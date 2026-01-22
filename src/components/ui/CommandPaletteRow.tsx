import { motion } from 'framer-motion'
import Avatar from './Avatar'

interface CommandPaletteRowProps {
  symbol: string
  company: string
  isActive?: boolean
  onMouseEnter?: () => void
  onClick?: () => void
  variant?: 'single' | 'double'
  showPriceInfo?: boolean
  price?: string
  change?: string
  showKeyboardShortcut?: boolean
  keyboardShortcut?: string
  initialsType?: 'first' | 'both'
  avatarVariant?: 'default' | 'placeholder'
}

export default function CommandPaletteRow({
  symbol,
  company,
  isActive = false,
  onMouseEnter,
  onClick,
  variant = 'double',
  showPriceInfo = false,
  price,
  change,
  showKeyboardShortcut = false,
  keyboardShortcut,
  initialsType = 'first',
  avatarVariant = 'default'
}: CommandPaletteRowProps) {
  // Get initials based on type
  const getInitials = () => {
    if (initialsType === 'first') {
      return symbol[0] || company[0] || ''
    } else {
      // Both initials: first letter of symbol/company and first letter of second word
      const parts = company.split(' ')
      if (parts.length > 1) {
        return (symbol[0] || parts[0][0] || '') + (parts[1][0] || '')
      }
      return symbol[0] || company[0] || ''
    }
  }

  const initials = getInitials()
  const isActionItem = showKeyboardShortcut && !showPriceInfo

  return (
    <motion.li
      className={`cp-item ${isActive ? 'active' : ''} ${isActionItem ? 'cp-action-item' : ''}`}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="cp-sheen"></div>
      <div className="cp-item-left">
        <Avatar 
          size="sm" 
          shape="rounded" 
          variant={avatarVariant}
          className={avatarVariant === 'placeholder' ? '' : (isActionItem ? 'avatar-action' : 'avatar-command')}
        >
          {avatarVariant === 'placeholder' ? null : initials}
        </Avatar>
        <div className="cp-item-info">
          <span className="cp-symbol">{symbol}</span>
          {variant === 'double' && (
            <span className="cp-company">{company}</span>
          )}
        </div>
      </div>
      <div className="cp-item-right">
        {showPriceInfo && price && change && (
          <div className="cp-price-info text-red">
            <span className="cp-change">▼ {change}</span>
            <span className="cp-price">{price}</span>
          </div>
        )}
        {showKeyboardShortcut && keyboardShortcut && (
          <kbd className="cp-enter-hint">{keyboardShortcut}</kbd>
        )}
        <kbd className="cp-enter-hint">ENTER</kbd>
      </div>
    </motion.li>
  )
}
