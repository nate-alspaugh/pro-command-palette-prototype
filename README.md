# Command Palette Prototype

A React-based financial dashboard prototype featuring an interactive command palette with WebGL shadow effects.

## Features

- **React + Vite** - Modern React development with Vite
- **Command Palette** - Press `CMD+K` (or `CTRL+K`) to open
- **WebGL Shadows** - Custom shader-based gradient shadows
- **Interactive Animations** - Smooth hover effects and transitions using Anime.js
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
│   ├── components/      # React components
│   │   ├── Sidebar.jsx
│   │   ├── Dashboard.jsx
│   │   ├── CommandPalette.jsx
│   │   └── ...
│   ├── hooks/          # Custom React hooks
│   │   ├── useCommandPalette.js
│   │   ├── useWebGLShadow.js
│   │   ├── useCardHover.js
│   │   └── useAnimeAnimations.js
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # React entry point
│   └── styles.css      # Global styles
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
- Anime.js
- WebGL
