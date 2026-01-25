import type { ComponentMeta } from '../types/component-meta'

/**
 * Component Registry
 *
 * Central registry of all design system components with their metadata.
 * Used by ComponentLibrary for documentation and by /component-forge
 * for discovery and similarity matching.
 */
export const componentRegistry: ComponentMeta[] = [
  // ===== UI PRIMITIVES =====
  {
    id: 'avatar',
    name: 'Avatar',
    category: 'ui',
    path: '@/components/avatar',
    purpose: {
      what: 'Display user or entity identity with consistent sizing and shape',
      where: 'Profile headers, comment threads, user lists, command palette rows',
      notFor: 'Decorative images (use img), logo marks, icon-only buttons'
    },
    variants: {
      size: { options: ['xs', 'sm', 'md', 'lg', 'xl'], default: 'md' },
      shape: { options: ['circle', 'rounded'], default: 'rounded' },
      variant: { options: ['default', 'placeholder'], default: 'default' }
    },
    composition: { uses: [], usedBy: ['CommandPaletteRow', 'Header', 'Sidebar'] },
    related: ['Chip'],
    guidelines: 'Circle shape for people/users, rounded for entities/logos'
  },
  {
    id: 'chip',
    name: 'Chip',
    category: 'ui',
    path: '@/components/chip',
    purpose: {
      what: 'Display status indicators, tags, or compact categorical information',
      where: 'Tables, cards, filters, tag lists, status displays',
      notFor: 'User identity (use Avatar), primary actions (use Button), navigation'
    },
    variants: {
      variant: { options: ['success', 'error', 'warning', 'info', 'neutral'], default: 'neutral' },
      filled: { options: ['true', 'false'], default: 'true' }
    },
    composition: { uses: [], usedBy: ['SummaryCard'] },
    related: ['Avatar'],
    guidelines: 'Use semantic variants for status indication'
  },
  {
    id: 'command-palette',
    name: 'CommandPalette',
    category: 'ui',
    path: '@/components/command-palette',
    purpose: {
      what: 'Global search and quick actions modal with keyboard navigation',
      where: 'App-level overlay, triggered by CMD+K, component library preview',
      notFor: 'In-page search (use SearchInput), form selection (use Select)'
    },
    variants: {
      isPreview: { options: ['true', 'false'], default: 'false' }
    },
    composition: { uses: ['CommandPaletteRow', 'Avatar'], usedBy: [] },
    related: [],
    guidelines: 'Always trap focus when open, support keyboard navigation'
  },
  {
    id: 'command-palette-row',
    name: 'CommandPaletteRow',
    category: 'ui',
    path: '@/components/command-palette-row',
    purpose: {
      what: 'Individual selectable row within CommandPalette for search results/actions',
      where: 'CommandPalette list items',
      notFor: 'Generic list items (use ListItem), table rows (use DataTable)'
    },
    variants: {
      variant: { options: ['single', 'double'], default: 'double' },
      isActive: { options: ['true', 'false'], default: 'false' },
      showPriceInfo: { options: ['true', 'false'], default: 'false' },
      avatarVariant: { options: ['default', 'placeholder'], default: 'default' }
    },
    composition: { uses: ['Avatar'], usedBy: ['CommandPalette'] },
    related: ['DataTable'],
    guidelines: 'Double variant for two-line content, single for action items'
  },
  {
    id: 'text-field',
    name: 'TextField',
    category: 'ui',
    path: '@/components/text-field',
    purpose: {
      what: 'Text input with glassmorphism styling for forms and search',
      where: 'Forms, search inputs, settings panels, command palette inputs',
      notFor: 'Dense data tables (use inline edit), read-only display (use text)'
    },
    variants: {
      size: { options: ['sm', 'md', 'lg'], default: 'md' }
    },
    composition: { uses: ['Base UI Field', 'Base UI Input'], usedBy: [] },
    related: ['CommandPalette'],
    guidelines: 'Built on Base UI Field/Input. Pass error string for validation state.'
  },

  // ===== CARDS =====
  {
    id: 'card',
    name: 'Card',
    category: 'cards',
    path: '@/components/card',
    purpose: {
      what: 'Base container with glassmorphism styling and hover effects',
      where: 'Dashboard sections, content grouping, feature highlights',
      notFor: 'Full-width sections (use Section), inline content (use Box)'
    },
    variants: {},
    composition: { uses: [], usedBy: ['SummaryCard', 'TopPredictorsCard'] },
    related: ['SummaryCard', 'TopPredictorsCard'],
    guidelines: 'Base component - extend via SummaryCard for status, TopPredictorsCard for data'
  },
  {
    id: 'summary-card',
    name: 'SummaryCard',
    category: 'cards',
    path: '@/components/summary-card',
    purpose: {
      what: 'Display key metrics with positive/negative sentiment glow',
      where: 'Dashboard KPI sections, performance summaries, trend highlights',
      notFor: 'Detailed data tables (use DataTable), neutral content (use Card)'
    },
    variants: {
      variant: { options: ['positive', 'negative'], default: 'positive' }
    },
    composition: { uses: ['Card', 'Chip'], usedBy: ['Dashboard'] },
    related: ['Card', 'KpiLayout', 'GaugeLayout'],
    guidelines: 'Use positive for upward trends, negative for downward trends'
  },
  {
    id: 'top-predictor-card',
    name: 'TopPredictorCard',
    category: 'cards',
    path: '@/components/top-predictor-card',
    purpose: {
      what: 'Display individual analyst predictor with ranking and metrics',
      where: 'TopPredictorsCard list, analyst rankings, leaderboards',
      notFor: 'Generic user profiles (use UserCard), simple stats (use SummaryCard)'
    },
    variants: {},
    composition: { uses: [], usedBy: ['TopPredictorsCard'] },
    related: ['TopPredictorsCard'],
    guidelines: 'Used as child of TopPredictorsCard'
  },
  {
    id: 'top-predictors-card',
    name: 'TopPredictorsCard',
    category: 'cards',
    path: '@/components/top-predictors-card',
    purpose: {
      what: 'Display ranked list of top analyst predictors in a card',
      where: 'Dashboard, analyst insights section',
      notFor: 'Generic leaderboards (extend this pattern), single predictor (use TopPredictorCard)'
    },
    variants: {},
    composition: { uses: ['Card', 'TopPredictorCard'], usedBy: ['Dashboard'] },
    related: ['Card', 'TopPredictorCard'],
    guidelines: 'Shows top 3 predictors by default'
  },

  // ===== CHARTS =====
  {
    id: 'area-chart',
    name: 'AreaChart',
    category: 'charts',
    path: '@/components/area-chart',
    purpose: {
      what: 'Display time-series or sequential data with filled area under line',
      where: 'Trend visualization, performance over time, volume displays',
      notFor: 'Comparisons (use BarChart), proportions (use GaugeLayout)'
    },
    variants: {
      color: { options: ['accent-green', 'accent-blue', 'accent-red', 'accent-yellow'], default: 'accent-green' },
      showLabels: { options: ['true', 'false'], default: 'true' },
      animated: { options: ['true', 'false'], default: 'true' }
    },
    composition: { uses: [], usedBy: [] },
    related: ['LineChart', 'BarChart'],
    guidelines: 'Use for trends with volume emphasis'
  },
  {
    id: 'bar-chart',
    name: 'BarChart',
    category: 'charts',
    path: '@/components/bar-chart',
    purpose: {
      what: 'Display categorical data comparison with vertical bars',
      where: 'Period comparisons, category breakdowns, discrete data',
      notFor: 'Trends over time (use AreaChart/LineChart), rankings (use HorizontalBarChart)'
    },
    variants: {
      color: { options: ['accent-green', 'accent-blue', 'accent-red', 'accent-yellow'], default: 'accent-green' },
      showLabels: { options: ['true', 'false'], default: 'true' },
      showValues: { options: ['true', 'false'], default: 'false' },
      animated: { options: ['true', 'false'], default: 'true' }
    },
    composition: { uses: [], usedBy: [] },
    related: ['HorizontalBarChart', 'AreaChart'],
    guidelines: 'Use for discrete category comparisons'
  },
  {
    id: 'horizontal-bar-chart',
    name: 'HorizontalBarChart',
    category: 'charts',
    path: '@/components/horizontal-bar-chart',
    purpose: {
      what: 'Display ranked/sorted data with horizontal bars and threshold coloring',
      where: 'Rankings, trust analysis, score comparisons, progress indicators',
      notFor: 'Time series (use AreaChart), vertical comparisons (use BarChart)'
    },
    variants: {
      sortOrder: { options: ['ascending', 'descending'], default: 'descending' },
      showLabels: { options: ['true', 'false'], default: 'true' },
      showEndLabel: { options: ['true', 'false'], default: 'false' },
      animated: { options: ['true', 'false'], default: 'true' }
    },
    composition: { uses: [], usedBy: ['Dashboard'] },
    related: ['BarChart', 'DataTable'],
    guidelines: 'Auto-colors based on thresholds (green ≥75%, yellow 65-74%, red <65%)'
  },
  {
    id: 'line-chart',
    name: 'LineChart',
    category: 'charts',
    path: '@/components/line-chart',
    purpose: {
      what: 'Display time-series or sequential data as a line with optional dots',
      where: 'Trend visualization, performance tracking, simple data series',
      notFor: 'Volume/area emphasis (use AreaChart), comparisons (use BarChart)'
    },
    variants: {
      color: { options: ['accent-green', 'accent-blue', 'accent-red', 'accent-yellow'], default: 'accent-green' },
      showLabels: { options: ['true', 'false'], default: 'true' },
      showDots: { options: ['true', 'false'], default: 'true' },
      animated: { options: ['true', 'false'], default: 'true' }
    },
    composition: { uses: [], usedBy: [] },
    related: ['AreaChart', 'BarChart'],
    guidelines: 'Use for simple trend lines without volume emphasis'
  },

  // ===== LAYOUT =====
  {
    id: 'dashboard',
    name: 'Dashboard',
    category: 'layout',
    path: '@/components/dashboard',
    purpose: {
      what: 'Main dashboard view with header, tabs, and content grid',
      where: 'Primary app view, stock/asset detail pages',
      notFor: 'Settings pages (use SettingsLayout), auth flows (use AuthLayout)'
    },
    variants: {
      activeTab: { options: ['Overview', 'Financials', 'Stories'], default: 'Financials' }
    },
    composition: { uses: ['Header', 'NavTabs', 'SummaryCard', 'Card', 'TopPredictorsCard', 'GaugeLayout', 'KpiLayout', 'HorizontalBarChart'], usedBy: [] },
    related: ['RightPanel'],
    guidelines: 'Main content area, pairs with Sidebar and optionally RightPanel'
  },
  {
    id: 'data-table',
    name: 'DataTable',
    category: 'layout',
    path: '@/components/data-table',
    purpose: {
      what: 'Display key/value pairs in a compact list format',
      where: 'Card bodies, detail panels, summary sections',
      notFor: 'Full data grids (use Table), editable data (use Form)'
    },
    variants: {},
    composition: { uses: [], usedBy: ['GaugeLayout', 'KpiLayout'] },
    related: ['GaugeLayout', 'KpiLayout'],
    guidelines: 'Use for read-only key/value displays'
  },
  {
    id: 'gauge-layout',
    name: 'GaugeLayout',
    category: 'layout',
    path: '@/components/gauge-layout',
    purpose: {
      what: 'Display donut chart with center value and supporting data table',
      where: 'SummaryCards, consensus displays, percentage breakdowns',
      notFor: 'Time series (use AreaChart), comparisons (use BarChart)'
    },
    variants: {},
    composition: { uses: ['DataTable'], usedBy: ['SummaryCard', 'Dashboard'] },
    related: ['KpiLayout', 'SummaryCard'],
    guidelines: 'Use for proportion/percentage displays with supporting metrics'
  },
  {
    id: 'kpi-layout',
    name: 'KpiLayout',
    category: 'layout',
    path: '@/components/kpi-layout',
    purpose: {
      what: 'Display large KPI boxes with supporting data table',
      where: 'SummaryCards, momentum displays, stat comparisons',
      notFor: 'Single metrics (use StatBox), charts (use GaugeLayout)'
    },
    variants: {},
    composition: { uses: ['DataTable'], usedBy: ['SummaryCard', 'Dashboard'] },
    related: ['GaugeLayout', 'SummaryCard'],
    guidelines: 'Use for 2-3 large KPI values with supporting data'
  },
  {
    id: 'modal',
    name: 'Modal',
    category: 'layout',
    path: '@/components/modal',
    purpose: {
      what: 'Full-screen or large overlay container for page-level content (Notion-style page-as-modal)',
      where: 'Viewing detailed content in overlay, company profiles, detail views without navigation',
      notFor: 'Simple confirmations (use Dialog), tooltips, dropdown menus, toasts'
    },
    variants: {
      size: { options: ['page', 'lg', 'md', 'sm'], default: 'page' },
      showClose: { options: ['true', 'false'], default: 'true' }
    },
    composition: { uses: ['Base UI Dialog'], usedBy: [] },
    related: ['CommandPalette', 'RightPanel'],
    guidelines: 'Use page size for full content layouts, sm for mobile/compact dialogs. Built on Base UI Dialog for accessibility (focus trap, escape to close, aria).'
  },
  {
    id: 'right-panel',
    name: 'RightPanel',
    category: 'layout',
    path: '@/components/right-panel',
    purpose: {
      what: 'Slide-in sidebar panel for contextual content and actions',
      where: 'Detail views, settings, filters, secondary navigation',
      notFor: 'Main navigation (use Sidebar), modals (use Modal), drawers (use Drawer)'
    },
    variants: {
      isOpen: { options: ['true', 'false'], default: 'false' }
    },
    composition: { uses: [], usedBy: [] },
    related: ['Dashboard', 'Sidebar', 'Modal'],
    guidelines: 'Use for contextual content that augments main view'
  },

  // ===== NAVIGATION =====
  {
    id: 'header',
    name: 'Header',
    category: 'navigation',
    path: '@/components/header',
    purpose: {
      what: 'Page header with title, subtitle, logo, and action area',
      where: 'Top of Dashboard, detail pages, any main content area',
      notFor: 'App-level navigation (use Sidebar), section headers (use SectionHeader)'
    },
    variants: {
      showLogo: { options: ['true', 'false'], default: 'true' }
    },
    composition: { uses: ['Avatar'], usedBy: ['Dashboard', 'ComponentLibrary'] },
    related: ['NavTabs'],
    guidelines: 'Often paired with NavTabs below'
  },
  {
    id: 'main-nav',
    name: 'MainNav',
    category: 'navigation',
    path: '@/components/main-nav',
    purpose: {
      what: 'Vertical icon+label navigation for Sidebar',
      where: 'Sidebar, app-level primary navigation',
      notFor: 'Horizontal tabs (use NavTabs), secondary nav (use SubNav)'
    },
    variants: {
      activeTab: { options: ['home', 'explore', 'settings'], default: 'home' }
    },
    composition: { uses: [], usedBy: ['Sidebar'] },
    related: ['Sidebar', 'NavTabs'],
    guidelines: 'Used inside Sidebar for primary app navigation'
  },
  {
    id: 'nav-tabs',
    name: 'NavTabs',
    category: 'navigation',
    path: '@/components/nav-tabs',
    purpose: {
      what: 'Horizontal pill-style tab navigation with responsive overflow',
      where: 'Below Header, content section navigation',
      notFor: 'Vertical navigation (use MainNav), page-level nav (use Sidebar)'
    },
    variants: {
      activeTab: { options: ['Overview', 'Stories', 'Financials'], default: 'Overview' }
    },
    composition: { uses: [], usedBy: ['Dashboard'] },
    related: ['Header', 'Tab', 'SubNav'],
    guidelines: 'Handles overflow with dropdown menu'
  },
  {
    id: 'sidebar',
    name: 'Sidebar',
    category: 'navigation',
    path: '@/components/sidebar',
    purpose: {
      what: 'Fixed left navigation with logo, main nav, and user avatar',
      where: 'App shell, persistent across all views',
      notFor: 'Contextual panels (use RightPanel), mobile nav (use MobileNav)'
    },
    variants: {},
    composition: { uses: ['MainNav', 'Avatar'], usedBy: [] },
    related: ['RightPanel', 'MainNav'],
    guidelines: 'Fixed position, always visible in desktop views'
  },
  {
    id: 'sub-nav',
    name: 'SubNav',
    category: 'navigation',
    path: '@/components/sub-nav',
    purpose: {
      what: 'Secondary navigation bar for contextual actions',
      where: 'Below primary navigation, section-specific controls',
      notFor: 'Primary navigation (use MainNav/NavTabs), breadcrumbs (use Breadcrumb)'
    },
    variants: {
      isVisible: { options: ['true', 'false'], default: 'true' }
    },
    composition: { uses: [], usedBy: [] },
    related: ['NavTabs', 'MainNav'],
    guidelines: 'Use for secondary/contextual navigation'
  },
  {
    id: 'tab',
    name: 'Tab',
    category: 'navigation',
    path: '@/components/tab',
    purpose: {
      what: 'Individual pill-style tab with hover glow effect',
      where: 'NavTabs, SubNav, any horizontal tab group',
      notFor: 'Buttons (use Button), links (use Link), vertical items (use NavItem)'
    },
    variants: {
      active: { options: ['true', 'false'], default: 'false' }
    },
    composition: { uses: [], usedBy: ['NavTabs'] },
    related: ['NavTabs', 'SubNav'],
    guidelines: 'Atomic tab component with hover effects'
  },

  // ===== PAGES =====
  {
    id: 'component-library',
    name: 'ComponentLibrary',
    category: 'pages',
    path: '@/components/component-library',
    purpose: {
      what: 'Interactive documentation and preview of all design system components',
      where: 'Accessed via command palette, developer/designer reference',
      notFor: 'Production UI (this is a development/documentation tool)'
    },
    variants: {},
    composition: { uses: ['Header'], usedBy: [] },
    related: ['CardExplorer'],
    guidelines: 'Development tool for component exploration'
  },
  {
    id: 'card-explorer',
    name: 'CardExplorer',
    category: 'pages',
    path: '@/components/card-explorer',
    purpose: {
      what: 'Visual exploration page for card effects and glassmorphism',
      where: 'Accessed via command palette, design exploration',
      notFor: 'Production UI (this is a development/exploration tool)'
    },
    variants: {},
    composition: { uses: [], usedBy: [] },
    related: ['ComponentLibrary'],
    guidelines: 'Experimental visual exploration tool'
  },

  // ===== UTILITY =====
  {
    id: 'error-boundary',
    name: 'ErrorBoundary',
    category: 'utility',
    path: '@/components/error-boundary',
    purpose: {
      what: 'Catch and display React errors gracefully with recovery option',
      where: 'Wrap around App or major sections to prevent full crashes',
      notFor: 'Form validation errors (use FormError), API errors (handle in component)'
    },
    variants: {},
    composition: { uses: [], usedBy: [] },
    related: [],
    guidelines: 'Wrap at App level or around major feature boundaries'
  }
]

