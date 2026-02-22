# TimePicker

## Purpose

Provide date/time input primitives for scheduling, reporting, and range-based filtering.
Support localized parsing/display while keeping predictable controlled value contracts.

## Props

- `modelValue?: string` (v-model, time `HH:mm`)
- `placeholder?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `min?: string` (time `HH:mm`)
- `max?: string` (time `HH:mm`)
- `step?: number` (minutes, default `30`)
- `format?: '24h' | '12h'` (default `24h`)
- `ariaLabel?: string` (default `Time picker`)
- `panelAriaLabel?: string` (default `Time options`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)

## Events

- `update:modelValue`
- `change`
- `focus`
- `blur`

## Slots

- This component does not expose named slots.

## Examples

```vue
<TimePicker v-model="meetingTime" placeholder="Pick time" min="09:00" max="18:00" :step="15" />
```

## Theming

- Override via theme component overrides for each component documented on this page.

## Tokens

Component tokens (override via `theme.overrides.components.timepicker`):

- `minWidth`, `fontSize`, `controlGap`, `chevronSize`
- `padding`, `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`
- `disabledOpacity`
- `panelBackgroundColor`, `panelBorderColor`, `panelPadding`, `panelMaxHeight`, `panelRadiusOffset`, `panelShadow`
- `optionPadding`, `optionBorderRadius`
- `optionHoverBackgroundColor`, `optionActiveBackgroundColor`, `optionActiveTextColor`
- `small.fontSize`, `small.padding`
- `large.fontSize`, `large.padding`

## Recipes

- Start with the examples above as baseline usage for this component.
- Add product-specific variants (loading/error/dense/mobile) in consuming app docs when needed.

## Responsive

Validate panel positioning, grid readability, and action controls on small screens.
Ensure touch interactions for day/time selection remain accurate with adequate target size.

## SSR/Hydration

Render initial date/time value and panel-closed state consistently in SSR output.
Run locale/timezone-sensitive formatting in a hydration-safe way to prevent mismatch.

## Testing

Cover parsing/formatting, keyboard navigation, min/max constraints, and range/time edge cases.
Add tests for locale variants and ARIA semantics for calendar and listbox-like panels.

## Accessibility

- Trigger exposes popup semantics via `aria-haspopup="listbox"`, `aria-expanded`, and `aria-controls`.
- Keyboard support: `ArrowDown` opens and focuses options; option list supports `ArrowUp`/`ArrowDown`, `Home`/`End`, `Enter`/`Space` select, and `Escape` close.
- Invalid time values are ignored for display state (treated as empty placeholder).
- `min`/`max` constraints disable out-of-range options.
- In `readonly` mode, open/select interactions are blocked.
