# Avatar Component Walkthrough

Example of creating a component using /component-forge.

## User Request

> "I need a component to display user profile pictures with different sizes"

## Phase 1: Intent Extraction

**Claude's response:**

Based on your request, here's what I'm inferring:

**Purpose:**
- What: Display user identity with consistent sizing and visual treatment
- Where: Profile headers, comment threads, user lists, activity feeds
- Not for: Decorative images (use Image), logo marks (use Logo)

**Suggested variant axes:**
- `size`: xs, sm, md, lg, xl (for different contexts)
- `shape`: circle, rounded (circle for people, rounded for entities)
- `variant`: default, placeholder (when no image available)

**Components to check:**
- Chip: Also displays compact identity info, might share styling

Does this capture your intent? Anything to adjust?

**User confirms:** "Yes, that's right"

## Phase 2: Discovery

**Step 1: Base UI Check**

```
**Base UI check**: Avatar

1. Use Base UI [Primitive] + our styles
2. No match - create custom  ←
```

No Avatar primitive in Base UI. Proceeding with custom component.

**Step 2: Similar Components**

```
**Chip exists:**
- Purpose: Display tags, filters, removable items
- Variants: size, variant, removable

**Decision:**
1. Create new (different enough)  ←
2. Extend existing (add variant)
3. Cancel
```

Chip is for tags/filters, not identity display. Creating new component.

**Step 3: Composition Check**

```
**Building Avatar with:**

**Or**: Atomic component (no composition needed)  ←
```

Avatar is itself atomic - no existing components to compose from.

## Phase 3: Architecture

**Claude proposes:**

Proposed variant architecture for Avatar:

**Variants:**
- `size`: xs | sm | md | lg | xl (default: md)
- `shape`: circle | rounded (default: circle)
- `variant`: default | placeholder (default: default)

**Not applicable for this component:**
- `intent/status`: Avatar doesn't convey semantic status
- `state`: No loading/error states (placeholder handles missing image)

Confirm this structure?

**User confirms:** "Looks good"

## Phase 4: Build with Consent Checkpoints

**During implementation:**

```typescript
const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl'
}
```

**Claude notices:** Using Tailwind defaults for sizes, these map to:
- xs: 24px, sm: 32px, md: 40px, lg: 48px, xl: 64px

These align with the spacing scale. No consent checkpoint needed.

**No new tokens detected** - proceeding with build.

## Phase 5: Registration

**JSDoc added to component:**

```typescript
/**
 * @component Avatar
 * @purpose Display user identity with consistent sizing and shape
 * @where Profile headers, comment threads, user lists, activity feeds
 * @not-for Decorative images (use Image), logo marks (use Logo)
 *
 * @variant size - xs | sm | md | lg | xl - Controls dimensions and text scale
 * @variant shape - circle | rounded - Circle for people, rounded for entities
 * @variant variant - default | placeholder - Placeholder when no image available
 *
 * @uses None (atomic component)
 * @related Chip (both display compact identity info)
 */
```

**Registry entry added:**

```typescript
{
  id: 'avatar',
  name: 'Avatar',
  category: 'ui',
  path: '@/components/ui/Avatar',
  purpose: {
    what: 'Display user identity with consistent sizing and shape',
    where: 'Profile headers, comment threads, user lists, activity feeds',
    notFor: 'Decorative images (use Image), logo marks (use Logo)'
  },
  variants: {
    size: { options: ['xs', 'sm', 'md', 'lg', 'xl'], default: 'md' },
    shape: { options: ['circle', 'rounded'], default: 'circle' },
    variant: { options: ['default', 'placeholder'], default: 'default' }
  },
  composition: {
    uses: [],
    usedBy: []
  },
  related: ['Chip'],
  guidelines: 'Circle shape for people/users, rounded for organizations/entities'
}
```

## Final Component

```typescript
import { cn } from '@/utils/cn'
import { ReactNode } from 'react'

/**
 * @component Avatar
 * @purpose Display user identity with consistent sizing and shape
 * @where Profile headers, comment threads, user lists, activity feeds
 * @not-for Decorative images (use Image), logo marks (use Logo)
 *
 * @variant size - xs | sm | md | lg | xl - Controls dimensions and text scale
 * @variant shape - circle | rounded - Circle for people, rounded for entities
 * @variant variant - default | placeholder - Placeholder when no image available
 *
 * @uses None (atomic component)
 * @related Chip (both display compact identity info)
 */

interface AvatarProps {
  children?: ReactNode
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  shape?: 'circle' | 'rounded'
  variant?: 'default' | 'placeholder'
  src?: string
  alt?: string
  className?: string
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl'
}

const shapeClasses = {
  circle: 'rounded-full',
  rounded: 'rounded-lg'
}

export default function Avatar({
  children,
  size = 'md',
  shape = 'circle',
  variant = 'default',
  src,
  alt = '',
  className
}: AvatarProps) {
  const baseClasses = 'inline-flex items-center justify-center bg-surface-1 text-txt-secondary overflow-hidden'

  if (variant === 'placeholder' || !src) {
    return (
      <div className={cn(baseClasses, sizeClasses[size], shapeClasses[shape], className)}>
        {children || <span>?</span>}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn(baseClasses, sizeClasses[size], shapeClasses[shape], 'object-cover', className)}
    />
  )
}
```

## Summary

The component was created with:
- Full metadata in JSDoc and registry
- No new tokens needed (used existing scale)
- Clear purpose boundaries (not for decorative images)
- Documented relationships (related to Chip)
