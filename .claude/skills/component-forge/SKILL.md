---
name: component-forge
description: Create or edit design system components and tokens with full metadata, consent checkpoints, and automatic multi-location registration. Use when building new components, editing existing ones, or managing design tokens.
allowed-tools: Read, Write, Edit, Grep, Glob, Bash, AskUserQuestion
---

# Component Forge

## Core Principles

1. **Stay on task**: Track the original request. Side discussions (tokens, patterns) feed back into the main task.
2. **Be concise**: Tables over prose. Show only what's needed for the current decision.
3. **Choices LAST**: When presenting options, they MUST be the final thing in the response. Nothing after. User selects with arrow keys.
4. **MD files are mandatory**: Every component/token change MUST update relevant md files. Never ask "did you update md files?" - just do it.

## Task Tracking

**ALWAYS maintain task context.** When a tangent arises (e.g., "should we add a token?"), resolve it and immediately return to the main task.

Format task status as:
```
**Task**: [Component/Token] → [Name]
**Status**: [Phase X: Description]
```

## Choice Format

**USE the AskUserQuestion tool** - not printed text lists.

This gives the user:
- Arrow key navigation (up/down)
- Enter to select
- "Other" option for custom input (always included automatically)

**Example usage:**
```
AskUserQuestion with:
- question: "Proceed with this architecture?"
- options: [
    { label: "Yes", description: "Build the component" },
    { label: "Adjust variants", description: "Modify the variant structure" },
    { label: "Check similar first", description: "Review existing components" }
  ]
```

**When to use:**
- Confirming intent/architecture
- Token checkpoints
- Any decision point

**When NOT to use:**
- Pure informational output (no decision needed)
- Final "Done" messages

---

## Workflow

### Phase 1: Intent (30 seconds)

Extract and confirm in ONE compact block:

```
**Task**: Create Component → [Name]

| Purpose | |
|---------|---|
| What | [description] |
| Where | [contexts] |
| Not for | [anti-patterns] |

| Variants | Options | Default |
|----------|---------|---------|
| [axis] | [options] | [default] |

**Similar**: [Component] - [why similar]

**Proceed?**
1. Yes
2. Adjust purpose
3. Adjust variants
4. Check similar first
```

### Phase 2: Discovery

Check existing options before building from scratch.

**Step 1: Base UI Check**

Base UI (`@base-ui/react`) provides unstyled, accessible primitives. Always check here first.

| Category | Components |
|----------|------------|
| Inputs | `Field`, `Input`, `Checkbox`, `Radio`, `Select`, `Slider`, `Switch`, `NumberField` |
| Overlays | `Dialog`, `Popover`, `Tooltip`, `Menu`, `AlertDialog` |
| Navigation | `Tabs`, `Accordion`, `NavigationMenu` |
| Feedback | `Progress`, `Toast` |
| Utilities | `FocusTrap`, `Portal`, `VisuallyHidden` |

```
**Base UI check**: [ComponentName]

1. Use Base UI [Primitive] + our styles
2. No match - create custom
```

**Example - TextField using Base UI:**
```tsx
import { Field, Input } from '@base-ui/react'

<Field.Root>
  <Field.Label className="text-field-label">Email</Field.Label>
  <Input className="text-field" placeholder="Enter email..." />
  <Field.Error className="text-field-helper-error" />
</Field.Root>
```

**Docs**: https://base-ui.com/react/components/[component-name]

**Step 2: Similar Components** (skip if none found in Phase 1)

```
**[SimilarComponent] exists:**
- Purpose: [what]
- Variants: [list]

**Decision:**
1. Create new (different enough)
2. Extend existing (add variant)
3. Cancel
```

**Step 3: Composition Check**

Identify existing components to compose the new one from.

```
**Building [Component] with:**

| Component | Role |
|-----------|------|
| [existing] | [how it's used] |

**Or**: Atomic component (no composition needed)
```

This informs the `uses`/`usedBy` metadata in registration.

