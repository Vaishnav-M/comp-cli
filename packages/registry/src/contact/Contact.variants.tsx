/**
 * Contact Section - Variant Components
 * 
 * Implements the three Contact variants:
 * 1. Simple - Just a contact form
 * 2. With-info - Form + company contact information
 * 3. CTA-based - Call-to-action block without form
 */

import React, { useState } from 'react';
import type { Theme, SocialLink, ContactInfo } from '../types';
import { cn, formatEmailHref, formatPhoneHref } from '../utils';
import { useTheme, useForm } from '../hooks';
import { validators } from '../utils/validation';
import { Input, Textarea, Select, Button } from '../components/primitives';
import { getThemeColors, getContainerStyles, getSectionBaseStyles, getSectionPadding } from '../styles';
import {
  type ContactProps,
  type ContactVariant,
  type ContactFormData,
  type ContactFormConfig,
  getContactHeadingStyles,
  getContactSubheadingStyles,
  getContactFormStyles,
} from './Contact.base';

// ============================================================================
// Shared Components
// ============================================================================

interface ContactHeaderProps {
  subheading?: string;
  heading: string;
  description?: string;
  theme: Theme;
  alignment?: 'left' | 'center';
}

function ContactHeader({ subheading, heading, description, theme, alignment = 'left' }: ContactHeaderProps): React.ReactElement {
  const colors = getThemeColors(theme);
  
  return (
    <header style={{ textAlign: alignment }}>
      {subheading && (
        <p style={{ ...getContactSubheadingStyles(), color: colors.primary, marginBottom: '0.75rem' }}>
          {subheading}
        </p>
      )}
      <h2 style={{ ...getContactHeadingStyles(), color: colors.foreground }}>
        {heading}
      </h2>
      {description && (
        <p style={{ 
          fontSize: '1.125rem', 
          lineHeight: 1.7, 
          color: colors.foregroundSecondary,
          marginTop: '1rem',
          maxWidth: alignment === 'center' ? '600px' : undefined,
          marginLeft: alignment === 'center' ? 'auto' : undefined,
          marginRight: alignment === 'center' ? 'auto' : undefined,
        }}>
          {description}
        </p>
      )}
    </header>
  );
}

interface ContactFormProps {
  config?: ContactFormConfig;
  theme: Theme;
}

function ContactForm({ config, theme }: ContactFormProps): React.ReactElement {
  const colors = getThemeColors(theme);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const { showPhone = false, showSubject = false, subjectOptions, submitText = 'Send Message', successMessage = 'Thank you! Your message has been sent.', onSubmit } = config ?? {};

  const form = useForm<ContactFormData>({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
    validationRules: {
      name: [validators.required('Please enter your name')],
      email: [validators.required('Please enter your email'), validators.email()],
      phone: showPhone ? [validators.phone()] : [],
      subject: showSubject ? [validators.required('Please select a subject')] : [],
      message: [validators.required('Please enter a message'), validators.minLength(10, 'Message must be at least 10 characters')],
    },
    onSubmit: async (values) => {
      try {
        await onSubmit?.(values);
        setSubmitStatus('success');
        form.reset();
      } catch {
        setSubmitStatus('error');
      }
    },
  });

  if (submitStatus === 'success') {
    return (
      <div
        role="status"
        aria-live="polite"
        style={{
          padding: '2rem',
          backgroundColor: colors.backgroundSecondary,
          borderRadius: '0.75rem',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '1.125rem', color: colors.foreground, margin: 0 }}>
          ✓ {successMessage}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit} style={getContactFormStyles()} noValidate>
      <Input
        {...form.getFieldProps('name')}
        label="Name"
        required
        autoComplete="name"
        theme={theme}
      />

      <Input
        {...form.getFieldProps('email')}
        label="Email"
        type="email"
        required
        autoComplete="email"
        theme={theme}
      />

      {showPhone && (
        <Input
          {...form.getFieldProps('phone')}
          label="Phone"
          type="tel"
          autoComplete="tel"
          theme={theme}
        />
      )}

      {showSubject && (
        subjectOptions ? (
          <Select
            {...form.getFieldProps('subject')}
            label="Subject"
            options={subjectOptions}
            placeholder="Select a subject"
            required
            theme={theme}
          />
        ) : (
          <Input
            {...form.getFieldProps('subject')}
            label="Subject"
            required
            theme={theme}
          />
        )
      )}

      <Textarea
        {...form.getFieldProps('message')}
        label="Message"
        required
        rows={5}
        theme={theme}
      />

      {submitStatus === 'error' && (
        <p role="alert" style={{ color: colors.error, margin: 0 }}>
          Something went wrong. Please try again.
        </p>
      )}

      <Button
        type="submit"
        theme={theme}
        disabled={form.isSubmitting}
        style={{ alignSelf: 'flex-start' }}
      >
        {form.isSubmitting ? 'Sending...' : submitText}
      </Button>
    </form>
  );
}

