# FileUpload

## Purpose

Provide advanced task-focused interactions for authoring, media/input control, and guided workflows.
Enable product features that require richer interaction than basic form controls.

## Props

- `modelValue?: File | File[] | null` (v-model)
- `multiple?: boolean`
- `accept?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `maxSize?: number` (bytes)
- `maxFiles?: number`
- `placeholder?: string`
- `buttonLabel?: string` (default `Browse`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)

## Events

- `update:modelValue`
- `change`
- `reject` (payload: `Array<{ file: File; reason: 'maxSize' | 'maxFiles'; maxSize?: number; maxFiles?: number }>` )
- `focus`
- `blur`

## Slots

- This component does not expose named slots.

## Examples

```vue
<FileUpload v-model="attachments" multiple :max-files="5" :max-size="10_000_000" />
```

## Theming

- Override via theme component overrides for each component documented on this page.

## Tokens

Component tokens (override via `theme.overrides.components.fileUpload`):

- `minHeight`, `fontSize`, `gap`, `padding`
- `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`
- `disabledOpacity`, `dragBackgroundColor`
- `listGap`, `itemPadding`, `itemBorderColor`, `itemBackgroundColor`, `itemRadius`, `itemTextColor`, `sizeTextColor`
- `buttonPadding`, `buttonRadius`, `buttonBorderColor`, `buttonBackgroundColor`, `buttonTextColor`, `buttonHoverBackgroundColor`
- `removeSize`, `removeRadius`, `removeHoverBackgroundColor`
- `small.fontSize`, `small.padding`, `small.buttonPadding`
- `large.fontSize`, `large.padding`, `large.buttonPadding`

## Recipes

- Start with the examples above as baseline usage for this component.
- Add product-specific variants (loading/error/dense/mobile) in consuming app docs when needed.

## Responsive

Verify control affordances, panel sizing, and gesture/mouse interactions across device classes.
Ensure compact layouts preserve clarity for actions, handles, and contextual hints.

## SSR/Hydration

Keep initial value and panel-closed/base state stable between server and client output.
Hydrate client-only interaction engines (editor, drag, command layers) without DOM mismatch.

## Testing

Cover core interaction loops, boundary conditions, and value/state synchronization.
Add accessibility tests for keyboard alternatives, labelling, and focus behavior.

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
