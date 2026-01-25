# Variant Axes Checklist

Common variant patterns to evaluate for each new component.

## Hierarchy/Intent Variants

**Question**: Does this component have semantic meaning variations?

| Axis | Common Options | When to Use |
|------|----------------|-------------|
| `intent` | primary, secondary, tertiary | Buttons, links, CTAs |
| `variant` | default, ghost, outline, solid | Buttons, badges, cards |
| `status` | info, success, warning, error | Alerts, badges, notifications |
| `priority` | low, medium, high, critical | Task items, notifications |

## Dimension Variants

**Question**: Does this component need to fit different space constraints?

| Axis | Common Options | When to Use |
|------|----------------|-------------|
| `size` | xs, sm, md, lg, xl | Most interactive components |
| `density` | compact, default, comfortable | Tables, lists, forms |
| `width` | auto, full, fixed | Containers, inputs |

## State Variants

**Question**: Beyond CSS states, are there semantic states?

| Axis | Common Options | When to Use |
|------|----------------|-------------|
| `state` | default, loading, empty, error | Data containers |
| `mode` | view, edit, preview | Editable content |
| `expanded` | true, false | Collapsible sections |
| `selected` | true, false | Selectable items |

## Shape Variants

**Question**: Does this component have different visual forms?

| Axis | Common Options | When to Use |
|------|----------------|-------------|
| `shape` | circle, rounded, square | Avatars, buttons, cards |
| `orientation` | horizontal, vertical | Stacks, dividers |
| `alignment` | start, center, end | Layout containers |

## Slot Variants

**Question**: Are there configurable child positions?

| Slot | Description | When to Use |
|------|-------------|-------------|
| `leading` | Content before main content | Icons before labels |
| `trailing` | Content after main content | Icons after labels |
| `header` | Top section content | Cards, modals |
| `footer` | Bottom section content | Cards, modals |
| `action` | Interactive element slot | Cards, list items |

## Responsive Stacking

**Question**: Does this component have horizontal children that should stack on smaller viewports?

| Pattern | Implementation | When to Use |
|---------|---------------|-------------|
| Mobile-first stack | `flex-col sm:flex-row` | Default approach |
| Wrap overflow | `flex-wrap` | Allow natural wrapping |
| Responsive grid | `grid-cols-1 md:grid-cols-2` | Card layouts |
| Prevent text overflow | `min-w-0` on flex children | Long text in flex items |

**Red Flags**:
- `flex-row` without breakpoint stacking or `flex-wrap`
- Fixed grid columns without responsive variant
- Horizontal children that can grow beyond parent width

## Questions to Ask

For each axis, ask:

1. **Does this axis apply?** Not every component needs every variant.
2. **What are the real options?** Don't add options "just in case."
3. **What's the default?** The most common use case.
4. **Are these mutually exclusive?** Or can they combine?

## Red Flags

- Adding size variants to components that should always be one size
- Adding color variants when the color should come from context/theme
- Adding state variants that CSS `:hover/:focus/:disabled` already handles
- Creating variants for edge cases instead of composition
