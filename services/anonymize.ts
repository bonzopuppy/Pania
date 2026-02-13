/**
 * PII Anonymization Service
 * Strips personally identifiable information before sending text to AI
 */

// Email addresses
const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

// Phone numbers (US + international)
const PHONE_RE = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g;

// UUIDs
const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;

// SSN patterns (XXX-XX-XXXX)
const SSN_RE = /\b\d{3}-\d{2}-\d{4}\b/g;

// Credit card patterns (13-19 digits, optionally separated by spaces or dashes)
const CC_RE = /\b(?:\d{4}[-\s]?){3,4}\d{1,4}\b/g;

/**
 * Strip PII from text before sending to AI
 * @param text - The text to anonymize
 * @param knownName - User's known name to redact (from profile)
 * @param knownEmail - User's known email to redact (from auth)
 */
export function anonymize(
  text: string,
  knownName?: string | null,
  knownEmail?: string | null
): string {
  let result = text;

  // Replace known name (case-insensitive, whole word)
  if (knownName && knownName.trim()) {
    const escaped = knownName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    result = result.replace(new RegExp(`\\b${escaped}\\b`, 'gi'), '[name]');
  }

  // Replace known email
  if (knownEmail && knownEmail.trim()) {
    const escaped = knownEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    result = result.replace(new RegExp(escaped, 'gi'), '[email]');
  }

  // Replace patterns
  result = result.replace(EMAIL_RE, '[email]');
  result = result.replace(SSN_RE, '[ssn]');
  result = result.replace(CC_RE, '[card]');
  result = result.replace(UUID_RE, '[id]');
  result = result.replace(PHONE_RE, '[phone]');

  return result;
}
