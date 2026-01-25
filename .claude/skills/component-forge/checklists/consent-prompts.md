# Consent Checkpoint Prompts

Standard language for consent checkpoints during component creation.

## New Token Checkpoints

### New Color Token
```
I'm about to use color `[value]` for [property].
This doesn't match any existing token in styles.css.

Options:
1. Add `--[semantic-name]: [value]` to global tokens
2. Use existing `--[similar-token]` ([value]) instead
3. Keep as inline value (justified one-off)

Which approach?
```

### New Spacing Value
```
I'm about to use `[value]` spacing.
This isn't in the spacing scale [2, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40].

Options:
1. Add to spacing scale (it's genuinely needed)
2. Use `[nearest-value]` instead
3. Keep as one-off (explain why)

Which approach?
```

### New Typography Value
```
I'm about to use font-size `[value]` / weight `[value]`.
This doesn't match the semantic text styles in ui-skill.

Options:
1. Add new text style to the system
2. Use `[similar-style]` instead
3. Keep as component-specific exception

Which approach?
```

### New Border Radius
```
I'm about to use border-radius `[value]`.
This isn't in the radius scale [2px, 4px, 8px, 12px, 16px, 9999px].

Options:
1. Add to radius scale
2. Use `[nearest-value]` instead
3. Keep as one-off (explain why)

Which approach?
```

### Horizontal Layout Without Stacking
```
This component has horizontal children but no stacking behavior.
On narrow viewports, children may overflow or break the layout.

Options:
1. Add mobile-first stacking (`flex-col sm:flex-row`)
2. Add flex-wrap (`flex-wrap`)
3. Keep horizontal (parent viewport is fixed-width)

Which approach?
```

## Component Similarity Checkpoints

### Similar Purpose Detected
```
This component's purpose sounds similar to [ExistingComponent].

[ExistingComponent]:
- Purpose: [existing purpose]
- Where: [existing usage contexts]

Your new component:
- Purpose: [new purpose]
- Where: [new usage contexts]

Questions:
1. Is this genuinely different enough to be separate?
2. Could [ExistingComponent] be extended instead?
3. Should they share a base component?

How should we proceed?
```

### Similar Structure Detected
```
This component has similar props/structure to [ExistingComponent].

[ExistingComponent] variants:
- [axis]: [options]

Proposed [NewComponent] variants:
- [axis]: [options]

This could potentially be:
1. A new variant of [ExistingComponent]
2. A separate component (explain the distinction)
3. Both should share a base primitive

Which approach makes sense?
```

### Potential Atomic Component
```
This functionality might be useful in multiple components.

I could:
1. Build it inline in [Component]
2. Extract it as a reusable atom `[AtomName]`

If extracted, it could be used by:
- [potential use case 1]
- [potential use case 2]

Should this be a shared atom?
```

## Registration Confirmation

### Pre-Registration Summary
```
Ready to register [Component]:

Purpose:
- What: [what]
- Where: [where]
- Not for: [not for]

Variants:
- [axis]: [options] (default: [default])

Composition:
- Uses: [components]
- Related to: [components]

This will:
1. Add JSDoc block to component file
2. Add entry to registry.ts
3. Update usedBy arrays for composed components

Proceed with registration?
```