/**
 * Find components by category
 */
export function getComponentsByCategory(category: ComponentMeta['category']): ComponentMeta[] {
  return componentRegistry.filter((c) => c.category === category)
}

/**
 * Find component by id
 */
export function getComponentById(id: string): ComponentMeta | undefined {
  return componentRegistry.find((c) => c.id === id)
}

/**
 * Search components by purpose keywords
 */
export function searchComponentsByPurpose(query: string): ComponentMeta[] {
  const lowerQuery = query.toLowerCase()
  return componentRegistry.filter(
    (c) =>
      c.purpose.what.toLowerCase().includes(lowerQuery) ||
      c.purpose.where.toLowerCase().includes(lowerQuery) ||
      c.name.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Find similar components by checking purpose overlap
 */
export function findSimilarComponents(purposeKeywords: string[]): ComponentMeta[] {
  const lowerKeywords = purposeKeywords.map((k) => k.toLowerCase())
  return componentRegistry.filter((c) => {
    const purposeText = `${c.purpose.what} ${c.purpose.where}`.toLowerCase()
    return lowerKeywords.some((keyword) => purposeText.includes(keyword))
  })
}

/**
 * Get all components that use a given component
 */
export function getComponentsUsing(componentId: string): ComponentMeta[] {
  return componentRegistry.filter((c) => c.composition.uses.includes(componentId))
}

/**
 * Get all components used by a given component
 */
export function getComponentsUsedBy(componentId: string): ComponentMeta[] {
  const component = getComponentById(componentId)
  if (!component) return []
  return component.composition.uses
    .map((id) => getComponentById(id))
    .filter((c): c is ComponentMeta => c !== undefined)
}
