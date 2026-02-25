# BottomSheet

## Purpose

Provide a mobile-first bottom-anchored surface for actions/details in responsive SaaS flows.

## Props

- `modelValue?: boolean` (v-model)
- `title?: string`
- `overlay?: boolean` (default `true`)
- `closeOnOverlay?: boolean` (default `true`)
- `closeOnEsc?: boolean` (default `true`)
- `showClose?: boolean` (default `true`)
- `lockScroll?: boolean` (default `true`)
- `size?: 'sm' | 'md' | 'lg'` (default `md`)

## Events

- `update:modelValue`
- `open`
- `close`

## Slots

- `header` (optional)
- `body` (optional; falls back to default slot)
- `default` (optional)
- `footer` (optional)
- `close` (optional, slot props: `{ close }`)

## Examples

```vue
<BottomSheet v-model="open" title="Quick actions">
    <template #body>
        <p>Run mobile-first contextual actions here.</p>
    </template>
</BottomSheet>
```

## Theming

- Override via `theme.overrides.components.bottomSheet`.

## Tokens

- Surface/layer: `zIndex`, `maxWidth`, `maxHeight`, `minHeight*`, `borderRadius`, `backgroundColor`, `textColor`, `overlayBackgroundColor`, `shadow`
- Safe area/handle: `safeAreaBottom`, `handleWidth`, `handleHeight`, `handleColor`, `handleMargin`
- Header/title: `headerGap`, `headerPadding`, `titleFontSize`, `titleLineHeight`, `titleFontWeight`
- Close button: `closeSize`, `closeRadius`, `closeColor`, `closeFontSize`, `closeHoverBackgroundColor`
- Content/footer: `bodyPadding`, `footerPadding`, `footerGap`

## Recipes

- Mobile row actions/details in list views.
- Confirmation/details surface that should not fully replace page context.

## Accessibility

- Focus is trapped while open and restored on close.
- Escape and overlay close behavior are configurable.

## Responsive

- Designed for narrow viewports and touch-first actions.
- Uses safe-area padding for devices with bottom insets.

## SSR/Hydration

- Deterministic open/closed rendering with teleport-safe markup.

## Testing

- Cover overlay/escape close, focus trap/restore, and scroll-lock behavior.
