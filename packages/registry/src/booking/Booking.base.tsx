/**
 * Booking Section - Base Component
 * 
 * Provides the foundational structure, types, and form logic for all Booking variants.
 */

import React from 'react';
import type { 
  BaseSectionProps, 
  ContactInfo,
} from '../types';

// ============================================================================
// Booking Variants
// ============================================================================

export const BOOKING_VARIANTS = ['minimal', 'datetime', 'with-info'] as const;
export type BookingVariant = typeof BOOKING_VARIANTS[number];

// ============================================================================
// Booking Form Types
// ============================================================================

/**
 * Booking form data - all fields are strings (empty string for optional fields)
 * The useForm hook requires Record<string, string>
 */
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

export interface TimeSlot {
  value: string;
  label: string;
  available?: boolean;
}

export interface BookingFormConfig {
  /** Available time slots */
  timeSlots?: TimeSlot[];
  /** Available services/options */
  services?: Array<{ value: string; label: string }>;
  /** Party size options */
  partySizeOptions?: Array<{ value: string; label: string }>;
  /** Show party size field */
  showPartySize?: boolean;
  /** Show service selection */
  showService?: boolean;
  /** Show notes field */
  showNotes?: boolean;
  /** Submit button text */
  submitText?: string;
  /** Success message */
  successMessage?: string;
  /** Minimum booking date (e.g., today) */
  minDate?: string;
  /** Maximum booking date */
  maxDate?: string;
  /** Form submission handler */
  onSubmit?: (data: BookingFormData) => void | Promise<void>;
}

// ============================================================================
// Booking Props
// ============================================================================

export interface BookingContent {
  /** Section heading */
  heading: string;
  /** Optional subheading */
  subheading?: string;
  /** Optional description */
  description?: string;
  /** Business info (for with-info variant) */
  businessInfo?: ContactInfo & {
    /** Business name */
    name?: string;
  };
  /** Additional info items */
  infoItems?: Array<{
    icon?: React.ReactNode;
    title: string;
    description: string;
  }>;
}

export interface BookingProps extends BaseSectionProps {
  /** Visual layout variant */
  variant: BookingVariant;
  /** Booking content */
  content: BookingContent;
  /** Form configuration */
  formConfig?: BookingFormConfig;
}

// ============================================================================
// Base Styles
// ============================================================================

export function getBookingHeadingStyles(): React.CSSProperties {
  return {
    fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.025em',
    margin: 0,
  };
}

export function getBookingSubheadingStyles(): React.CSSProperties {
  return {
    fontSize: '1rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    margin: 0,
  };
}

export function getBookingFormStyles(): React.CSSProperties {
  return {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  };
}

// ============================================================================
// Helper: Get today's date in YYYY-MM-DD format
// ============================================================================

export function getTodayDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

// ============================================================================
// Default Export
// ============================================================================

export { Booking } from './Booking.variants';
