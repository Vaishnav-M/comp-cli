/**
 * CLI Type Definitions
 */

// ============================================================================
// Project Detection Types
// ============================================================================

export type ProjectFramework = 'nextjs' | 'react' | 'unknown';
export type RouterType = 'app' | 'pages' | 'unknown';
export type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun';

export interface ProjectConfig {
  /** Detected framework */
  framework: ProjectFramework;
  /** Is TypeScript enabled */
  typescript: boolean;
  /** Router type (Next.js specific) */
  routerType: RouterType;
  /** Detected package manager */
  packageManager: PackageManager;
  /** Project root path */
  rootPath: string;
  /** Source directory (src/ or root) */
  srcDir: string;
  /** Components directory */
  componentsDir: string;
  /** Does project have tailwind */
  hasTailwind: boolean;
}

// ============================================================================
// CLI Configuration
// ============================================================================

export interface CLIConfig {
  /** Base directory for installed components */
  componentsDir: string;
  /** Whether to use TypeScript */
  typescript: boolean;
  /** Custom path aliases */
  aliases?: Record<string, string>;
}

// ============================================================================
// Section Metadata (mirrors registry)
// ============================================================================

export interface SectionMeta {
  id: string;
  name: string;
  description: string;
  variants: readonly string[];
  files: string[];
  dependencies: string[];
}

export const AVAILABLE_SECTIONS: Record<string, SectionMeta> = {
  hero: {
    id: 'hero',
    name: 'Hero',
    description: 'Prominent header section with heading, CTAs, and optional media',
    variants: ['centered', 'split', 'fullwidth'],
    files: ['Hero.base.tsx', 'Hero.variants.tsx', 'index.ts'],
    dependencies: [],
  },
  about: {
    id: 'about',
    name: 'About',
    description: 'Information section for company/product details',
    variants: ['text-heavy', 'image-focused', 'values'],
    files: ['About.base.tsx', 'About.variants.tsx', 'index.ts'],
    dependencies: [],
  },
  contact: {
    id: 'contact',
    name: 'Contact',
    description: 'Contact form and information section',
    variants: ['simple', 'with-info', 'cta-based'],
    files: ['Contact.base.tsx', 'Contact.variants.tsx', 'index.ts'],
    dependencies: [],
  },
  booking: {
    id: 'booking',
    name: 'Booking',
    description: 'Reservation and booking form section',
    variants: ['minimal', 'datetime', 'with-info'],
    files: ['Booking.base.tsx', 'Booking.variants.tsx', 'index.ts'],
    dependencies: [],
  },
  footer: {
    id: 'footer',
    name: 'Footer',
    description: 'Site footer with navigation, branding, and optional newsletter',
    variants: ['minimal', 'multi-column', 'newsletter'],
    files: ['Footer.base.tsx', 'Footer.variants.tsx', 'index.ts'],
    dependencies: [],
  },
};

// Section names type
export type SectionName = 'hero' | 'about' | 'contact' | 'booking' | 'footer';

// Section names as array for iteration
export const SECTION_NAMES: SectionName[] = ['hero', 'about', 'contact', 'booking', 'footer'];

// Shared dependencies required by all sections
export const SHARED_DEPENDENCY_PACKAGES: string[] = []; // No external packages required beyond React

// ============================================================================
// Command Types
// ============================================================================

export interface InitOptions {
  cwd?: string;
  yes?: boolean;
}

export interface AddOptions {
  cwd?: string;
  overwrite?: boolean;
  all?: boolean;
}
