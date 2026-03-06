# Drawer

Present slide-in panels for filters, secondary navigation, and contextual workflows.

## Import

```ts
import { Drawer } from '@codemonster-ru/vueforge';
```

## Examples

Use `Drawer` when the page should stay recognizable in the background and the task belongs to a side panel.

### Basic

Use a right-side drawer for filters or detail panels.

```vue
<template>
    <Drawer v-model="open" title="Filters" position="right">
        <template #body>
            <p>Drawer content</p>
        </template>
        <template #footer>
            <Button label="Reset" severity="secondary" size="small" />
            <Button label="Apply" size="small" @click="open = false" />
        </template>
    </Drawer>
</template>
```

### Left Navigation Drawer

Use `position="left"` for secondary navigation or workspace tools.

```vue
<template>
    <Drawer v-model="open" title="Navigation" position="left">
        <template #body>
            <Menu :items="[{ label: 'Overview', to: '/' }, { label: 'Members', to: '/members' }]" />
        </template>
    </Drawer>
</template>
```

### Bottom Drawer

Use `position="bottom"` for compact mobile-first flows or short task panels.

```vue
<template>
    <Drawer v-model="open" title="Quick actions" position="bottom" size="sm">
        <template #body>
            <Stack gap="0.75rem">
                <Button label="Duplicate" />
                <Button label="Archive" severity="secondary" />
            </Stack>
        </template>
    </Drawer>
</template>
```

### Overlay And Scroll Policy

Control whether the drawer behaves like a blocking overlay or a lighter utility panel.

```vue
<template>
    <Drawer v-model="open" :overlay="false" :lock-scroll="false" title="Inspector">
        <template #body>
            Non-blocking utility panel
        </template>
    </Drawer>
</template>
```

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

- Use drawers for secondary tasks that still need more structure than a popover.
- Choose side based on context: left for navigation, right for details/filters, bottom for mobile quick flows.
- Turn off overlay only for clearly non-blocking utility panels.

## Accessibility

- Focus is trapped while drawer is open and restored to the previous element on close.
- Supports `Escape` close behavior when `closeOnEsc` is enabled.
- For top/bottom drawers, ensure content headings are descriptive for screen readers.
