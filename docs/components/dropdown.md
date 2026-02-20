# Dropdown

## Props

- `modelValue?: boolean` (v-model)
- `items?: Array<{ label?: string; to?: string; href?: string; url?: string; icon?: string; disabled?: boolean; separator?: boolean; command?: () => void }>`
- `placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'bottom' | 'top'` (default `bottom-start`)
- `offset?: number` (default `6`)
- `disabled?: boolean`
- `closeOnSelect?: boolean` (default `true`)
- `closeOnEsc?: boolean` (default `true`)
- `matchTriggerWidth?: boolean` (default `true`)

## Events

- `update:modelValue`
- `open`
- `close`
- `select`

## Slots

- `trigger`
- `default` (optional) - dropdown content (defaults to `items` list if provided)

Note: For custom dropdown content, add `data-dropdown-close` to clickable elements to auto-close on click.

## Examples

```vue
<Dropdown :items="menuItems">
    <template #trigger>
        <Button label="Actions" />
    </template>
</Dropdown>
```

## Tokens

Component tokens (override via `theme.overrides.components.dropdown`):

- `panelPadding`, `panelBorderRadius`, `panelBorderColor`
- `panelBackgroundColor`, `panelShadow`, `zIndex`
- `disabledOpacity`, `itemPadding`

## Accessibility

- Trigger exposes popup state via `aria-expanded`.
- Keyboard close via `Escape` is available when `closeOnEsc` is enabled.
- For custom menu content, ensure focusable actions have clear text labels.
