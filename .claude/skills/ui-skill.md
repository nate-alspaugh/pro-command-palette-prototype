# UI Skill

Design constraints for Pro prototype.

## Stack

- MUST use Tailwind CSS defaults unless custom values already exist or are explicitly requested (See **Spacing** and **Colors** below for required overrides).
- MUST use `motion/react` (formerly `framer-motion`) when JavaScript animation is required.
- SHOULD use `tw-animate-css` for entrance and micro-animations in Tailwind CSS.
- MUST use `cn` utility (`clsx` + `tailwind-merge`) for class logic.
- NEVER use Chakra UI or other component libraries; strictly use Tailwind utility classes.

## Components

- **General Accessibility:**
  - MUST use accessible component primitives for anything with keyboard or focus behavior (`Base UI`, `React Aria`).
  - MUST add an `aria-label` to icon-only buttons.
  - NEVER rebuild keyboard or focus behavior by hand unless explicitly requested.

- **Button Primary (High Fidelity):**
  - Label: `Base Gray` (#0C0D0D) | Weight: 450.
  - Fill: Linear Gradient (Top -> Bottom): White 80% -> White 70%.
  - Outer Border: `card-border` (White 10% -> White 5%).
  - Inner Border (Highlight): MUST use a `::before` pseudo-element (masked) or inset box-shadow to create a top-shine (White 100%) to bottom-shadow (Black 30%) gradient. Width: 0.5px.

- **Button Secondary (Glass/Ghost):**
  - Label: `txt-secondary` (White 60%) | Weight: 450.
  - Fill: Linear Gradient (Top -> Bottom): White 0% -> White 10%.
  - Outer Border: `card-border` (White 10% -> White 5%).
  - Inner Border (Ring): Solid Black 20% (0.5px width) via inset box-shadow.

- **Table Small (Key/Value):**
  - Usage: Direct key/value pairs inside cards.
  - Layout: `flex justify-between items-center`, `py-2` (8px).
  - Borders: Strictly `divide-y` logic (between items only), using `card-border`.
  - Typography: Key (`xs`, 450 weight, `txt-secondary`) vs Value (`s`, 700 weight, `txt-primary`, Mono).

## Typography

- **Font Families:**
  - MUST use `General Sans` (Variable) for UI.
  - MUST use `JetBrains Mono` for numbers, data, and IDs.

- **Weights (Variable Axis):**
  - MUST use specific weights: `450` (Book) and `530` (Medium).
  - NEVER round to 400 or 500.
  - Mono Bold: 700.

- **Semantic Text Styles Map (MUST FOLLOW):**
  - `Title 4`: size: 2xl (28px), weight: 530
  - `Title 3`: size: xl (24px), weight: 530
  - `Title 2`: size: l (20px), weight: 450
  - `Title 1`: size: m (18px), weight: 450
  - `Paragraph 3`: size: s (16px), weight: 450
  - `Paragraph 2`: size: xs (14px), weight: 450
  - `Paragraph 1`: size: 2xs (12px), weight: 450
  - `Action Label (s)`: size: s (16px), weight: 450
  - `Action Label (xs)`: size: xs (14px), weight: 450
  - `Table Label`: size: xs/2xs, weight: 450
  - `Mono Label`: Uppercase, Bold (700)

- **Line Height Logic:**
  - Single-line content (Titles/Labels): MUST use `100%` (`leading-none`).
  - Multi-line content (Paragraphs): MUST use `150%` (`leading-relaxed`).

- **Formatting:**
  - MUST use `text-balance` for headings and `text-pretty` for body.
  - MUST use `tabular-nums` for data.
  - SHOULD use `truncate` or `line-clamp` for dense UI.

## Layout & Spacing

- **Grid System:**
  - Base unit: 4px (Implicit).
  - Exception unit: 2px.

- **Spacing Token Scale:**
  - MUST strictly adhere to: `[2, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40]`.
  - NEVER invent arbitrary values (e.g., 10px, 15px).

- **Borders:**
  - Width: MUST be `1px` for all bordered elements (Cards, Buttons, Tables).
  - Radius: Standard steps `[2px, 4px, 8px, 12px, 16px]` or `9999px` (Pill).

- **General:**
  - NEVER use `h-screen`, use `h-dvh`.
  - MUST respect `safe-area-inset` for fixed elements.

## Design & Colors

- **Base Palette:**
  - `Base Gray`: `#0C0D0D`
  - Alpha Scales: 0% to 100% (White/Black).

- **Semantic Tokens (MUST USE):**
  - `surface-0`: Base Gray.
  - `surface-1`: White 5%.
  - `surface-2`: White 2.5%.
  - `card-bg-0`: surface-1 + blur(200).
  - `card-bg-1`: surface-2 + blur(200).
  - `card-border`: Linear Gradient (45deg, White 10% -> White 5%).
  - `txt-primary` (White 90%), `txt-secondary` (White 60%), `txt-tertiary` (White 40%).

- **Card Hierarchy:**
  - MUST use `card-bg-0` for Parent/Base layers.
  - MUST use `card-bg-1` for Nested layers.

- **Accent Colors:**
  - Source: **Tailwind CSS Default Palette**.
  - MUST match screenshot colors to the nearest Tailwind color token (e.g., `teal-400`, `orange-500`, `sky-600`).
  - NEVER use arbitrary hex codes for accents.

- **Gradients:**
  - MUST use specified gradients for Buttons and Card Borders.
  - NEVER use purple or multicolor gradients (unless matching a specific Tailwind accent in a chart).

## Interaction

- MUST use an `AlertDialog` for destructive or irreversible actions.
- SHOULD use structural skeletons for loading states.
- MUST show errors next to where the action happens.
- NEVER block paste in `input` or `textarea` elements.

## Animation

- NEVER add animation unless it is explicitly requested.
- MUST animate only compositor props (`transform`, `opacity`).
- NEVER animate layout properties (`width`, `height`, `top`, `left`, `margin`, `padding`).
- NEVER exceed `200ms` for interaction feedback.

## Performance

- NEVER animate large `blur()` or `backdrop-filter` surfaces (static blurs on cards are okay).
- NEVER apply `will-change` outside an active animation.
- NEVER use `useEffect` for anything that can be expressed as render logic.
