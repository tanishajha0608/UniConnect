/**
 * UC System Authentication Middleware
 * Server-side validation and rate limiting for UC email authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateUCDomain, logBlockedAttempt, getRateLimitKey } from './uc-email-validation';

// Simple in-memory rate limiting (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  blockDurationMs: 30 * 60 * 1000, // 30 minutes block
};

/**
 * Gets client IP address from request
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

/**
 * Checks if an IP/email combination is rate limited
 */
function isRateLimited(key: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(key);
  
  if (!record) {
    return false;
  }
  
  // Check if we're in the block period
  if (now < record.resetTime) {
    return true;
  }
  
  // Clean up expired records
  if (now >= record.resetTime) {
    rateLimitStore.delete(key);
    return false;
  }
  
  return false;
}

/**
 * Records a failed authentication attempt
 */
function recordFailedAttempt(key: string): void {
  const now = Date.now();
  const record = rateLimitStore.get(key);
  
  if (!record) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs
    });
    return;
  }
  
  // If we're past the reset time, start fresh
  if (now >= record.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs
    });
    return;
  }
  
  // Increment count
  record.count++;
  
  // If we've exceeded max attempts, extend the block time
  if (record.count >= RATE_LIMIT_CONFIG.maxAttempts) {
    record.resetTime = now + RATE_LIMIT_CONFIG.blockDurationMs;
  }
  
  rateLimitStore.set(key, record);
}

/**
 * Records a successful authentication attempt (clears rate limiting)
 */
function recordSuccessfulAttempt(key: string): void {
  rateLimitStore.delete(key);
}

/**
 * UC Email validation middleware for API routes
 */
export function validateUCEmail(request: NextRequest): {
  isValid: boolean;
  response?: NextResponse;
  email?: string;
  ip?: string;
} {
  const ip = getClientIP(request);
  
  try {
    const body = request.json ? request.json() : Promise.resolve({});
    
    return body.then((data: any) => {
      const email = data?.email;
      
      if (!email || typeof email !== 'string') {
        return {
          isValid: false,
          response: NextResponse.json(
            { error: 'Invalid email domain. UC system emails only.' },
            { status: 400 }
          )
        };
      }
      
      // Check rate limiting
      const rateLimitKey = getRateLimitKey(email, ip);
      if (isRateLimited(rateLimitKey)) {
        logBlockedAttempt(email, 'Rate limited', ip);
        return {
          isValid: false,
          response: NextResponse.json(
            { error: 'Too many failed attempts. Please try again later.' },
            { status: 429 }
          )
        };
      }
      
      // Validate UC domain
      const validation = validateUCDomain(email);
      
      if (!validation.isValid) {
        recordFailedAttempt(rateLimitKey);
        logBlockedAttempt(email, validation.error || 'Invalid UC domain', ip);
        
        return {
          isValid: false,
          response: NextResponse.json(
            { error: 'Invalid email domain. UC system emails only.' },
            { status: 400 }
          )
        };
      }
      
      // Success - clear any rate limiting
      recordSuccessfulAttempt(rateLimitKey);
      
      return {
        isValid: true,
        email: validation.sanitizedEmail,
        ip
      };
    });
  } catch (error) {
    logBlockedAttempt('unknown', 'Invalid request format', ip);
    return {
      isValid: false,
      response: NextResponse.json(
        { error: 'Invalid request format.' },
        { status: 400 }
      )
    };
  }
}

/**
 * Synchronous version for form validation
 */
export function validateUCEmailSync(email: string, ip?: string): {
  isValid: boolean;
  sanitizedEmail?: string;
  error?: string;
} {
  if (!email || typeof email !== 'string') {
    return {
      isValid: false,
      error: 'Invalid email domain. UC system emails only.'
    };
  }
  
  // Check rate limiting
  const rateLimitKey = getRateLimitKey(email, ip);
  if (isRateLimited(rateLimitKey)) {
    logBlockedAttempt(email, 'Rate limited', ip);
    return {
      isValid: false,
      error: 'Too many failed attempts. Please try again later.'
    };
  }
  
  // Validate UC domain
  const validation = validateUCDomain(email);
  
  if (!validation.isValid) {
    recordFailedAttempt(rateLimitKey);
    logBlockedAttempt(email, validation.error || 'Invalid UC domain', ip);
    return validation;
  }
  
  // Success - clear any rate limiting
  recordSuccessfulAttempt(rateLimitKey);
  
  return {
    isValid: true,
    sanitizedEmail: validation.sanitizedEmail
  };
}

/**
 * Middleware wrapper for API routes
 */
export function withUCEmailValidation(handler: (request: NextRequest, email: string, ip: string) => Promise<NextResponse>) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const validation = await validateUCEmail(request);
    
    if (!validation.isValid) {
      return validation.response!;
    }
    
    return handler(request, validation.email!, validation.ip!);
  };
}

/**
 * Clean up expired rate limit records (call periodically)
 */
export function cleanupRateLimit(): void {
  const now = Date.now();
  
  for (const [key, record] of rateLimitStore.entries()) {
    if (now >= record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Clean up rate limit store every 5 minutes
if (typeof window === 'undefined') {
  setInterval(cleanupRateLimit, 5 * 60 * 1000);
}