/**
 * Custom React hooks for section components
 */

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import type { Theme } from '../types';
import { generateId } from '../utils';
import { 
  validateField, 
  validateForm, 
  type FieldValidation,
  type ValidationErrors 
} from '../utils/validation';

// ============================================================================
// useTheme - Theme management hook
// ============================================================================

interface UseThemeOptions {
  defaultTheme?: Theme;
  respectSystemPreference?: boolean;
}

interface UseThemeReturn {
  theme: Theme;
  isDark: boolean;
  isLight: boolean;
  themeClass: string;
}

export function useTheme(
  propTheme?: Theme,
  options: UseThemeOptions = {}
): UseThemeReturn {
  const { defaultTheme = 'light', respectSystemPreference = true } = options;

  const [systemTheme, setSystemTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    if (!respectSystemPreference || typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [respectSystemPreference]);

  const theme = propTheme ?? systemTheme;

  return {
    theme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    themeClass: `theme-${theme}`,
  };
}

// ============================================================================
// useId - Accessible ID generation
// ============================================================================

export function useId(prefix?: string): string {
  const idRef = useRef<string>();
  
  if (!idRef.current) {
    idRef.current = generateId(prefix);
  }
  
  return idRef.current;
}

// ============================================================================
// useForm - Form state management with validation
// ============================================================================

type FormValues = { [K: string]: string };

interface UseFormOptions<T extends FormValues> {
  initialValues: T;
  validationRules?: FieldValidation;
  onSubmit?: (values: T) => void | Promise<void>;
}

interface UseFormReturn<T extends FormValues> {
  values: T;
  errors: ValidationErrors;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  handleChange: (name: keyof T) => (value: string) => void;
  handleBlur: (name: keyof T) => () => void;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  setFieldValue: (name: keyof T, value: string) => void;
  setFieldError: (name: keyof T, error: string | undefined) => void;
  reset: () => void;
  getFieldProps: (name: keyof T) => {
    value: string;
    onChange: (value: string) => void;
    onBlur: () => void;
    error: string | undefined;
    name: string;
  };
}

export function useForm<T extends FormValues>(
  options: UseFormOptions<T>
): UseFormReturn<T> {
  const { initialValues, validationRules = {}, onSubmit } = options;

  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDirty = useMemo(() => {
    return Object.keys(initialValues).some(
      (key) => values[key as keyof T] !== initialValues[key as keyof T]
    );
  }, [values, initialValues]);

  const validateSingleField = useCallback(
    (name: keyof T, value: string) => {
      const rules = validationRules[name as string];
      if (!rules) return undefined;
      return validateField(value, rules);
    },
    [validationRules]
  );

  const handleChange = useCallback(
    (name: keyof T) => (value: string) => {
      setValues((prev) => ({ ...prev, [name]: value }));
      
      // Clear error when user starts typing
      if (errors[name as string]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [errors]
  );

  const handleBlur = useCallback(
    (name: keyof T) => () => {
      setTouched((prev) => ({ ...prev, [name]: true }));
      
      // Validate on blur
      const error = validateSingleField(name, values[name]);
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
    [values, validateSingleField]
  );

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as Record<keyof T, boolean>
      );
      setTouched(allTouched);

      // Validate all fields
      const { isValid, errors: validationErrors } = validateForm(
        values,
        validationRules
      );
      setErrors(validationErrors);

      if (!isValid || !onSubmit) return;

      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validationRules, onSubmit]
  );

  const setFieldValue = useCallback((name: keyof T, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const setFieldError = useCallback((name: keyof T, error: string | undefined) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const getFieldProps = useCallback(
    (name: keyof T) => ({
      value: values[name],
      onChange: handleChange(name),
      onBlur: handleBlur(name),
      error: touched[name] ? errors[name as string] : undefined,
      name: name as string,
    }),
    [values, errors, touched, handleChange, handleBlur]
  );

  const isValid = useMemo(() => {
    const { isValid } = validateForm(values, validationRules);
    return isValid;
  }, [values, validationRules]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    reset,
    getFieldProps,
  };
}

// ============================================================================
// useMediaQuery - Responsive design hook
// ============================================================================

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mediaQuery.addEventListener('change', handler);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// Common breakpoints
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)');
}

export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
}

export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}

// ============================================================================
// useReducedMotion - Accessibility hook
// ============================================================================

export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
