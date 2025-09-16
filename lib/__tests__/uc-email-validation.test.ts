/**
 * UC Email Validation Security Tests
 * Comprehensive testing of edge cases and security bypasses
 */

import { validateUCDomain, getUniversityFromEmail, UC_DOMAINS } from '../uc-email-validation';

describe('UC Email Domain Validation Security Tests', () => {
  
  describe('Valid UC Emails', () => {
    const validEmails = [
      'student@berkeley.edu',
      'user@ucdavis.edu',
      'test@ucla.edu',
      'admin@ucsd.edu',
      'john.doe@uci.edu',
      'jane+tag@ucsb.edu', // Plus addressing should be allowed
      'user123@ucr.edu',
      'test.user@ucsc.edu',
      'student@ucmerced.edu',
      'faculty@ucsf.edu'
    ];

    validEmails.forEach(email => {
      test(`should accept valid UC email: ${email}`, () => {
        const result = validateUCDomain(email);
        expect(result.isValid).toBe(true);
        expect(result.sanitizedEmail).toBe(email.toLowerCase().trim());
        expect(result.error).toBeUndefined();
      });
    });
  });

  describe('Invalid Domain Rejection', () => {
    const invalidEmails = [
      'student@gmail.com',
      'user@yahoo.com',
      'test@stanford.edu',
      'admin@mit.edu',
      'user@fake-uc.edu',
      'test@berkeley.com', // Wrong TLD
      'user@uc-berkeley.edu', // Hyphenated domain
      'test@berkeley.org',
      'admin@berkeley.net'
    ];

    invalidEmails.forEach(email => {
      test(`should reject non-UC email: ${email}`, () => {
        const result = validateUCDomain(email);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Invalid email domain. UC system emails only.');
      });
    });
  });

  describe('Subdomain Spoofing Protection', () => {
    const subdomainEmails = [
      'user@mail.berkeley.edu',
      'test@web.ucla.edu',
      'admin@subdomain.ucsd.edu',
      'student@fake.berkeley.edu',
      'user@berkeley.edu.evil.com',
      'test@berkeley.edu.malicious.org'
    ];

    subdomainEmails.forEach(email => {
      test(`should reject subdomain email: ${email}`, () => {
        const result = validateUCDomain(email);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Invalid email domain. UC system emails only.');
      });
    });
  });

  describe('Case Sensitivity Handling', () => {
    const caseVariations = [
      'STUDENT@BERKELEY.EDU',
      'User@UCLA.EDU',
      'test@UcDaViS.eDu',
      'ADMIN@UCSD.EDU',
      'Student@Berkeley.Edu'
    ];

    caseVariations.forEach(email => {
      test(`should handle case variations: ${email}`, () => {
        const result = validateUCDomain(email);
        expect(result.isValid).toBe(true);
        expect(result.sanitizedEmail).toBe(email.toLowerCase().trim());
      });
    });
  });

  describe('Whitespace Handling', () => {
    const whitespaceEmails = [
      ' student@berkeley.edu ',
      '\tuser@ucla.edu\t',
      '\n test@ucsd.edu \n',
      '  admin@uci.edu  '
    ];

    whitespaceEmails.forEach(email => {
      test(`should handle whitespace: ${JSON.stringify(email)}`, () => {
        const result = validateUCDomain(email);
        expect(result.isValid).toBe(true);
        expect(result.sanitizedEmail).toBe(email.trim().toLowerCase());
      });
    });
  });

  describe('Empty and Null Input Protection', () => {
    const emptyInputs = [
      '',
      '   ',
      '\t',
      '\n',
      null as any,
      undefined as any,
      'not-a-string' as any,
      123 as any,
      {} as any,
      [] as any
    ];

    emptyInputs.forEach(input => {
      test(`should reject empty/null input: ${JSON.stringify(input)}`, () => {
        const result = validateUCDomain(input);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Invalid email domain. UC system emails only.');
      });
    });
  });

  describe('Multiple @ Symbol Protection', () => {
    const multipleAtEmails = [
      'user@@berkeley.edu',
      'test@berkeley@edu',
      'admin@berkeley.edu@fake.com',
      'user@berkeley.edu@',
      '@@berkeley.edu'
    ];

    multipleAtEmails.forEach(email => {
      test(`should reject multiple @ symbols: ${email}`, () => {
        const result = validateUCDomain(email);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Invalid email domain. UC system emails only.');
      });
    });
  });

  describe('Domain-Only Input Protection', () => {
    const domainOnlyInputs = [
      '@berkeley.edu',
      '@ucla.edu',
      '@ucsd.edu',
      '@',
      '@.edu',
      '@berkeley'
    ];

    domainOnlyInputs.forEach(input => {
      test(`should reject domain-only input: ${input}`, () => {
        const result = validateUCDomain(input);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Invalid email domain. UC system emails only.');
      });
    });
  });

  describe('Invalid Email Format Protection', () => {
    const invalidFormats = [
      'not-an-email',
      'user@',
      '@berkeley.edu',
      'user.berkeley.edu',
      'user@berkeley',
      'user@.edu',
      'user@berkeley.',
      'user@.berkeley.edu',
      'user@berkeley..edu',
      'user@berkeley.edu.',
      'user@berkeley.edu..'
    ];

    invalidFormats.forEach(email => {
      test(`should reject invalid format: ${email}`, () => {
        const result = validateUCDomain(email);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Invalid email domain. UC system emails only.');
      });
    });
  });

  describe('University Mapping Tests', () => {
    const emailToUniversity = [
      { email: 'student@berkeley.edu', expected: 'berkeley' },
      { email: 'user@ucdavis.edu', expected: 'davis' },
      { email: 'test@ucla.edu', expected: 'ucla' },
      { email: 'admin@ucsd.edu', expected: 'ucsd' },
      { email: 'john@uci.edu', expected: 'uci' },
      { email: 'jane@ucsb.edu', expected: 'ucsb' },
      { email: 'user@ucr.edu', expected: 'riverside' },
      { email: 'test@ucsc.edu', expected: 'ucsc' },
      { email: 'student@ucmerced.edu', expected: 'merced' },
      { email: 'faculty@ucsf.edu', expected: 'ucsf' }
    ];

    emailToUniversity.forEach(({ email, expected }) => {
      test(`should map ${email} to ${expected}`, () => {
        const result = getUniversityFromEmail(email);
        expect(result).toBe(expected);
      });
    });

    test('should return null for invalid email', () => {
      const result = getUniversityFromEmail('invalid@gmail.com');
      expect(result).toBeNull();
    });
  });

  describe('Security Edge Cases', () => {
    const securityTests = [
      // Unicode lookalikes (potential homograph attacks)
      { email: 'user@bеrkеlеy.edu', description: 'Cyrillic е instead of Latin e' },
      { email: 'test@uclа.edu', description: 'Cyrillic а instead of Latin a' },
      
      // Suspicious characters
      { email: 'user@berkeley.edu/', description: 'Trailing slash' },
      { email: 'test@berkeley.edu\\', description: 'Trailing backslash' },
      { email: 'admin@berkeley.edu?', description: 'Query parameter' },
      { email: 'user@berkeley.edu#', description: 'Fragment identifier' },
      
      // Multiple dots
      { email: 'user@berkeley..edu', description: 'Double dots' },
      { email: 'test@berkeley...edu', description: 'Triple dots' },
      
      // Leading/trailing hyphens
      { email: 'user@-berkeley.edu', description: 'Leading hyphen' },
      { email: 'test@berkeley-.edu', description: 'Trailing hyphen' }
    ];

    securityTests.forEach(({ email, description }) => {
      test(`should reject ${description}: ${email}`, () => {
        const result = validateUCDomain(email);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Invalid email domain. UC system emails only.');
      });
    });
  });

  describe('UC Domains Whitelist', () => {
    test('should contain all required UC domains', () => {
      const expectedDomains = [
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
      ];

      expectedDomains.forEach(domain => {
        expect(UC_DOMAINS.has(domain)).toBe(true);
      });
    });

    test('should not contain extra domains', () => {
      expect(UC_DOMAINS.size).toBe(10);
    });
  });

  describe('Performance Tests', () => {
    test('should handle large number of validations efficiently', () => {
      const startTime = Date.now();
      const testEmails = Array(1000).fill('student@berkeley.edu');
      
      testEmails.forEach(email => {
        validateUCDomain(email);
      });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete 1000 validations in under 100ms
      expect(duration).toBeLessThan(100);
    });
  });
});