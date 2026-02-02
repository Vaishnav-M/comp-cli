/**
 * Footer Section - Variant Components
 * 
 * Implements the three Footer variants:
 * 1. Minimal - Simple footer with logo, links, and copyright
 * 2. Multi-column - Full footer with nav groups and social
 * 3. Newsletter - Multi-column with newsletter signup
 */

import React, { useState } from 'react';
import type { Theme, NavGroup, NavLink, SocialLink } from '../types';
import { cn, getExternalLinkProps, isValidEmail } from '../utils';
import { useTheme } from '../hooks';
import { Button } from '../components/primitives';
import { getThemeColors, getContainerStyles, getSectionBaseStyles } from '../styles';
import {
  type FooterProps,
  type FooterVariant,
  type FooterBranding,
  type NewsletterConfig,
  getFooterBaseStyles,
  getFooterLinkStyles,
  getCurrentYear,
} from './Footer.base';
// ============================================================================
// Shared Components
// ============================================================================

interface BrandingBlockProps {
  branding: FooterBranding;
  theme: Theme;
}

function BrandingBlock({ branding, theme }: BrandingBlockProps): React.ReactElement {
  const colors = getThemeColors(theme);

  return (
    <div>
      {branding.logo && (
        typeof branding.logo === 'string' ? (
          <img 
            src={branding.logo} 
            alt={branding.name} 
            style={{ height: '32px', marginBottom: '0.75rem' }}
          />
        ) : (
          <div style={{ marginBottom: '0.75rem' }}>{branding.logo}</div>
        )
      )}
      <p style={{ 
        fontWeight: 700, 
        fontSize: '1.25rem', 
        color: colors.foreground, 
        margin: 0 
      }}>
        {branding.name}
      </p>
      {branding.tagline && (
        <p style={{ 
          color: colors.foregroundSecondary, 
          margin: 0, 
          marginTop: '0.5rem',
          fontSize: '0.9375rem',
        }}>
          {branding.tagline}
        </p>
      )}
    </div>
  );
}

interface NavLinksBlockProps {
  links: NavLink[];
  theme: Theme;
  inline?: boolean;
}

