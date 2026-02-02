/**
 * About Section - Variant Components
 * 
 * Implements the three About variants:
 * 1. Text-heavy - Focus on text content with optional highlights
 * 2. Image-focused - Side-by-side text and image
 * 3. Values - Grid of values/highlights with icons
 */

import React from 'react';
import type { Theme, HighlightItem } from '../types';
import { cn } from '../utils';
import { useTheme } from '../hooks';
import { Media } from '../components/primitives';
import { getThemeColors, getContainerStyles, getSectionBaseStyles, getSectionPadding } from '../styles';
import {
  type AboutProps,
  type AboutVariant,
  getAboutHeadingStyles,
  getAboutSubheadingStyles,
  getAboutDescriptionStyles,
} from './About.base';

// ============================================================================
// Shared Components
// ============================================================================

interface AboutHeaderProps {
  subheading?: string;
  heading: string;
  theme: Theme;
  alignment?: 'left' | 'center';
}

function AboutHeader({ subheading, heading, theme, alignment = 'left' }: AboutHeaderProps): React.ReactElement {
  const colors = getThemeColors(theme);
  
  return (
    <header style={{ textAlign: alignment }}>
      {subheading && (
        <p style={{ ...getAboutSubheadingStyles(), color: colors.primary, marginBottom: '0.75rem' }}>
          {subheading}
        </p>
      )}
      <h2 style={{ ...getAboutHeadingStyles(), color: colors.foreground }}>
        {heading}
      </h2>
    </header>
  );
}

interface DescriptionBlockProps {
  description: string | string[];
  theme: Theme;
}

function DescriptionBlock({ description, theme }: DescriptionBlockProps): React.ReactElement {
  const colors = getThemeColors(theme);
  const paragraphs = Array.isArray(description) ? description : [description];
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {paragraphs.map((para, index) => (
        <p 
          key={index} 
          style={{ ...getAboutDescriptionStyles(), color: colors.foregroundSecondary }}
        >
          {para}
        </p>
      ))}
    </div>
  );
}

interface HighlightCardProps {
  highlight: HighlightItem;
  theme: Theme;
}

function HighlightCard({ highlight, theme }: HighlightCardProps): React.ReactElement {
  const colors = getThemeColors(theme);
  
  return (
    <article
      style={{
        padding: '1.5rem',
        backgroundColor: colors.backgroundSecondary,
        borderRadius: '0.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      {highlight.icon && (
        <div 
          style={{ 
            width: '48px', 
            height: '48px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: colors.primary,
            borderRadius: '0.5rem',
            color: colors.primaryForeground,
          }}
          aria-hidden="true"
        >
          {highlight.icon}
        </div>
      )}
      <h3 
        style={{ 
          fontSize: '1.125rem', 
          fontWeight: 600, 
          margin: 0,
          color: colors.foreground,
        }}
      >
        {highlight.title}
      </h3>
      {highlight.description && (
        <p 
          style={{ 
            fontSize: '0.9375rem', 
            lineHeight: 1.6, 
            margin: 0,
            color: colors.foregroundSecondary,
          }}
        >
          {highlight.description}
        </p>
      )}
    </article>
  );
}

// ============================================================================
// Text-Heavy Variant
// ============================================================================

function AboutTextHeavy({
  content,
  theme,
  className,
  id,
  'data-testid': testId,
}: Omit<AboutProps, 'variant'>): React.ReactElement {
  const { themeClass } = useTheme(theme);
  const effectiveTheme = theme ?? 'light';

  return (
    <section
      id={id}
      data-testid={testId}
      className={cn('comp-about', 'comp-about--text-heavy', themeClass, className)}
      style={{
        ...getSectionBaseStyles(effectiveTheme),
        ...getSectionPadding(),
      }}
    >
      <div style={{ ...getContainerStyles(), maxWidth: '900px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <AboutHeader
            subheading={content.subheading}
            heading={content.heading}
            theme={effectiveTheme}
          />
          
          <DescriptionBlock description={content.description} theme={effectiveTheme} />
          
          {content.highlights && content.highlights.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem',
                marginTop: '1rem',
              }}
            >
              {content.highlights.map((highlight, index) => (
                <HighlightCard key={index} highlight={highlight} theme={effectiveTheme} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Image-Focused Variant
// ============================================================================

function AboutImageFocused({
  content,
  media,
  mediaPosition = 'right',
  theme,
  className,
  id,
  'data-testid': testId,
}: Omit<AboutProps, 'variant'>): React.ReactElement {
  const { themeClass } = useTheme(theme);
  const effectiveTheme = theme ?? 'light';

  const contentOrder = mediaPosition === 'left' ? 2 : 1;
  const mediaOrder = mediaPosition === 'left' ? 1 : 2;

  return (
    <section
      id={id}
      data-testid={testId}
      className={cn('comp-about', 'comp-about--image-focused', themeClass, className)}
      style={{
        ...getSectionBaseStyles(effectiveTheme),
        ...getSectionPadding(),
      }}
    >
      <div
        style={{
          ...getContainerStyles(),
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '4rem',
          alignItems: 'center',
        }}
      >
        {/* Content */}
        <div style={{ order: contentOrder, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <AboutHeader
            subheading={content.subheading}
            heading={content.heading}
            theme={effectiveTheme}
          />
          <DescriptionBlock description={content.description} theme={effectiveTheme} />
        </div>

        {/* Media */}
        {media && (
          <div style={{ order: mediaOrder }}>
            <Media
              src={media.src}
              alt={media.alt}
              type={media.type}
              poster={media.poster}
              style={{
                borderRadius: '1rem',
                width: '100%',
                height: 'auto',
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
// Values Variant
// ============================================================================

function AboutValues({
  content,
  theme,
  className,
  id,
  'data-testid': testId,
}: Omit<AboutProps, 'variant'>): React.ReactElement {
  const { themeClass } = useTheme(theme);
  const effectiveTheme = theme ?? 'light';

  return (
    <section
      id={id}
      data-testid={testId}
      className={cn('comp-about', 'comp-about--values', themeClass, className)}
      style={{
        ...getSectionBaseStyles(effectiveTheme),
        ...getSectionPadding(),
      }}
    >
      <div style={getContainerStyles()}>
        {/* Header - Centered */}
        <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
          <AboutHeader
            subheading={content.subheading}
            heading={content.heading}
            theme={effectiveTheme}
            alignment="center"
          />
          {content.description && (
            <div style={{ marginTop: '1rem' }}>
              <DescriptionBlock description={content.description} theme={effectiveTheme} />
            </div>
          )}
        </div>

        {/* Values Grid */}
        {content.highlights && content.highlights.length > 0 && (
          <div
            role="list"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {content.highlights.map((highlight, index) => (
              <div key={index} role="listitem">
                <HighlightCard highlight={highlight} theme={effectiveTheme} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================================================
// Variant Map
// ============================================================================

const variantComponents: Record<
  AboutVariant,
  React.ComponentType<Omit<AboutProps, 'variant'>>
> = {
  'text-heavy': AboutTextHeavy,
  'image-focused': AboutImageFocused,
  'values': AboutValues,
};

// ============================================================================
// Main About Component
// ============================================================================

export function About({ variant, ...props }: AboutProps): React.ReactElement {
  const VariantComponent = variantComponents[variant];
  return <VariantComponent {...props} />;
}

About.displayName = 'About';
