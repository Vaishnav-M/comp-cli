/**
 * Hero Section - Variant Components
 * 
 * Implements the three Hero variants:
 * 1. Centered - Text-focused, centered layout
 * 2. Split - Side-by-side content and media
 * 3. Fullwidth - Full background image with overlay
 */

import React from 'react';
import type { Theme } from '../types';
import { cn } from '../utils';
import { useTheme } from '../hooks';
import { CTAButton as CTAButtonComponent, Media } from '../components/primitives';
import { getThemeColors, getContainerStyles } from '../styles';
import {
  type HeroProps,
  type HeroVariant,
  getHeroBaseStyles,
  getHeroContentStyles,
  getHeroHeadingStyles,
  getHeroSubheadingStyles,
  getHeroDescriptionStyles,
  getHeroCTAContainerStyles,
} from './Hero.base';

// ============================================================================
// Shared Content Renderer
// ============================================================================

interface HeroContentRendererProps {
  content: HeroProps['content'];
  alignment?: HeroProps['alignment'];
  theme: Theme;
}

function HeroContentRenderer({
  content,
  alignment = 'center',
  theme,
}: HeroContentRendererProps): React.ReactElement {
  const colors = getThemeColors(theme);

  return (
    <div style={getHeroContentStyles(alignment)}>
      <h1 style={{ ...getHeroHeadingStyles(), color: colors.foreground }}>
        {content.heading}
      </h1>
      
      {content.subheading && (
        <p style={{ ...getHeroSubheadingStyles(), color: colors.foregroundSecondary }}>
          {content.subheading}
        </p>
      )}
      
      {content.description && (
        <p style={{ ...getHeroDescriptionStyles(), color: colors.foregroundSecondary }}>
          {content.description}
        </p>
      )}
      
      {content.ctas && content.ctas.length > 0 && (
        <div style={getHeroCTAContainerStyles(alignment)}>
          {content.ctas.map((cta, index) => (
            <CTAButtonComponent
              key={index}
              {...cta}
              theme={theme}
              variant={cta.variant ?? (index === 0 ? 'primary' : 'outline')}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Centered Variant
// ============================================================================

function HeroCentered({
  content,
  alignment = 'center',
  theme,
  minHeight,
  className,
  id,
  'data-testid': testId,
}: Omit<HeroProps, 'variant'>): React.ReactElement {
  const { themeClass } = useTheme(theme);
  const colors = getThemeColors(theme ?? 'light');

  return (
    <section
      id={id}
      data-testid={testId}
      className={cn('comp-hero', 'comp-hero--centered', themeClass, className)}
      style={{
        ...getHeroBaseStyles(minHeight),
        backgroundColor: colors.background,
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          ...getContainerStyles(),
          display: 'flex',
          flexDirection: 'column',
          alignItems: alignment === 'left' ? 'flex-start' : alignment === 'right' ? 'flex-end' : 'center',
          padding: '4rem 1rem',
        }}
      >
        <HeroContentRenderer
          content={content}
          alignment={alignment}
          theme={theme ?? 'light'}
        />
      </div>
    </section>
  );
}

// ============================================================================
// Split Variant
// ============================================================================

function HeroSplit({
  content,
  media,
  theme,
  minHeight,
  className,
  id,
  'data-testid': testId,
}: Omit<HeroProps, 'variant' | 'alignment'>): React.ReactElement {
  const { themeClass } = useTheme(theme);
  const colors = getThemeColors(theme ?? 'light');

  return (
    <section
      id={id}
      data-testid={testId}
      className={cn('comp-hero', 'comp-hero--split', themeClass, className)}
      style={{
        ...getHeroBaseStyles(minHeight),
        backgroundColor: colors.background,
      }}
    >
      <div
        style={{
          ...getContainerStyles(),
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '3rem',
          alignItems: 'center',
          padding: '4rem 1rem',
        }}
      >
        {/* Content Side */}
        <div>
          <HeroContentRenderer
            content={content}
            alignment="left"
            theme={theme ?? 'light'}
          />
        </div>

        {/* Media Side */}
        {media && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Media
              src={media.src}
              alt={media.alt}
              type={media.type}
              poster={media.poster}
              width={media.width}
              height={media.height}
              style={{
                borderRadius: '1rem',
                maxHeight: '500px',
                objectFit: 'cover',
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================================================
// Fullwidth Variant
// ============================================================================

function HeroFullwidth({
  content,
  media,
  alignment = 'center',
  overlayOpacity = 0.5,
  theme,
  minHeight,
  className,
  id,
  'data-testid': testId,
}: Omit<HeroProps, 'variant'>): React.ReactElement {
  const { themeClass } = useTheme(theme);
  const effectiveTheme = theme ?? 'dark'; // Default to dark for readability over images

  return (
    <section
      id={id}
      data-testid={testId}
      className={cn('comp-hero', 'comp-hero--fullwidth', themeClass, className)}
      style={{
        ...getHeroBaseStyles(minHeight ?? '80vh'),
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Media */}
      {media && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
          }}
        >
          {media.type === 'video' ? (
            <video
              src={media.src}
              poster={media.poster}
              autoPlay
              muted
              loop
              playsInline
              aria-hidden="true"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <img
              src={media.src}
              alt=""
              aria-hidden="true"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          )}
        </div>
      )}

      {/* Overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div
        style={{
          ...getContainerStyles(),
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: alignment === 'left' ? 'flex-start' : alignment === 'right' ? 'flex-end' : 'center',
          justifyContent: 'center',
          padding: '4rem 1rem',
          color: '#ffffff',
        }}
      >
        <HeroContentRenderer
          content={content}
          alignment={alignment}
          theme={effectiveTheme}
        />
      </div>
    </section>
  );
}

// ============================================================================
// Variant Map
// ============================================================================

const variantComponents: Record<
  HeroVariant,
  React.ComponentType<Omit<HeroProps, 'variant'>>
> = {
  centered: HeroCentered,
  split: HeroSplit,
  fullwidth: HeroFullwidth,
};

// ============================================================================
// Main Hero Component
// ============================================================================

export function Hero({ variant, ...props }: HeroProps): React.ReactElement {
  const VariantComponent = variantComponents[variant];
  return <VariantComponent {...props} />;
}

Hero.displayName = 'Hero';