### Phase 3: Architecture (only if variants need discussion)

Skip if variants were confirmed in Phase 1. Only show for complex decisions:

```
**Variant architecture for [Component]:**

| Axis | Options | Default | Rationale |
|------|---------|---------|-----------|
| size | sm, md, lg | md | Height variations |

**Confirm?**
1. Yes
2. Modify
```

### Phase 4: Build

**Token checkpoint** - Only pause if using non-standard values:

```
**Token check**: Using [value] for [property].

1. Add global token (missing from system)
2. Use [existing-token] instead
3. One-off (justified exception)
```

**Build silently** unless decisions are needed. Don't narrate each step.

### Phase 5: Register

Complete ALL registrations including MD files. No exceptions.

**Mandatory registrations:**
1. Component file + JSDoc
2. Folder + index.ts
3. Main barrel export
4. registry.ts entry
5. ComponentLibrary preview
6. **README.md** - add to project structure
7. **Styleguide SKILL.md** - if component has notable specs
8. **ui-skill.md** - if affects design rules

Then report:
```
**Registered [Component]:**
- [x] Component + JSDoc
- [x] Folder + barrel
- [x] registry.ts
- [x] ComponentLibrary
- [x] README.md
- [x] Styleguide (if applicable)
```

---

## Token Creation (condensed)

```
**Task**: Create Token → [name]

| Token | Value | Purpose |
|-------|-------|---------|
| [name] | [value] | [description] |

**Similar**: [existing-token] - [value]

**Proceed?**
1. Yes, add token
2. Use existing instead
3. Cancel
```

Register silently, then:
```
**Registered [token]:**
- [x] styles.css
- [x] ComponentLibrary DesignTokens
- [x] Styleguide SKILL.md

**Done.**
```

---

## Edit Workflows (condensed)

### Edit Component
```
**Current [Component]:**
| Field | Value |
|-------|-------|
| Purpose | [what] |
| Variants | [list] |

**What to change?**
1. Purpose
2. Add variant
3. Remove variant
4. Rename
5. Other
```

### Edit Token
```
**Current [token]:** [value]
**Used in:** [list files/components]

**Change to:** [new value]

**Proceed?**
1. Yes
2. Cancel
```

---

## Reference Files

| Type | Location |
|------|----------|
| Types | `src/types/component-meta.ts` |
| Registry | `src/components/registry.ts` |
| Tokens | `src/styles.css` |
| Library | `src/components/component-library/ComponentLibrary.tsx` |
| README | `README.md` |
| Styleguide | `.claude/skills/ui-skill.md` |

## Component Folder Structure

```
src/components/[kebab-name]/
├── [Name].tsx    # Component + JSDoc
└── index.ts      # export { default } from './[Name]'
```

## Registration Checklist

**Components (ALL required, no skipping):**
- [ ] `src/components/[name]/[Name].tsx` - Component file with JSDoc
- [ ] `src/components/[name]/index.ts` - Barrel export
- [ ] `src/components/index.ts` - Add to main barrel
- [ ] `src/components/registry.ts` - Metadata entry
- [ ] `ComponentLibrary.tsx` → componentsList - Preview entry
- [ ] `README.md` - Add to project structure listing
- [ ] `.claude/skills/ui-skill.md` - If has design specs
- [ ] Update `usedBy` arrays if composing other components

**Tokens (ALL required, no skipping):**
- [ ] `src/styles.css` - Token definition with comment
- [ ] `ComponentLibrary.tsx` → DesignTokens - Visual display
- [ ] `README.md` - Update tokens section if new category
- [ ] `.claude/skills/ui-skill.md` - Update token docs

## Design System Rules

- **Borders**: Use `--border-*` tokens, NEVER surface tokens
- **Glass elements**: Use `--border-glass` (gradient)
- **Spacing**: Only [2, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40]
- **Radius**: Only [2, 4, 8, 12, 16, 9999]
