/**
 * Utility functions for the component registry
 * These are minimal, dependency-free utilities for use across all sections
 */

/**
 * Combines class names, filtering out falsy values
 * A minimal alternative to clsx/classnames without external dependencies
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Generates a unique ID for accessibility purposes
 * Uses a counter to ensure uniqueness within the same runtime
 */
let idCounter = 0;
export function generateId(prefix: string = 'comp'): string {
  return `${prefix}-${++idCounter}`;
}

/**
 * Creates an aria-describedby value from multiple potential IDs
 */
export function createAriaDescribedBy(...ids: (string | undefined | null)[]): string | undefined {
  const validIds = ids.filter(Boolean);
  return validIds.length > 0 ? validIds.join(' ') : undefined;
}

/**
 * Formats a phone number for tel: links
 */
export function formatPhoneHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

/**
 * Formats an email for mailto: links
 */
export function formatEmailHref(email: string, subject?: string): string {
  const base = `mailto:${email}`;
  return subject ? `${base}?subject=${encodeURIComponent(subject)}` : base;
}

/**
 * Validates an email address (basic validation)
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates a phone number (basic validation - allows various formats)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
  return phone.length >= 7 && phoneRegex.test(phone);
}

/**
 * Creates props for external links (security best practices)
 */
export function getExternalLinkProps(): { target: string; rel: string } {
  return {
    target: '_blank',
    rel: 'noopener noreferrer',
  };
}

/**
 * Determines if we're in a browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Simple debounce function
 */
export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
