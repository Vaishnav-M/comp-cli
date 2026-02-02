/**
 * Booking Section - Variant Components
 * 
 * Implements the three Booking variants:
 * 1. Minimal - Simple date/name/email booking form
 * 2. Datetime - Full date and time selection
 * 3. With-info - Booking form + business information
 */

import React, { useState } from 'react';
import type { Theme } from '../types';
import { cn, formatEmailHref, formatPhoneHref } from '../utils';
import { useTheme, useForm } from '../hooks';
import { validators } from '../utils/validation';
import { Input, Textarea, Select, Button } from '../components/primitives';
import { getThemeColors, getContainerStyles, getSectionBaseStyles, getSectionPadding, getInputStyles, getLabelStyles } from '../styles';
import {
  type BookingProps,
  type BookingVariant,
  type BookingFormData,
  type BookingFormConfig,
  type BookingContent,
  getBookingHeadingStyles,
  getBookingSubheadingStyles,
  getBookingFormStyles,
  getTodayDate,
} from './Booking.base';

// ============================================================================
// Shared Components
// ============================================================================

interface BookingHeaderProps {
  subheading?: string;
  heading: string;
  description?: string;
  theme: Theme;
  alignment?: 'left' | 'center';
}

function BookingHeader({ subheading, heading, description, theme, alignment = 'left' }: BookingHeaderProps): React.ReactElement {
  const colors = getThemeColors(theme);
  
  return (
    <header style={{ textAlign: alignment }}>
      {subheading && (
        <p style={{ ...getBookingSubheadingStyles(), color: colors.primary, marginBottom: '0.75rem' }}>
          {subheading}
        </p>
      )}
      <h2 style={{ ...getBookingHeadingStyles(), color: colors.foreground }}>
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

interface DateInputProps {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  min?: string;
  max?: string;
  required?: boolean;
  error?: string;
  theme: Theme;
}

function DateInput({ name, label, value, onChange, onBlur, min, max, required, error, theme }: DateInputProps): React.ReactElement {
  const inputId = `date-${name}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const colors = getThemeColors(theme);

  return (
    <div>
      <label htmlFor={inputId} style={getLabelStyles(theme)}>
        {label}
        {required && <span aria-hidden="true" style={{ color: colors.error }}> *</span>}
      </label>
      <input
        id={inputId}
        name={name}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        min={min}
        max={max}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={errorId}
        style={getInputStyles(theme, !!error)}
      />
      {error && (
        <p id={errorId} role="alert" style={{ fontSize: '0.875rem', color: colors.error, marginTop: '0.25rem' }}>
          {error}
        </p>
      )}
    </div>
  );
}

interface BookingFormProps {
  config?: BookingFormConfig;
  theme: Theme;
  showDateTime?: boolean;
}

function BookingForm({ config, theme, showDateTime = false }: BookingFormProps): React.ReactElement {
  const colors = getThemeColors(theme);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    timeSlots,
    services,
    partySizeOptions,
    showPartySize = false,
    showService = false,
    showNotes = false,
    submitText = 'Book Now',
    successMessage = 'Your booking request has been submitted. We will contact you shortly to confirm.',
    minDate = getTodayDate(),
    maxDate,
    onSubmit,
  } = config ?? {};

  const form = useForm<BookingFormData>({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      partySize: '',
      service: '',
      notes: '',
    },
    validationRules: {
      name: [validators.required('Please enter your name')],
      email: [validators.required('Please enter your email'), validators.email()],
      phone: [validators.required('Please enter your phone number'), validators.phone()],
      date: [validators.required('Please select a date'), validators.futureDate()],
      time: showDateTime && timeSlots ? [validators.required('Please select a time')] : [],
      partySize: showPartySize ? [validators.required('Please select party size')] : [],
      service: showService ? [validators.required('Please select a service')] : [],
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
    <form onSubmit={form.handleSubmit} style={getBookingFormStyles()} noValidate>
      <Input
        {...form.getFieldProps('name')}
        label="Full Name"
        required
        autoComplete="name"
        theme={theme}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Input
          {...form.getFieldProps('email')}
          label="Email"
          type="email"
          required
          autoComplete="email"
          theme={theme}
        />
        <Input
          {...form.getFieldProps('phone')}
          label="Phone"
          type="tel"
          required
          autoComplete="tel"
          theme={theme}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: showDateTime && timeSlots ? '1fr 1fr' : '1fr', gap: '1rem' }}>
        <DateInput
          name="date"
          label="Date"
          value={form.values.date}
          onChange={form.handleChange('date')}
          onBlur={form.handleBlur('date')}
          min={minDate}
          max={maxDate}
          required
          error={form.touched.date ? form.errors.date : undefined}
          theme={theme}
        />

        {showDateTime && timeSlots && (
          <Select
            {...form.getFieldProps('time')}
            label="Time"
            options={timeSlots.filter(slot => slot.available !== false).map(slot => ({
              value: slot.value,
              label: slot.label,
            }))}
            placeholder="Select a time"
            required
            theme={theme}
          />
        )}
      </div>

      {showPartySize && partySizeOptions && (
        <Select
          {...form.getFieldProps('partySize')}
          label="Party Size"
          options={partySizeOptions}
          placeholder="Number of guests"
          required
          theme={theme}
        />
      )}

      {showService && services && (
        <Select
          {...form.getFieldProps('service')}
          label="Service"
          options={services}
          placeholder="Select a service"
          required
          theme={theme}
        />
      )}

      {showNotes && (
        <Textarea
          {...form.getFieldProps('notes')}
          label="Special Requests (Optional)"
          rows={3}
          theme={theme}
        />
      )}

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
        {form.isSubmitting ? 'Submitting...' : submitText}
      </Button>
    </form>
  );
}

interface BusinessInfoBlockProps {
  businessInfo: BookingContent['businessInfo'];
  infoItems?: BookingContent['infoItems'];
  theme: Theme;
}

function BusinessInfoBlock({ businessInfo, infoItems, theme }: BusinessInfoBlockProps): React.ReactElement {
  const colors = getThemeColors(theme);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {businessInfo && (
        <address style={{ fontStyle: 'normal', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {businessInfo.name && (
            <p style={{ fontWeight: 700, fontSize: '1.25rem', color: colors.foreground, margin: 0 }}>
              {businessInfo.name}
            </p>
          )}
          
          {businessInfo.address && (
            <p style={{ color: colors.foregroundSecondary, margin: 0 }}>
              📍 {businessInfo.address}
            </p>
          )}
          
          {businessInfo.phone && (
            <p style={{ margin: 0 }}>
              ☎{' '}
              <a href={formatPhoneHref(businessInfo.phone)} style={{ color: colors.primary, textDecoration: 'none' }}>
                {businessInfo.phone}
              </a>
            </p>
          )}
          
          {businessInfo.email && (
            <p style={{ margin: 0 }}>
              ✉{' '}
              <a href={formatEmailHref(businessInfo.email)} style={{ color: colors.primary, textDecoration: 'none' }}>
                {businessInfo.email}
              </a>
            </p>
          )}
          
          {businessInfo.hours && (
            <p style={{ color: colors.foregroundSecondary, margin: 0 }}>
              🕒 {businessInfo.hours}
            </p>
          )}
        </address>
      )}

      {infoItems && infoItems.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {infoItems.map((item, index) => (
            <div 
              key={index}
              style={{
                padding: '1rem',
                backgroundColor: colors.backgroundSecondary,
                borderRadius: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                {item.icon && (
                  <span style={{ fontSize: '1.25rem' }} aria-hidden="true">{item.icon}</span>
                )}
                <div>
                  <h4 style={{ fontWeight: 600, color: colors.foreground, margin: 0, marginBottom: '0.25rem' }}>
                    {item.title}
                  </h4>
                  <p style={{ color: colors.foregroundSecondary, margin: 0, fontSize: '0.9375rem' }}>
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Minimal Variant
// ============================================================================

function BookingMinimal({
  content,
  formConfig,
  theme,
  className,
  id,
  'data-testid': testId,
}: Omit<BookingProps, 'variant'>): React.ReactElement {
  const { themeClass } = useTheme(theme);
  const effectiveTheme = theme ?? 'light';

  return (
    <section
      id={id}
      data-testid={testId}
      className={cn('comp-booking', 'comp-booking--minimal', themeClass, className)}
      style={{
        ...getSectionBaseStyles(effectiveTheme),
        ...getSectionPadding(),
      }}
    >
      <div style={{ ...getContainerStyles(), maxWidth: '500px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <BookingHeader
            subheading={content.subheading}
            heading={content.heading}
            description={content.description}
            theme={effectiveTheme}
            alignment="center"
          />
          <BookingForm config={formConfig} theme={effectiveTheme} showDateTime={false} />
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Datetime Variant
// ============================================================================

function BookingDatetime({
  content,
  formConfig,
  theme,
  className,
  id,
  'data-testid': testId,
}: Omit<BookingProps, 'variant'>): React.ReactElement {
  const { themeClass } = useTheme(theme);
  const colors = getThemeColors(theme ?? 'light');
  const effectiveTheme = theme ?? 'light';

  return (
    <section
      id={id}
      data-testid={testId}
      className={cn('comp-booking', 'comp-booking--datetime', themeClass, className)}
      style={{
        ...getSectionBaseStyles(effectiveTheme),
        ...getSectionPadding(),
      }}
    >
      <div style={{ ...getContainerStyles(), maxWidth: '600px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <BookingHeader
            subheading={content.subheading}
            heading={content.heading}
            description={content.description}
            theme={effectiveTheme}
            alignment="center"
          />
          <div
            style={{
              backgroundColor: colors.backgroundSecondary,
              padding: '2rem',
              borderRadius: '1rem',
            }}
          >
            <BookingForm 
              config={{ 
                ...formConfig, 
                showPartySize: true,
                showNotes: true,
              }} 
              theme={effectiveTheme} 
              showDateTime={true} 
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// With-Info Variant
// ============================================================================

function BookingWithInfo({
  content,
  formConfig,
  theme,
  className,
  id,
  'data-testid': testId,
}: Omit<BookingProps, 'variant'>): React.ReactElement {
  const { themeClass } = useTheme(theme);
  const colors = getThemeColors(theme ?? 'light');
  const effectiveTheme = theme ?? 'light';

  return (
    <section
      id={id}
      data-testid={testId}
      className={cn('comp-booking', 'comp-booking--with-info', themeClass, className)}
      style={{
        ...getSectionBaseStyles(effectiveTheme),
        ...getSectionPadding(),
      }}
    >
      <div style={getContainerStyles()}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.25fr',
            gap: '4rem',
            alignItems: 'start',
          }}
        >
          {/* Info Side */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <BookingHeader
              subheading={content.subheading}
              heading={content.heading}
              description={content.description}
              theme={effectiveTheme}
            />
            <BusinessInfoBlock
              businessInfo={content.businessInfo}
              infoItems={content.infoItems}
              theme={effectiveTheme}
            />
          </div>

          {/* Form Side */}
          <div
            style={{
              backgroundColor: colors.backgroundSecondary,
              padding: '2rem',
              borderRadius: '1rem',
            }}
          >
            <h3 style={{ 
              fontWeight: 600, 
              color: colors.foreground, 
              marginBottom: '1.5rem',
              fontSize: '1.25rem',
            }}>
              Make a Reservation
            </h3>
            <BookingForm 
              config={{ 
                ...formConfig, 
                showPartySize: true,
                showNotes: true,
              }} 
              theme={effectiveTheme} 
              showDateTime={true} 
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Variant Map
// ============================================================================

const variantComponents: Record<
  BookingVariant,
  React.ComponentType<Omit<BookingProps, 'variant'>>
> = {
  'minimal': BookingMinimal,
  'datetime': BookingDatetime,
  'with-info': BookingWithInfo,
};

// ============================================================================
// Main Booking Component
// ============================================================================

export function Booking({ variant, ...props }: BookingProps): React.ReactElement {
  const VariantComponent = variantComponents[variant];
  return <VariantComponent {...props} />;
}

Booking.displayName = 'Booking';
