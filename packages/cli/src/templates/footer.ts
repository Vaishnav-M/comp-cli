/**
 * Footer Section Templates
 */

export const FOOTER_TEMPLATES = {
  'Footer.base.tsx': `/**
 * Footer Section - Base Component
 */

import React from 'react';
import type { BaseSectionProps, NavGroup, NavLink, SocialLink } from '../types';

export const FOOTER_VARIANTS = ['minimal', 'multi-column', 'newsletter'] as const;
export type FooterVariant = typeof FOOTER_VARIANTS[number];

export interface FooterBranding { logo?: string | React.ReactNode; name: string; tagline?: string; }

export interface NewsletterConfig {
  heading?: string;
  description?: string;
  placeholder?: string;
  submitText?: string;
  successMessage?: string;
  onSubmit?: (email: string) => void | Promise<void>;
}

export interface FooterContent {
  branding: FooterBranding;
  navGroups?: NavGroup[];
  links?: NavLink[];
  socialLinks?: SocialLink[];
  copyright?: string;
  legalLinks?: NavLink[];
  newsletter?: NewsletterConfig;
}

export interface FooterProps extends BaseSectionProps {
  variant: FooterVariant;
  content: FooterContent;
}

export function getFooterLinkStyles(color: string): React.CSSProperties {
  return { color, textDecoration: 'none', fontSize: '0.9375rem', transition: 'opacity 150ms' };
}

export function getCurrentYear(): number { return new Date().getFullYear(); }

export { Footer } from './Footer.variants';
`,

  'Footer.variants.tsx': `/**
 * Footer Section - Variant Components
 */

import React, { useState } from 'react';
import type { Theme, NavGroup, NavLink, SocialLink } from '../types';
import { cn, getExternalLinkProps, isValidEmail } from '../utils';
import { useTheme } from '../hooks';
import { Button } from '../components/primitives';
import { getThemeColors, getContainerStyles, getSectionBaseStyles } from '../styles';
import { type FooterProps, type FooterVariant, type FooterBranding, type NewsletterConfig, getFooterLinkStyles, getCurrentYear } from './Footer.base';

function BrandingBlock({ branding, theme }: { branding: FooterBranding; theme: Theme }) {
  const colors = getThemeColors(theme);
  return (
    <div>
      {branding.logo && (typeof branding.logo === 'string' ? <img src={branding.logo} alt={branding.name} style={{ height: '32px', marginBottom: '0.75rem' }} /> : <div style={{ marginBottom: '0.75rem' }}>{branding.logo}</div>)}
      <p style={{ fontWeight: 700, fontSize: '1.25rem', color: colors.foreground, margin: 0 }}>{branding.name}</p>
      {branding.tagline && <p style={{ color: colors.foregroundSecondary, margin: 0, marginTop: '0.5rem', fontSize: '0.9375rem' }}>{branding.tagline}</p>}
    </div>
  );
}

function NavLinksBlock({ links, theme, inline = false }: { links: NavLink[]; theme: Theme; inline?: boolean }) {
  const colors = getThemeColors(theme);
  return (
    <nav aria-label="Footer navigation">
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: inline ? 'row' : 'column', gap: inline ? '1.5rem' : '0.75rem', flexWrap: 'wrap' }}>
        {links.map((link, i) => <li key={i}><a href={link.href} style={getFooterLinkStyles(colors.foregroundSecondary)} {...(link.external && getExternalLinkProps())}>{link.label}</a></li>)}
      </ul>
    </nav>
  );
}

function NavGroupBlock({ group, theme }: { group: NavGroup; theme: Theme }) {
  const colors = getThemeColors(theme);
  return (
    <div>
      <h3 style={{ fontWeight: 600, fontSize: '0.875rem', color: colors.foreground, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{group.title}</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {group.links.map((link, i) => <li key={i}><a href={link.href} style={getFooterLinkStyles(colors.foregroundSecondary)} {...(link.external && getExternalLinkProps())}>{link.label}</a></li>)}
      </ul>
    </div>
  );
}

function SocialLinksBlock({ links, theme }: { links: SocialLink[]; theme: Theme }) {
  const colors = getThemeColors(theme);
  return (
    <div style={{ display: 'flex', gap: '0.75rem' }}>
      {links.map((link, i) => <a key={i} href={link.href} aria-label={link.ariaLabel ?? \`Follow us on \${link.platform}\`} target="_blank" rel="noopener noreferrer" style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.backgroundSecondary, borderRadius: '0.375rem', color: colors.foregroundSecondary, textDecoration: 'none' }}>{link.platform[0].toUpperCase()}</a>)}
    </div>
  );
}

function CopyrightBlock({ copyright, brandName, legalLinks, theme }: { copyright?: string; brandName: string; legalLinks?: NavLink[]; theme: Theme }) {
  const colors = getThemeColors(theme);
  const copyrightText = copyright ?? \`© \${getCurrentYear()} \${brandName}. All rights reserved.\`;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', paddingTop: '1.5rem', borderTop: \`1px solid \${colors.border}\`, marginTop: '2rem' }}>
      <p style={{ color: colors.foregroundSecondary, margin: 0, fontSize: '0.875rem' }}>{copyrightText}</p>
      {legalLinks && legalLinks.length > 0 && (
        <nav aria-label="Legal links">
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', gap: '1.5rem' }}>
            {legalLinks.map((link, i) => <li key={i}><a href={link.href} style={{ ...getFooterLinkStyles(colors.foregroundSecondary), fontSize: '0.875rem' }}>{link.label}</a></li>)}
          </ul>
        </nav>
      )}
    </div>
  );
}

function NewsletterBlock({ config, theme }: { config: NewsletterConfig; theme: Theme }) {
  const colors = getThemeColors(theme);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | undefined>();
  const { heading = 'Subscribe to our newsletter', description = 'Get the latest updates.', placeholder = 'Enter your email', submitText = 'Subscribe', successMessage = 'Thanks for subscribing!', onSubmit } = config;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    if (!email.trim()) { setError('Please enter your email'); return; }
    if (!isValidEmail(email)) { setError('Please enter a valid email'); return; }
    setStatus('loading');
    try { await onSubmit?.(email); setStatus('success'); setEmail(''); } catch { setStatus('error'); setError('Something went wrong.'); }
  };

  if (status === 'success') return <div role="status" aria-live="polite"><p style={{ color: colors.foreground, margin: 0 }}>✓ {successMessage}</p></div>;

  return (
    <div>
      <h3 style={{ fontWeight: 600, fontSize: '1rem', color: colors.foreground, marginBottom: '0.5rem' }}>{heading}</h3>
      <p style={{ color: colors.foregroundSecondary, margin: 0, marginBottom: '1rem', fontSize: '0.9375rem' }}>{description}</p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
        <div style={{ flex: 1 }}>
          <label htmlFor="newsletter-email" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>Email address</label>
          <input id="newsletter-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={placeholder} aria-invalid={error ? 'true' : undefined} style={{ width: '100%', padding: '0.625rem 1rem', fontSize: '0.9375rem', color: colors.foreground, backgroundColor: colors.background, border: \`1px solid \${error ? colors.error : colors.border}\`, borderRadius: '0.375rem', outline: 'none' }} />
        </div>
        <Button type="submit" theme={theme} disabled={status === 'loading'} style={{ whiteSpace: 'nowrap' }}>{status === 'loading' ? '...' : submitText}</Button>
      </form>
      {error && <p role="alert" style={{ color: colors.error, margin: 0, marginTop: '0.5rem', fontSize: '0.875rem' }}>{error}</p>}
    </div>
  );
}

function FooterMinimal({ content, theme, className, id, 'data-testid': testId }: Omit<FooterProps, 'variant'>) {
  const { themeClass } = useTheme(theme);
  const colors = getThemeColors(theme ?? 'light');
  const effectiveTheme = theme ?? 'light';
  return (
    <footer id={id} data-testid={testId} className={cn('comp-footer', 'comp-footer--minimal', themeClass, className)} style={{ ...getSectionBaseStyles(effectiveTheme), paddingTop: '3rem', paddingBottom: '2rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
      <div style={getContainerStyles()}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.5rem' }}>
          <BrandingBlock branding={content.branding} theme={effectiveTheme} />
          {content.links && content.links.length > 0 && <NavLinksBlock links={content.links} theme={effectiveTheme} inline />}
          {content.socialLinks && content.socialLinks.length > 0 && <SocialLinksBlock links={content.socialLinks} theme={effectiveTheme} />}
          <div style={{ width: '100%', paddingTop: '1.5rem', borderTop: \`1px solid \${colors.border}\`, marginTop: '0.5rem' }}>
            <p style={{ color: colors.foregroundSecondary, margin: 0, fontSize: '0.875rem' }}>{content.copyright ?? \`© \${getCurrentYear()} \${content.branding.name}. All rights reserved.\`}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterMultiColumn({ content, theme, className, id, 'data-testid': testId }: Omit<FooterProps, 'variant'>) {
  const { themeClass } = useTheme(theme);
  const effectiveTheme = theme ?? 'light';
  return (
    <footer id={id} data-testid={testId} className={cn('comp-footer', 'comp-footer--multi-column', themeClass, className)} style={{ ...getSectionBaseStyles(effectiveTheme), paddingTop: '3rem', paddingBottom: '2rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
      <div style={getContainerStyles()}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr repeat(auto-fit, minmax(150px, 1fr))', gap: '3rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <BrandingBlock branding={content.branding} theme={effectiveTheme} />
            {content.socialLinks && content.socialLinks.length > 0 && <SocialLinksBlock links={content.socialLinks} theme={effectiveTheme} />}
          </div>
          {content.navGroups?.map((group, i) => <NavGroupBlock key={i} group={group} theme={effectiveTheme} />)}
        </div>
        <CopyrightBlock copyright={content.copyright} brandName={content.branding.name} legalLinks={content.legalLinks} theme={effectiveTheme} />
      </div>
    </footer>
  );
}

function FooterNewsletter({ content, theme, className, id, 'data-testid': testId }: Omit<FooterProps, 'variant'>) {
  const { themeClass } = useTheme(theme);
  const effectiveTheme = theme ?? 'light';
  return (
    <footer id={id} data-testid={testId} className={cn('comp-footer', 'comp-footer--newsletter', themeClass, className)} style={{ ...getSectionBaseStyles(effectiveTheme), paddingTop: '3rem', paddingBottom: '2rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
      <div style={getContainerStyles()}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr repeat(auto-fit, minmax(140px, 1fr)) 1.5fr', gap: '3rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <BrandingBlock branding={content.branding} theme={effectiveTheme} />
            {content.socialLinks && content.socialLinks.length > 0 && <SocialLinksBlock links={content.socialLinks} theme={effectiveTheme} />}
          </div>
          {content.navGroups?.map((group, i) => <NavGroupBlock key={i} group={group} theme={effectiveTheme} />)}
          {content.newsletter && <NewsletterBlock config={content.newsletter} theme={effectiveTheme} />}
        </div>
        <CopyrightBlock copyright={content.copyright} brandName={content.branding.name} legalLinks={content.legalLinks} theme={effectiveTheme} />
      </div>
    </footer>
  );
}

const variantComponents: Record<FooterVariant, React.ComponentType<Omit<FooterProps, 'variant'>>> = { minimal: FooterMinimal, 'multi-column': FooterMultiColumn, newsletter: FooterNewsletter };

export function Footer({ variant, ...props }: FooterProps): React.ReactElement {
  const VariantComponent = variantComponents[variant];
  return <VariantComponent {...props} />;
}

Footer.displayName = 'Footer';
`,

  'index.ts': `export { Footer, FOOTER_VARIANTS } from './Footer.base';
export type { FooterProps, FooterVariant, FooterContent, FooterBranding, NewsletterConfig } from './Footer.base';
`,
};
