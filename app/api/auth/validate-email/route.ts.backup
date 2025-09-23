/**
 * UC Email Validation API Endpoint
 * Server-side validation for UC email domains
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateUCEmailSync } from '@/lib/auth-middleware';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Invalid email domain. UC system emails only.' },
        { status: 400 }
      );
    }

    const clientIP = getClientIP(request);
    const validation = validateUCEmailSync(email, clientIP);

    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error || 'Invalid email domain. UC system emails only.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      sanitizedEmail: validation.sanitizedEmail
    });

  } catch (error) {
    console.error('Email validation error:', error);
    return NextResponse.json(
      { error: 'Invalid request format.' },
      { status: 400 }
    );
  }
}

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