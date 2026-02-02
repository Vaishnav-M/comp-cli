/**
 * Footer Section - Base Component
 * 
 * Provides the foundational structure, types, and shared logic for all Footer variants.
 */

import React from 'react';
import type { 
  BaseSectionProps, 
  NavGroup,
  NavLink,
  SocialLink,
} from '../types';

// ============================================================================
// Footer Variants
// ============================================================================

export const FOOTER_VARIANTS = ['minimal', 'multi-column', 'newsletter'] as const;
export type FooterVariant = typeof FOOTER_VARIANTS[number];

// ============================================================================
// Footer Props
// ============================================================================

export interface FooterBranding {
  /** Logo image src or text */
  logo?: string | React.ReactNode;
  /** Company/site name */
  name: string;
  /** Short tagline */
  tagline?: string;
}

export interface NewsletterConfig {
  /** Newsletter heading */
  heading?: string;
  /** Newsletter description */
  description?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Submit button text */
  submitText?: string;
  /** Success message */
  successMessage?: string;
  /** Submit handler */
  onSubmit?: (email: string) => void | Promise<void>;
}

export interface FooterContent {
  /** Branding info */
  branding: FooterBranding;
  /** Navigation groups (for multi-column variant) */
  navGroups?: NavGroup[];
  /** Single row of links (for minimal variant) */
  links?: NavLink[];
  /** Social media links */
  socialLinks?: SocialLink[];
  /** Copyright text (defaults to © {year} {name}) */
  copyright?: string;
  /** Legal links (privacy, terms, etc.) */
  legalLinks?: NavLink[];
  /** Newsletter config (for newsletter variant) */
  newsletter?: NewsletterConfig;
}

export interface FooterProps extends BaseSectionProps {
  /** Visual layout variant */
  variant: FooterVariant;
  /** Footer content */
  content: FooterContent;
}

// ============================================================================
// Base Styles
// ============================================================================

export function getFooterBaseStyles(): React.CSSProperties {
  return {
    paddingTop: '3rem',
    paddingBottom: '2rem',
    paddingLeft: '1rem',
    paddingRight: '1rem',
  };
}

export function getFooterLinkStyles(color: string): React.CSSProperties {
  return {
    color,
    textDecoration: 'none',
    fontSize: '0.9375rem',
    transition: 'opacity 150ms',
  };
}

// ============================================================================
// Helper: Get current year
// ============================================================================

export function getCurrentYear(): number {
  return new Date().getFullYear();
}

// ============================================================================
// Default Export
// ============================================================================

export { Footer } from './Footer.variants';
