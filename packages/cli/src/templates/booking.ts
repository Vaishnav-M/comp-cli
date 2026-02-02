/**
 * Booking Section Templates
 */

export const BOOKING_TEMPLATES = {
  'Booking.base.tsx': `/**
 * Booking Section - Base Component
 */

import React from 'react';
import type { BaseSectionProps, ContactInfo } from '../types';

export const BOOKING_VARIANTS = ['minimal', 'datetime', 'with-info'] as const;
export type BookingVariant = typeof BOOKING_VARIANTS[number];

export interface BookingFormData { 
  [key: string]: string;
  name: string; 
  email: string; 
  phone: string; 
  date: string; 
  time: string; 
  partySize: string; 
  service: string; 
  notes: string; 
}

export interface TimeSlot { value: string; label: string; available?: boolean; }

export interface BookingFormConfig {
  timeSlots?: TimeSlot[];
  services?: Array<{ value: string; label: string }>;
  partySizeOptions?: Array<{ value: string; label: string }>;
  showPartySize?: boolean;
  showService?: boolean;
  showNotes?: boolean;
  submitText?: string;
  successMessage?: string;
  minDate?: string;
  maxDate?: string;
  onSubmit?: (data: BookingFormData) => void | Promise<void>;
}

export interface BookingContent {
  heading: string;
  subheading?: string;
  description?: string;
  businessInfo?: ContactInfo & { name?: string };
  infoItems?: Array<{ icon?: React.ReactNode; title: string; description: string }>;
}

export interface BookingProps extends BaseSectionProps {
  variant: BookingVariant;
  content: BookingContent;
  formConfig?: BookingFormConfig;
}

export function getBookingHeadingStyles(): React.CSSProperties {
  return { fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.025em', margin: 0 };
}

export function getBookingSubheadingStyles(): React.CSSProperties {
  return { fontSize: '1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 };
}

export function getTodayDate(): string { return new Date().toISOString().split('T')[0]; }

export { Booking } from './Booking.variants';
`,

  'Booking.variants.tsx': `/**
 * Booking Section - Variant Components
 */

import React, { useState } from 'react';
import type { Theme } from '../types';
import { cn, formatEmailHref, formatPhoneHref } from '../utils';
import { useTheme, useForm } from '../hooks';
import { validators } from '../utils/validation';
import { Input, Textarea, Select, Button } from '../components/primitives';
import { getThemeColors, getContainerStyles, getSectionBaseStyles, getSectionPadding, getInputStyles, getLabelStyles } from '../styles';
import { type BookingProps, type BookingVariant, type BookingFormData, type BookingFormConfig, type BookingContent, getBookingHeadingStyles, getBookingSubheadingStyles, getTodayDate } from './Booking.base';

function BookingHeader({ subheading, heading, description, theme, alignment = 'left' }: { subheading?: string; heading: string; description?: string; theme: Theme; alignment?: 'left' | 'center' }) {
  const colors = getThemeColors(theme);
  return (
    <header style={{ textAlign: alignment }}>
      {subheading && <p style={{ ...getBookingSubheadingStyles(), color: colors.primary, marginBottom: '0.75rem' }}>{subheading}</p>}
      <h2 style={{ ...getBookingHeadingStyles(), color: colors.foreground }}>{heading}</h2>
      {description && <p style={{ fontSize: '1.125rem', lineHeight: 1.7, color: colors.foregroundSecondary, marginTop: '1rem' }}>{description}</p>}
    </header>
  );
}

function DateInput({ name, label, value, onChange, onBlur, min, max, required, error, theme }: { name: string; label: string; value: string; onChange: (v: string) => void; onBlur?: () => void; min?: string; max?: string; required?: boolean; error?: string; theme: Theme }) {
  const inputId = \`date-\${name}\`;
  const errorId = error ? \`\${inputId}-error\` : undefined;
  const colors = getThemeColors(theme);
  return (
    <div>
      <label htmlFor={inputId} style={getLabelStyles(theme)}>{label}{required && <span style={{ color: colors.error }}> *</span>}</label>
      <input id={inputId} name={name} type="date" value={value} onChange={(e) => onChange(e.target.value)} onBlur={onBlur} min={min} max={max} required={required} aria-invalid={error ? 'true' : undefined} aria-describedby={errorId} style={getInputStyles(theme, !!error)} />
      {error && <p id={errorId} role="alert" style={{ fontSize: '0.875rem', color: colors.error, marginTop: '0.25rem' }}>{error}</p>}
    </div>
  );
}

function BookingForm({ config, theme, showDateTime = false }: { config?: BookingFormConfig; theme: Theme; showDateTime?: boolean }) {
  const colors = getThemeColors(theme);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { timeSlots, services, partySizeOptions, showPartySize = false, showService = false, showNotes = false, submitText = 'Book Now', successMessage = 'Your booking request has been submitted.', minDate = getTodayDate(), maxDate, onSubmit } = config ?? {};

  const form = useForm<BookingFormData>({
    initialValues: { name: '', email: '', phone: '', date: '', time: '', partySize: '', service: '', notes: '' },
    validationRules: {
      name: [validators.required('Please enter your name')],
      email: [validators.required('Please enter your email'), validators.email()],
      phone: [validators.required('Please enter your phone'), validators.phone()],
      date: [validators.required('Please select a date'), validators.futureDate()],
    },
    onSubmit: async (values) => { try { await onSubmit?.(values); setSubmitStatus('success'); form.reset(); } catch { setSubmitStatus('error'); } },
  });

  if (submitStatus === 'success') return <div role="status" aria-live="polite" style={{ padding: '2rem', backgroundColor: colors.backgroundSecondary, borderRadius: '0.75rem', textAlign: 'center' }}><p style={{ fontSize: '1.125rem', color: colors.foreground, margin: 0 }}>✓ {successMessage}</p></div>;

  return (
    <form onSubmit={form.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} noValidate>
      <Input {...form.getFieldProps('name')} label="Full Name" required autoComplete="name" theme={theme} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Input {...form.getFieldProps('email')} label="Email" type="email" required autoComplete="email" theme={theme} />
        <Input {...form.getFieldProps('phone')} label="Phone" type="tel" required autoComplete="tel" theme={theme} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: showDateTime && timeSlots ? '1fr 1fr' : '1fr', gap: '1rem' }}>
        <DateInput name="date" label="Date" value={form.values.date} onChange={form.handleChange('date')} onBlur={form.handleBlur('date')} min={minDate} max={maxDate} required error={form.touched.date ? form.errors.date : undefined} theme={theme} />
        {showDateTime && timeSlots && <Select {...form.getFieldProps('time')} label="Time" options={timeSlots.filter(s => s.available !== false)} placeholder="Select a time" required theme={theme} />}
      </div>
      {showPartySize && partySizeOptions && <Select {...form.getFieldProps('partySize')} label="Party Size" options={partySizeOptions} placeholder="Number of guests" required theme={theme} />}
      {showService && services && <Select {...form.getFieldProps('service')} label="Service" options={services} placeholder="Select a service" required theme={theme} />}
      {showNotes && <Textarea {...form.getFieldProps('notes')} label="Special Requests (Optional)" rows={3} theme={theme} />}
      {submitStatus === 'error' && <p role="alert" style={{ color: colors.error, margin: 0 }}>Something went wrong.</p>}
      <Button type="submit" theme={theme} disabled={form.isSubmitting} style={{ alignSelf: 'flex-start' }}>{form.isSubmitting ? 'Submitting...' : submitText}</Button>
    </form>
  );
}

function BusinessInfoBlock({ businessInfo, infoItems, theme }: { businessInfo: BookingContent['businessInfo']; infoItems?: BookingContent['infoItems']; theme: Theme }) {
  const colors = getThemeColors(theme);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {businessInfo && (
        <address style={{ fontStyle: 'normal', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {businessInfo.name && <p style={{ fontWeight: 700, fontSize: '1.25rem', color: colors.foreground, margin: 0 }}>{businessInfo.name}</p>}
          {businessInfo.address && <p style={{ color: colors.foregroundSecondary, margin: 0 }}>📍 {businessInfo.address}</p>}
          {businessInfo.phone && <p style={{ margin: 0 }}>☎ <a href={formatPhoneHref(businessInfo.phone)} style={{ color: colors.primary, textDecoration: 'none' }}>{businessInfo.phone}</a></p>}
          {businessInfo.email && <p style={{ margin: 0 }}>✉ <a href={formatEmailHref(businessInfo.email)} style={{ color: colors.primary, textDecoration: 'none' }}>{businessInfo.email}</a></p>}
          {businessInfo.hours && <p style={{ color: colors.foregroundSecondary, margin: 0 }}>🕒 {businessInfo.hours}</p>}
        </address>
      )}
      {infoItems && infoItems.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {infoItems.map((item, i) => (
            <div key={i} style={{ padding: '1rem', backgroundColor: colors.backgroundSecondary, borderRadius: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                {item.icon && <span aria-hidden="true">{item.icon}</span>}
                <div>
                  <h4 style={{ fontWeight: 600, color: colors.foreground, margin: 0, marginBottom: '0.25rem' }}>{item.title}</h4>
                  <p style={{ color: colors.foregroundSecondary, margin: 0, fontSize: '0.9375rem' }}>{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BookingMinimal({ content, formConfig, theme, className, id, 'data-testid': testId }: Omit<BookingProps, 'variant'>) {
  const { themeClass } = useTheme(theme);
  const effectiveTheme = theme ?? 'light';
  return (
    <section id={id} data-testid={testId} className={cn('comp-booking', 'comp-booking--minimal', themeClass, className)} style={{ ...getSectionBaseStyles(effectiveTheme), ...getSectionPadding() }}>
      <div style={{ ...getContainerStyles(), maxWidth: '500px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <BookingHeader subheading={content.subheading} heading={content.heading} description={content.description} theme={effectiveTheme} alignment="center" />
          <BookingForm config={formConfig} theme={effectiveTheme} />
        </div>
      </div>
    </section>
  );
}

function BookingDatetime({ content, formConfig, theme, className, id, 'data-testid': testId }: Omit<BookingProps, 'variant'>) {
  const { themeClass } = useTheme(theme);
  const colors = getThemeColors(theme ?? 'light');
  const effectiveTheme = theme ?? 'light';
  return (
    <section id={id} data-testid={testId} className={cn('comp-booking', 'comp-booking--datetime', themeClass, className)} style={{ ...getSectionBaseStyles(effectiveTheme), ...getSectionPadding() }}>
      <div style={{ ...getContainerStyles(), maxWidth: '600px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <BookingHeader subheading={content.subheading} heading={content.heading} description={content.description} theme={effectiveTheme} alignment="center" />
          <div style={{ backgroundColor: colors.backgroundSecondary, padding: '2rem', borderRadius: '1rem' }}>
            <BookingForm config={{ ...formConfig, showPartySize: true, showNotes: true }} theme={effectiveTheme} showDateTime />
          </div>
        </div>
      </div>
    </section>
  );
}

function BookingWithInfo({ content, formConfig, theme, className, id, 'data-testid': testId }: Omit<BookingProps, 'variant'>) {
  const { themeClass } = useTheme(theme);
  const colors = getThemeColors(theme ?? 'light');
  const effectiveTheme = theme ?? 'light';
  return (
    <section id={id} data-testid={testId} className={cn('comp-booking', 'comp-booking--with-info', themeClass, className)} style={{ ...getSectionBaseStyles(effectiveTheme), ...getSectionPadding() }}>
      <div style={getContainerStyles()}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: '4rem', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <BookingHeader subheading={content.subheading} heading={content.heading} description={content.description} theme={effectiveTheme} />
            <BusinessInfoBlock businessInfo={content.businessInfo} infoItems={content.infoItems} theme={effectiveTheme} />
          </div>
          <div style={{ backgroundColor: colors.backgroundSecondary, padding: '2rem', borderRadius: '1rem' }}>
            <h3 style={{ fontWeight: 600, color: colors.foreground, marginBottom: '1.5rem', fontSize: '1.25rem' }}>Make a Reservation</h3>
            <BookingForm config={{ ...formConfig, showPartySize: true, showNotes: true }} theme={effectiveTheme} showDateTime />
          </div>
        </div>
      </div>
    </section>
  );
}

const variantComponents: Record<BookingVariant, React.ComponentType<Omit<BookingProps, 'variant'>>> = { minimal: BookingMinimal, datetime: BookingDatetime, 'with-info': BookingWithInfo };

export function Booking({ variant, ...props }: BookingProps): React.ReactElement {
  const VariantComponent = variantComponents[variant];
  return <VariantComponent {...props} />;
}

Booking.displayName = 'Booking';
`,

  'index.ts': `export { Booking, BOOKING_VARIANTS } from './Booking.base';
export type { BookingProps, BookingVariant, BookingContent, BookingFormData, BookingFormConfig, TimeSlot } from './Booking.base';
`,
};
