# Sidebar

## Purpose

Provide a migration-friendly alias over `Drawer` for sidebar-style overlays.

## Props

- `visible?: boolean` (legacy v-model alias)
- `modelValue?: boolean` (Vue standard v-model)
- `title?: string`
- `position?: 'left' | 'right' | 'top' | 'bottom'` (default `left`)
- `size?: 'sm' | 'md' | 'lg'`
- `modal?: boolean` (alias for `overlay`)
- `overlay?: boolean`
- `dismissable?: boolean` (alias for `closeOnOverlay`)
- `closeOnOverlay?: boolean`
- `closeOnEscape?: boolean` (alias for `closeOnEsc`)
- `closeOnEsc?: boolean`
- `showCloseIcon?: boolean` (alias for `showClose`)
- `showClose?: boolean`
- `blockScroll?: boolean` (alias for `lockScroll`)
- `lockScroll?: boolean`

## Events

- `update:visible`
- `update:modelValue`
- `show`, `onShow` (alias events)
- `hide`, `onHide` (alias events)
- `open`, `close`

## Slots

- `header`, `body`, `footer`, `close`, default

## Examples

```vue
<Sidebar v-model:visible="sidebarOpen" title="Filters" position="left">
    <template #body>
        <p>Sidebar content</p>
    </template>
</Sidebar>
```

## Guidance vs Drawer

- `Drawer` is the canonical component for new code.
- `Sidebar` is compatibility-oriented and forwards behavior to `Drawer`.
- Prefer migrating to `Drawer` API gradually (`modelValue`, `closeOnOverlay`, `closeOnEsc`, `showClose`, `lockScroll`).

## Theming

- Override via `theme.overrides.components.sidebar` (same token shape as `drawer`).

## Tokens

- Uses `DrawerTokens` contract (`width*`, `height*`, `padding`, `borderRadius`, `overlayBackgroundColor`, `shadow`, `zIndex`, header/body/footer gaps, close tokens).

## Accessibility

- Inherits dialog semantics and focus trapping from `Drawer`.
- Keyboard `Escape` close depends on `closeOnEsc`/`closeOnEscape`.

## Responsive

- Keep `position="left"`/`position="right"` for desktop navigation and use top/bottom for compact mobile flows.

## SSR/Hydration

- Same SSR/hydration behavior as `Drawer`.

## Testing

- Cover alias prop mapping (`visible`, `dismissable`, `closeOnEscape`, `showCloseIcon`, `blockScroll`) and event forwarding.
