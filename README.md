# Pro Prototype

A React + TypeScript financial dashboard prototype featuring an interactive command palette with WebGL shadow effects and a comprehensive design system.

## Features

- **React + TypeScript + Vite** - Modern React development with full type safety
- **Command Palette** - Press `CMD+K` (or `CTRL+K`) to open
- **Component Library** - Interactive documentation for all design system components
- **Design System** - Documented tokens, components with JSDoc, and central registry
- **WebGL Shadows** - Custom shader-based gradient shadows
- **Interactive Animations** - Smooth hover effects and transitions using Framer Motion

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

Components follow a **flat, one-folder-per-component** structure (similar to Base UI):

```
├── src/
│   ├── components/           # Each component has its own folder
│   │   ├── area-chart/
│   │   │   ├── AreaChart.tsx
│   │   │   └── index.ts
│   │   ├── avatar/
│   │   │   ├── Avatar.tsx
│   │   │   └── index.ts
│   │   ├── bar-chart/
│   │   │   ├── BarChart.tsx
│   │   │   └── index.ts
│   │   ├── card/
│   │   │   ├── Card.tsx
│   │   │   └── index.ts
│   │   ├── card-explorer/
│   │   │   ├── CardExplorer.tsx
│   │   │   └── index.ts
│   │   ├── chip/
│   │   │   ├── Chip.tsx
│   │   │   └── index.ts
│   │   ├── command-palette/
│   │   │   ├── CommandPalette.tsx
│   │   │   └── index.ts
│   │   ├── command-palette-row/
│   │   │   ├── CommandPaletteRow.tsx
│   │   │   └── index.ts
│   │   ├── component-library/
│   │   │   ├── ComponentLibrary.tsx
│   │   │   └── index.ts
│   │   ├── dashboard/
│   │   │   ├── Dashboard.tsx
│   │   │   └── index.ts
│   │   ├── data-table/
│   │   │   ├── DataTable.tsx
│   │   │   └── index.ts
│   │   ├── error-boundary/
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── index.ts
│   │   ├── gauge-layout/
│   │   │   ├── GaugeLayout.tsx
│   │   │   └── index.ts
│   │   ├── header/
│   │   │   ├── Header.tsx
│   │   │   └── index.ts
│   │   ├── horizontal-bar-chart/
│   │   │   ├── HorizontalBarChart.tsx
│   │   │   └── index.ts
│   │   ├── kpi-layout/
│   │   │   ├── KpiLayout.tsx
│   │   │   └── index.ts
│   │   ├── line-chart/
│   │   │   ├── LineChart.tsx
│   │   │   └── index.ts
│   │   ├── main-nav/
│   │   │   ├── MainNav.tsx
│   │   │   └── index.ts
│   │   ├── modal/
│   │   │   ├── Modal.tsx
│   │   │   └── index.ts
│   │   ├── nav-tabs/
│   │   │   ├── NavTabs.tsx
│   │   │   └── index.ts
│   │   ├── right-panel/
│   │   │   ├── RightPanel.tsx
│   │   │   └── index.ts
│   │   ├── sidebar/
│   │   │   ├── Sidebar.tsx
│   │   │   └── index.ts
│   │   ├── sub-nav/
│   │   │   ├── SubNav.tsx
│   │   │   └── index.ts
│   │   ├── summary-card/
│   │   │   ├── SummaryCard.tsx
│   │   │   └── index.ts
│   │   ├── tab/
│   │   │   ├── Tab.tsx
│   │   │   └── index.ts
│   │   ├── text-field/
│   │   │   ├── TextField.tsx
│   │   │   └── index.ts
│   │   ├── top-predictor-card/
│   │   │   ├── TopPredictorCard.tsx
│   │   │   └── index.ts
│   │   ├── top-predictors-card/
│   │   │   ├── TopPredictorsCard.tsx
│   │   │   └── index.ts
│   │   ├── registry.ts       # Component metadata registry
│   │   └── index.ts          # Barrel export
│   ├── hooks/                # Custom React hooks
│   │   ├── useCardHover.ts
│   │   ├── useCommandPalette.ts
│   │   ├── useWebGLShadow.ts
│   │   ├── useWindowFocus.ts
│   │   └── index.ts
│   ├── types/                # TypeScript type definitions
│   │   └── component-meta.ts # Component registry types
│   ├── utils/                # Utility functions
│   │   ├── cn.ts             # clsx + tailwind-merge
│   │   └── index.ts
│   ├── constants/            # Constants and configuration
│   │   └── index.ts
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # React entry point
│   └── styles.css            # Global styles + design tokens
├── .claude/
│   └── skills/
│       └── component-forge/  # Component creation skill
├── .cursor/
│   └── skills/
│       └── 2026-pro-styleguide/ # Design system spec
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Design System

### Component Registry

All components are documented in `src/components/registry.ts` with:
- **Purpose**: What, where, and not-for
- **Variants**: Available prop options with defaults
- **Composition**: What uses what
- **Guidelines**: Usage notes

### Design Tokens

Defined in `src/styles.css` with purpose comments:
- **Colors**: surface-0/1/2, txt-primary/secondary/tertiary, accents
- **Typography**: General Sans (UI), JetBrains Mono (data)
- **Spacing**: 4px base grid [2, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40]
- **Borders**:
  - Width: 1px, radius scale [2, 4, 8, 12, 16, 9999]
  - Base: border-default, border-subtle, border-glass
  - Semantic: card-border, input-border, input-border-focus, input-border-error

### Component Library

Access via Command Palette → "Component Library" to:
- Browse all components by category
- Interactive property controls
- View purpose, variants, composition, and guidelines

## Keyboard Shortcuts

- `CMD+K` / `CTRL+K` - Open/close command palette
- `↑` / `↓` - Navigate command palette items
- `Enter` - Select command palette item
- `Escape` - Close command palette

## Technologies

- React 18
- TypeScript
- Vite
- Base UI - Unstyled, accessible component primitives
- Framer Motion - Animation library
- Tailwind CSS v4 - Utility-first CSS framework
- WebGL - Custom shader-based shadows
