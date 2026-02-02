/**
 * About Section - Base Component
 * 
 * Provides the foundational structure, types, and shared logic for all About variants.
 */

import React from 'react';
import type { 
  BaseSectionProps, 
  MediaItem,
  HighlightItem,
} from '../types';

// ============================================================================
// About Variants
// ============================================================================

export const ABOUT_VARIANTS = ['text-heavy', 'image-focused', 'values'] as const;
export type AboutVariant = typeof ABOUT_VARIANTS[number];

// ============================================================================
// About Props
// ============================================================================

export interface AboutContent {
  /** Section title/heading */
  heading: string;
  /** Optional subheading */
  subheading?: string;
  /** Main description paragraphs */
  description: string | string[];
  /** Optional highlights/features/values */
  highlights?: HighlightItem[];
}

export interface AboutProps extends BaseSectionProps {
  /** Visual layout variant */
  variant: AboutVariant;
  /** About content */
  content: AboutContent;
  /** Optional media (for image-focused variant) */
  media?: MediaItem;
  /** Media position (for image-focused variant) */
  mediaPosition?: 'left' | 'right';
}

// ============================================================================
// Base Styles
// ============================================================================

export function getAboutContainerStyles(): React.CSSProperties {
  return {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  };
}

export function getAboutHeadingStyles(): React.CSSProperties {
  return {
    fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.025em',
    margin: 0,
  };
}

export function getAboutSubheadingStyles(): React.CSSProperties {
  return {
    fontSize: '1rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    margin: 0,
  };
}

export function getAboutDescriptionStyles(): React.CSSProperties {
  return {
    fontSize: '1.125rem',
    lineHeight: 1.8,
    margin: 0,
  };
}

// ============================================================================
// Default Export
// ============================================================================

export { About } from './About.variants';
