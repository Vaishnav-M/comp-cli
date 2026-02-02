/**
 * Hero Section Templates
 */

export const HERO_TEMPLATES = {
  'Hero.base.tsx': `/**
 * Hero Section - Base Component
 */

import React from 'react';
import type { BaseSectionProps, CTAButton, MediaItem } from '../types';

export const HERO_VARIANTS = ['centered', 'split', 'fullwidth'] as const;
export type HeroVariant = typeof HERO_VARIANTS[number];

export interface HeroContent {
  heading: string;
  subheading?: string;
  description?: string;
  ctas?: CTAButton[];
}

export interface HeroProps extends BaseSectionProps {
  variant: HeroVariant;
  content: HeroContent;
  media?: MediaItem;
  alignment?: 'left' | 'center' | 'right';
  overlayOpacity?: number;
  minHeight?: string;
}

export function getHeroBaseStyles(minHeight?: string): React.CSSProperties {
  return { position: 'relative', minHeight: minHeight ?? '70vh', display: 'flex', alignItems: 'center' };
}

export function getHeroContentStyles(alignment: 'left' | 'center' | 'right' = 'center'): React.CSSProperties {
  const alignMap = { left: 'flex-start', center: 'center', right: 'flex-end' };
  return { textAlign: alignment, display: 'flex', flexDirection: 'column', alignItems: alignMap[alignment], gap: '1.5rem', maxWidth: '800px' };
}

export function getHeroHeadingStyles(): React.CSSProperties {
  return { fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.025em', margin: 0 };
}

export function getHeroSubheadingStyles(): React.CSSProperties {
  return { fontSize: 'clamp(1.125rem, 2vw, 1.5rem)', lineHeight: 1.5, margin: 0, opacity: 0.9 };
}

export function getHeroCTAContainerStyles(alignment: 'left' | 'center' | 'right' = 'center'): React.CSSProperties {
  const justifyMap = { left: 'flex-start', center: 'center', right: 'flex-end' };
  return { display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: justifyMap[alignment], marginTop: '0.5rem' };
}

export { Hero } from './Hero.variants';
`,

  'Hero.variants.tsx': `/**
 * Hero Section - Variant Components
 */

import React from 'react';
import type { Theme } from '../types';
import { cn } from '../utils';
import { useTheme } from '../hooks';
import { CTAButton, Media } from '../components/primitives';
import { getThemeColors, getContainerStyles } from '../styles';
import { type HeroProps, type HeroVariant, getHeroBaseStyles, getHeroContentStyles, getHeroHeadingStyles, getHeroSubheadingStyles, getHeroCTAContainerStyles } from './Hero.base';

interface HeroContentRendererProps { content: HeroProps['content']; alignment?: HeroProps['alignment']; theme: Theme; }

function HeroContentRenderer({ content, alignment = 'center', theme }: HeroContentRendererProps): React.ReactElement {
  const colors = getThemeColors(theme);
  return (
    <div style={getHeroContentStyles(alignment)}>
      <h1 style={{ ...getHeroHeadingStyles(), color: colors.foreground }}>{content.heading}</h1>
      {content.subheading && <p style={{ ...getHeroSubheadingStyles(), color: colors.foregroundSecondary }}>{content.subheading}</p>}
      {content.ctas && content.ctas.length > 0 && (
        <div style={getHeroCTAContainerStyles(alignment)}>
          {content.ctas.map((cta, i) => <CTAButton key={i} {...cta} theme={theme} variant={cta.variant ?? (i === 0 ? 'primary' : 'outline')} />)}
        </div>
      )}
    </div>
  );
}

function HeroCentered({ content, alignment = 'center', theme, minHeight, className, id, 'data-testid': testId }: Omit<HeroProps, 'variant'>): React.ReactElement {
  const { themeClass } = useTheme(theme);
  const colors = getThemeColors(theme ?? 'light');
  return (
    <section id={id} data-testid={testId} className={cn('comp-hero', 'comp-hero--centered', themeClass, className)} style={{ ...getHeroBaseStyles(minHeight), backgroundColor: colors.background, justifyContent: 'center' }}>
      <div style={{ ...getContainerStyles(), display: 'flex', flexDirection: 'column', alignItems: alignment === 'left' ? 'flex-start' : alignment === 'right' ? 'flex-end' : 'center', padding: '4rem 1rem' }}>
        <HeroContentRenderer content={content} alignment={alignment} theme={theme ?? 'light'} />
      </div>
    </section>
  );
}

function HeroSplit({ content, media, theme, minHeight, className, id, 'data-testid': testId }: Omit<HeroProps, 'variant' | 'alignment'>): React.ReactElement {
  const { themeClass } = useTheme(theme);
  const colors = getThemeColors(theme ?? 'light');
  return (
    <section id={id} data-testid={testId} className={cn('comp-hero', 'comp-hero--split', themeClass, className)} style={{ ...getHeroBaseStyles(minHeight), backgroundColor: colors.background }}>
      <div style={{ ...getContainerStyles(), display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '3rem', alignItems: 'center', padding: '4rem 1rem' }}>
        <div><HeroContentRenderer content={content} alignment="left" theme={theme ?? 'light'} /></div>
        {media && <div style={{ display: 'flex', justifyContent: 'center' }}><Media src={media.src} alt={media.alt} type={media.type} style={{ borderRadius: '1rem', maxHeight: '500px', objectFit: 'cover' }} /></div>}
      </div>
    </section>
  );
}

function HeroFullwidth({ content, media, alignment = 'center', overlayOpacity = 0.5, theme, minHeight, className, id, 'data-testid': testId }: Omit<HeroProps, 'variant'>): React.ReactElement {
  const { themeClass } = useTheme(theme);
  const effectiveTheme = theme ?? 'dark';
  return (
    <section id={id} data-testid={testId} className={cn('comp-hero', 'comp-hero--fullwidth', themeClass, className)} style={{ ...getHeroBaseStyles(minHeight ?? '80vh'), position: 'relative', overflow: 'hidden' }}>
      {media && <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>{media.type === 'video' ? <video src={media.src} autoPlay muted loop playsInline aria-hidden="true" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <img src={media.src} alt="" aria-hidden="true" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}</div>}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundColor: \`rgba(0, 0, 0, \${overlayOpacity})\`, zIndex: 1 }} />
      <div style={{ ...getContainerStyles(), position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: alignment === 'left' ? 'flex-start' : alignment === 'right' ? 'flex-end' : 'center', justifyContent: 'center', padding: '4rem 1rem', color: '#ffffff' }}>
        <HeroContentRenderer content={content} alignment={alignment} theme={effectiveTheme} />
      </div>
    </section>
  );
}

const variantComponents: Record<HeroVariant, React.ComponentType<Omit<HeroProps, 'variant'>>> = { centered: HeroCentered, split: HeroSplit, fullwidth: HeroFullwidth };

export function Hero({ variant, ...props }: HeroProps): React.ReactElement {
  const VariantComponent = variantComponents[variant];
  return <VariantComponent {...props} />;
}

Hero.displayName = 'Hero';
`,

  'index.ts': `export { Hero, HERO_VARIANTS } from './Hero.base';
export type { HeroProps, HeroVariant, HeroContent } from './Hero.base';
`,
};
