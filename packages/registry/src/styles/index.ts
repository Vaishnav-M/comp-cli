/**
 * Base CSS styles and CSS-in-JS utilities
 * These provide default styling without external dependencies
 */

import { CSSProperties } from 'react';
import type { Theme } from '../types';

// ============================================================================
// Theme Colors
// ============================================================================

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

export function getThemeColors(theme: Theme) {
  return themeColors[theme];
}

// ============================================================================
// Base Section Styles
// ============================================================================

export function getSectionBaseStyles(theme: Theme): CSSProperties {
  const colors = getThemeColors(theme);
  return {
    backgroundColor: colors.background,
    color: colors.foreground,
    width: '100%',
    boxSizing: 'border-box',
  };
}

export function getSectionPadding(): CSSProperties {
  return {
    paddingTop: '4rem',
    paddingBottom: '4rem',
    paddingLeft: '1rem',
    paddingRight: '1rem',
  };
}

// ============================================================================
// Container Styles
// ============================================================================

export function getContainerStyles(): CSSProperties {
  return {
    maxWidth: '1200px',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%',
  };
}

export function getContainerNarrowStyles(): CSSProperties {
  return {
    maxWidth: '800px',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%',
  };
}

// ============================================================================
// Typography Styles
// ============================================================================

export function getHeadingStyles(
  level: 1 | 2 | 3 | 4 | 5 | 6,
  theme: Theme
): CSSProperties {
  const colors = getThemeColors(theme);
  const sizes: Record<number, CSSProperties> = {
    1: { fontSize: '3rem', lineHeight: 1.1, fontWeight: 800 },
    2: { fontSize: '2.25rem', lineHeight: 1.2, fontWeight: 700 },
    3: { fontSize: '1.875rem', lineHeight: 1.3, fontWeight: 600 },
    4: { fontSize: '1.5rem', lineHeight: 1.4, fontWeight: 600 },
    5: { fontSize: '1.25rem', lineHeight: 1.5, fontWeight: 500 },
    6: { fontSize: '1rem', lineHeight: 1.5, fontWeight: 500 },
  };

  return {
    ...sizes[level],
    color: colors.foreground,
    margin: 0,
    letterSpacing: '-0.025em',
  };
}

export function getBodyTextStyles(theme: Theme): CSSProperties {
  const colors = getThemeColors(theme);
  return {
    fontSize: '1rem',
    lineHeight: 1.7,
    color: colors.foregroundSecondary,
    margin: 0,
  };
}

export function getLargeTextStyles(theme: Theme): CSSProperties {
  const colors = getThemeColors(theme);
  return {
    fontSize: '1.25rem',
    lineHeight: 1.6,
    color: colors.foregroundSecondary,
    margin: 0,
  };
}

// ============================================================================
// Button Styles
// ============================================================================

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

export function getButtonStyles(
  variant: ButtonVariant,
  theme: Theme
): CSSProperties {
  const colors = getThemeColors(theme);

  const baseStyles: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    fontWeight: 500,
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 150ms ease-in-out',
  };

  const variantStyles: Record<ButtonVariant, CSSProperties> = {
    primary: {
      backgroundColor: colors.primary,
      color: colors.primaryForeground,
    },
    secondary: {
      backgroundColor: colors.backgroundSecondary,
      color: colors.foreground,
    },
    outline: {
      backgroundColor: 'transparent',
      color: colors.foreground,
      border: `1px solid ${colors.border}`,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: colors.foreground,
    },
  };

  return { ...baseStyles, ...variantStyles[variant] };
}

// ============================================================================
// Form Styles
// ============================================================================

export function getInputStyles(theme: Theme, hasError?: boolean): CSSProperties {
  const colors = getThemeColors(theme);
  return {
    width: '100%',
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    lineHeight: 1.5,
    color: colors.foreground,
    backgroundColor: colors.background,
    border: `1px solid ${hasError ? colors.error : colors.border}`,
    borderRadius: '0.5rem',
    outline: 'none',
    transition: 'border-color 150ms ease-in-out',
    boxSizing: 'border-box',
  };
}

export function getLabelStyles(theme: Theme): CSSProperties {
  const colors = getThemeColors(theme);
  return {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: colors.foreground,
    marginBottom: '0.5rem',
  };
}

export function getErrorStyles(theme: Theme): CSSProperties {
  const colors = getThemeColors(theme);
  return {
    fontSize: '0.875rem',
    color: colors.error,
    marginTop: '0.25rem',
  };
}

// ============================================================================
// Layout Utilities
// ============================================================================

export function getFlexStyles(
  direction: 'row' | 'column' = 'row',
  gap: string = '1rem'
): CSSProperties {
  return {
    display: 'flex',
    flexDirection: direction,
    gap,
  };
}

export function getGridStyles(columns: number, gap: string = '1.5rem'): CSSProperties {
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap,
  };
}

export function getCenterStyles(): CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
}

// ============================================================================
// Responsive Styles Helper
// ============================================================================

/**
 * Note: For true responsive styles, use CSS classes or a CSS-in-JS solution
 * This is a simplified version for inline styles
 */
export function mergeStyles(...styles: (CSSProperties | undefined)[]): CSSProperties {
  return styles.reduce<CSSProperties>((acc, style) => {
    if (style) {
      return { ...acc, ...style };
    }
    return acc;
  }, {});
}
