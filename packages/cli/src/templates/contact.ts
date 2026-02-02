/**
 * Contact Section Templates
 */

export const CONTACT_TEMPLATES = {
  'Contact.base.tsx': `/**
 * Contact Section - Base Component
 */

import React from 'react';
import type { BaseSectionProps, ContactInfo, CTAButton, SocialLink } from '../types';

export const CONTACT_VARIANTS = ['simple', 'with-info', 'cta-based'] as const;
export type ContactVariant = typeof CONTACT_VARIANTS[number];

export interface ContactFormData { 
  [key: string]: string;
  name: string; 
  email: string; 
  phone: string; 
  subject: string; 
  message: string; 
}

export interface ContactFormConfig {
  showPhone?: boolean;
  showSubject?: boolean;
  subjectOptions?: Array<{ value: string; label: string }>;
  submitText?: string;
  successMessage?: string;
  onSubmit?: (data: ContactFormData) => void | Promise<void>;
}

export interface ContactContent {
  heading: string;
  subheading?: string;
  description?: string;
  contactInfo?: ContactInfo;
  socialLinks?: SocialLink[];
  cta?: { heading: string; description?: string; buttons: CTAButton[]; };
}

export interface ContactProps extends BaseSectionProps {
  variant: ContactVariant;
  content: ContactContent;
  formConfig?: ContactFormConfig;
}

export function getContactHeadingStyles(): React.CSSProperties {
  return { fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.025em', margin: 0 };
}

export function getContactSubheadingStyles(): React.CSSProperties {
  return { fontSize: '1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 };
}

export { Contact } from './Contact.variants';
`,

  'Contact.variants.tsx': `/**
 * Contact Section - Variant Components
 */

import React, { useState } from 'react';
import type { Theme, SocialLink, ContactInfo } from '../types';
import { cn, formatEmailHref, formatPhoneHref } from '../utils';
import { useTheme, useForm } from '../hooks';
import { validators } from '../utils/validation';
import { Input, Textarea, Select, Button } from '../components/primitives';
import { getThemeColors, getContainerStyles, getSectionBaseStyles, getSectionPadding } from '../styles';
import { type ContactProps, type ContactVariant, type ContactFormData, type ContactFormConfig, getContactHeadingStyles, getContactSubheadingStyles } from './Contact.base';

function ContactHeader({ subheading, heading, description, theme, alignment = 'left' }: { subheading?: string; heading: string; description?: string; theme: Theme; alignment?: 'left' | 'center' }) {
  const colors = getThemeColors(theme);
  return (
    <header style={{ textAlign: alignment }}>
      {subheading && <p style={{ ...getContactSubheadingStyles(), color: colors.primary, marginBottom: '0.75rem' }}>{subheading}</p>}
      <h2 style={{ ...getContactHeadingStyles(), color: colors.foreground }}>{heading}</h2>
      {description && <p style={{ fontSize: '1.125rem', lineHeight: 1.7, color: colors.foregroundSecondary, marginTop: '1rem' }}>{description}</p>}
    </header>
  );
}

function ContactForm({ config, theme }: { config?: ContactFormConfig; theme: Theme }) {
  const colors = getThemeColors(theme);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { showPhone = false, showSubject = false, subjectOptions, submitText = 'Send Message', successMessage = 'Thank you! Your message has been sent.', onSubmit } = config ?? {};

  const form = useForm<ContactFormData>({
    initialValues: { name: '', email: '', phone: '', subject: '', message: '' },
    validationRules: {
      name: [validators.required('Please enter your name')],
      email: [validators.required('Please enter your email'), validators.email()],
      message: [validators.required('Please enter a message'), validators.minLength(10, 'Message must be at least 10 characters')],
    },
    onSubmit: async (values) => { try { await onSubmit?.(values); setSubmitStatus('success'); form.reset(); } catch { setSubmitStatus('error'); } },
  });

  if (submitStatus === 'success') return <div role="status" aria-live="polite" style={{ padding: '2rem', backgroundColor: colors.backgroundSecondary, borderRadius: '0.75rem', textAlign: 'center' }}><p style={{ fontSize: '1.125rem', color: colors.foreground, margin: 0 }}>✓ {successMessage}</p></div>;

  return (
    <form onSubmit={form.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} noValidate>
      <Input {...form.getFieldProps('name')} label="Name" required autoComplete="name" theme={theme} />
      <Input {...form.getFieldProps('email')} label="Email" type="email" required autoComplete="email" theme={theme} />
      {showPhone && <Input {...form.getFieldProps('phone')} label="Phone" type="tel" autoComplete="tel" theme={theme} />}
      {showSubject && (subjectOptions ? <Select {...form.getFieldProps('subject')} label="Subject" options={subjectOptions} placeholder="Select a subject" required theme={theme} /> : <Input {...form.getFieldProps('subject')} label="Subject" required theme={theme} />)}
      <Textarea {...form.getFieldProps('message')} label="Message" required rows={5} theme={theme} />
      {submitStatus === 'error' && <p role="alert" style={{ color: colors.error, margin: 0 }}>Something went wrong. Please try again.</p>}
      <Button type="submit" theme={theme} disabled={form.isSubmitting} style={{ alignSelf: 'flex-start' }}>{form.isSubmitting ? 'Sending...' : submitText}</Button>
    </form>
  );
}

function ContactInfoBlock({ contactInfo, socialLinks, theme }: { contactInfo: ContactInfo; socialLinks?: SocialLink[]; theme: Theme }) {
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
        {infoItems.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <span aria-hidden="true" style={{ fontSize: '1.25rem' }}>{item.icon}</span>
            <div>
              <p style={{ fontWeight: 600, color: colors.foreground, margin: 0, fontSize: '0.875rem' }}>{item.label}</p>
              {item.href ? <a href={item.href} style={{ color: colors.primary, textDecoration: 'none' }}>{item.value}</a> : <p style={{ color: colors.foregroundSecondary, margin: 0 }}>{item.value}</p>}
            </div>
          </div>
        ))}
      </address>
      {socialLinks && socialLinks.length > 0 && (
        <div>
          <p style={{ fontWeight: 600, color: colors.foreground, marginBottom: '0.75rem' }}>Follow Us</p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {socialLinks.map((link, i) => <a key={i} href={link.href} aria-label={link.ariaLabel ?? \`Follow us on \${link.platform}\`} target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.backgroundSecondary, borderRadius: '0.5rem', color: colors.foreground, textDecoration: 'none' }}>{link.platform[0].toUpperCase()}</a>)}
          </div>
        </div>
      )}
    </div>
  );
}

function ContactSimple({ content, formConfig, theme, className, id, 'data-testid': testId }: Omit<ContactProps, 'variant'>) {
  const { themeClass } = useTheme(theme);
  const effectiveTheme = theme ?? 'light';
  return (
    <section id={id} data-testid={testId} className={cn('comp-contact', 'comp-contact--simple', themeClass, className)} style={{ ...getSectionBaseStyles(effectiveTheme), ...getSectionPadding() }}>
      <div style={{ ...getContainerStyles(), maxWidth: '600px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <ContactHeader subheading={content.subheading} heading={content.heading} description={content.description} theme={effectiveTheme} alignment="center" />
          <ContactForm config={formConfig} theme={effectiveTheme} />
        </div>
      </div>
    </section>
  );
}

function ContactWithInfo({ content, formConfig, theme, className, id, 'data-testid': testId }: Omit<ContactProps, 'variant'>) {
  const { themeClass } = useTheme(theme);
  const colors = getThemeColors(theme ?? 'light');
  const effectiveTheme = theme ?? 'light';
  return (
    <section id={id} data-testid={testId} className={cn('comp-contact', 'comp-contact--with-info', themeClass, className)} style={{ ...getSectionBaseStyles(effectiveTheme), ...getSectionPadding() }}>
      <div style={getContainerStyles()}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '4rem', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <ContactHeader subheading={content.subheading} heading={content.heading} description={content.description} theme={effectiveTheme} />
            {content.contactInfo && <ContactInfoBlock contactInfo={content.contactInfo} socialLinks={content.socialLinks} theme={effectiveTheme} />}
          </div>
          <div style={{ backgroundColor: colors.backgroundSecondary, padding: '2rem', borderRadius: '1rem' }}>
            <ContactForm config={{ ...formConfig, showPhone: true, showSubject: true }} theme={effectiveTheme} />
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactCTABased({ content, theme, className, id, 'data-testid': testId }: Omit<ContactProps, 'variant'>) {
  const { themeClass } = useTheme(theme);
  const colors = getThemeColors(theme ?? 'light');
  const effectiveTheme = theme ?? 'light';
  const { cta } = content;
  return (
    <section id={id} data-testid={testId} className={cn('comp-contact', 'comp-contact--cta-based', themeClass, className)} style={{ ...getSectionBaseStyles(effectiveTheme), ...getSectionPadding(), backgroundColor: colors.primary, color: colors.primaryForeground }}>
      <div style={{ ...getContainerStyles(), textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          {content.subheading && <p style={{ ...getContactSubheadingStyles(), color: 'rgba(255,255,255,0.8)', marginBottom: '0.75rem' }}>{content.subheading}</p>}
          <h2 style={{ ...getContactHeadingStyles(), color: colors.primaryForeground, marginBottom: cta?.description ? '1rem' : '2rem' }}>{cta?.heading ?? content.heading}</h2>
          {cta?.description && <p style={{ fontSize: '1.25rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.9)', marginBottom: '2rem' }}>{cta.description}</p>}
          {cta?.buttons && cta.buttons.length > 0 && (
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {cta.buttons.map((btn, i) => <Button key={i} variant={btn.variant ?? (i === 0 ? 'secondary' : 'outline')} href={btn.href} onClick={btn.onClick} external={btn.external} theme={effectiveTheme} style={i === 0 ? { backgroundColor: colors.primaryForeground, color: colors.primary } : { borderColor: colors.primaryForeground, color: colors.primaryForeground }}>{btn.label}</Button>)}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const variantComponents: Record<ContactVariant, React.ComponentType<Omit<ContactProps, 'variant'>>> = { simple: ContactSimple, 'with-info': ContactWithInfo, 'cta-based': ContactCTABased };

export function Contact({ variant, ...props }: ContactProps): React.ReactElement {
  const VariantComponent = variantComponents[variant];
  return <VariantComponent {...props} />;
}

Contact.displayName = 'Contact';
`,

  'index.ts': `export { Contact, CONTACT_VARIANTS } from './Contact.base';
export type { ContactProps, ContactVariant, ContactContent, ContactFormData, ContactFormConfig } from './Contact.base';
`,
};
