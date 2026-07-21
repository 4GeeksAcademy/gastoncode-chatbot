---
name: Synthetic Intelligence
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#bbc9cd'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#859397'
  outline-variant: '#3c494c'
  surface-tint: '#2fd9f4'
  primary: '#8aebff'
  on-primary: '#00363e'
  primary-container: '#22d3ee'
  on-primary-container: '#005763'
  inverse-primary: '#006877'
  secondary: '#cebdff'
  on-secondary: '#381385'
  secondary-container: '#4f319c'
  on-secondary-container: '#bea8ff'
  tertiary: '#61f6b9'
  on-tertiary: '#003825'
  tertiary-container: '#3dd99e'
  on-tertiary-container: '#005a3e'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#a2eeff'
  primary-fixed-dim: '#2fd9f4'
  on-primary-fixed: '#001f25'
  on-primary-fixed-variant: '#004e5a'
  secondary-fixed: '#e8ddff'
  secondary-fixed-dim: '#cebdff'
  on-secondary-fixed: '#21005e'
  on-secondary-fixed-variant: '#4f319c'
  tertiary-fixed: '#68fcbf'
  tertiary-fixed-dim: '#45dfa4'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005137'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
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
  code-snippet:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  label-caps:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 0.5rem
  sm: 1rem
  md: 1.5rem
  lg: 2.5rem
  xl: 4rem
  container-max: 1200px
  gutter: 1.5rem
---

## Brand & Style
The design system is engineered for a high-performance AI workspace, targeting developers and data scientists who require a focused, low-friction environment. The aesthetic combines **Minimalism** with subtle **Glassmorphism** to create a sense of depth without distracting from the computational output.

The brand personality is precise, technical, and forward-leaning. It avoids "friendly" curves in favor of a structured, professional tech aesthetic. The user should feel in control of a powerful engine, where the interface recedes to highlight the intelligence of the responses and the clarity of the data visualizations.

## Colors
The palette is rooted in deep, nocturnal tones to reduce eye strain during prolonged technical sessions. 

- **Primary (Cyan):** Reserved for high-priority interactive elements like primary buttons and active states. 
- **Secondary (Violet):** Dedicated to AI-generated content, creating a distinct visual "voice" for the machine.
- **Tertiary (Emerald):** Used exclusively for metrics, success states, and positive delta indicators.
- **Surface Strategy:** The background uses a "Deep Navy" (#0f172a), while UI containers and cards use "Charcoal" (#1e293b) to establish a clear hierarchy of information layers.

## Typography
This design system utilizes a dual-font strategy. **Geist** provides a technical, developer-centric feel for headings, navigation, and labels. **Inter** is used for the primary chat bubbles and body text to ensure maximum readability and comfort during long reading sessions.

Large displays use tight letter-spacing to maintain a "machined" look. Labels are often set in uppercase with slight tracking to differentiate them from functional text. Code snippets should always utilize the monospaced capabilities of the Geist family for alignment and precision.

## Layout & Spacing
The layout follows a **fluid grid** model with a hard-coded maximum container width for readability of AI responses. 

- **Desktop:** 12-column grid. Chat content is typically centered within 8 columns to prevent line lengths from becoming unreadable. Sidebars (for history/settings) occupy 2-3 columns.
- **Tablet:** 8-column grid. Sidebars collapse into drawers.
- **Mobile:** Single column. Margins are reduced to 16px to maximize the conversational area.

Spacing follows a 4px base unit, favoring generous "breathing room" between chat blocks to clearly delineate between user prompts and system responses.

## Elevation & Depth
Depth is created through **Tonal Layers** and **Glassmorphism**. Rather than traditional heavy shadows, the system uses "inner glows" and "border strokes" to define edges.

1.  **Level 0 (Base):** Deep Navy (#0f172a).
2.  **Level 1 (Cards/Bubbles):** Charcoal (#1e293b) with a 1px solid border at 10% opacity white.
3.  **Level 2 (Overlays/Popovers):** Semi-transparent Charcoal with a 20px backdrop blur (Glassmorphism), creating a sense of a "heads-up display" (HUD).

Shadows, when used, are strictly ambient: very low opacity (#000000 at 25%) with a large 32px spread to simulate a soft glow rather than a physical shadow.

## Shapes
The design system uses a **Rounded** philosophy (12px - 16px) to soften the technical edge and make the interface feel modern and approachable. 

- **Cards and Chat Bubbles:** Use `rounded-lg` (16px) to create a distinct containerized look.
- **Buttons and Inputs:** Use `rounded-md` (8px-12px) for a more precise, clickable feel.
- **Metrics/Status Indicators:** Small chips use `rounded-full` (pill-shaped) to distinguish them from interactive buttons.

## Components
- **Primary Buttons:** Solid Cyan fill with black text for maximum contrast. No gradient. 
- **AI Chat Bubbles:** Secondary (Violet) 1px left-border accent. Background is slightly lighter than the main surface to signify the "active" agent.
- **Input Field:** Large, persistent bottom-docked field. Uses a subtle glass effect and a Cyan glow on focus.
- **Data Visualization:** Line charts use the Tertiary (Emerald) color with a semi-transparent gradient fill underneath the line. Grid lines for charts are kept at 5% opacity.
- **Chips:** Small, uppercase labels used for categorization (e.g., "MODEL: GPT-4"). They use a ghost-border style (outline only).
- **Code Blocks:** Darker than the surface (#020617) with syntax highlighting that utilizes the Primary, Secondary, and Tertiary accent colors.