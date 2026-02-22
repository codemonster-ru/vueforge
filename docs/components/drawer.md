# Drawer

## Purpose

Handle layered interactions (dialogs, overlays, contextual actions, and transient notifications) with consistent behavior.
Centralize close policies, focus management, and stack/layer contracts for complex SaaS screens.

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

## Theming

- Override via `theme.overrides.components.drawer`.

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

## Recipes

- Filter drawer: right-side drawer with apply/reset footer actions.
- Mobile bottom sheet: `position="bottom"` with compact content and `size="sm"`.
- Secondary navigation: left drawer with section links and optional persistent overlay.

## Responsive

Verify overlay sizing, placement fallback, and viewport collision handling on mobile/tablet/desktop.
Ensure gesture/touch close interactions and action buttons remain accessible on small screens.

## SSR/Hydration

Render closed/open initial state deterministically and keep portal/container structure hydration-safe.
Initialize positioning/focus logic only after mount to avoid server-client markup drift.

## Testing

Cover open/close triggers, escape/outside click behavior, focus trap/restore, and stacking order.
Add accessibility tests for ARIA roles, labelling, and keyboard navigation in layered UI.

## Accessibility

- Focus is trapped while drawer is open and restored to the previous element on close.
- Supports `Escape` close behavior when `closeOnEsc` is enabled.
- For top/bottom drawers, ensure content headings are descriptive for screen readers.

## Interaction Contract

- `modelValue=true`:
    - emits `open`
    - moves focus into drawer panel (first focusable element, otherwise panel)
    - traps `Tab`/`Shift+Tab` focus inside panel
    - locks document scroll when `lockScroll=true`
- Close triggers (`overlay`, `Escape`, close button/slot):
    - emit `update:modelValue=false`
    - emit `close`
    - restore focus to element active before open
- Behavior flags:
    - `overlay=false` hides overlay entirely
    - `closeOnOverlay=false` keeps drawer open on overlay click
    - `closeOnEsc=false` disables `Escape` close
    - `lockScroll=false` keeps body scrolling enabled

## Z-Index Policy

- Drawer root uses `zIndex` token (`--vf-drawer-z-index`, default `100`).
- Drawer and modal share default overlay layer (`100`) and are expected to be ordered by mount sequence unless overridden.
- Prefer project-level theme overrides for custom stacking rules instead of hardcoded component styles.
