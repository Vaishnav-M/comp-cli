/**
 * Component Templates
 * 
 * Contains the source code for all section components.
 * In a real implementation, these would be loaded from the registry package,
 * but for the CLI to work standalone, we embed them here.
 */

// ============================================================================
// Shared Files
// ============================================================================

export const SHARED_FILES = {
  'types/index.ts': `/**
 * Core type definitions for the section registry
 */

import { ReactNode, CSSProperties } from 'react';

export type Theme = 'light' | 'dark';

export interface ThemeProps {
  theme?: Theme;
}

export interface BaseSectionProps extends ThemeProps {
  className?: string;
  style?: CSSProperties;
  id?: string;
  'data-testid'?: string;
}

export interface VariantSectionProps<V extends string> extends BaseSectionProps {
  variant: V;
}

export interface CTAButton {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  ariaLabel?: string;
  external?: boolean;
}

export interface MediaItem {
  src: string;
  alt: string;
  type: 'image' | 'video';
  poster?: string;
  width?: number;
  height?: number;
}

export interface HighlightItem {
  icon?: ReactNode;
  title: string;
  description?: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
  hours?: string;
}

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
  ariaLabel?: string;
}

export interface NavGroup {
  title: string;
  links: NavLink[];
}

export type SocialPlatform = 
  | 'twitter' 
  | 'facebook' 
  | 'instagram' 
  | 'linkedin' 
  | 'youtube' 
  | 'github'
  | 'tiktok';

export interface SocialLink {
  platform: SocialPlatform;
  href: string;
  ariaLabel?: string;
}
`,

  'utils/index.ts': `/**
 * Utility functions
 */

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

let idCounter = 0;
export function generateId(prefix: string = 'comp'): string {
  return \`\${prefix}-\${++idCounter}\`;
}

export function formatPhoneHref(phone: string): string {
  return \`tel:\${phone.replace(/[^\\d+]/g, '')}\`;
}

export function formatEmailHref(email: string, subject?: string): string {
  const base = \`mailto:\${email}\`;
  return subject ? \`\${base}?subject=\${encodeURIComponent(subject)}\` : base;
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\\s./0-9]*$/;
  return phone.length >= 7 && phoneRegex.test(phone);
}

export function getExternalLinkProps(): { target: string; rel: string } {
  return { target: '_blank', rel: 'noopener noreferrer' };
}
`,

  'utils/validation.ts': `/**
 * Form validation utilities
 */

export interface ValidationRule {
  validate: (value: string) => boolean;
  message: string;
}

export interface FieldValidation {
  [fieldName: string]: ValidationRule[];
}

export interface ValidationErrors {
  [fieldName: string]: string | undefined;
}

export const validators = {
  required: (message = 'This field is required'): ValidationRule => ({
    validate: (value) => value.trim().length > 0,
    message,
  }),

  email: (message = 'Please enter a valid email address'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
      return emailRegex.test(value);
    },
    message,
  }),

  phone: (message = 'Please enter a valid phone number'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\\s./0-9]*$/;
      return value.length >= 7 && phoneRegex.test(value);
    },
    message,
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    validate: (value) => value.length >= min,
    message: message ?? \`Must be at least \${min} characters\`,
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

export function validateField(value: string, rules: ValidationRule[]): string | undefined {
  for (const rule of rules) {
    if (!rule.validate(value)) {
      return rule.message;
    }
  }
  return undefined;
}

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
`,

  'hooks/index.ts': `/**
 * Custom React hooks
 */

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import type { Theme } from '../types';
import { generateId } from '../utils';
import { validateField, validateForm, type ValidationRule, type FieldValidation, type ValidationErrors } from '../utils/validation';

export function useTheme(propTheme?: Theme) {
  const [systemTheme, setSystemTheme] = useState<Theme>('light');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    const handler = (e: MediaQueryListEvent) => setSystemTheme(e.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const theme = propTheme ?? systemTheme;
  return { theme, isDark: theme === 'dark', isLight: theme === 'light', themeClass: \`theme-\${theme}\` };
}

export function useId(prefix?: string): string {
  const idRef = useRef<string | null>(null);
  if (!idRef.current) idRef.current = generateId(prefix);
  return idRef.current;
}

export function useForm<T extends Record<string, string>>(options: {
  initialValues: T;
  validationRules?: FieldValidation;
  onSubmit?: (values: T) => void | Promise<void>;
}) {
  const { initialValues, validationRules = {}, onSubmit } = options;
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((name: keyof T) => (value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name as string]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, [errors]);

  const handleBlur = useCallback((name: keyof T) => () => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const rules = validationRules[name as string];
    if (rules) {
      const error = validateField(values[name], rules);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  }, [values, validationRules]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    setTouched(Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {} as Record<keyof T, boolean>));
    const { isValid, errors: validationErrors } = validateForm(values, validationRules);
    setErrors(validationErrors);
    if (!isValid || !onSubmit) return;
    setIsSubmitting(true);
    try { await onSubmit(values); } finally { setIsSubmitting(false); }
  }, [values, validationRules, onSubmit]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const getFieldProps = useCallback((name: keyof T) => ({
    value: values[name],
    onChange: handleChange(name),
    onBlur: handleBlur(name),
    error: touched[name] ? errors[name as string] : undefined,
    name: name as string,
  }), [values, errors, touched, handleChange, handleBlur]);

  const isValid = useMemo(() => validateForm(values, validationRules).isValid, [values, validationRules]);

  return { values, errors, touched, isSubmitting, isValid, handleChange, handleBlur, handleSubmit, reset, getFieldProps };
}

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

export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
`,

  'styles/index.ts': `/**
 * Style utilities
 */

import { CSSProperties } from 'react';
import type { Theme } from '../types';

export const themeColors = {
  light: {
    background: '#ffffff',
    backgroundSecondary: '#f9fafb',
    foreground: '#111827',
    foregroundSecondary: '#6b7280',
    border: '#e5e7eb',
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    primaryForeground: '#ffffff',
    error: '#dc2626',
    success: '#16a34a',
  },
  dark: {
    background: '#111827',
    backgroundSecondary: '#1f2937',
    foreground: '#f9fafb',
    foregroundSecondary: '#9ca3af',
    border: '#374151',
    primary: '#3b82f6',
    primaryHover: '#60a5fa',
    primaryForeground: '#ffffff',
    error: '#f87171',
    success: '#4ade80',
  },
} as const;

export function getThemeColors(theme: Theme) { return themeColors[theme]; }
export function getSectionBaseStyles(theme: Theme): CSSProperties {
  const colors = getThemeColors(theme);
  return { backgroundColor: colors.background, color: colors.foreground, width: '100%', boxSizing: 'border-box' };
}
export function getSectionPadding(): CSSProperties {
  return { paddingTop: '4rem', paddingBottom: '4rem', paddingLeft: '1rem', paddingRight: '1rem' };
}
export function getContainerStyles(): CSSProperties {
  return { maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto', width: '100%' };
}
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export function getButtonStyles(variant: ButtonVariant, theme: Theme): CSSProperties {
  const colors = getThemeColors(theme);
  const base: CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
    padding: '0.75rem 1.5rem', fontSize: '1rem', fontWeight: 500, borderRadius: '0.5rem',
    border: 'none', cursor: 'pointer', textDecoration: 'none', transition: 'all 150ms ease-in-out',
  };
  const variants: Record<ButtonVariant, CSSProperties> = {
    primary: { backgroundColor: colors.primary, color: colors.primaryForeground },
    secondary: { backgroundColor: colors.backgroundSecondary, color: colors.foreground },
    outline: { backgroundColor: 'transparent', color: colors.foreground, border: \`1px solid \${colors.border}\` },
    ghost: { backgroundColor: 'transparent', color: colors.foreground },
  };
  return { ...base, ...variants[variant] };
}
export function getInputStyles(theme: Theme, hasError?: boolean): CSSProperties {
  const colors = getThemeColors(theme);
  return {
    width: '100%', padding: '0.75rem 1rem', fontSize: '1rem', lineHeight: 1.5,
    color: colors.foreground, backgroundColor: colors.background,
    border: \`1px solid \${hasError ? colors.error : colors.border}\`,
    borderRadius: '0.5rem', outline: 'none', boxSizing: 'border-box',
  };
}
export function getLabelStyles(theme: Theme): CSSProperties {
  const colors = getThemeColors(theme);
  return { display: 'block', fontSize: '0.875rem', fontWeight: 500, color: colors.foreground, marginBottom: '0.5rem' };
}
export function getErrorStyles(theme: Theme): CSSProperties {
  const colors = getThemeColors(theme);
  return { fontSize: '0.875rem', color: colors.error, marginTop: '0.25rem' };
}
`,

  'components/primitives.tsx': `/**
 * Shared UI primitive components
 */

import React from 'react';
import type { Theme, CTAButton as CTAButtonType } from '../types';
import { cn, getExternalLinkProps } from '../utils';
import { getThemeColors, getButtonStyles, getInputStyles, getLabelStyles, getErrorStyles, getContainerStyles, getSectionBaseStyles, getSectionPadding, type ButtonVariant } from '../styles';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  theme: Theme;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  external?: boolean;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Button({ children, variant = 'primary', theme, href, onClick, type = 'button', disabled, external, ariaLabel, className, style }: ButtonProps): React.ReactElement {
  const buttonStyles = { ...getButtonStyles(variant, theme), ...style, ...(disabled && { opacity: 0.5, cursor: 'not-allowed' }) };
  if (href) {
    return <a href={href} className={cn('comp-button', className)} style={buttonStyles} aria-label={ariaLabel} {...(external && getExternalLinkProps())}>{children}</a>;
  }
  return <button type={type} onClick={onClick} disabled={disabled} className={cn('comp-button', className)} style={buttonStyles} aria-label={ariaLabel}>{children}</button>;
}

export function CTAButton({ label, href, onClick, variant = 'primary', ariaLabel, external, theme, className }: CTAButtonType & { theme: Theme; className?: string }): React.ReactElement {
  return <Button variant={variant} theme={theme} href={href} onClick={onClick} external={external} ariaLabel={ariaLabel ?? label} className={className}>{label}</Button>;
}

export interface InputProps {
  name: string; label: string; type?: 'text' | 'email' | 'tel' | 'url';
  value: string; onChange: (value: string) => void; onBlur?: () => void;
  placeholder?: string; required?: boolean; disabled?: boolean; error?: string;
  theme: Theme; className?: string; autoComplete?: string;
}

export function Input({ name, label, type = 'text', value, onChange, onBlur, placeholder, required, disabled, error, theme, className, autoComplete }: InputProps): React.ReactElement {
  const inputId = \`input-\${name}\`;
  const errorId = error ? \`\${inputId}-error\` : undefined;
  const colors = getThemeColors(theme);
  return (
    <div className={cn('comp-input-group', className)}>
      <label htmlFor={inputId} style={getLabelStyles(theme)}>{label}{required && <span style={{ color: colors.error }}> *</span>}</label>
      <input id={inputId} name={name} type={type} value={value} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} placeholder={placeholder} required={required} disabled={disabled} aria-invalid={error ? 'true' : undefined} aria-describedby={errorId} autoComplete={autoComplete} style={getInputStyles(theme, !!error)} />
      {error && <p id={errorId} role="alert" style={getErrorStyles(theme)}>{error}</p>}
    </div>
  );
}

export interface TextareaProps {
  name: string; label: string; value: string; onChange: (value: string) => void; onBlur?: () => void;
  placeholder?: string; required?: boolean; disabled?: boolean; error?: string; rows?: number; theme: Theme;
}

export function Textarea({ name, label, value, onChange, onBlur, placeholder, required, disabled, error, rows = 4, theme }: TextareaProps): React.ReactElement {
  const inputId = \`textarea-\${name}\`;
  const errorId = error ? \`\${inputId}-error\` : undefined;
  const colors = getThemeColors(theme);
  return (
    <div className="comp-textarea-group">
      <label htmlFor={inputId} style={getLabelStyles(theme)}>{label}{required && <span style={{ color: colors.error }}> *</span>}</label>
      <textarea id={inputId} name={name} value={value} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} placeholder={placeholder} required={required} disabled={disabled} rows={rows} aria-invalid={error ? 'true' : undefined} aria-describedby={errorId} style={{ ...getInputStyles(theme, !!error), resize: 'vertical', minHeight: '100px' }} />
      {error && <p id={errorId} role="alert" style={getErrorStyles(theme)}>{error}</p>}
    </div>
  );
}

export interface SelectProps {
  name: string; label: string; value: string; onChange: (value: string) => void; onBlur?: () => void;
  options: Array<{ value: string; label: string }>; placeholder?: string; required?: boolean; disabled?: boolean; error?: string; theme: Theme;
}

export function Select({ name, label, value, onChange, onBlur, options, placeholder, required, disabled, error, theme }: SelectProps): React.ReactElement {
  const inputId = \`select-\${name}\`;
  const errorId = error ? \`\${inputId}-error\` : undefined;
  const colors = getThemeColors(theme);
  return (
    <div className="comp-select-group">
      <label htmlFor={inputId} style={getLabelStyles(theme)}>{label}{required && <span style={{ color: colors.error }}> *</span>}</label>
      <select id={inputId} name={name} value={value} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} required={required} disabled={disabled} aria-invalid={error ? 'true' : undefined} aria-describedby={errorId} style={getInputStyles(theme, !!error)}>
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      {error && <p id={errorId} role="alert" style={getErrorStyles(theme)}>{error}</p>}
    </div>
  );
}

export interface MediaProps { src: string; alt: string; type?: 'image' | 'video'; style?: React.CSSProperties; }

export function Media({ src, alt, type = 'image', style }: MediaProps): React.ReactElement {
  const baseStyles: React.CSSProperties = { maxWidth: '100%', height: 'auto', display: 'block', ...style };
  if (type === 'video') return <video src={src} style={baseStyles} controls aria-label={alt}><track kind="captions" /></video>;
  return <img src={src} alt={alt} loading="lazy" style={baseStyles} />;
}
`,
};
