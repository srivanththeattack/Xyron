/**
 * Xyron Security Hardening — Input Sanitization & XSS/SQL Injection Prevention
 */

// Strip HTML tags and dangerous characters from user input
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/<[^>]*>/g, '')           // Strip HTML tags
    .replace(/[<>"'`]/g, '')           // Remove dangerous chars
    .replace(/javascript:/gi, '')      // Remove JS protocol
    .replace(/on\w+=/gi, '')           // Remove event handlers
    .trim();
};

// Sanitize for safe display (allows some safe HTML, strips dangerous)
export const sanitizeDisplay = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/data\s*:\s*text\/html/gi, '');
};

// Sanitize for SQL-like query parameters (defense in depth)
export const sanitizeQueryParam = (input: string): string => {
  return input
    .replace(/['";\\]/g, '')
    .replace(/--/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '')
    .replace(/union\s+select/gi, '')
    .replace(/drop\s+table/gi, '')
    .replace(/insert\s+into/gi, '')
    .trim();
};

// Validate that a string is a safe alphanumeric ID
export const isValidInstanceId = (id: string): boolean => {
  return /^[a-zA-Z0-9_-]{1,64}$/.test(id);
};

// Escape shell command arguments
export const escapeShellArg = (arg: string): string => {
  return arg.replace(/['"\\$`!|;&<>(){}[\]\n\r]/g, '');
};

// Rate-limit tracking map
const rateLimitMap = new Map<string, number[]>();

// Simple rate limiter: max N calls per windowMs
export const checkRateLimit = (key: string, maxCalls: number = 60, windowMs: number = 60000): boolean => {
  const now = Date.now();
  const timestamps = rateLimitMap.get(key) || [];
  const recent = timestamps.filter(t => now - t < windowMs);
  
  if (recent.length >= maxCalls) {
    return false; // Rate limited
  }
  
  recent.push(now);
  rateLimitMap.set(key, recent);
  return true;
};

// Zero-log policy marker — in production this integrates with a logging system
// This ensures no sensitive data gets persisted
export const ZERO_LOG_POLICY = true;

export const logSanitized = (message: string): void => {
  if (ZERO_LOG_POLICY) return; // Zero-log: don't persist
  const sanitized = sanitizeInput(message);
  console.log(`[Xyron] ${sanitized}`);
};
