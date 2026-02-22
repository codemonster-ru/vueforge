# SegmentedControl

## Purpose

- Switch between mutually exclusive views or modes with high discoverability.
- Provide a compact alternative to tabs for small option sets.

## Props

- `modelValue?: string | number` (v-model)
- `options?: Array<{ label: string; value: string | number; disabled?: boolean }>` (default `[]`)
- `disabled?: boolean`
- `fullWidth?: boolean` (default `false`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `ariaLabel?: string`
- `ariaLabelledby?: string`

## Events

- `update:modelValue`
- `change`
- `focus`
- `blur`

## Slots

- This component does not expose named slots.

## Examples

```vue
<SegmentedControl
    v-model="view"
    :options="[
        { label: 'List', value: 'list' },
        { label: 'Grid', value: 'grid' },
        { label: 'Board', value: 'board' },
    ]"
/>
```

## Theming

- Override via theme component overrides for each component documented on this page.

## Tokens

Component tokens (override via `theme.overrides.components.segmentedControl`):

- `fontSize`, `padding`, `gap`
- `borderRadius`, `borderColor`, `backgroundColor`, `textColor`
- `hoverBackgroundColor`, `activeBackgroundColor`, `activeTextColor`
- `focusRingShadow`, `disabledOpacity`
- `segmentPadding`, `segmentRadius`, `segmentFontWeight`
- `small.fontSize`, `small.padding`, `small.segmentPadding`
- `large.fontSize`, `large.padding`, `large.segmentPadding`

## Recipes

- Start with the examples above as baseline usage for this component.
- Add product-specific variants (loading/error/dense/mobile) in consuming app docs when needed.

## Responsive

- Validate segment wrapping/scroll behavior for many options on mobile.
- Ensure active indicator and labels remain clear at small widths.

## SSR/Hydration

- Selected segment state should be identical in server and client initial render.
- Avoid client-only measurement logic before hydration.

## Testing

- Cover controlled/uncontrolled selection, keyboard navigation, and disabled options.
- Add tests for long labels and dynamic option list updates.

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
