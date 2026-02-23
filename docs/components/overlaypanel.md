# OverlayPanel

## Purpose

Provide a compatibility alias for `Popover` with `OverlayPanel`-style API names, backed by the same overlay positioning and dismiss behavior.

## Compatibility Mapping

- `dismissable` -> mapped to `Popover.closeOnOutside`
- `closeOnEscape` -> mapped to `Popover.closeOnEsc`
- `showCloseIcon` -> renders close button in header slot
- Theming uses `popover` tokens (also available via `overlaypanel` alias in theme overrides).

## Props

- `modelValue?: boolean`
- `placement?: 'bottom' | 'top' | 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'` (default `bottom`)
- `offset?: number` (default `8`)
- `disabled?: boolean` (default `false`)
- `dismissable?: boolean` (default `true`)
- `closeOnEscape?: boolean` (default `true`)
- `showCloseIcon?: boolean` (default `false`)
- `closeLabel?: string` (default `Close overlay panel`)
- `pt?: PassThroughOptions`
- `unstyled?: boolean` (default `false`)

## Events

- `update:modelValue`
- `show`
- `hide`
- `onShow`
- `onHide`
- `click`
- `onClick`

## Slots

- `trigger` / `button`
- `default`
- `header` / `popoverHeader`
- `body` / `popoverBody`
- `footer` / `popoverFooter`

## Exposes

- `show()`
- `hide()`
- `toggle()`

## Examples

```vue
<OverlayPanel :dismissable="false" showCloseIcon>
    <template #trigger>
        <Button label="Open overlay" />
    </template>
    <template #header>Quick actions</template>
    <template #default>Panel content</template>
</OverlayPanel>
```

## Theming

- Override via `theme.overrides.components.popover`.
- Alias override is also accepted via `theme.overrides.components.overlaypanel`.

## Tokens

- Uses `Popover` token set:
  `borderRadius`, `borderColor`, `backgroundColor`, `shadow`, `zIndex`

## Recipes

- Migration bridge from legacy `OverlayPanel` naming to `Popover` implementation.
- Compact contextual action surface with explicit close icon.

## Accessibility

- Inherits `Popover` keyboard and ARIA behavior.
- Supports `Escape` dismiss when `closeOnEscape=true`.

## Responsive

- Inherits `Popover` placement/flip behavior with viewport collision handling.

## SSR/Hydration

- Inherits `Popover` SSR-safe closed/open rendering and post-mount positioning logic.

## Testing

- Cover compatibility mappings for `dismissable` and `closeOnEscape`.
- Verify close-icon behavior and controlled `modelValue` flow.
