/**
 * Form validation utilities
 * Client-side validation with accessible error handling
 */

export interface ValidationRule {
  /** Validation function - returns true if valid */
  validate: (value: string) => boolean;
  /** Error message to display when validation fails */
  message: string;
}

export interface FieldValidation {
  [fieldName: string]: ValidationRule[];
}

export interface ValidationErrors {
  [fieldName: string]: string | undefined;
}

/**
 * Pre-built validation rules
 */
export const validators = {
  required: (message = 'This field is required'): ValidationRule => ({
    validate: (value) => value.trim().length > 0,
    message,
  }),

  email: (message = 'Please enter a valid email address'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true; // Let required handle empty
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    message,
  }),

  phone: (message = 'Please enter a valid phone number'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
      return value.length >= 7 && phoneRegex.test(value);
    },
    message,
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    validate: (value) => value.length >= min,
    message: message ?? `Must be at least ${min} characters`,
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    validate: (value) => value.length <= max,
    message: message ?? `Must be no more than ${max} characters`,
  }),

  pattern: (regex: RegExp, message: string): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      return regex.test(value);
    },
    message,
  }),

  url: (message = 'Please enter a valid URL'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    message,
  }),

  date: (message = 'Please enter a valid date'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      const date = new Date(value);
      return !isNaN(date.getTime());
    },
    message,
  }),

  futureDate: (message = 'Please select a future date'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    },
    message,
  }),
};

/**
 * Validates a single field against its rules
 */
export function validateField(
  value: string,
  rules: ValidationRule[]
): string | undefined {
  for (const rule of rules) {
    if (!rule.validate(value)) {
      return rule.message;
    }
  }
  return undefined;
}

/**
 * Validates all fields in a form
 */
export function validateForm(
  values: Record<string, string>,
  validationRules: FieldValidation
): { isValid: boolean; errors: ValidationErrors } {
  const errors: ValidationErrors = {};
  let isValid = true;

  for (const [fieldName, rules] of Object.entries(validationRules)) {
    const value = values[fieldName] ?? '';
    const error = validateField(value, rules);
    
    if (error) {
      errors[fieldName] = error;
      isValid = false;
    }
  }

  return { isValid, errors };
}

/**
 * Hook-friendly form state type
 */
export interface FormState<T extends Record<string, string>> {
  values: T;
  errors: ValidationErrors;
  touched: Record<keyof T, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}
