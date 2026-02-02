# comp-cli

A section-based UI component registry with CLI installer for Next.js and React TypeScript projects.

## Overview

comp-cli provides a collection of pre-built, customizable UI sections that can be installed directly into your project using a CLI tool. Similar to shadcn/ui but designed for complete page sections rather than atomic components.

## Features

- **5 Section Types**: Hero, About, Contact, Booking, Footer
- **3 Variants Each**: Different layouts for each section type
- **TypeScript First**: Full type safety with strict typing
- **Framework Agnostic**: Works with Next.js (App/Pages Router) and any React+TS project
- **Zero Runtime Dependencies**: Components are copied into your project
- **Customizable**: Full source code access for customization
- **Accessible**: WCAG-compliant with proper ARIA attributes
- **Theme Support**: Built-in light/dark theme support

## Quick Start

### 1. Initialize in your project

```bash
npx comp-cli init
```

This creates shared utilities and configuration in your project.

### 2. Add sections

```bash
# Add a single section
npx comp-cli add hero

# Add multiple sections
npx comp-cli add hero about footer

# Add all sections
npx comp-cli add --all
```

### 3. Use in your code

```tsx
import { Hero } from '@/components/sections/hero';
import { Contact } from '@/components/sections/contact';
import { Footer } from '@/components/sections/footer';

export default function LandingPage() {
  return (
    <>
      <Hero 
        variant="centered"
        theme="light"
        content={{
          heading: "Welcome to Our Platform",
          subheading: "The best solution for your needs",
          description: "Get started today and see the difference.",
          ctas: [
            { label: "Get Started", href: "/signup" },
            { label: "Learn More", href: "/about", variant: "outline" }
          ]
        }}
      />
      
      <Contact 
        variant="simple"
        theme="light"
        content={{
          heading: "Get in Touch",
          description: "We'd love to hear from you."
        }}
        formConfig={{
          onSubmit: async (data) => {
            await fetch('/api/contact', { 
              method: 'POST', 
              body: JSON.stringify(data) 
            });
          }
        }}
      />
      
      <Footer 
        variant="minimal"
        theme="dark"
        content={{
          branding: { name: "Acme Inc", tagline: "Building the future" },
          links: [
            { label: "About", href: "/about" },
            { label: "Contact", href: "/contact" },
            { label: "Privacy", href: "/privacy" }
          ]
        }}
      />
    </>
  );
}
```

## Available Sections

### Hero
Prominent header section with heading, CTAs, and optional media.

| Variant | Description |
|---------|-------------|
| `centered` | Text-focused, centered layout |
| `split` | Side-by-side content and media |
| `fullwidth` | Full background image with overlay |

### About
Information section for company/product details.

| Variant | Description |
|---------|-------------|
| `text-heavy` | Focus on text content with optional highlights |
| `image-focused` | Side-by-side text and image |
| `values` | Grid of values/highlights with icons |

### Contact
Contact form and information section.

| Variant | Description |
|---------|-------------|
| `simple` | Just a contact form |
| `with-info` | Form + company contact information |
| `cta-based` | Call-to-action block without form |

### Booking
Reservation and booking form section.

| Variant | Description |
|---------|-------------|
| `minimal` | Simple date/name/email booking form |
| `datetime` | Full date and time selection |
| `with-info` | Booking form + business information |

### Footer
Site footer with navigation, branding, and optional newsletter.

| Variant | Description |
|---------|-------------|
| `minimal` | Simple footer with logo, links, and copyright |
| `multi-column` | Full footer with nav groups and social |
| `newsletter` | Multi-column with newsletter signup |

## CLI Commands

### `init`
Initialize the component registry in your project.

```bash
npx comp-cli init [options]

Options:
  -y, --yes       Skip prompts and use defaults
  --cwd <path>    Working directory (defaults to current)
```

### `add`
Add section components to your project.

```bash
npx comp-cli add [sections...] [options]

Arguments:
  sections        One or more section names (hero, about, contact, booking, footer)

Options:
  -a, --all       Install all available sections
  -o, --overwrite Overwrite existing sections without prompting
  --cwd <path>    Working directory (defaults to current)
```

