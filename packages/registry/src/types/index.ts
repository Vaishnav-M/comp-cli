/**
 * Core type definitions for the section registry
 * These types ensure type-safe variant resolution and consistent APIs
 */

import { ReactNode, CSSProperties } from 'react';

// ============================================================================
// Theme Types
// ============================================================================

export type Theme = 'light' | 'dark';

export interface ThemeProps {
  /** Visual theme - affects colors and contrast */
  theme?: Theme;
}

// ============================================================================
// Base Section Props
// ============================================================================

export interface BaseSectionProps extends ThemeProps {
  /** Additional CSS classes */
  className?: string;
  /** Inline styles (use sparingly) */
  style?: CSSProperties;
  /** Section ID for navigation/anchoring */
  id?: string;
  /** Test ID for testing frameworks */
  'data-testid'?: string;
}

// ============================================================================
// Variant System Types
// ============================================================================

/**
 * Generic type for sections with variants
 * V extends string to ensure variant is a union of literal types
 */
export interface VariantSectionProps<V extends string> extends BaseSectionProps {
  /** The visual/layout variant to render */
  variant: V;
}

/**
 * Utility type to extract variant from a section props type
 */
export type ExtractVariant<T> = T extends VariantSectionProps<infer V> ? V : never;

// ============================================================================
// CTA (Call to Action) Types
// ============================================================================

export interface CTAButton {
  /** Button text */
  label: string;
  /** Click handler or href */
  href?: string;
  onClick?: () => void;
  /** Button importance */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  /** Accessibility label */
  ariaLabel?: string;
  /** Open in new tab */
  external?: boolean;
}

// ============================================================================
// Media Types
// ============================================================================

export interface MediaItem {
  /** Media source URL */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Media type */
  type: 'image' | 'video';
  /** Optional poster for video */
  poster?: string;
  /** Width hint for optimization */
  width?: number;
  /** Height hint for optimization */
  height?: number;
}

// ============================================================================
// Form Types
// ============================================================================

export interface FormFieldBase {
  /** Field name (for form data) */
  name: string;
  /** Field label */
  label: string;
  /** Placeholder text */
  placeholder?: string;
  /** Is field required */
  required?: boolean;
  /** Field is disabled */
  disabled?: boolean;
  /** Error message */
  error?: string;
  /** Help text */
  helpText?: string;
}

export interface TextFieldProps extends FormFieldBase {
  type: 'text' | 'email' | 'tel' | 'url';
  value: string;
  onChange: (value: string) => void;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export interface TextAreaFieldProps extends FormFieldBase {
  type: 'textarea';
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  minLength?: number;
  maxLength?: number;
}

export interface SelectFieldProps extends FormFieldBase {
  type: 'select';
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}

export interface DateFieldProps extends FormFieldBase {
  type: 'date' | 'datetime-local' | 'time';
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
}

export type FormField = 
  | TextFieldProps 
  | TextAreaFieldProps 
  | SelectFieldProps 
  | DateFieldProps;

// ============================================================================
// Navigation / Link Types
// ============================================================================

export interface NavLink {
  /** Link text */
  label: string;
  /** Link URL */
  href: string;
  /** Is external link */
  external?: boolean;
  /** Accessibility label */
  ariaLabel?: string;
}

export interface NavGroup {
  /** Group title */
  title: string;
  /** Links in this group */
  links: NavLink[];
}

// ============================================================================
// Social Media Types
// ============================================================================

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

// ============================================================================
// Content Types
// ============================================================================

export interface HighlightItem {
  /** Icon or visual indicator */
  icon?: ReactNode;
  /** Title text */
  title: string;
  /** Description text */
  description?: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
  hours?: string;
}

// ============================================================================
// Section Registry Types
// ============================================================================

export interface SectionMeta {
  /** Section unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Description */
  description: string;
  /** Available variants */
  variants: readonly string[];
  /** Required dependencies */
  dependencies: string[];
}

export interface SectionRegistry {
  [key: string]: SectionMeta;
}

// ============================================================================
// Component Map Type for Internal Use
// ============================================================================

export type VariantComponentMap<V extends string, P> = {
  [K in V]: React.ComponentType<Omit<P, 'variant'>>;
};