interface ContactInfoBlockProps {
  contactInfo: ContactInfo;
  socialLinks?: SocialLink[];
  theme: Theme;
}

function ContactInfoBlock({ contactInfo, socialLinks, theme }: ContactInfoBlockProps): React.ReactElement {
  const colors = getThemeColors(theme);

  const infoItems = [
    { icon: '✉', label: 'Email', value: contactInfo.email, href: contactInfo.email ? formatEmailHref(contactInfo.email) : undefined },
    { icon: '☎', label: 'Phone', value: contactInfo.phone, href: contactInfo.phone ? formatPhoneHref(contactInfo.phone) : undefined },
    { icon: '📍', label: 'Address', value: contactInfo.address },
    { icon: '🕒', label: 'Hours', value: contactInfo.hours },
  ].filter(item => item.value);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <address style={{ fontStyle: 'normal', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {infoItems.map((item, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <span aria-hidden="true" style={{ fontSize: '1.25rem' }}>{item.icon}</span>
            <div>
              <p style={{ fontWeight: 600, color: colors.foreground, margin: 0, fontSize: '0.875rem' }}>
                {item.label}
              </p>
              {item.href ? (
                <a
                  href={item.href}
                  style={{ 
                    color: colors.primary, 
                    textDecoration: 'none',
                    fontSize: '1rem',
                  }}
                >
                  {item.value}
                </a>
              ) : (
                <p style={{ color: colors.foregroundSecondary, margin: 0, fontSize: '1rem' }}>
                  {item.value}
                </p>
              )}
            </div>
          </div>
        ))}
      </address>

      {socialLinks && socialLinks.length > 0 && (
        <div>
          <p style={{ fontWeight: 600, color: colors.foreground, marginBottom: '0.75rem' }}>
            Follow Us
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                aria-label={link.ariaLabel ?? `Follow us on ${link.platform}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.backgroundSecondary,
                  borderRadius: '0.5rem',
                  color: colors.foreground,
                  textDecoration: 'none',
                  fontSize: '1.125rem',
                  transition: 'background-color 150ms',
                }}
              >
                {getSocialIcon(link.platform)}
              </a>
            ))}
          </div>
        </div>
      )}
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

// ============================================================================
// Simple Variant
// ============================================================================

function ContactSimple({
  content,
  formConfig,
  theme,
  className,
  id,
  'data-testid': testId,
}: Omit<ContactProps, 'variant'>): React.ReactElement {
  const { themeClass } = useTheme(theme);
  const effectiveTheme = theme ?? 'light';

  return (
    <section
      id={id}
      data-testid={testId}
      className={cn('comp-contact', 'comp-contact--simple', themeClass, className)}
      style={{
        ...getSectionBaseStyles(effectiveTheme),
        ...getSectionPadding(),
      }}
    >
      <div style={{ ...getContainerStyles(), maxWidth: '600px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <ContactHeader
            subheading={content.subheading}
            heading={content.heading}
            description={content.description}
            theme={effectiveTheme}
            alignment="center"
          />
          <ContactForm config={formConfig} theme={effectiveTheme} />
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// With-Info Variant
// ============================================================================

function ContactWithInfo({
  content,
  formConfig,
  theme,
  className,
  id,
  'data-testid': testId,
}: Omit<ContactProps, 'variant'>): React.ReactElement {
  const { themeClass } = useTheme(theme);
  const colors = getThemeColors(theme ?? 'light');
  const effectiveTheme = theme ?? 'light';

  return (
    <section
      id={id}
      data-testid={testId}
      className={cn('comp-contact', 'comp-contact--with-info', themeClass, className)}
      style={{
        ...getSectionBaseStyles(effectiveTheme),
        ...getSectionPadding(),
      }}
    >
      <div style={getContainerStyles()}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.5fr',
            gap: '4rem',
            alignItems: 'start',
          }}
        >
          {/* Contact Info Side */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <ContactHeader
              subheading={content.subheading}
              heading={content.heading}
              description={content.description}
              theme={effectiveTheme}
            />
            {content.contactInfo && (
              <ContactInfoBlock
                contactInfo={content.contactInfo}
                socialLinks={content.socialLinks}
                theme={effectiveTheme}
              />
            )}
          </div>

          {/* Form Side */}
          <div
            style={{
              backgroundColor: colors.backgroundSecondary,
              padding: '2rem',
              borderRadius: '1rem',
            }}
          >
            <ContactForm 
              config={{ ...formConfig, showPhone: true, showSubject: true }} 
              theme={effectiveTheme} 
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CTA-Based Variant
// ============================================================================

function ContactCTABased({
  content,
  theme,
  className,
  id,
  'data-testid': testId,
}: Omit<ContactProps, 'variant'>): React.ReactElement {
  const { themeClass } = useTheme(theme);
  const colors = getThemeColors(theme ?? 'light');
  const effectiveTheme = theme ?? 'light';

  const { cta } = content;

  return (
    <section
      id={id}
      data-testid={testId}
      className={cn('comp-contact', 'comp-contact--cta-based', themeClass, className)}
      style={{
        ...getSectionBaseStyles(effectiveTheme),
        ...getSectionPadding(),
        backgroundColor: colors.primary,
        color: colors.primaryForeground,
      }}
    >
      <div style={{ ...getContainerStyles(), textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          {content.subheading && (
            <p style={{ 
              ...getContactSubheadingStyles(), 
              color: 'rgba(255,255,255,0.8)', 
              marginBottom: '0.75rem' 
            }}>
              {content.subheading}
            </p>
          )}
          
          <h2 style={{ 
            ...getContactHeadingStyles(), 
            color: colors.primaryForeground,
            marginBottom: cta?.description ? '1rem' : '2rem',
          }}>
            {cta?.heading ?? content.heading}
          </h2>

          {cta?.description && (
            <p style={{ 
              fontSize: '1.25rem', 
              lineHeight: 1.6, 
              color: 'rgba(255,255,255,0.9)',
              marginBottom: '2rem',
            }}>
              {cta.description}
            </p>
          )}

          {cta?.buttons && cta.buttons.length > 0 && (
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {cta.buttons.map((button, index) => (
                <Button
                  key={index}
                  variant={button.variant ?? (index === 0 ? 'secondary' : 'outline')}
                  href={button.href}
                  onClick={button.onClick}
                  external={button.external}
                  ariaLabel={button.ariaLabel}
                  theme={effectiveTheme}
                  style={index === 0 ? {
                    backgroundColor: colors.primaryForeground,
                    color: colors.primary,
                  } : {
                    borderColor: colors.primaryForeground,
                    color: colors.primaryForeground,
                  }}
                >
                  {button.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Variant Map
// ============================================================================

const variantComponents: Record<
  ContactVariant,
  React.ComponentType<Omit<ContactProps, 'variant'>>
> = {
  'simple': ContactSimple,
  'with-info': ContactWithInfo,
  'cta-based': ContactCTABased,
};

// ============================================================================
// Main Contact Component
// ============================================================================

export function Contact({ variant, ...props }: ContactProps): React.ReactElement {
  const VariantComponent = variantComponents[variant];
  return <VariantComponent {...props} />;
}

Contact.displayName = 'Contact';
