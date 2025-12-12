/**
 * RSC Guard - Security utilities to protect against CVE-2025-55182
 * 
 * This module provides functions to detect and prevent:
 * - Prototype pollution attacks
 * - Remote Code Execution (RCE) via RSC gadget chains
 * - Malicious payloads in React Server Components
 */

// Dangerous keys that could lead to prototype pollution
const DANGEROUS_KEYS = [
  '__proto__',
  'constructor',
  'prototype',
  '_response',
  '_prefix',
  '__defineGetter__',
  '__defineSetter__',
  '__lookupGetter__',
  '__lookupSetter__',
];

// Dangerous values/patterns that could indicate RCE attempts
const DANGEROUS_VALUE_PATTERNS = [
  /process\.mainModule\.require/i,
  /child_process\.execSync/i,
  /process\.binding/i,
  /require\s*\(/i,
  /eval\s*\(/i,
  /Function\s*\(/i,
  /import\s*\(/i,
  /global\./i,
  /globalThis\./i,
  /__dirname/i,
  /__filename/i,
  /process\.env/i,
  /fs\.readFile/i,
  /fs\.writeFile/i,
  /child_process/i,
  /spawn/i,
  /exec/i,
];

/**
 * Check if a key is dangerous (could lead to prototype pollution)
 * @param key - The key to check
 * @returns true if the key is dangerous
 */
export function hasDangerousKey(key: string): boolean {
  if (typeof key !== 'string') return false;
  
  const lowerKey = key.toLowerCase();
  return DANGEROUS_KEYS.some(dangerousKey => 
    lowerKey.includes(dangerousKey.toLowerCase())
  );
}

/**
 * Check if a value contains dangerous patterns (RCE gadgets)
 * @param value - The value to check
 * @returns true if the value contains dangerous patterns
 */
export function hasDangerousValue(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  
  const stringValue = String(value);
  
  return DANGEROUS_VALUE_PATTERNS.some(pattern => 
    pattern.test(stringValue)
  );
}

/**
 * Recursively scan an object for RSC gadgets and dangerous patterns
 * @param obj - The object to scan
 * @param maxDepth - Maximum recursion depth (default: 10)
 * @param currentDepth - Current recursion depth (internal use)
 * @returns Object containing scan results
 */
export function scanObjectForRscGadgets(
  obj: unknown,
  maxDepth: number = 10,
  currentDepth: number = 0
): {
  isSafe: boolean;
  dangerousKeys: string[];
  dangerousValues: string[];
  reason?: string;
} {
  const result = {
    isSafe: true,
    dangerousKeys: [] as string[],
    dangerousValues: [] as string[],
  };

  // Prevent infinite recursion
  if (currentDepth > maxDepth) {
    return {
      isSafe: false,
      dangerousKeys: [],
      dangerousValues: [],
      reason: 'Maximum recursion depth exceeded',
    };
  }

  // Handle null/undefined
  if (obj === null || obj === undefined) {
    return result;
  }

  // Handle primitives
  if (typeof obj !== 'object') {
    if (hasDangerousValue(obj)) {
      result.isSafe = false;
      result.dangerousValues.push(String(obj));
    }
    return result;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      const itemResult = scanObjectForRscGadgets(obj[i], maxDepth, currentDepth + 1);
      if (!itemResult.isSafe) {
        result.isSafe = false;
        result.dangerousKeys.push(...itemResult.dangerousKeys);
        result.dangerousValues.push(...itemResult.dangerousValues);
      }
    }
    return result;
  }

  // Handle objects
  try {
    const keys = Object.keys(obj);
    
    for (const key of keys) {
      // Check if key itself is dangerous
      if (hasDangerousKey(key)) {
        result.isSafe = false;
        result.dangerousKeys.push(key);
      }

      // Check if value is dangerous
      const value = (obj as Record<string, unknown>)[key];
      
      if (hasDangerousValue(value)) {
        result.isSafe = false;
        result.dangerousValues.push(`${key}: ${String(value)}`);
      }

      // Recursively check nested objects
      if (value !== null && typeof value === 'object') {
        const nestedResult = scanObjectForRscGadgets(value, maxDepth, currentDepth + 1);
        if (!nestedResult.isSafe) {
          result.isSafe = false;
          result.dangerousKeys.push(...nestedResult.dangerousKeys.map(k => `${key}.${k}`));
          result.dangerousValues.push(...nestedResult.dangerousValues.map(v => `${key}.${v}`));
        }
      }
    }
  } catch (error) {
    return {
      isSafe: false,
      dangerousKeys: [],
      dangerousValues: [],
      reason: `Error scanning object: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }

  return result;
}

/**
 * Validate and sanitize request body for API routes
 * Use this in your API routes to prevent malicious payloads
 * 
 * @param body - The request body to validate
 * @returns Validation result with details
 */
export function validateRequestBody(body: unknown): {
  isValid: boolean;
  error?: string;
  details?: {
    dangerousKeys: string[];
    dangerousValues: string[];
  };
} {
  // Check if body is too large (basic protection)
  const bodyString = JSON.stringify(body);
  if (bodyString.length > 1048576) { // 1MB limit
    return {
      isValid: false,
      error: 'Request body too large',
    };
  }

  // Scan for RSC gadgets
  const scanResult = scanObjectForRscGadgets(body);

  if (!scanResult.isSafe) {
    return {
      isValid: false,
      error: 'Request body contains dangerous patterns',
      details: {
        dangerousKeys: scanResult.dangerousKeys,
        dangerousValues: scanResult.dangerousValues,
      },
    };
  }

  return { isValid: true };
}

/**
 * Create a safe response object that prevents information leakage
 * @param success - Whether the operation was successful
 * @param message - Optional message
 * @param data - Optional data (will be sanitized)
 */
export function createSafeResponse(
  success: boolean,
  message?: string,
  data?: unknown
): {
  success: boolean;
  message?: string;
  data?: unknown;
} {
  const response: {
    success: boolean;
    message?: string;
    data?: unknown;
  } = { success };

  if (message) {
    response.message = message;
  }

  // Only include data if it's safe
  if (data !== undefined) {
    const scanResult = scanObjectForRscGadgets(data);
    if (scanResult.isSafe) {
      response.data = data;
    } else {
      console.warn('[Security] Blocked unsafe data in response:', {
        dangerousKeys: scanResult.dangerousKeys,
        dangerousValues: scanResult.dangerousValues,
      });
    }
  }

  return response;
}

/**
 * Middleware-compatible function to check request headers and body
 * Returns null if safe, error response if dangerous
 */
export function checkRequestSecurity(
  headers: Headers,
  body?: unknown
): { error: string; status: number } | null {
  // Check headers for RSC indicators
  if (headers.get('accept')?.includes('text/x-component')) {
    return {
      error: 'RSC requests are not allowed',
      status: 403,
    };
  }

  if (headers.get('next-action')) {
    return {
      error: 'Server actions are not allowed',
      status: 403,
    };
  }

  // Check body if provided
  if (body !== undefined) {
    const bodyValidation = validateRequestBody(body);
    if (!bodyValidation.isValid) {
      return {
        error: bodyValidation.error || 'Invalid request body',
        status: 400,
      };
    }
  }

  return null;
}

