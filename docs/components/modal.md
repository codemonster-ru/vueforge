# Modal

Present blocking dialogs for confirmation, forms, and focused workflows in a centered overlay.

## Import

```ts
import { Modal } from '@codemonster-ru/vueforge';
```

## Examples

Use `Modal` for blocking tasks that require full user attention before returning to the page.

### Basic

Use a small modal for short confirmation or informational flows.

```vue
<template>
    <Modal v-model="open" title="Confirm action" size="sm">
        <template #body>
            <p>Are you sure?</p>
        </template>
        <template #footer>
            <Button label="Cancel" severity="secondary" @click="open = false" />
            <Button label="Confirm" @click="open = false" />
        </template>
    </Modal>
</template>
```

### Form Modal

Use the default medium size for embedded forms and multi-control flows.

```vue
<template>
    <Modal v-model="open" title="Create project">
        <template #body>
            <Stack gap="0.75rem">
                <Input placeholder="Project name" />
                <Textarea placeholder="Description" :rows="4" />
            </Stack>
        </template>
        <template #footer>
            <Button label="Cancel" variant="outlined" severity="secondary" @click="open = false" />
            <Button label="Create" @click="open = false" />
        </template>
    </Modal>
</template>
```

### Custom Header And Close Slot

Slots let the product replace the built-in title area and close control.

```vue
<template>
    <Modal v-model="open" :show-close="true">
        <template #header>
            <h3 style="margin: 0;">Workspace notice</h3>
        </template>
        <template #body>
            Custom modal content.
        </template>
    </Modal>
</template>
```

### Strict Dismiss Policy

Disable overlay and Escape dismissal when the user must make an explicit choice.

```vue
<template>
    <Modal v-model="open" title="Finish setup" :close-on-overlay="false" :close-on-esc="false">
        <template #body>
            Complete the required fields before continuing.
        </template>
    </Modal>
</template>
```

## Props

- `modelValue?: boolean` (v-model)
- `title?: string`
- `size?: 'sm' | 'md' | 'lg'`
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
- `body` (optional) - modal content (defaults to default slot if not provided)
- `default` (optional) - modal content if `body` slot is not used
- `footer` (optional)
- `close` (optional) - custom close button; slot props: `{ close }`

## Theming

- Override via `theme.overrides.components.modal`.

## Tokens

Component tokens (override via `theme.overrides.components.modal`):

- `width`, `maxWidth`, `maxHeight`
- `widthSm`, `maxWidthSm`
- `widthLg`, `maxWidthLg`
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

- Use `Modal` for blocking decisions and tasks; prefer `Popover` or `Drawer` when the page can remain interactive.
- Keep the title action-oriented so users immediately understand the reason for interruption.
- Disable passive dismiss only when the product truly requires an explicit outcome.

## Accessibility

- Focus is trapped while modal is open and restored to the previous element on close.
- Supports `Escape` close behavior when `closeOnEsc` is enabled.
- Uses overlay and close controls that should have clear labels/titles in content.
