/**
 * About Section Templates
 */

export const ABOUT_TEMPLATES = {
  'About.base.tsx': `/**
 * About Section - Base Component
 */

import React from 'react';
import type { BaseSectionProps, MediaItem, HighlightItem } from '../types';

export const ABOUT_VARIANTS = ['text-heavy', 'image-focused', 'values'] as const;
export type AboutVariant = typeof ABOUT_VARIANTS[number];

export interface AboutContent {
  heading: string;
  subheading?: string;
  description: string | string[];
  highlights?: HighlightItem[];
}

export interface AboutProps extends BaseSectionProps {
  variant: AboutVariant;
  content: AboutContent;
  media?: MediaItem;
  mediaPosition?: 'left' | 'right';
}

export function getAboutHeadingStyles(): React.CSSProperties {
  return { fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.025em', margin: 0 };
}

export function getAboutSubheadingStyles(): React.CSSProperties {
  return { fontSize: '1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 };
}

export { About } from './About.variants';
`,

  'About.variants.tsx': `/**
 * About Section - Variant Components
 */

import React from 'react';
import type { Theme, HighlightItem } from '../types';
import { cn } from '../utils';
import { useTheme } from '../hooks';
import { Media } from '../components/primitives';
import { getThemeColors, getContainerStyles, getSectionBaseStyles, getSectionPadding } from '../styles';
import { type AboutProps, type AboutVariant, getAboutHeadingStyles, getAboutSubheadingStyles } from './About.base';

function AboutHeader({ subheading, heading, theme, alignment = 'left' }: { subheading?: string; heading: string; theme: Theme; alignment?: 'left' | 'center' }) {
  const colors = getThemeColors(theme);
  return (
    <header style={{ textAlign: alignment }}>
      {subheading && <p style={{ ...getAboutSubheadingStyles(), color: colors.primary, marginBottom: '0.75rem' }}>{subheading}</p>}
      <h2 style={{ ...getAboutHeadingStyles(), color: colors.foreground }}>{heading}</h2>
    </header>
  );
}

function DescriptionBlock({ description, theme }: { description: string | string[]; theme: Theme }) {
  const colors = getThemeColors(theme);
  const paragraphs = Array.isArray(description) ? description : [description];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {paragraphs.map((para, i) => <p key={i} style={{ fontSize: '1.125rem', lineHeight: 1.8, color: colors.foregroundSecondary, margin: 0 }}>{para}</p>)}
    </div>
  );
}

function HighlightCard({ highlight, theme }: { highlight: HighlightItem; theme: Theme }) {
  const colors = getThemeColors(theme);
  return (
    <article style={{ padding: '1.5rem', backgroundColor: colors.backgroundSecondary, borderRadius: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {highlight.icon && <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, borderRadius: '0.5rem', color: colors.primaryForeground }} aria-hidden="true">{highlight.icon}</div>}
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0, color: colors.foreground }}>{highlight.title}</h3>
      {highlight.description && <p style={{ fontSize: '0.9375rem', lineHeight: 1.6, margin: 0, color: colors.foregroundSecondary }}>{highlight.description}</p>}
    </article>
  );
}

function AboutTextHeavy({ content, theme, className, id, 'data-testid': testId }: Omit<AboutProps, 'variant'>) {
  const { themeClass } = useTheme(theme);
  const effectiveTheme = theme ?? 'light';
  return (
    <section id={id} data-testid={testId} className={cn('comp-about', 'comp-about--text-heavy', themeClass, className)} style={{ ...getSectionBaseStyles(effectiveTheme), ...getSectionPadding() }}>
      <div style={{ ...getContainerStyles(), maxWidth: '900px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <AboutHeader subheading={content.subheading} heading={content.heading} theme={effectiveTheme} />
          <DescriptionBlock description={content.description} theme={effectiveTheme} />
          {content.highlights && content.highlights.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
              {content.highlights.map((h, i) => <HighlightCard key={i} highlight={h} theme={effectiveTheme} />)}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function AboutImageFocused({ content, media, mediaPosition = 'right', theme, className, id, 'data-testid': testId }: Omit<AboutProps, 'variant'>) {
  const { themeClass } = useTheme(theme);
  const effectiveTheme = theme ?? 'light';
  return (
    <section id={id} data-testid={testId} className={cn('comp-about', 'comp-about--image-focused', themeClass, className)} style={{ ...getSectionBaseStyles(effectiveTheme), ...getSectionPadding() }}>
      <div style={{ ...getContainerStyles(), display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4rem', alignItems: 'center' }}>
        <div style={{ order: mediaPosition === 'left' ? 2 : 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <AboutHeader subheading={content.subheading} heading={content.heading} theme={effectiveTheme} />
          <DescriptionBlock description={content.description} theme={effectiveTheme} />
        </div>
        {media && <div style={{ order: mediaPosition === 'left' ? 1 : 2 }}><Media src={media.src} alt={media.alt} type={media.type} style={{ borderRadius: '1rem', width: '100%' }} /></div>}
      </div>
    </section>
  );
}

function AboutValues({ content, theme, className, id, 'data-testid': testId }: Omit<AboutProps, 'variant'>) {
  const { themeClass } = useTheme(theme);
  const effectiveTheme = theme ?? 'light';
  return (
    <section id={id} data-testid={testId} className={cn('comp-about', 'comp-about--values', themeClass, className)} style={{ ...getSectionBaseStyles(effectiveTheme), ...getSectionPadding() }}>
      <div style={getContainerStyles()}>
        <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
          <AboutHeader subheading={content.subheading} heading={content.heading} theme={effectiveTheme} alignment="center" />
          {content.description && <div style={{ marginTop: '1rem' }}><DescriptionBlock description={content.description} theme={effectiveTheme} /></div>}
        </div>
        {content.highlights && content.highlights.length > 0 && (
          <div role="list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {content.highlights.map((h, i) => <div key={i} role="listitem"><HighlightCard highlight={h} theme={effectiveTheme} /></div>)}
          </div>
        )}
      </div>
    </section>
  );
}

const variantComponents: Record<AboutVariant, React.ComponentType<Omit<AboutProps, 'variant'>>> = { 'text-heavy': AboutTextHeavy, 'image-focused': AboutImageFocused, 'values': AboutValues };

export function About({ variant, ...props }: AboutProps): React.ReactElement {
  const VariantComponent = variantComponents[variant];
  return <VariantComponent {...props} />;
}

About.displayName = 'About';
`,

  'index.ts': `export { About, ABOUT_VARIANTS } from './About.base';
export type { AboutProps, AboutVariant, AboutContent } from './About.base';
`,
};
