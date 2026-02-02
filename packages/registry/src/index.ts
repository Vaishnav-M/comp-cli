/**
 * @comp-cli/registry
 * 
 * A section-based UI component registry for Next.js and React projects.
 * 
 * @example
 * ```tsx
 * import { Hero, Contact, Footer } from '@comp-cli/registry';
 * 
 * function Page() {
 *   return (
 *     <>
 *       <Hero variant="centered" content={{ heading: 'Welcome' }} />
 *       <Contact variant="simple" content={{ heading: 'Get in Touch' }} />
 *       <Footer variant="minimal" content={{ branding: { name: 'My Site' } }} />
 *     </>
 *   );
 * }
 * ```
 */

// ============================================================================
// Section Components
// ============================================================================

// Import variant constants for use in SECTION_REGISTRY
import { HERO_VARIANTS } from './hero/Hero.base';
import { ABOUT_VARIANTS } from './about/About.base';
import { CONTACT_VARIANTS } from './contact/Contact.base';
import { BOOKING_VARIANTS } from './booking/Booking.base';
import { FOOTER_VARIANTS } from './footer/Footer.base';

export { Hero, HERO_VARIANTS } from './hero';
export type { HeroProps, HeroVariant, HeroContent } from './hero';

export { About, ABOUT_VARIANTS } from './about';
export type { AboutProps, AboutVariant, AboutContent } from './about';

export { Contact, CONTACT_VARIANTS } from './contact';
export type { 
  ContactProps, 
  ContactVariant, 
  ContactContent,
  ContactFormData,
  ContactFormConfig,
} from './contact';

export { Booking, BOOKING_VARIANTS } from './booking';
export type { 
  BookingProps, 
  BookingVariant, 
  BookingContent,
  BookingFormData,
  BookingFormConfig,
  TimeSlot,
} from './booking';

export { Footer, FOOTER_VARIANTS } from './footer';
export type { 
  FooterProps, 
  FooterVariant, 
  FooterContent,
  FooterBranding,
  NewsletterConfig,
} from './footer';

// ============================================================================
// Shared Types
// ============================================================================

export type {
  Theme,
  ThemeProps,
  BaseSectionProps,
  CTAButton,
  MediaItem,
  NavLink,
  NavGroup,
  SocialLink,
  SocialPlatform,
  HighlightItem,
  ContactInfo,
  FormField,
  TextFieldProps,
  TextAreaFieldProps,
  SelectFieldProps,
  DateFieldProps,
} from './types';

// ============================================================================
// Utilities
// ============================================================================

export { cn, generateId, isValidEmail, isValidPhone } from './utils';
export { validators, validateField, validateForm } from './utils/validation';
export type { ValidationRule, FieldValidation, ValidationErrors, FormState } from './utils/validation';

// ============================================================================
// Hooks
// ============================================================================

export { 
  useTheme, 
  useForm, 
  useId,
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useReducedMotion,
} from './hooks';

// ============================================================================
// Primitive Components
// ============================================================================

export { 
  SectionContainer,
  Button,
  CTAButton as CTAButtonComponent,
  Input,
  Textarea,
  Select,
  Media,
} from './components/primitives';
export type {
  SectionContainerProps,
  ButtonProps,
  CTAButtonComponentProps,
  InputProps,
  TextareaProps,
  SelectProps,
  MediaProps,
} from './components/primitives';

// ============================================================================
// Style Utilities
// ============================================================================

export {
  themeColors,
  getThemeColors,
  getSectionBaseStyles,
  getSectionPadding,
  getContainerStyles,
  getContainerNarrowStyles,
  getHeadingStyles,
  getBodyTextStyles,
  getLargeTextStyles,
  getButtonStyles,
  getInputStyles,
  getLabelStyles,
  getErrorStyles,
  getFlexStyles,
  getGridStyles,
  getCenterStyles,
  mergeStyles,
} from './styles';
export type { ButtonVariant } from './styles';

// ============================================================================
// Registry Metadata
// ============================================================================

/**
 * Complete registry of all available sections with their metadata.
 * Useful for CLI tools and documentation generation.
 */
export const SECTION_REGISTRY = {
  hero: {
    id: 'hero',
    name: 'Hero',
    description: 'Prominent header section with heading, CTAs, and optional media',
    variants: HERO_VARIANTS,
    dependencies: [],
  },
  about: {
    id: 'about',
    name: 'About',
    description: 'Information section for company/product details',
    variants: ABOUT_VARIANTS,
    dependencies: [],
  },
  contact: {
    id: 'contact',
    name: 'Contact',
    description: 'Contact form and information section',
    variants: CONTACT_VARIANTS,
    dependencies: [],
  },
  booking: {
    id: 'booking',
    name: 'Booking',
    description: 'Reservation and booking form section',
    variants: BOOKING_VARIANTS,
    dependencies: [],
  },
  footer: {
    id: 'footer',
    name: 'Footer',
    description: 'Site footer with navigation, branding, and optional newsletter',
    variants: FOOTER_VARIANTS,
    dependencies: [],
  },
} as const;

export type SectionId = keyof typeof SECTION_REGISTRY;
export const SECTION_IDS = Object.keys(SECTION_REGISTRY) as SectionId[];
