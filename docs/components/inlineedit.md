# InlineEdit

## Purpose

Deliver reusable UI building blocks with stable API contracts for SaaS application development.
Keep behavior consistent across pages, themes, and interaction contexts.

## Props

- `modelValue?: string | number | null` (v-model)
- `type?: 'text' | 'number'` (default `text`)
- `placeholder?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `editLabel?: string` (default `Edit`)
- `saveLabel?: string` (default `Save`)
- `cancelLabel?: string` (default `Cancel`)

## Events

- `update:modelValue`
- `save`
- `cancel`
- `start`
- `end`
- `focus`
- `blur`

## Slots

- This component does not expose named slots.

## Examples

```vue
<InlineEdit v-model="projectName" placeholder="No project name" />
<InlineEdit v-model="budget" type="number" variant="outlined" />
```

## Theming

- Override via theme component overrides for each component documented on this page.

## Tokens

Component tokens (override via `theme.overrides.components.inlineEdit`):

- `gap`, `fontSize`, `padding`
- `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`, `disabledOpacity`
- `actionsGap`
- `buttonPadding`, `buttonRadius`, `buttonBorderColor`
- `buttonBackgroundColor`, `buttonTextColor`, `buttonHoverBackgroundColor`
- `cancelButtonBackgroundColor`, `cancelButtonTextColor`, `cancelButtonBorderColor`
- `small.fontSize`, `small.padding`, `small.buttonPadding`
- `large.fontSize`, `large.padding`, `large.buttonPadding`

## Recipes

- Start with the examples above as baseline usage for this component.
- Add product-specific variants (loading/error/dense/mobile) in consuming app docs when needed.

## Responsive

Verify behavior across mobile/tablet/desktop breakpoints including touch and overflow handling.
Ensure component layout and actions remain usable in constrained containers.

## SSR/Hydration

Keep initial render state deterministic and hydration-safe for interactive features.
Defer client-only calculations until after mount when needed.

## Testing

Cover render, interaction, and regression-sensitive scenarios for the component API surface.
Add accessibility checks and visual/SSR assertions where behavior is dynamic.

## Accessibility

- Editing flow supports keyboard-first interactions: `Enter` to save and `Escape` to cancel.
- Keep `editLabel`/`saveLabel`/`cancelLabel` explicit for screen-reader clarity in contextual inline actions.
- In `readonly` mode, editing controls are hidden and value remains non-interactive.