### `list`
List all available sections and their variants.

```bash
npx comp-cli list
```

## Project Structure

After initialization, your project will have:

```
src/components/sections/
├── types/
│   └── index.ts          # Shared type definitions
├── utils/
│   ├── index.ts          # Utility functions (cn, formatters, etc.)
│   └── validation.ts     # Form validation utilities
├── hooks/
│   └── index.ts          # Custom hooks (useForm, useTheme, etc.)
├── styles/
│   └── index.ts          # Style utilities and theme colors
├── components/
│   └── primitives.tsx    # Shared UI primitives (Button, Input, etc.)
├── hero/                  # (after `add hero`)
│   ├── Hero.base.tsx
│   ├── Hero.variants.tsx
│   └── index.ts
├── contact/               # (after `add contact`)
│   ├── Contact.base.tsx
│   ├── Contact.variants.tsx
│   └── index.ts
└── ...
```

## Configuration

After running `init`, a `comp-cli.json` file is created:

```json
{
  "$schema": "https://raw.githubusercontent.com/comp-cli/schema.json",
  "componentsDir": "src/components/sections",
  "installedSections": []
}
```

## API Reference

### Common Props

All sections accept these base props:

| Prop | Type | Description |
|------|------|-------------|
| `variant` | string | Layout variant (required) |
| `theme` | `'light' \| 'dark'` | Visual theme |
| `className` | string | Additional CSS classes |
| `id` | string | Section ID for anchor links |
| `data-testid` | string | Test identifier |

### Theme Colors

Default theme colors (customizable in `styles/index.ts`):

```typescript
const themeColors = {
  light: {
    background: '#ffffff',
    foreground: '#171717',
    primary: '#2563eb',
    // ...
  },
  dark: {
    background: '#0a0a0a',
    foreground: '#fafafa',
    primary: '#3b82f6',
    // ...
  }
};
```

## Customization

### Modifying Styles

All styles are inline for zero-CSS-dependency operation. Modify styles in:
- `styles/index.ts` - Theme colors and style utilities
- Individual component files - Section-specific styles

### Adding Custom Variants

1. Add variant name to the variants array in `[Section].base.tsx`
2. Create new variant component in `[Section].variants.tsx`
3. Add to the variant mapping object

### Extending Types

All types are in `types/index.ts`. Add or modify types as needed.

## Requirements

- Node.js 18+
- React 18+
- TypeScript 5+

## Design Decisions

### 1. Variant Strategy Pattern
Instead of creating separate components for each variant (HeroCentered, HeroSplit, etc.), we use a single component with a `variant` prop that resolves internally. This:
- Prevents prop explosion across variant-specific components
- Ensures consistent API surface
- Makes it easy to add new variants without breaking changes

### 2. Base + Variants Architecture
Each section is split into:
- `[Section].base.tsx` - Types, constants, shared styles, variant definitions
- `[Section].variants.tsx` - Variant-specific rendering logic
- `index.ts` - Clean public exports

This ensures no duplicated logic between variants while keeping concerns separated.

### 3. Copy-Paste over Dependencies
Following shadcn/ui's philosophy, components are copied into the user's project rather than imported from a package. This gives developers:
- Full ownership and customization ability
- No version lock-in or breaking updates
- Ability to modify components without forking

### 4. Embedded Templates in CLI
Component source code is embedded as strings in the CLI package rather than read from files at runtime. This:
- Enables single-binary distribution
- Avoids file path resolution issues
- Works reliably across different environments

### 5. Zero Runtime CSS Dependencies
All styles are inline using `CSSProperties`. This:
- Works in any React environment (Next.js App/Pages Router, CRA, Vite)
- Avoids CSS-in-JS library conflicts
- Ensures components work without additional setup

### 6. Form Validation Built-in
Contact and Booking sections include client-side validation using a custom `useForm` hook with:
- Field-level validation rules
- Touch tracking for UX
- Accessible error messaging
- No external form library required

### 7. Theme as a Prop, Not Context
Theme is passed as a prop rather than using React Context. This:
- Allows mixing themes on the same page
- Avoids provider wrapper requirements
- Makes components truly standalone

## License

MIT
