/**
 * Shared UI primitive components
 * These are building blocks used across all section components
 */

import React from 'react';
import type { Theme, CTAButton as CTAButtonType } from '../types';
import { cn, getExternalLinkProps } from '../utils';
import { 
  getButtonStyles, 
  getInputStyles, 
  getLabelStyles, 
  getErrorStyles,
  getContainerStyles,
  getSectionBaseStyles,
  getSectionPadding,
  type ButtonVariant 
} from '../styles';

// ============================================================================
// Section Container
// ============================================================================

export interface SectionContainerProps {
  children: React.ReactNode;
  theme: Theme;
  className?: string;
  id?: string;
  'data-testid'?: string;
  as?: 'section' | 'footer' | 'header';
}

export function SectionContainer({
  children,
  theme,
  className,
  id,
  'data-testid': testId,
  as: Component = 'section',
}: SectionContainerProps): React.ReactElement {
  return (
    <Component
      id={id}
      data-testid={testId}
      className={cn('comp-section', `theme-${theme}`, className)}
      style={{
        ...getSectionBaseStyles(theme),
        ...getSectionPadding(),
      }}
    >
      <div style={getContainerStyles()}>
        {children}
      </div>
    </Component>
  );
}

// ============================================================================
// Button
// ============================================================================

export interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  theme: Theme;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  external?: boolean;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Button({
  children,
  variant = 'primary',
  theme,
  href,
  onClick,
  type = 'button',
  disabled,
  external,
  ariaLabel,
  className,
  style,
}: ButtonProps): React.ReactElement {
  const buttonStyles = {
    ...getButtonStyles(variant, theme),
    ...style,
    ...(disabled && { opacity: 0.5, cursor: 'not-allowed' }),
  };

  if (href) {
    return (
      <a
        href={href}
        className={cn('comp-button', `comp-button--${variant}`, className)}
        style={buttonStyles}
        aria-label={ariaLabel}
        {...(external && getExternalLinkProps())}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn('comp-button', `comp-button--${variant}`, className)}
      style={buttonStyles}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

// ============================================================================
// CTA Button (from CTAButton type)
// ============================================================================

export interface CTAButtonComponentProps extends CTAButtonType {
  theme: Theme;
  className?: string;
}

export function CTAButton({
  label,
  href,
  onClick,
  variant = 'primary',
  ariaLabel,
  external,
  theme,
  className,
}: CTAButtonComponentProps): React.ReactElement {
  return (
    <Button
      variant={variant}
      theme={theme}
      href={href}
      onClick={onClick}
      external={external}
      ariaLabel={ariaLabel ?? label}
      className={className}
    >
      {label}
    </Button>
  );
}

// ============================================================================
// Form Input
// ============================================================================

export interface InputProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'url' | 'password';
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  theme: Theme;
  className?: string;
  autoComplete?: string;
}

export function Input({
  name,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  required,
  disabled,
  error,
  helpText,
  theme,
  className,
  autoComplete,
}: InputProps): React.ReactElement {
  const inputId = `input-${name}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const helpId = helpText ? `${inputId}-help` : undefined;

  return (
    <div className={cn('comp-input-group', className)}>
      <label htmlFor={inputId} style={getLabelStyles(theme)}>
        {label}
        {required && <span aria-hidden="true" style={{ color: 'red' }}> *</span>}
      </label>
      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={[errorId, helpId].filter(Boolean).join(' ') || undefined}
        autoComplete={autoComplete}
        style={getInputStyles(theme, !!error)}
      />
      {helpText && !error && (
        <p id={helpId} style={{ ...getErrorStyles(theme), color: 'inherit', opacity: 0.7 }}>
          {helpText}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" style={getErrorStyles(theme)}>
          {error}
        </p>
      )}
    </div>
  );
}

// ============================================================================
// Textarea
// ============================================================================

export interface TextareaProps {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  rows?: number;
  theme: Theme;
  className?: string;
}

export function Textarea({
  name,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  required,
  disabled,
  error,
  helpText,
  rows = 4,
  theme,
  className,
}: TextareaProps): React.ReactElement {
  const inputId = `textarea-${name}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const helpId = helpText ? `${inputId}-help` : undefined;

  return (
    <div className={cn('comp-textarea-group', className)}>
      <label htmlFor={inputId} style={getLabelStyles(theme)}>
        {label}
        {required && <span aria-hidden="true" style={{ color: 'red' }}> *</span>}
      </label>
      <textarea
        id={inputId}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={[errorId, helpId].filter(Boolean).join(' ') || undefined}
        style={{
          ...getInputStyles(theme, !!error),
          resize: 'vertical',
          minHeight: '100px',
        }}
      />
      {helpText && !error && (
        <p id={helpId} style={{ ...getErrorStyles(theme), color: 'inherit', opacity: 0.7 }}>
          {helpText}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" style={getErrorStyles(theme)}>
          {error}
        </p>
      )}
    </div>
  );
}

// ============================================================================
// Select
// ============================================================================

export interface SelectProps {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  theme: Theme;
  className?: string;
}

export function Select({
  name,
  label,
  value,
  onChange,
  onBlur,
  options,
  placeholder,
  required,
  disabled,
  error,
  theme,
  className,
}: SelectProps): React.ReactElement {
  const inputId = `select-${name}`;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className={cn('comp-select-group', className)}>
      <label htmlFor={inputId} style={getLabelStyles(theme)}>
        {label}
        {required && <span aria-hidden="true" style={{ color: 'red' }}> *</span>}
      </label>
      <select
        id={inputId}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        required={required}
        disabled={disabled}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={errorId}
        style={getInputStyles(theme, !!error)}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={errorId} role="alert" style={getErrorStyles(theme)}>
          {error}
        </p>
      )}
    </div>
  );
}

// ============================================================================
// Media Component (Image/Video)
// ============================================================================

export interface MediaProps {
  src: string;
  alt: string;
  type?: 'image' | 'video';
  poster?: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
}

export function Media({
  src,
  alt,
  type = 'image',
  poster,
  width,
  height,
  className,
  style,
  loading = 'lazy',
}: MediaProps): React.ReactElement {
  const baseStyles: React.CSSProperties = {
    maxWidth: '100%',
    height: 'auto',
    display: 'block',
    ...style,
  };

  if (type === 'video') {
    return (
      <video
        src={src}
        poster={poster}
        width={width}
        height={height}
        className={cn('comp-media', 'comp-media--video', className)}
        style={baseStyles}
        controls
        aria-label={alt}
      >
        <track kind="captions" />
        Your browser does not support the video tag.
      </video>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      className={cn('comp-media', 'comp-media--image', className)}
      style={baseStyles}
    />
  );
}
