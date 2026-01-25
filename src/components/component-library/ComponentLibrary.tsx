import React, { useState, useMemo, useEffect } from 'react'

/**
 * @component ComponentLibrary
 * @purpose Interactive documentation and preview of all design system components
 * @where Accessed via command palette, developer/designer reference
 * @not-for Production UI (this is a development/documentation tool)
 *
 * @variant None (full-page view with search and detail modes)
 *
 * @uses All components for previews, Header
 * @related CardExplorer (visual exploration tool)
 */

import { getComponentById, searchComponentsByPurpose } from '../registry'
import type { ComponentMeta } from '../../types/component-meta'
import {
  SummaryCard,
  TopPredictorCard,
  GaugeLayout,
  KpiLayout,
  DataTable,
  Modal,
  RightPanel,
  Header,
  NavTabs,
  Tab,
  Sidebar,
  SubNav,
  Avatar,
  Chip,
  CommandPalette,
  CommandPaletteRow,
  TextField,
  AreaChart,
  BarChart,
  HorizontalBarChart,
  LineChart
} from '../'

// Design Tokens Component
const DesignTokens = () => {
  const textSizes = [
    { name: '2xs', value: '12px', tailwind: 'text-2xs' },
    { name: 'xs', value: '14px', tailwind: 'text-xs' },
    { name: 's', value: '16px', tailwind: 'text-s' },
    { name: 'm', value: '18px', tailwind: 'text-m' },
    { name: 'l', value: '20px', tailwind: 'text-l' },
    { name: 'xl', value: '24px', tailwind: 'text-xl' },
    { name: '2xl', value: '28px', tailwind: 'text-2xl' }
  ]

  const fontWeights = [
    { name: 'Book', value: '450', var: '--weight-book' },
    { name: 'Semi', value: '530', var: '--weight-semi' },
    { name: 'Bold', value: '700', var: '--weight-bold' }
  ]

  const semanticTextStyles = [
    { name: 'Title 4', size: '2xl', sizeValue: '28px', weight: '530', weightName: 'Semi' },
    { name: 'Title 3', size: 'xl', sizeValue: '24px', weight: '530', weightName: 'Semi' },
    { name: 'Title 2', size: 'l', sizeValue: '20px', weight: '450', weightName: 'Book' },
    { name: 'Title 1', size: 'm', sizeValue: '18px', weight: '450', weightName: 'Book' },
    { name: 'Paragraph 3', size: 's', sizeValue: '16px', weight: '450', weightName: 'Book' },
    { name: 'Paragraph 2', size: 'xs', sizeValue: '14px', weight: '450', weightName: 'Book' },
    { name: 'Paragraph 1', size: '2xs', sizeValue: '12px', weight: '450', weightName: 'Book' },
    { name: 'Action Label (s)', size: 's', sizeValue: '16px', weight: '450', weightName: 'Book' },
    { name: 'Action Label (xs)', size: 'xs', sizeValue: '14px', weight: '450', weightName: 'Book' },
    { name: 'Table Label', size: 'xs/2xs', sizeValue: '14px/12px', weight: '450', weightName: 'Book' },
    { name: 'Mono Label', size: 'varies', sizeValue: 'varies', weight: '700', weightName: 'Bold', special: 'Uppercase' }
  ]

  const spacingScale = [2, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40]

  const whiteAlpha = [
    { name: '100%', value: 'rgba(255, 255, 255, 1)', var: '--white-100' },
    { name: '90%', value: 'rgba(255, 255, 255, 0.9)', var: '--white-90' },
    { name: '80%', value: 'rgba(255, 255, 255, 0.8)', var: '--white-80' },
    { name: '70%', value: 'rgba(255, 255, 255, 0.7)', var: '--white-70' },
    { name: '60%', value: 'rgba(255, 255, 255, 0.6)', var: '--white-60' },
    { name: '50%', value: 'rgba(255, 255, 255, 0.5)', var: '--white-50' },
    { name: '40%', value: 'rgba(255, 255, 255, 0.4)', var: '--white-40' },
    { name: '30%', value: 'rgba(255, 255, 255, 0.3)', var: '--white-30' },
    { name: '20%', value: 'rgba(255, 255, 255, 0.2)', var: '--white-20' },
    { name: '10%', value: 'rgba(255, 255, 255, 0.1)', var: '--white-10' },
    { name: '5%', value: 'rgba(255, 255, 255, 0.05)', var: '--white-5' },
    { name: '2.5%', value: 'rgba(255, 255, 255, 0.025)', var: '--white-2-5' },
    { name: '0%', value: 'rgba(255, 255, 255, 0)', var: '--white-0' }
  ]

  const blackAlpha = [
    { name: '100%', value: 'rgba(0, 0, 0, 1)', var: '--black-100' },
    { name: '90%', value: 'rgba(0, 0, 0, 0.9)', var: '--black-90' },
    { name: '80%', value: 'rgba(0, 0, 0, 0.8)', var: '--black-80' },
    { name: '70%', value: 'rgba(0, 0, 0, 0.7)', var: '--black-70' },
    { name: '60%', value: 'rgba(0, 0, 0, 0.6)', var: '--black-60' },
    { name: '50%', value: 'rgba(0, 0, 0, 0.5)', var: '--black-50' },
    { name: '40%', value: 'rgba(0, 0, 0, 0.4)', var: '--black-40' },
    { name: '30%', value: 'rgba(0, 0, 0, 0.3)', var: '--black-30' },
    { name: '20%', value: 'rgba(0, 0, 0, 0.2)', var: '--black-20' },
    { name: '10%', value: 'rgba(0, 0, 0, 0.1)', var: '--black-10' },
    { name: '5%', value: 'rgba(0, 0, 0, 0.05)', var: '--black-5' },
    { name: '2.5%', value: 'rgba(0, 0, 0, 0.025)', var: '--black-2-5' },
    { name: '0%', value: 'rgba(0, 0, 0, 0)', var: '--black-0' }
  ]

  const borderRadius = [
    { name: '2px', value: '2px', usage: 'Small elements' },
    { name: '4px', value: '4px', usage: 'Standard elements' },
    { name: '8px', value: '8px', usage: 'Cards, containers' },
    { name: '12px', value: '12px', usage: 'Large cards' },
    { name: '16px', value: '16px', usage: 'Extra large containers' },
    { name: '9000', value: '9999px', usage: 'Full/Pill shape' }
  ]

  const borderTokens = [
    { name: 'border-default', value: 'var(--white-10)', description: 'Standard solid border - dividers, containers', type: 'solid' },
    { name: 'border-subtle', value: 'var(--white-5)', description: 'Subtle border - secondary elements', type: 'solid' },
    { name: 'border-glass', value: 'linear-gradient(45deg, white-10, white-5)', description: 'Gradient border - glass elements (cards, inputs)', type: 'gradient' }
  ]

  const semanticBorderTokens = [
    { name: 'card-border', references: '--border-glass', usage: 'Card gradient borders' },
    { name: 'input-border', references: '--border-glass', usage: 'Input gradient borders' },
    { name: 'input-border-focus', references: '--accent-blue', usage: 'Input focus state' },
    { name: 'input-border-error', references: '--accent-red', usage: 'Input error state' }
  ]

  const semanticColors = [
    { name: 'surface-0', value: '#0C0D0D', description: 'Base Gray' },
    { name: 'surface-1', value: 'rgba(255, 255, 255, 0.05)', description: 'White 5%' },
    { name: 'surface-2', value: 'rgba(255, 255, 255, 0.025)', description: 'White 2.5%' },
    { name: 'txt-primary', value: 'rgba(255, 255, 255, 0.9)', description: 'White 90%' },
    { name: 'txt-secondary', value: 'rgba(255, 255, 255, 0.6)', description: 'White 60%' },
    { name: 'txt-tertiary', value: 'rgba(255, 255, 255, 0.4)', description: 'White 40%' },
    { name: 'accent-green', value: '#10b981', description: 'Tailwind emerald-500' },
    { name: 'accent-blue', value: '#2563eb', description: 'Tailwind blue-600' },
    { name: 'accent-red', value: '#ef4444', description: 'Tailwind red-500' },
    { name: 'accent-yellow', value: '#facc15', description: 'Tailwind yellow-400' }
  ]

  return (
    <div className="flex flex-col gap-10 py-6">
      {/* Typography */}
      <section className="flex flex-col gap-6">
        <h3 className="text-[20px] font-[530] text-txt-primary m-0 pb-3 border-b border-surface-1">Typography</h3>
        
        <div className="flex flex-col gap-4">
          <h4 className="text-base font-[450] text-txt-secondary m-0">Font Families</h4>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
            <div className="bg-surface-2 border border-surface-1 rounded-lg p-4 flex flex-col gap-2">
              <div className="text-xs font-[530] text-txt-secondary uppercase tracking-wider">Primary (UI)</div>
              <div className="text-base font-[450] text-txt-primary" style={{ fontFamily: 'var(--font-ui)' }}>General Sans</div>
              <div className="text-xs font-mono text-txt-tertiary mt-1">--font-ui</div>
            </div>
            <div className="bg-surface-2 border border-surface-1 rounded-lg p-4 flex flex-col gap-2">
              <div className="text-xs font-[530] text-txt-secondary uppercase tracking-wider">Mono (Numbers/Data)</div>
              <div className="text-base font-[450] text-txt-primary font-mono">JetBrains Mono</div>
              <div className="text-xs font-mono text-txt-tertiary mt-1">--font-mono</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-base font-[450] text-txt-secondary m-0">Font Weights</h4>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
            {fontWeights.map(fw => (
              <div key={fw.name} className="bg-surface-2 border border-surface-1 rounded-lg p-4 flex flex-col gap-2">
                <div className="text-xs font-[530] text-txt-secondary uppercase tracking-wider">{fw.name}</div>
                <div className="text-base text-txt-primary font-mono" style={{ fontWeight: fw.value }}>{fw.value}</div>
                <div className="text-xs font-mono text-txt-tertiary mt-1">{fw.var}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-base font-[450] text-txt-secondary m-0">Font Sizes</h4>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
            {textSizes.map(size => (
              <div key={size.name} className="bg-surface-2 border border-surface-1 rounded-lg p-4 flex flex-col gap-2">
                <div className="text-xs font-[530] text-txt-secondary uppercase tracking-wider">{size.name}</div>
                <div className="text-txt-primary font-mono" style={{ fontSize: size.value }}>{size.value}</div>
                <div className="text-xs font-mono text-txt-tertiary mt-1">{size.tailwind}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-base font-[450] text-txt-secondary m-0">Semantic Text Styles</h4>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
            {semanticTextStyles.map(style => (
              <div key={style.name} className="bg-surface-2 border border-surface-1 rounded-lg p-4 flex flex-col gap-2">
                <div className="text-xs font-[530] text-txt-secondary uppercase tracking-wider">{style.name}</div>
                <div 
                  className="text-txt-primary" 
                  style={{ 
                    fontSize: style.sizeValue.includes('/') ? '14px' : style.sizeValue,
                    fontWeight: style.weight,
                    fontFamily: style.name === 'Mono Label' ? 'var(--font-mono)' : 'var(--font-ui)',
                    textTransform: style.special === 'Uppercase' ? 'uppercase' : 'none'
                  }}
                >
                  {style.name === 'Mono Label' ? 'MONO LABEL' : style.name}
                </div>
                <div className="flex flex-col gap-1 mt-1">
                  <div className="text-xs font-mono text-txt-tertiary">size: {style.size}</div>
                  <div className="text-xs font-mono text-txt-tertiary">weight: {style.weightName} ({style.weight})</div>
                  {style.special && (
                    <div className="text-xs font-mono text-txt-tertiary">{style.special}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-base font-[450] text-txt-secondary m-0">Line Heights</h4>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
            <div className="bg-surface-2 border border-surface-1 rounded-lg p-4 flex flex-col gap-2">
              <div className="text-xs font-[530] text-txt-secondary uppercase tracking-wider">Single-line</div>
              <div className="text-base text-txt-primary leading-none">100% (1.0)</div>
              <div className="text-xs font-mono text-txt-tertiary mt-1">leading-none</div>
            </div>
            <div className="bg-surface-2 border border-surface-1 rounded-lg p-4 flex flex-col gap-2">
              <div className="text-xs font-[530] text-txt-secondary uppercase tracking-wider">Multi-line</div>
              <div className="text-base text-txt-primary leading-relaxed">150% (1.5)</div>
              <div className="text-xs font-mono text-txt-tertiary mt-1">leading-relaxed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Spacing */}
      <section className="flex flex-col gap-6">
        <h3 className="text-[20px] font-[530] text-txt-primary m-0 pb-3 border-b border-surface-1">Spacing</h3>
        <div className="flex flex-col gap-4">
          <h4 className="text-base font-[450] text-txt-secondary m-0">Spacing Scale (px)</h4>
          <div className="flex flex-wrap gap-4 items-end p-6 bg-surface-2 border border-surface-1 rounded-lg">
            {spacingScale.map(spacing => (
              <div key={spacing} className="flex flex-col items-center gap-2">
                <div className="bg-accent-blue rounded-sm" style={{ width: `${spacing}px`, height: `${spacing}px`, minWidth: '2px', minHeight: '2px' }}></div>
                <div className="text-xs font-mono text-txt-secondary">{spacing}px</div>
              </div>
            ))}
          </div>
          <div className="text-xs text-txt-tertiary italic mt-2">Base unit: 4px | Smallest exception: 2px</div>
        </div>
      </section>

      {/* Colors */}
      <section className="flex flex-col gap-6">
        <h3 className="text-[20px] font-[530] text-txt-primary m-0 pb-3 border-b border-surface-1">Colors</h3>
        
        <div className="flex flex-col gap-4">
          <h4 className="text-base font-[450] text-txt-secondary m-0">Semantic Colors</h4>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
            {semanticColors.map(color => (
              <div key={color.name} className="bg-surface-2 border border-surface-1 rounded-lg p-4 flex flex-col gap-2">
                <div className="text-xs font-[530] text-txt-secondary uppercase tracking-wider">{color.name}</div>
                <div className="w-full h-12 rounded border border-surface-1 my-2" style={{ backgroundColor: color.value }}></div>
                <div className="text-base font-[450] text-txt-primary font-mono">{color.value}</div>
                <div className="text-xs text-txt-tertiary italic">{color.description}</div>
                <div className="text-xs font-mono text-txt-tertiary mt-1">--{color.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-base font-[450] text-txt-secondary m-0">White Alpha Scale</h4>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3 p-6 bg-surface-2 border border-surface-1 rounded-lg">
            {whiteAlpha.map(alpha => (
              <div key={alpha.name} className="flex flex-col items-center gap-2">
                <div className="w-full h-10 rounded border border-surface-1 bg-surface-0" style={{ backgroundColor: alpha.value }}></div>
                <div className="text-xs font-[530] text-txt-primary font-mono">{alpha.name}</div>
                <div className="text-[10px] font-mono text-txt-tertiary text-center">{alpha.var}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-base font-[450] text-txt-secondary m-0">Black Alpha Scale</h4>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3 p-6 bg-surface-2 border border-surface-1 rounded-lg">
            {blackAlpha.map(alpha => (
              <div key={alpha.name} className="flex flex-col items-center gap-2">
                <div className="w-full h-10 rounded border border-surface-1 bg-white" style={{ backgroundColor: alpha.value }}></div>
                <div className="text-xs font-[530] text-txt-primary font-mono">{alpha.name}</div>
                <div className="text-[10px] font-mono text-txt-tertiary text-center">{alpha.var}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Borders */}
      <section className="flex flex-col gap-6">
        <h3 className="text-[20px] font-[530] text-txt-primary m-0 pb-3 border-b border-surface-1">Borders</h3>
        
        <div className="flex flex-col gap-4">
          <h4 className="text-base font-[450] text-txt-secondary m-0">Border Width</h4>
          <div className="bg-surface-2 border border-surface-1 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-2">
                <div className="text-xs font-[530] text-txt-secondary uppercase tracking-wider">Default</div>
                <div className="w-32 h-16 bg-surface-0 rounded border" style={{ borderWidth: '1px', borderColor: 'rgba(255, 255, 255, 0.1)' }}></div>
                <div className="text-xs font-mono text-txt-tertiary">1px</div>
              </div>
              <div className="text-xs text-txt-tertiary italic">Strictly applied to all bordered elements</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-base font-[450] text-txt-secondary m-0">Border Radius</h4>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
            {borderRadius.map(radius => (
              <div key={radius.name} className="bg-surface-2 border border-surface-1 rounded-lg p-4 flex flex-col gap-3">
                <div className="text-xs font-[530] text-txt-secondary uppercase tracking-wider">{radius.name}</div>
                <div className="w-full h-16 bg-surface-0" style={{ borderRadius: radius.value }}></div>
                <div className="text-xs font-mono text-txt-tertiary">{radius.value}</div>
                <div className="text-xs text-txt-tertiary italic">{radius.usage}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-base font-[450] text-txt-secondary m-0">Base Border Tokens</h4>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
            {borderTokens.map(token => (
              <div key={token.name} className="bg-surface-2 border border-surface-1 rounded-lg p-4 flex flex-col gap-3">
                <div className="text-xs font-[530] text-txt-secondary uppercase tracking-wider">{token.name}</div>
                <div className="w-full h-12 bg-surface-0 rounded-lg relative" style={
                  token.type === 'gradient' ? {
                    background: 'var(--card-bg-0)',
                    backdropFilter: 'blur(200px)'
                  } : {}
                }>
                  {token.type === 'gradient' ? (
                    <div className="absolute inset-0 rounded-lg pointer-events-none" style={{
                      padding: '1px',
                      background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'exclude'
                    }}></div>
                  ) : (
                    <div className="absolute inset-0 rounded-lg border" style={{
                      borderColor: token.name === 'border-default' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)'
                    }}></div>
                  )}
                </div>
                <div className="text-xs text-txt-tertiary italic">{token.description}</div>
                <div className="text-xs font-mono text-txt-tertiary">--{token.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-base font-[450] text-txt-secondary m-0">Semantic Border Tokens</h4>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
            {semanticBorderTokens.map(token => (
              <div key={token.name} className="bg-surface-2 border border-surface-1 rounded-lg p-4 flex flex-col gap-2">
                <div className="text-xs font-[530] text-txt-secondary uppercase tracking-wider">{token.name}</div>
                <div className="text-xs text-txt-tertiary italic">{token.usage}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-txt-tertiary">→</span>
                  <span className="text-xs font-mono text-txt-primary">{token.references}</span>
                </div>
                <div className="text-xs font-mono text-txt-tertiary">--{token.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}

// Type definitions
interface ComponentProperty {
  id: string
  name: string
  type: 'select' | 'boolean' | 'text'
  options?: (string | number)[]
  default?: string | number | boolean
}

interface ComponentDefinition {
  id: string
  name: string
  category: string
  properties?: ComponentProperty[]
  render: (props: Record<string, any>) => React.ReactElement
  wide?: boolean
  fullPreview?: boolean // Hides properties panel, shows full-width preview
}

interface ComponentLibraryProps {
  initialComponentId?: string | null
  onNavigate?: (id: string | null) => void
}

const componentsList: ComponentDefinition[] = [
  {
    id: 'design-tokens',
    name: 'Design Tokens',
    category: 'Foundation',
    properties: [],
    render: () => <DesignTokens />
  },
  {
    id: 'avatar',
    name: 'Avatar',
    category: 'Elements',
    properties: [
      { id: 'size', name: 'Size', type: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'], default: 'md' },
      { id: 'shape', name: 'Shape', type: 'select', options: ['circle', 'rounded'], default: 'rounded' },
      { id: 'type', name: 'Type', type: 'select', options: ['logo', 'user'], default: 'logo' },
      { id: 'content', name: 'Content', type: 'text', default: 'JM' }
    ],
    render: (props) => {
      const className = props.type === 'logo' ? 'avatar-logo' : 'avatar-user'
      const content = props.type === 'logo' ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          <path d="M2 2h20v20H2z"/>
          <path d="M7 7h10v10H7z" fill="#000"/>
        </svg>
      ) : props.content
      
      return (
        <Avatar size={props.size} shape={props.shape} className={className}>
          {content}
        </Avatar>
      )
    }
  },
  {
    id: 'chip',
    name: 'Chip',
    category: 'Elements',
    properties: [
      { id: 'variant', name: 'Variant', type: 'select', options: ['success', 'error', 'warning', 'info', 'neutral'], default: 'success' },
      { id: 'filled', name: 'Filled', type: 'boolean', default: true },
      { id: 'label', name: 'Label', type: 'select', options: ['BUY', 'SELL', 'HOLD', 'BEARISH', 'UPGRADE', 'DOWNGRADE'], default: 'BUY' }
    ],
    render: (props) => (
      <Chip variant={props.variant} filled={props.filled}>
        {props.label}
      </Chip>
    )
  },
  {
    id: 'button-primary',
    name: 'Button Primary',
    category: 'Elements',
    properties: [
      { id: 'label', name: 'Label', type: 'text', default: 'Primary Button' }
    ],
    render: (props) => (
      <button className="btn-primary">
        {props.label}
      </button>
    )
  },
  {
    id: 'button-secondary',
    name: 'Button Secondary',
    category: 'Elements',
    properties: [
      { id: 'label', name: 'Label', type: 'text', default: 'Secondary Button' }
    ],
    render: (props) => (
      <button className="btn-secondary">
        {props.label}
      </button>
    )
  },
  {
    id: 'command-palette',
    name: 'Command Palette',
    category: 'Navigation',
    properties: [],
    render: () => (
      <div style={{ width: '100%', maxWidth: '700px', position: 'relative' }}>
        <CommandPalette isOpen={true} onClose={() => {}} setView={() => {}} isPreview={true} />
      </div>
    ),
    wide: true
  },
  {
    id: 'command-palette-row',
    name: 'Command Palette Row',
    category: 'Navigation',
    properties: [
      { id: 'symbol', name: 'Symbol', type: 'text', default: 'RBLX' },
      { id: 'company', name: 'Company', type: 'text', default: 'ROBLOX CORP' },
      { id: 'variant', name: 'Variant', type: 'select', options: ['single', 'double'], default: 'double' },
      { id: 'showPriceInfo', name: 'Show Price Info', type: 'boolean', default: false },
      { id: 'price', name: 'Price', type: 'text', default: '$128.11' },
      { id: 'change', name: 'Change', type: 'text', default: '-0.35%' },
      { id: 'showKeyboardShortcut', name: 'Show Keyboard Shortcut', type: 'boolean', default: false },
      { id: 'keyboardShortcut', name: 'Keyboard Shortcut', type: 'text', default: 'G C' },
      { id: 'initialsType', name: 'Initials Type', type: 'select', options: ['first', 'both'], default: 'first' }
    ],
    render: (props) => (
      <ul className="cp-list" style={{ width: '100%', maxWidth: '600px', background: 'var(--surface-0)', padding: '8px', borderRadius: '12px' }}>
        <CommandPaletteRow
          symbol={props.symbol}
          company={props.company}
          variant={props.variant}
          showPriceInfo={props.showPriceInfo}
          price={props.price}
          change={props.change}
          showKeyboardShortcut={props.showKeyboardShortcut}
          keyboardShortcut={props.keyboardShortcut}
          initialsType={props.initialsType}
        />
      </ul>
    ),
    wide: true
  },
  {
    id: 'text-field',
    name: 'Text Field',
    category: 'Elements',
    properties: [
      { id: 'size', name: 'Size', type: 'select', options: ['sm', 'md', 'lg'], default: 'md' },
      { id: 'disabled', name: 'Disabled', type: 'boolean', default: false },
      { id: 'label', name: 'Label', type: 'text', default: 'Label' },
      { id: 'placeholder', name: 'Placeholder', type: 'text', default: 'Enter text...' },
      { id: 'helperText', name: 'Helper Text', type: 'text', default: '' },
      { id: 'error', name: 'Error Message', type: 'text', default: '' }
    ],
    render: (props) => (
      <div style={{ width: '100%', maxWidth: '320px' }}>
        <TextField
          size={props.size}
          disabled={props.disabled}
          label={props.label || undefined}
          placeholder={props.placeholder}
          helperText={props.helperText || undefined}
          error={props.error || undefined}
        />
      </div>
    )
  },
  {
    id: 'summary-card',
    name: 'Summary Card',
    category: 'Cards',
    properties: [
      { id: 'variant', name: 'Variant', type: 'select', options: ['positive', 'negative'], default: 'positive' },
      { id: 'layout', name: 'Layout', type: 'select', options: ['gauge', 'kpi'], default: 'gauge' },
      { id: 'showBadge', name: 'Show Badge', type: 'boolean', default: true }
    ],
    render: (props) => {
      const isGauge = props.layout === 'gauge'
      const tableItems = isGauge ? [
        { label: 'Target price', value: '$132.94' },
        { label: 'Agreement', value: '94%' },
        { label: 'Confidence', value: '92%' },
        { label: 'Stability', value: '82%' }
      ] : [
        { label: 'Net change', value: '-1' },
        { label: 'Velocity', value: '-100%' },
        { label: 'Price target momentum', value: '-2273%' }
      ]

      return (
        <SummaryCard 
          title={isGauge ? "Analyst consensus" : "Rating momentum"} 
          badge={props.showBadge ? (props.variant === 'positive' ? "BUY" : "BEARISH") : null} 
          variant={props.variant}
        >
          {isGauge ? (
            <GaugeLayout 
              data={[
                { value: 88, color: 'accent-green', label: 'BUY' },
                { value: 12, color: 'muted', label: 'Other' }
              ]}
              centerValue="88%"
              centerLabel="BUY"
              tableItems={tableItems} 
            />
          ) : (
            <KpiLayout 
              kpis={[
                { label: 'UPGRADES', value: '0' },
                { label: 'DOWNGRADES', value: '1', colorClass: props.variant === 'negative' ? 'text-red' : '' }
              ]}
              tableItems={tableItems}
            />
          )}
        </SummaryCard>
      )
    }
  },
  {
    id: 'top-predictor-card',
    name: 'Top Predictor Card',
    category: 'Cards',
    properties: [
      { id: 'rank', name: 'Rank', type: 'select', options: ['1st', '2nd', '3rd'], default: '1st' },
      { id: 'accuracy', name: 'Accuracy %', type: 'select', options: ['86', '75', '73', '65', '50'], default: '86' },
      { id: 'accuracyColor', name: 'Accuracy Color', type: 'select', options: ['accent-green', 'accent-yellow', 'accent-red'], default: 'accent-green' }
    ],
    render: (props) => (
      <TopPredictorCard 
        rank={props.rank}
        accuracy={parseInt(props.accuracy)}
        accuracyColor={props.accuracyColor}
        name="Nick Mckay"
        firm="Freedom Capital Markets"
        smartScore={88}
        smartScoreColor={props.accuracyColor}
        sampleSize="56 PREDICTIONS"
        avgError="±23.4%"
      />
    )
  },
  {
    id: 'bar-chart',
    name: 'Bar Chart',
    category: 'Charts',
    properties: [
      { id: 'color', name: 'Color', type: 'select', options: ['accent-green', 'accent-blue', 'accent-red', 'accent-yellow'], default: 'accent-green' },
      { id: 'showLabels', name: 'Show Labels', type: 'boolean', default: true },
      { id: 'showValues', name: 'Show Values', type: 'boolean', default: false }
    ],
    render: (props) => (
      <BarChart 
        color={props.color}
        showLabels={props.showLabels}
        showValues={props.showValues}
      />
    )
  },
  {
    id: 'horizontal-bar-chart',
    name: 'Horizontal Bar Chart',
    category: 'Charts',
    properties: [
      { id: 'showLabels', name: 'Show Labels', type: 'boolean', default: true },
      { id: 'showEndLabel', name: 'Show End Label', type: 'boolean', default: false },
      { id: 'sortOrder', name: 'Sort Order', type: 'select', options: ['descending', 'ascending'], default: 'descending' }
    ],
    render: (props) => (
      <HorizontalBarChart 
        showLabels={props.showLabels}
        showEndLabel={props.showEndLabel}
        sortOrder={props.sortOrder}
      />
    )
  },
  {
    id: 'line-chart',
    name: 'Line Chart',
    category: 'Charts',
    properties: [
      { id: 'color', name: 'Color', type: 'select', options: ['accent-green', 'accent-blue', 'accent-red', 'accent-yellow'], default: 'accent-blue' },
      { id: 'showLabels', name: 'Show Labels', type: 'boolean', default: true },
      { id: 'showDots', name: 'Show Dots', type: 'boolean', default: true }
    ],
    render: (props) => (
      <LineChart 
        color={props.color}
        showLabels={props.showLabels}
        showDots={props.showDots}
      />
    )
  },
  {
    id: 'area-chart',
    name: 'Area Chart',
    category: 'Charts',
    properties: [
      { id: 'color', name: 'Color', type: 'select', options: ['accent-green', 'accent-blue', 'accent-red', 'accent-yellow'], default: 'accent-green' },
      { id: 'showLabels', name: 'Show Labels', type: 'boolean', default: true }
    ],
    render: (props) => (
      <AreaChart 
        color={props.color}
        showLabels={props.showLabels}
      />
    )
  },
  {
    id: 'donut-chart',
    name: 'Donut Chart',
    category: 'Charts',
    properties: [
      { id: 'numSegments', name: 'Number of Segments', type: 'select', options: [1, 2, 3, 4, 5, 6, 7, 8], default: 3 },
      { id: 'segment1Value', name: 'Segment 1 Value', type: 'select', options: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100], default: 40 },
      { id: 'segment1Color', name: 'Segment 1 Color', type: 'select', options: ['accent-green', 'accent-blue', 'accent-red', 'accent-yellow', 'muted'], default: 'accent-green' },
      { id: 'segment2Value', name: 'Segment 2 Value', type: 'select', options: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100], default: 35 },
      { id: 'segment2Color', name: 'Segment 2 Color', type: 'select', options: ['accent-green', 'accent-blue', 'accent-red', 'accent-yellow', 'muted'], default: 'accent-blue' },
      { id: 'segment3Value', name: 'Segment 3 Value', type: 'select', options: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100], default: 25 },
      { id: 'segment3Color', name: 'Segment 3 Color', type: 'select', options: ['accent-green', 'accent-blue', 'accent-red', 'accent-yellow', 'muted'], default: 'accent-yellow' },
      { id: 'segment4Value', name: 'Segment 4 Value', type: 'select', options: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100], default: 0 },
      { id: 'segment4Color', name: 'Segment 4 Color', type: 'select', options: ['accent-green', 'accent-blue', 'accent-red', 'accent-yellow', 'muted'], default: 'accent-red' },
      { id: 'segment5Value', name: 'Segment 5 Value', type: 'select', options: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100], default: 0 },
      { id: 'segment5Color', name: 'Segment 5 Color', type: 'select', options: ['accent-green', 'accent-blue', 'accent-red', 'accent-yellow', 'muted'], default: 'accent-green' },
      { id: 'segment6Value', name: 'Segment 6 Value', type: 'select', options: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100], default: 0 },
      { id: 'segment6Color', name: 'Segment 6 Color', type: 'select', options: ['accent-green', 'accent-blue', 'accent-red', 'accent-yellow', 'muted'], default: 'accent-blue' },
      { id: 'segment7Value', name: 'Segment 7 Value', type: 'select', options: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100], default: 0 },
      { id: 'segment7Color', name: 'Segment 7 Color', type: 'select', options: ['accent-green', 'accent-blue', 'accent-red', 'accent-yellow', 'muted'], default: 'accent-red' },
      { id: 'segment8Value', name: 'Segment 8 Value', type: 'select', options: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100], default: 0 },
      { id: 'segment8Color', name: 'Segment 8 Color', type: 'select', options: ['accent-green', 'accent-blue', 'accent-red', 'accent-yellow', 'muted'], default: 'accent-yellow' },
      { id: 'centerLabel', name: 'Center Label', type: 'text', default: 'Total' },
      { id: 'showTable', name: 'Show Data Table', type: 'boolean', default: false }
    ],
    render: (props) => {
      const numSegments = parseInt(String(props.numSegments || 3))
      const segments: Array<{ value: number; color: string; label: string }> = []
      
      for (let i = 1; i <= 8; i++) {
        if (i <= numSegments) {
          const value = parseInt(String(props[`segment${i}Value`] || 0))
          if (value > 0) {
            segments.push({
              value: value,
              color: String(props[`segment${i}Color`] || 'muted'),
              label: `Segment ${i}`
            })
          }
        }
      }
      
      const total = segments.reduce((sum, seg) => sum + seg.value, 0)
      const tableItems = props.showTable ? [
        ...segments.map((seg, idx) => ({ label: `Segment ${idx + 1}`, value: `${seg.value}` })),
        { label: 'Total', value: `${total}` }
      ] : []
      
      return (
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <GaugeLayout
            data={segments}
            centerValue={total.toString()}
            centerLabel={String(props.centerLabel || 'Total')}
            tableItems={tableItems}
          />
        </div>
      )
    }
  },
  {
    id: 'data-table',
    name: 'Data Table',
    category: 'Tables',
    properties: [
      { id: 'numRows', name: 'Number of Rows', type: 'select', options: [1, 2, 3, 4, 5, 6, 7, 8], default: 4 },
      { id: 'row1Label', name: 'Row 1 Label', type: 'text', default: 'Target price' },
      { id: 'row1Value', name: 'Row 1 Value', type: 'text', default: '$132.94' },
      { id: 'row1Color', name: 'Row 1 Value Color', type: 'select', options: ['default', 'text-red', 'text-green'], default: 'default' },
      { id: 'row2Label', name: 'Row 2 Label', type: 'text', default: 'Agreement' },
      { id: 'row2Value', name: 'Row 2 Value', type: 'text', default: '94%' },
      { id: 'row2Color', name: 'Row 2 Value Color', type: 'select', options: ['default', 'text-red', 'text-green'], default: 'default' },
      { id: 'row3Label', name: 'Row 3 Label', type: 'text', default: 'Confidence' },
      { id: 'row3Value', name: 'Row 3 Value', type: 'text', default: '92%' },
      { id: 'row3Color', name: 'Row 3 Value Color', type: 'select', options: ['default', 'text-red', 'text-green'], default: 'default' },
      { id: 'row4Label', name: 'Row 4 Label', type: 'text', default: 'Stability' },
      { id: 'row4Value', name: 'Row 4 Value', type: 'text', default: '82%' },
      { id: 'row4Color', name: 'Row 4 Value Color', type: 'select', options: ['default', 'text-red', 'text-green'], default: 'default' },
      { id: 'row5Label', name: 'Row 5 Label', type: 'text', default: 'Net change' },
      { id: 'row5Value', name: 'Row 5 Value', type: 'text', default: '-1' },
      { id: 'row5Color', name: 'Row 5 Value Color', type: 'select', options: ['default', 'text-red', 'text-green'], default: 'text-red' },
      { id: 'row6Label', name: 'Row 6 Label', type: 'text', default: 'Velocity' },
      { id: 'row6Value', name: 'Row 6 Value', type: 'text', default: '-100%' },
      { id: 'row6Color', name: 'Row 6 Value Color', type: 'select', options: ['default', 'text-red', 'text-green'], default: 'default' },
      { id: 'row7Label', name: 'Row 7 Label', type: 'text', default: 'Momentum' },
      { id: 'row7Value', name: 'Row 7 Value', type: 'text', default: 'Positive' },
      { id: 'row7Color', name: 'Row 7 Value Color', type: 'select', options: ['default', 'text-red', 'text-green'], default: 'default' },
      { id: 'row8Label', name: 'Row 8 Label', type: 'text', default: 'Status' },
      { id: 'row8Value', name: 'Row 8 Value', type: 'text', default: 'Active' },
      { id: 'row8Color', name: 'Row 8 Value Color', type: 'select', options: ['default', 'text-red', 'text-green'], default: 'default' }
    ],
    render: (props) => {
      const numRows = parseInt(String(props.numRows || 4))
      const items: Array<{ label: string; value: string; colorClass: string }> = []
      
      for (let i = 1; i <= 8; i++) {
        if (i <= numRows) {
          const colorClass = props[`row${i}Color`] === 'default' ? '' : String(props[`row${i}Color`] || '')
          items.push({
            label: String(props[`row${i}Label`] || `Row ${i}`),
            value: String(props[`row${i}Value`] || ''),
            colorClass: colorClass
          })
        }
      }
      
      return (
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <DataTable items={items} />
        </div>
      )
    }
  },
  {
    id: 'tab',
    name: 'Tab',
    category: 'Navigation',
    properties: [
      { id: 'active', name: 'Active', type: 'boolean', default: false },
      { id: 'label', name: 'Label', type: 'select', options: ['Overview', 'Stories', 'Market Predictions', 'Monitors', 'People', 'Financials', 'Company Info', 'Related'], default: 'Overview' }
    ],
    render: (props) => (
      <nav className="pill-row">
        <Tab active={props.active}>{props.label}</Tab>
      </nav>
    )
  },
  {
    id: 'tab-rail',
    name: 'Tab Rail',
    category: 'Navigation',
    properties: [],
    render: () => <NavTabs />,
    wide: true // Mark as wide component for scaling
  },
  {
    id: 'modal',
    name: 'Modal',
    category: 'Layouts',
    properties: [
      { id: 'size', name: 'Size', type: 'select', options: ['page', 'lg', 'md', 'sm'], default: 'md' },
      { id: 'showClose', name: 'Show Close Button', type: 'boolean', default: true }
    ],
    render: (props) => (
      <Modal
        isOpen={true}
        onClose={() => {}}
        size={props.size}
        showClose={props.showClose}
        isPreview={true}
      >
        <div style={{ padding: '60px 40px', minHeight: '300px' }}>
          <Header title="Company Profile" subtitle="RBLX" showLogo={true} />
          <div style={{ marginTop: '24px', color: 'var(--txt-secondary)', fontSize: '14px' }}>
            This modal can contain any page-level content including headers, navigation tabs, cards, charts, and scrollable content areas. It's designed for the "page-as-modal" pattern (like Notion).
          </div>
          <div style={{
            marginTop: '24px',
            padding: '40px',
            background: 'var(--surface-1)',
            borderRadius: '12px',
            border: '1px dashed var(--txt-tertiary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--txt-tertiary)',
            fontSize: '14px'
          }}>
            Content Area (Dashboard, forms, data tables, etc.)
          </div>
        </div>
      </Modal>
    )
  },
  {
    id: 'layout-full',
    name: 'Layout: Full (Sub Nav + Side Panel)',
    category: 'Layouts',
    properties: [],
    fullPreview: true,
    render: () => (
      <div className="app-layout-preview">
        <div className="app-layout-preview-inner">
          <Sidebar />
          <SubNav isVisible={true} />
          <div className="preview-main-content with-subnav with-panel">
            <div className="preview-content-placeholder">
              <span className="action-label-sm">General Content Area</span>
            </div>
          </div>
          <RightPanel isOpen={true} onClose={() => {}} />
        </div>
      </div>
    )
  },
  {
    id: 'layout-panel-only',
    name: 'Layout: Side Panel Only',
    category: 'Layouts',
    properties: [],
    fullPreview: true,
    render: () => (
      <div className="app-layout-preview">
        <div className="app-layout-preview-inner">
          <Sidebar />
          <div className="preview-main-content with-panel">
            <div className="preview-content-placeholder">
              <span className="action-label-sm">General Content Area</span>
            </div>
          </div>
          <RightPanel isOpen={true} onClose={() => {}} />
        </div>
      </div>
    )
  },
  {
    id: 'layout-subnav-only',
    name: 'Layout: Sub Nav Only',
    category: 'Layouts',
    properties: [],
    fullPreview: true,
    render: () => (
      <div className="app-layout-preview">
        <div className="app-layout-preview-inner">
          <Sidebar />
          <SubNav isVisible={true} />
          <div className="preview-main-content with-subnav">
            <div className="preview-content-placeholder">
              <span className="action-label-sm">General Content Area</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
]

const ComponentLibrary = ({ initialComponentId, onNavigate }: ComponentLibraryProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedComponentId, setSelectedComponentId] = useState<string | null | undefined>(initialComponentId)
  const [componentProps, setComponentProps] = useState<Record<string, any>>({})

  // Purpose editing state - saves to files via API
  interface PurposeData {
    what: string
    where: string
    notFor: string
  }
  const [isEditingPurpose, setIsEditingPurpose] = useState(false)
  const [editedPurpose, setEditedPurpose] = useState<PurposeData>({ what: '', where: '', notFor: '' })
  const [isSavingPurpose, setIsSavingPurpose] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const handleSavePurpose = async (componentId: string): Promise<void> => {
    setIsSavingPurpose(true)
    setSaveError(null)

    try {
      const response = await fetch('/api/registry/purpose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ componentId, purpose: editedPurpose })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save')
      }

      setIsEditingPurpose(false)
      // Note: Page will hot-reload with new values from the updated files
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save purpose')
    } finally {
      setIsSavingPurpose(false)
    }
  }

  const startEditingPurpose = (purpose: PurposeData) => {
    setEditedPurpose({ ...purpose })
    setIsEditingPurpose(true)
    setSaveError(null)
  }

  // Sync state if initialComponentId changes via command palette
  useEffect(() => {
    setSelectedComponentId(initialComponentId)
    if (initialComponentId) {
      const comp = componentsList.find(c => c.id === initialComponentId)
      if (comp) {
        const defaults: Record<string, any> = {}
        comp.properties?.forEach(p => defaults[p.id] = p.default)
        setComponentProps(defaults)
      }
    }
  }, [initialComponentId])

  const filteredComponents = useMemo(() => {
    if (!searchQuery.trim()) return componentsList

    const lowerQuery = searchQuery.toLowerCase()
    // Get component IDs that match by purpose from registry
    const purposeMatches = new Set(
      searchComponentsByPurpose(searchQuery).map(c => c.id)
    )

    return componentsList.filter(c =>
      c.name.toLowerCase().includes(lowerQuery) ||
      c.category.toLowerCase().includes(lowerQuery) ||
      purposeMatches.has(c.id)
    )
  }, [searchQuery])

  const handlePropChange = (id: string, value: any): void => {
    setComponentProps(prev => ({ ...prev, [id]: value }))
  }

  const categories = useMemo(() => {
    const cats = new Set(componentsList.map(c => c.category))
    return Array.from(cats)
  }, [])

  const selectedComponent = componentsList.find(c => c.id === selectedComponentId)

  if (selectedComponent) {
    return (
      <div className="library-page">
        <div className="library-detail-header">
          <button className="btn-secondary back-btn" onClick={() => {
            if (onNavigate) {
              onNavigate(null)
            } else {
              setSelectedComponentId(null)
            }
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to List
          </button>
          <div className="header-info">
            <h1>{selectedComponent.name}</h1>
            <span className="category-tag">{selectedComponent.category}</span>
          </div>
        </div>

        <div className={`library-detail-content ${selectedComponentId === 'design-tokens' || selectedComponent.fullPreview ? 'full-width' : ''}`}>
          <div className={`component-preview-box ${selectedComponent.wide ? 'wide-component' : ''} ${selectedComponent.fullPreview ? 'full-preview' : ''}`}>
            {!selectedComponent.fullPreview && <div className="preview-label">PREVIEW</div>}
            <div className={`preview-stage ${selectedComponent.wide ? 'wide-preview' : ''} ${selectedComponent.fullPreview ? 'full-preview-stage' : ''}`}>
              {selectedComponent.render(componentProps)}
            </div>
          </div>

          {selectedComponentId !== 'design-tokens' && !selectedComponent.fullPreview && (
            <div className="component-properties-panel">
              <div className="panel-header">PROPERTIES</div>
              <div className="properties-list">
                {selectedComponent.properties && selectedComponent.properties.length > 0 ? (
                  selectedComponent.properties.map(prop => (
                    <div key={prop.id} className="prop-item">
                      <label>{prop.name}</label>
                      {prop.type === 'select' ? (
                        <select 
                          value={String(componentProps[prop.id] ?? prop.default ?? '')} 
                          onChange={(e) => handlePropChange(prop.id, e.target.value)}
                        >
                          {prop.options?.map(opt => (
                            <option key={String(opt)} value={String(opt)}>{String(opt)}</option>
                          ))}
                        </select>
                      ) : prop.type === 'boolean' ? (
                        <div 
                          className={`toggle-switch ${componentProps[prop.id] ? 'on' : ''}`}
                          onClick={() => handlePropChange(prop.id, !componentProps[prop.id])}
                        >
                          <div className="toggle-thumb"></div>
                        </div>
                      ) : prop.type === 'text' ? (
                        <input 
                          type="text"
                          value={String(componentProps[prop.id] ?? prop.default ?? '')} 
                          onChange={(e) => handlePropChange(prop.id, e.target.value)}
                          className="prop-text-input"
                        />
                      ) : null}
                    </div>
                  ))
                ) : (
                  <div className="no-props">No adjustable properties</div>
                )}
              </div>

              {/* Registry Metadata Section */}
              {(() => {
                const registryMeta: ComponentMeta | undefined = getComponentById(selectedComponent.id)
                if (!registryMeta) return null

                return (
                  <>
                    {/* Purpose */}
                    <div className="panel-header" style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>PURPOSE</span>
                      {!isEditingPurpose && (
                        <button
                          className="edit-description-btn"
                          onClick={() => startEditingPurpose(registryMeta.purpose)}
                        >
                          Edit
                        </button>
                      )}
                    </div>
                    {isEditingPurpose ? (
                      <div className="purpose-edit-container">
                        <div className="purpose-edit-field">
                          <label className="meta-label">What:</label>
                          <textarea
                            className="description-textarea"
                            value={editedPurpose.what}
                            onChange={(e) => setEditedPurpose(prev => ({ ...prev, what: e.target.value }))}
                            rows={2}
                            disabled={isSavingPurpose}
                          />
                        </div>
                        <div className="purpose-edit-field">
                          <label className="meta-label">Where:</label>
                          <textarea
                            className="description-textarea"
                            value={editedPurpose.where}
                            onChange={(e) => setEditedPurpose(prev => ({ ...prev, where: e.target.value }))}
                            rows={2}
                            disabled={isSavingPurpose}
                          />
                        </div>
                        <div className="purpose-edit-field">
                          <label className="meta-label">Not for:</label>
                          <textarea
                            className="description-textarea"
                            value={editedPurpose.notFor}
                            onChange={(e) => setEditedPurpose(prev => ({ ...prev, notFor: e.target.value }))}
                            rows={2}
                            disabled={isSavingPurpose}
                          />
                        </div>
                        {saveError && (
                          <div className="save-error">{saveError}</div>
                        )}
                        <div className="description-edit-actions">
                          <button
                            className="btn-save"
                            onClick={() => handleSavePurpose(selectedComponent.id)}
                            disabled={isSavingPurpose}
                          >
                            {isSavingPurpose ? 'Saving...' : 'Save to Files'}
                          </button>
                          <button
                            className="btn-cancel"
                            onClick={() => setIsEditingPurpose(false)}
                            disabled={isSavingPurpose}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="registry-meta-section">
                        <div className="meta-item">
                          <span className="meta-label">What:</span>
                          <span className="meta-value">{registryMeta.purpose.what}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label">Where:</span>
                          <span className="meta-value">{registryMeta.purpose.where}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label">Not for:</span>
                          <span className="meta-value meta-not-for">{registryMeta.purpose.notFor}</span>
                        </div>
                      </div>
                    )}

                    {/* Variants from Registry */}
                    {Object.keys(registryMeta.variants).length > 0 && (
                      <>
                        <div className="panel-header" style={{ marginTop: '24px' }}>VARIANTS</div>
                        <div className="registry-meta-section">
                          {Object.entries(registryMeta.variants).map(([variantName, variantDef]) => (
                            <div key={variantName} className="meta-item">
                              <span className="meta-label">{variantName}:</span>
                              <span className="meta-value">
                                {variantDef.options.join(' | ')}
                                <span className="meta-default"> (default: {variantDef.default})</span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Composition */}
                    {(registryMeta.composition.uses.length > 0 || registryMeta.composition.usedBy.length > 0) && (
                      <>
                        <div className="panel-header" style={{ marginTop: '24px' }}>COMPOSITION</div>
                        <div className="registry-meta-section">
                          {registryMeta.composition.uses.length > 0 && (
                            <div className="meta-item">
                              <span className="meta-label">Uses:</span>
                              <span className="meta-value meta-links">
                                {registryMeta.composition.uses.map((usedId, idx) => (
                                  <span key={usedId}>
                                    <button
                                      className="meta-link"
                                      onClick={() => {
                                        const comp = componentsList.find(c => c.id === usedId.toLowerCase().replace(/([A-Z])/g, '-$1').replace(/^-/, ''))
                                        if (comp && onNavigate) {
                                          onNavigate(comp.id)
                                        }
                                      }}
                                    >
                                      {usedId}
                                    </button>
                                    {idx < registryMeta.composition.uses.length - 1 && ', '}
                                  </span>
                                ))}
                              </span>
                            </div>
                          )}
                          {registryMeta.composition.usedBy.length > 0 && (
                            <div className="meta-item">
                              <span className="meta-label">Used by:</span>
                              <span className="meta-value meta-links">
                                {registryMeta.composition.usedBy.map((usedById, idx) => (
                                  <span key={usedById}>
                                    <button
                                      className="meta-link"
                                      onClick={() => {
                                        const comp = componentsList.find(c => c.id === usedById.toLowerCase().replace(/([A-Z])/g, '-$1').replace(/^-/, ''))
                                        if (comp && onNavigate) {
                                          onNavigate(comp.id)
                                        }
                                      }}
                                    >
                                      {usedById}
                                    </button>
                                    {idx < registryMeta.composition.usedBy.length - 1 && ', '}
                                  </span>
                                ))}
                              </span>
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    {/* Related */}
                    {registryMeta.related.length > 0 && (
                      <>
                        <div className="panel-header" style={{ marginTop: '24px' }}>RELATED</div>
                        <div className="registry-meta-section">
                          <div className="meta-item">
                            <span className="meta-value meta-links">
                              {registryMeta.related.map((relatedId, idx) => (
                                <span key={relatedId}>
                                  <button
                                    className="meta-link"
                                    onClick={() => {
                                      const comp = componentsList.find(c => c.id === relatedId.toLowerCase().replace(/([A-Z])/g, '-$1').replace(/^-/, ''))
                                      if (comp && onNavigate) {
                                        onNavigate(comp.id)
                                      }
                                    }}
                                  >
                                    {relatedId}
                                  </button>
                                  {idx < registryMeta.related.length - 1 && ', '}
                                </span>
                              ))}
                            </span>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Guidelines */}
                    {registryMeta.guidelines && (
                      <>
                        <div className="panel-header" style={{ marginTop: '24px' }}>GUIDELINES</div>
                        <p className="prop-description prop-guidelines">{registryMeta.guidelines}</p>
                      </>
                    )}
                  </>
                )
              })()}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="library-page">
      <Header title="Library" subtitle="Component Library" showLogo={false} />
      
      <div className="library-search-wrapper">
        <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input 
          type="text" 
          placeholder="Search components..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="library-search-input"
        />
      </div>

      <div className="library-content">
        {categories.map(category => {
          const catComponents = filteredComponents.filter(c => c.category === category)
          if (catComponents.length === 0) return null

          return (
            <section key={category} className="library-section">
              <h2>{category}</h2>
              <div className="library-grid">
                {catComponents.map(component => (
                  <div 
                    key={component.id} 
                    className="library-card"
                    onClick={() => {
                      if (onNavigate) {
                        onNavigate(component.id)
                      } else {
                        setSelectedComponentId(component.id)
                        const defaults: Record<string, any> = {}
                        component.properties?.forEach(p => defaults[p.id] = p.default)
                        setComponentProps(defaults)
                      }
                    }}
                  >
                    <div className="card-preview">
                      <div className="mini-preview">
                        {component.render(component.properties?.reduce((acc, p) => ({ ...acc, [p.id]: p.default }), {}) || {})}
                      </div>
                    </div>
                    <div className="card-info">
                      <h3>{component.name}</h3>
                      <p>{getComponentById(component.id)?.purpose.what || ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

export default ComponentLibrary
