# Pro Prototype

A React-based financial dashboard prototype featuring an interactive command palette with WebGL shadow effects.

## Features

- **React + Vite** - Modern React development with Vite
- **Command Palette** - Press `CMD+K` (or `CTRL+K`) to open
- **WebGL Shadows** - Custom shader-based gradient shadows
- **Interactive Animations** - Smooth hover effects and transitions using Framer Motion
- **Conic Gradient Borders** - Dynamic rotating gradient borders on cards and tabs

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

```
├── src/
│   ├── components/         # React components (organized by feature)
│   │   ├── charts/        # Data visualization components
│   │   │   ├── AreaChart.jsx
│   │   │   ├── BarChart.jsx
│   │   │   ├── HorizontalBarChart.jsx
│   │   │   ├── LineChart.jsx
│   │   │   └── index.js
│   │   ├── cards/         # Card components
│   │   │   ├── SummaryCard.jsx
│   │   │   ├── TopPredictorCard.jsx
│   │   │   ├── TopPredictorsCard.jsx
│   │   │   └── index.js
│   │   ├── layout/         # Layout components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DataTable.jsx
│   │   │   ├── GaugeLayout.jsx
│   │   │   ├── KpiLayout.jsx
│   │   │   └── index.js
│   │   ├── navigation/    # Navigation components
│   │   │   ├── Header.jsx
│   │   │   ├── NavTabs.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Tab.jsx
│   │   │   └── index.js
│   │   ├── pages/         # Page-level components
│   │   │   ├── CardExplorer.jsx
│   │   │   ├── ComponentLibrary.jsx
│   │   │   └── index.js
│   │   ├── ui/            # UI primitives
│   │   │   ├── Chip.jsx
│   │   │   ├── CommandPalette.jsx
│   │   │   └── index.js
│   │   ├── ErrorBoundary.jsx
│   │   └── index.js       # Barrel export
│   ├── hooks/             # Custom React hooks
│   │   ├── useAnimeAnimations.js
│   │   ├── useCardHover.js
│   │   ├── useCommandPalette.js
│   │   ├── useWebGLShadow.js
│   │   └── index.js       # Barrel export
│   ├── utils/             # Utility functions
│   │   ├── cn.js
│   │   └── index.js       # Barrel export
│   ├── constants/         # Constants and configuration
│   │   └── index.js
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # React entry point
│   └── styles.css         # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## Keyboard Shortcuts

- `CMD+K` / `CTRL+K` - Open/close command palette
- `↑` / `↓` - Navigate command palette items
- `Enter` - Select command palette item
- `Escape` - Close command palette

## Technologies

- React 18
- Vite
- Framer Motion - Animation library
- Tailwind CSS - Utility-first CSS framework
- WebGL - Custom shader-based shadows
