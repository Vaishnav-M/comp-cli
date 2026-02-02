/**
 * Contact Section - Base Component
 * 
 * Provides the foundational structure, types, form logic, and validation
 * for all Contact variants.
 */

import React from 'react';
import type { 
  BaseSectionProps, 
  ContactInfo,
  CTAButton,
  SocialLink,
} from '../types';

// ============================================================================
// Contact Variants
// ============================================================================

export const CONTACT_VARIANTS = ['simple', 'with-info', 'cta-based'] as const;
export type ContactVariant = typeof CONTACT_VARIANTS[number];

// ============================================================================
// Contact Form Types
// ============================================================================

/**
 * Contact form data - all fields are strings (empty string for optional fields)
 * The useForm hook requires Record<string, string>
 */
export interface ContactFormData {
  [key: string]: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ContactFormConfig {
  /** Show phone field */
  showPhone?: boolean;
  /** Show subject field */
  showSubject?: boolean;
  /** Subject options (if select) */
  subjectOptions?: Array<{ value: string; label: string }>;
  /** Submit button text */
  submitText?: string;
  /** Success message */
  successMessage?: string;
  /** Form submission handler */
  onSubmit?: (data: ContactFormData) => void | Promise<void>;
}

// ============================================================================
// Contact Props
// ============================================================================

export interface ContactContent {
  /** Section heading */
  heading: string;
  /** Optional subheading */
  subheading?: string;
  /** Optional description */
  description?: string;
  /** Company/business contact info (for with-info variant) */
  contactInfo?: ContactInfo;
  /** Social links (for with-info variant) */
  socialLinks?: SocialLink[];
  /** CTA content (for cta-based variant) */
  cta?: {
    heading: string;
    description?: string;
    buttons: CTAButton[];
  };
}

export interface ContactProps extends BaseSectionProps {
  /** Visual layout variant */
  variant: ContactVariant;
  /** Contact content */
  content: ContactContent;
  /** Form configuration */
  formConfig?: ContactFormConfig;
}

// ============================================================================
// Base Styles
// ============================================================================

export function getContactHeadingStyles(): React.CSSProperties {
  return {
    fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.025em',
    margin: 0,
  };
}

export function getContactSubheadingStyles(): React.CSSProperties {
  return {
    fontSize: '1rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    margin: 0,
  };
}

export function getContactFormStyles(): React.CSSProperties {
  return {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  };
}

// ============================================================================
// Default Export
// ============================================================================

export { Contact } from './Contact.variants';
