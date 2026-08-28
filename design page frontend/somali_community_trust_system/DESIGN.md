---
name: Somali Community Trust System
colors:
  surface: '#f0fcfb'
  surface-dim: '#d1dcdc'
  surface-bright: '#f0fcfb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#ebf6f5'
  surface-container: '#e5f0ef'
  surface-container-high: '#dfeaea'
  surface-container-highest: '#dae5e4'
  on-surface: '#131d1d'
  on-surface-variant: '#3f484c'
  inverse-surface: '#283232'
  inverse-on-surface: '#e8f3f2'
  outline: '#6f797d'
  outline-variant: '#bec8cc'
  surface-tint: '#00677e'
  primary: '#00576b'
  on-primary: '#ffffff'
  primary-container: '#0b7189'
  on-primary-container: '#c2eeff'
  inverse-primary: '#82d1ec'
  secondary: '#7b5800'
  on-secondary: '#ffffff'
  secondary-container: '#fcc759'
  on-secondary-container: '#735200'
  tertiary: '#005c3d'
  on-tertiary: '#ffffff'
  tertiary-container: '#247554'
  on-tertiary-container: '#a9f8ce'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b4ebff'
  primary-fixed-dim: '#82d1ec'
  on-primary-fixed: '#001f28'
  on-primary-fixed-variant: '#004e5f'
  secondary-fixed: '#ffdea4'
  secondary-fixed-dim: '#f3be52'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5d4200'
  tertiary-fixed: '#a4f3ca'
  tertiary-fixed-dim: '#88d6af'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f0fcfb'
  on-background: '#131d1d'
  surface-variant: '#dae5e4'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  numeric-data:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 24px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  container-max: 1200px
  gutter: 24px
---

## Brand & Style

The design system is built on a foundation of "Human-centered Trust." It is tailored specifically for the Somali context, where community-driven support and financial transparency are paramount. The aesthetic merges **Minimalism** with **Modern Corporate** reliability, avoiding flashy trends in favor of a grounded, authoritative presence.

The visual narrative focuses on clarity and warmth. It shuns aggressive gradients and high-gloss finishes, instead utilizing a "Paper and Ink" philosophy—clean surfaces, intentional whitespace, and crisp typography that mimics the reliability of official documentation while maintaining the approachability of a community center. The emotional response should be one of security, dignity, and collective progress.

## Colors

This design system utilizes a palette that balances professional "Trustworthy Teal" with a "Warm Gold" accent to evoke the landscape and warmth of the Somali region.

- **Primary (#0B7189):** Used for primary actions, navigation headers, and branding elements. It represents stability and institutional trust.
- **Accent (#D8A63C):** Used sparingly for highlighting community achievements, "Donate" calls-to-action, and verification badges.
- **Surface & Background:** The background uses a subtle warm grey (#F8FAF9) to reduce eye strain, while pure white (#FFFFFF) is reserved for interactive cards and input containers to create clear visual separation.
- **Semantic Colors:** Success, Warning, and Error colors are slightly desaturated to maintain the calm, professional tone of the interface.

## Typography

The typography uses **Inter** exclusively to ensure maximum legibility for both English and Somali Latin scripts. 

- **Numerical Clarity:** For financial data and donation amounts, use the `numeric-data` style which enables tabular lining (tnum) to ensure numbers align perfectly in lists and tables.
- **Hierarchy:** Use `display-lg` for campaign titles. `body-lg` should be the default for storytelling text to ensure high readability for all age groups.
- **Contrast:** Maintain a high contrast ratio between text and background. Secondary text (#5E6B6B) is only permitted for metadata and labels, never for primary descriptive content.

## Layout & Spacing

The design system employs an **8px-based spacing scale** to create a rhythmic, predictable layout. 

- **Grid:** A 12-column fluid grid is used for desktop (breakpoint 1024px+), shifting to a 4-column grid for mobile (breakpoint < 768px).
- **Margins:** Desktop margins are fixed at 48px to give content "room to breathe," while mobile margins shrink to 16px to maximize screen real estate.
- **Alignment:** All components must snap to the 8px grid. Use 16px (md) for internal component padding and 24px (lg) for vertical section spacing.

## Elevation & Depth

This design system minimizes the use of shadows to maintain a clean, professional aesthetic. Depth is primarily conveyed through **Tonal Layers** and **Low-Contrast Outlines**.

- **Level 0 (Background):** #F8FAF9.
- **Level 1 (Cards/Surfaces):** #FFFFFF with a 1px solid border (#DCE4E3). No shadow.
- **Level 2 (Modals/Overlays):** #FFFFFF with a very soft, diffused shadow (0px 4px 20px rgba(23, 33, 33, 0.08)).
- **Interactions:** On hover, cards may transition to a slightly thicker border or a very subtle tint change, rather than "lifting" off the page. This reinforces the "solid" and "grounded" nature of the platform.

## Shapes

The shape language is "Softly Geometric." We avoid the playfulness of hyper-rounded pill shapes and the harshness of sharp corners.

- **Standard Elements (Buttons, Inputs):** 8px (rounded).
- **Surface Containers (Cards, Modals):** 12px (rounded-lg).
- **Large Sections (Hero containers):** 16px (rounded-xl).
- **Consistency:** All interactive elements must share the same corner radius to create a unified visual language.

## Components

### Buttons
- **Primary:** Solid #0B7189 with white text. 8px radius. High emphasis.
- **Secondary:** Outlined with 1px #DCE4E3, text in Primary color. Used for less critical actions.
- **Accent (Donate):** Solid #D8A63C with #172121 text. Reserved strictly for the final conversion step.

### Campaign Cards
- **Structure:** 12px radius, 1px border. Top section contains the image, bottom section contains a clear vertical hierarchy: Title (Headline-sm), Organizer (Label-md), and Progress.
- **Progress Bars:** Use a thick 8px track. The unfilled track should be #DCE4E3, filled with #0B7189.

### Verification Badges
- Small, rounded-sm containers with #D8A63C background and a "Verified" icon. This is a critical trust component and should be placed near the organizer's name or the campaign title.

### Input Fields
- 1px #DCE4E3 border, 8px radius. Labels should always be visible above the field (not just placeholder text) to assist users during complex donation flows. Focus state uses a 2px #0B7189 border.

### Chips/Tags
- Rectangular with 4px radius. Use subtle background tints of the semantic colors (e.g., light teal for "Education" category) to categorize campaigns without distracting from the main content.