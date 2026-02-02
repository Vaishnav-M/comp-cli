/**
 * Hero Section - Base Component
 * 
 * Provides the foundational structure, types, and shared logic for all Hero variants.
 * The variant-specific rendering is delegated to Hero.variants.tsx
 */

import React from 'react';
import type { 
  BaseSectionProps, 
  CTAButton, 
  MediaItem,
} from '../types';

// ============================================================================
// Hero Variants
// ============================================================================

export const HERO_VARIANTS = ['centered', 'split', 'fullwidth'] as const;
export type HeroVariant = typeof HERO_VARIANTS[number];

// ============================================================================
// Hero Props
// ============================================================================

export interface HeroContent {
  /** Main heading text */
  heading: string;
  /** Optional subheading/tagline */
  subheading?: string;
  /** Optional body text/description */
  description?: string;
  /** Call-to-action buttons (max recommended: 2) */
  ctas?: CTAButton[];
}

export interface HeroProps extends BaseSectionProps {
  /** Visual layout variant */
  variant: HeroVariant;
  /** Hero content */
  content: HeroContent;
  /** Optional media (image/video) */
  media?: MediaItem;
  /** Text alignment (applies to centered and fullwidth variants) */
  alignment?: 'left' | 'center' | 'right';
  /** Overlay opacity for fullwidth variant (0-1) */
  overlayOpacity?: number;
  /** Minimum height */
  minHeight?: string;
}

// ============================================================================
// Base Styles
// ============================================================================

export function getHeroBaseStyles(minHeight?: string): React.CSSProperties {
  return {
    position: 'relative',
    minHeight: minHeight ?? '70vh',
    display: 'flex',
    alignItems: 'center',
  };
}

export function getHeroContentStyles(
  alignment: 'left' | 'center' | 'right' = 'center'
): React.CSSProperties {
  const alignMap = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
  };

  return {
    textAlign: alignment,
    display: 'flex',
    flexDirection: 'column',
    alignItems: alignMap[alignment],
    gap: '1.5rem',
    maxWidth: '800px',
  };
}

export function getHeroHeadingStyles(): React.CSSProperties {
  return {
    fontSize: 'clamp(2rem, 5vw, 4rem)',
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: '-0.025em',
    margin: 0,
  };
}

export function getHeroSubheadingStyles(): React.CSSProperties {
  return {
    fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
    lineHeight: 1.5,
    margin: 0,
    opacity: 0.9,
  };
}

export function getHeroDescriptionStyles(): React.CSSProperties {
  return {
    fontSize: '1.125rem',
    lineHeight: 1.7,
    margin: 0,
    opacity: 0.8,
    maxWidth: '600px',
  };
}

export function getHeroCTAContainerStyles(
  alignment: 'left' | 'center' | 'right' = 'center'
): React.CSSProperties {
  const justifyMap = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
  };

  return {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    justifyContent: justifyMap[alignment],
    marginTop: '0.5rem',
  };
}

// ============================================================================
// Default Export
// ============================================================================

export { Hero } from './Hero.variants';