function NavLinksBlock({ links, theme, inline = false }: NavLinksBlockProps): React.ReactElement {
  const colors = getThemeColors(theme);

  return (
    <nav aria-label="Footer navigation">
      <ul 
        style={{ 
          listStyle: 'none', 
          padding: 0, 
          margin: 0,
          display: 'flex',
          flexDirection: inline ? 'row' : 'column',
          gap: inline ? '1.5rem' : '0.75rem',
          flexWrap: 'wrap',
        }}
      >
        {links.map((link, index) => (
          <li key={index}>
            <a
              href={link.href}
              aria-label={link.ariaLabel}
              style={getFooterLinkStyles(colors.foregroundSecondary)}
              {...(link.external && getExternalLinkProps())}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

interface NavGroupBlockProps {
  group: NavGroup;
  theme: Theme;
}

function NavGroupBlock({ group, theme }: NavGroupBlockProps): React.ReactElement {
  const colors = getThemeColors(theme);

  return (
    <div>
      <h3 style={{ 
        fontWeight: 600, 
        fontSize: '0.875rem', 
        color: colors.foreground, 
        marginBottom: '1rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        {group.title}
      </h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {group.links.map((link, index) => (
          <li key={index}>
            <a
              href={link.href}
              aria-label={link.ariaLabel}
              style={getFooterLinkStyles(colors.foregroundSecondary)}
              {...(link.external && getExternalLinkProps())}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface SocialLinksBlockProps {
  links: SocialLink[];
  theme: Theme;
}

function SocialLinksBlock({ links, theme }: SocialLinksBlockProps): React.ReactElement {
  const colors = getThemeColors(theme);

  return (
    <div style={{ display: 'flex', gap: '0.75rem' }}>
      {links.map((link, index) => (
        <a
          key={index}
          href={link.href}
          aria-label={link.ariaLabel ?? `Follow us on ${link.platform}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.backgroundSecondary,
            borderRadius: '0.375rem',
            color: colors.foregroundSecondary,
            textDecoration: 'none',
            fontSize: '1rem',
            transition: 'background-color 150ms, color 150ms',
          }}
        >
          {getSocialIcon(link.platform)}
        </a>
      ))}
    </div>
  );
}

function getSocialIcon(platform: string): string {
  const icons: Record<string, string> = {
    twitter: '𝕏',
    facebook: 'f',
    instagram: '📷',
    linkedin: 'in',
    youtube: '▶',
    github: '⌘',
    tiktok: '♪',
  };
  return icons[platform] ?? '🔗';
}

interface CopyrightBlockProps {
  copyright?: string;
  brandName: string;
  legalLinks?: NavLink[];
  theme: Theme;
}

function CopyrightBlock({ copyright, brandName, legalLinks, theme }: CopyrightBlockProps): React.ReactElement {
  const colors = getThemeColors(theme);
  const copyrightText = copyright ?? `© ${getCurrentYear()} ${brandName}. All rights reserved.`;

  return (
    <div 
      style={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        justifyContent: 'space-between', 
        alignItems: 'center',
        gap: '1rem',
        paddingTop: '1.5rem',
        borderTop: `1px solid ${colors.border}`,
        marginTop: '2rem',
      }}
    >
      <p style={{ 
        color: colors.foregroundSecondary, 
        margin: 0, 
        fontSize: '0.875rem' 
      }}>
        {copyrightText}
      </p>
      {legalLinks && legalLinks.length > 0 && (
        <nav aria-label="Legal links">
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            margin: 0, 
            display: 'flex', 
            gap: '1.5rem' 
          }}>
            {legalLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  style={{ 
                    ...getFooterLinkStyles(colors.foregroundSecondary),
                    fontSize: '0.875rem',
                  }}
                  {...(link.external && getExternalLinkProps())}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}

interface NewsletterBlockProps {
  config: NewsletterConfig;
  theme: Theme;
}

function NewsletterBlock({ config, theme }: NewsletterBlockProps): React.ReactElement {
  const colors = getThemeColors(theme);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | undefined>();

  const {
    heading = 'Subscribe to our newsletter',
    description = 'Get the latest updates delivered to your inbox.',
    placeholder = 'Enter your email',
    submitText = 'Subscribe',
    successMessage = 'Thanks for subscribing!',
    onSubmit,
  } = config;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email');
      return;
    }

    setStatus('loading');
    try {
      await onSubmit?.(email);
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
      setError('Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div role="status" aria-live="polite">
        <p style={{ color: colors.foreground, margin: 0 }}>
          ✓ {successMessage}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ 
        fontWeight: 600, 
        fontSize: '1rem', 
        color: colors.foreground, 
        marginBottom: '0.5rem' 
      }}>
        {heading}
      </h3>
      <p style={{ 
        color: colors.foregroundSecondary, 
        margin: 0, 
        marginBottom: '1rem',
        fontSize: '0.9375rem',
      }}>
        {description}
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
        <div style={{ flex: 1 }}>
          <label htmlFor="newsletter-email" className="sr-only" style={{ 
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: 0,
          }}>
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? 'newsletter-error' : undefined}
            style={{
              width: '100%',
              padding: '0.625rem 1rem',
              fontSize: '0.9375rem',
              color: colors.foreground,
              backgroundColor: colors.background,
              border: `1px solid ${error ? colors.error : colors.border}`,
              borderRadius: '0.375rem',
              outline: 'none',
            }}
          />
        </div>
        <Button
          type="submit"
          theme={theme}
          disabled={status === 'loading'}
          style={{ whiteSpace: 'nowrap' }}
        >
          {status === 'loading' ? '...' : submitText}
        </Button>
      </form>
      {error && (
        <p 
          id="newsletter-error" 
          role="alert" 
          style={{ color: colors.error, margin: 0, marginTop: '0.5rem', fontSize: '0.875rem' }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

// ============================================================================
// Minimal Variant
// ============================================================================

function FooterMinimal({
  content,
  theme,
  className,
  id,
  'data-testid': testId,
}: Omit<FooterProps, 'variant'>): React.ReactElement {
  const { themeClass } = useTheme(theme);
  const colors = getThemeColors(theme ?? 'light');
  const effectiveTheme = theme ?? 'light';

  return (
    <footer
      id={id}
      data-testid={testId}
      className={cn('comp-footer', 'comp-footer--minimal', themeClass, className)}
      style={{
        ...getSectionBaseStyles(effectiveTheme),
        ...getFooterBaseStyles(),
      }}
    >
      <div style={getContainerStyles()}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          textAlign: 'center',
          gap: '1.5rem',
        }}>
          <BrandingBlock branding={content.branding} theme={effectiveTheme} />
          
          {content.links && content.links.length > 0 && (
            <NavLinksBlock links={content.links} theme={effectiveTheme} inline />
          )}
          
          {content.socialLinks && content.socialLinks.length > 0 && (
            <SocialLinksBlock links={content.socialLinks} theme={effectiveTheme} />
          )}
          
          <div style={{ 
            width: '100%', 
            paddingTop: '1.5rem', 
            borderTop: `1px solid ${colors.border}`, 
            marginTop: '0.5rem' 
          }}>
            <p style={{ 
              color: colors.foregroundSecondary, 
              margin: 0, 
              fontSize: '0.875rem' 
            }}>
              {content.copyright ?? `© ${getCurrentYear()} ${content.branding.name}. All rights reserved.`}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
// Multi-Column Variant
// ============================================================================

function FooterMultiColumn({
  content,
  theme,
  className,
  id,
  'data-testid': testId,
}: Omit<FooterProps, 'variant'>): React.ReactElement {
  const { themeClass } = useTheme(theme);
  const effectiveTheme = theme ?? 'light';

  return (
    <footer
      id={id}
      data-testid={testId}
      className={cn('comp-footer', 'comp-footer--multi-column', themeClass, className)}
      style={{
        ...getSectionBaseStyles(effectiveTheme),
        ...getFooterBaseStyles(),
      }}
    >
      <div style={getContainerStyles()}>
        {/* Main Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr repeat(auto-fit, minmax(150px, 1fr))',
          gap: '3rem',
        }}>
          {/* Branding Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <BrandingBlock branding={content.branding} theme={effectiveTheme} />
            {content.socialLinks && content.socialLinks.length > 0 && (
              <SocialLinksBlock links={content.socialLinks} theme={effectiveTheme} />
            )}
          </div>

          {/* Nav Groups */}
          {content.navGroups?.map((group, index) => (
            <NavGroupBlock key={index} group={group} theme={effectiveTheme} />
          ))}
        </div>

        {/* Copyright */}
        <CopyrightBlock
          copyright={content.copyright}
          brandName={content.branding.name}
          legalLinks={content.legalLinks}
          theme={effectiveTheme}
        />
      </div>
    </footer>
  );
}

// ============================================================================
// Newsletter Variant
// ============================================================================

function FooterNewsletter({
  content,
  theme,
  className,
  id,
  'data-testid': testId,
}: Omit<FooterProps, 'variant'>): React.ReactElement {
  const { themeClass } = useTheme(theme);
  const effectiveTheme = theme ?? 'light';

  return (
    <footer
      id={id}
      data-testid={testId}
      className={cn('comp-footer', 'comp-footer--newsletter', themeClass, className)}
      style={{
        ...getSectionBaseStyles(effectiveTheme),
        ...getFooterBaseStyles(),
      }}
    >
      <div style={getContainerStyles()}>
        {/* Main Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1.5fr repeat(auto-fit, minmax(140px, 1fr)) 1.5fr',
          gap: '3rem',
        }}>
          {/* Branding Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <BrandingBlock branding={content.branding} theme={effectiveTheme} />
            {content.socialLinks && content.socialLinks.length > 0 && (
              <SocialLinksBlock links={content.socialLinks} theme={effectiveTheme} />
            )}
          </div>

          {/* Nav Groups */}
          {content.navGroups?.map((group, index) => (
            <NavGroupBlock key={index} group={group} theme={effectiveTheme} />
          ))}

          {/* Newsletter Column */}
          {content.newsletter && (
            <NewsletterBlock config={content.newsletter} theme={effectiveTheme} />
          )}
        </div>

        {/* Copyright */}
        <CopyrightBlock
          copyright={content.copyright}
          brandName={content.branding.name}
          legalLinks={content.legalLinks}
          theme={effectiveTheme}
        />
      </div>
    </footer>
  );
}

// ============================================================================
// Variant Map
// ============================================================================

const variantComponents: Record<
  FooterVariant,
  React.ComponentType<Omit<FooterProps, 'variant'>>
> = {
  'minimal': FooterMinimal,
  'multi-column': FooterMultiColumn,
  'newsletter': FooterNewsletter,
};

// ============================================================================
// Main Footer Component
// ============================================================================

export function Footer({ variant, ...props }: FooterProps): React.ReactElement {
  const VariantComponent = variantComponents[variant];
  return <VariantComponent {...props} />;
}

Footer.displayName = 'Footer';
