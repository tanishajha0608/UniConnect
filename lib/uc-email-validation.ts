/**
 * UC System Email Domain Authentication
 * Strict validation for UC system emails with comprehensive security checks
 */

// Approved UC Domain Whitelist (Case-Insensitive)
const UC_DOMAINS = new Set([
  'berkeley.edu',
  'ucdavis.edu', 
  'ucla.edu',
  'ucsd.edu',
  'uci.edu',
  'ucsb.edu',
  'ucr.edu',
  'ucsc.edu',
  'ucmerced.edu',
  'ucsf.edu'
]);

/**
 * Validates if an email domain is from an approved UC system
 * @param email - The email address to validate
 * @returns Object with validation result and sanitized email
 */
export function validateUCDomain(email: string): {
  isValid: boolean;
  sanitizedEmail: string;
  error?: string;
} {
  // Early return for null/undefined/empty
  if (!email || typeof email !== 'string') {
    return {
      isValid: false,
      sanitizedEmail: '',
      error: 'Invalid email domain. UC system emails only.'
    };
  }

  // Trim whitespace and convert to lowercase
  const sanitizedEmail = email.trim().toLowerCase();

  // Check for empty string after trimming
  if (!sanitizedEmail) {
    return {
      isValid: false,
      sanitizedEmail: '',
      error: 'Invalid email domain. UC system emails only.'
    };
  }

  // Basic email format validation using regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitizedEmail)) {
    return {
      isValid: false,
      sanitizedEmail: '',
      error: 'Invalid email domain. UC system emails only.'
    };
  }

  // Extract domain part
  const emailParts = sanitizedEmail.split('@');
  
  // Security check: exactly one @ symbol
  if (emailParts.length !== 2) {
    return {
      isValid: false,
      sanitizedEmail: '',
      error: 'Invalid email domain. UC system emails only.'
    };
  }

  const domain = emailParts[1];

  // Security check: domain cannot be empty
  if (!domain) {
    return {
      isValid: false,
      sanitizedEmail: '',
      error: 'Invalid email domain. UC system emails only.'
    };
  }

  // Security check: no subdomains allowed (exact domain match only)
  if (!UC_DOMAINS.has(domain)) {
    return {
      isValid: false,
      sanitizedEmail: '',
      error: 'Invalid email domain. UC system emails only.'
    };
  }

  // Additional security checks for edge cases
  if (containsSuspiciousCharacters(domain)) {
    return {
      isValid: false,
      sanitizedEmail: '',
      error: 'Invalid email domain. UC system emails only.'
    };
  }

  return {
    isValid: true,
    sanitizedEmail
  };
}

/**
 * Checks for suspicious characters that might indicate spoofing attempts
 * @param domain - The domain to check
 * @returns true if suspicious characters are found
 */
function containsSuspiciousCharacters(domain: string): boolean {
  // Check for Unicode lookalikes and suspicious characters
  const suspiciousPatterns = [
    /[^\x00-\x7F]/, // Non-ASCII characters (potential homograph attacks)
    /[^\w.-]/, // Characters that shouldn't be in domains
    /\.{2,}/, // Multiple consecutive dots
    /^-|-$/, // Leading or trailing hyphens
    /\.{2,}/, // Multiple consecutive dots
  ];

  return suspiciousPatterns.some(pattern => pattern.test(domain));
}

/**
 * Extracts the university slug from a valid UC email domain
 * @param email - Valid UC email address
 * @returns University slug or null if not found
 */
export function getUniversityFromEmail(email: string): string | null {
  const validation = validateUCDomain(email);
  
  if (!validation.isValid) {
    return null;
  }

  const domain = validation.sanitizedEmail.split('@')[1];
  
  // Map domains to university slugs
  const domainToSlug: Record<string, string> = {
    'berkeley.edu': 'berkeley',
    'ucdavis.edu': 'davis',
    'ucla.edu': 'ucla',
    'ucsd.edu': 'ucsd',
    'uci.edu': 'uci',
    'ucsb.edu': 'ucsb',
    'ucr.edu': 'riverside',
    'ucsc.edu': 'ucsc',
    'ucmerced.edu': 'merced',
    'ucsf.edu': 'ucsf'
  };

  return domainToSlug[domain] || null;
}

/**
 * Logs blocked authentication attempts for monitoring
 * @param email - The blocked email
 * @param reason - Reason for blocking
 * @param ip - Client IP address
 */
export function logBlockedAttempt(email: string, reason: string, ip?: string): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    email: email.substring(0, 3) + '***@' + email.split('@')[1], // Partial email for privacy
    reason,
    ip: ip || 'unknown',
    userAgent: typeof window !== 'undefined' ? window.navigator?.userAgent : 'server'
  };

  // In production, this would send to your logging service
  console.warn('Blocked UC authentication attempt:', logEntry);
}

/**
 * Rate limiting key generator for failed attempts
 * @param email - The email address
 * @param ip - Client IP address
 * @returns Rate limiting key
 */
export function getRateLimitKey(email: string, ip?: string): string {
  const sanitizedEmail = email.trim().toLowerCase();
  return `uc_auth_${sanitizedEmail}_${ip || 'unknown'}`;
}

/**
 * Validates email format without domain checking (for basic format validation)
 * @param email - Email to validate
 * @returns true if email format is valid
 */
export function isValidEmailFormat(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  
  const trimmed = email.trim();
  if (!trimmed) return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmed);
}

// Export the UC domains for testing purposes
export { UC_DOMAINS };