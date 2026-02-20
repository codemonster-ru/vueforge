# Drawer

## Props

- `modelValue?: boolean` (v-model)
- `title?: string`
- `position?: 'left' | 'right' | 'top' | 'bottom'` (default `right`)
- `size?: 'sm' | 'md' | 'lg'`
- `overlay?: boolean` (default `true`)
- `closeOnOverlay?: boolean` (default `true`)
- `closeOnEsc?: boolean` (default `true`)
- `showClose?: boolean` (default `true`)
- `lockScroll?: boolean` (default `true`)

## Events

- `update:modelValue`
- `open`
- `close`

## Slots

- `header` (optional) - replaces the title area
- `body` (optional) - drawer content (defaults to default slot if not provided)
- `default` (optional) - drawer content if `body` slot is not used
- `footer` (optional)
- `close` (optional) - custom close button; slot props: `{ close }`

## Examples

```vue
<Drawer v-model="open" title="Filters" position="right">
    <template #body>
        <p>Drawer content</p>
    </template>
    <template #footer>
        <Button label="Reset" severity="secondary" size="small" />
        <Button label="Apply" size="small" @click="open = false" />
    </template>
</Drawer>
```

## Tokens

Component tokens (override via `theme.overrides.components.drawer`):

- `width`, `widthSm`, `widthLg`
- `height`, `heightSm`, `heightLg`
- `padding`, `borderRadius`
- `backgroundColor`, `textColor`
- `overlayBackgroundColor`
- `shadow`
- `zIndex`
- `headerGap`, `bodyGap`, `footerGap`
- `titleFontSize`, `titleLineHeight`, `titleFontWeight`
- `closeSize`, `closeRadius`, `closeOffset`
- `closeColor`, `closeFontSize`, `closeHoverBackgroundColor`

## Accessibility

- Focus is trapped while drawer is open and restored to the previous element on close.
- Supports `Escape` close behavior when `closeOnEsc` is enabled.
- For top/bottom drawers, ensure content headings are descriptive for screen readers.
