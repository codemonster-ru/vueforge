# OverlayPanel

OverlayPanel is a compatibility alias for `Popover` with legacy compatibility prop and event names.

## Import

```ts
import { OverlayPanel } from '@codemonster-ru/vueforge';
```

## Examples

### Basic

Use `OverlayPanel` when you need legacy `OverlayPanel` naming over the shared `Popover` implementation.

```vue
<OverlayPanel>
    <template #trigger>
        <Button label="Open overlay" />
    </template>

    Panel content
</OverlayPanel>
```

### Close Icon

Enable `show-close-icon` for explicit dismissal in denser utility surfaces.

```vue
<OverlayPanel :dismissable="false" show-close-icon>
    <template #trigger>
        <Button label="Quick actions" />
    </template>

    <template #header>
        Quick actions
    </template>

    Panel content
</OverlayPanel>
```

### Controlled

Use controlled mode when open state must stay synchronized with surrounding workflow state.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const open = ref(false);
</script>

<template>
    <OverlayPanel v-model="open" placement="bottom-end" />
</template>
```

## API

### Props

| Name            | Type                                                                              | Default                 |
| --------------- | --------------------------------------------------------------------------------- | ----------------------- |
| `modelValue`    | `boolean \| undefined`                                                            | `undefined`             |
| `placement`     | `'bottom' \| 'top' \| 'bottom-start' \| 'bottom-end' \| 'top-start' \| 'top-end'` | `'bottom'`              |
| `offset`        | `number`                                                                          | `8`                     |
| `disabled`      | `boolean`                                                                         | `false`                 |
| `dismissable`   | `boolean`                                                                         | `true`                  |
| `closeOnEscape` | `boolean`                                                                         | `true`                  |
| `showCloseIcon` | `boolean`                                                                         | `false`                 |
| `closeLabel`    | `string`                                                                          | `'Close overlay panel'` |
| `pt`            | `PassThroughOptions \| undefined`                                                 | `undefined`             |
| `unstyled`      | `boolean`                                                                         | `false`                 |

### Events

| Name                | Payload   |
| ------------------- | --------- |
| `update:modelValue` | `boolean` |
| `show`              | none      |
| `hide`              | none      |
| `onShow`            | none      |
| `onHide`            | none      |
| `click`             | none      |
| `onClick`           | none      |

### Slots

| Name                       | Description           |
| -------------------------- | --------------------- |
| `trigger` / `button`       | Trigger content.      |
| `default`                  | Main overlay content. |
| `header` / `popoverHeader` | Header content.       |
| `body` / `popoverBody`     | Body content.         |
| `footer` / `popoverFooter` | Footer content.       |

### Exposed Methods

| Name       | Description          |
| ---------- | -------------------- |
| `show()`   | Opens the overlay.   |
| `hide()`   | Closes the overlay.  |
| `toggle()` | Toggles the overlay. |

## Theming

`OverlayPanel` inherits `Popover` theming. Override `theme.overrides.components.popover`, and this repo also accepts the alias `theme.overrides.components.overlaypanel`.

## Tokens

- Uses the `Popover` token contract, including `borderRadius`, `borderColor`, `backgroundColor`, `shadow`, and `zIndex`

## Recipes

- Prefer `Popover` for new docs and canonical usage.
- Keep `OverlayPanel` only where compatibility with existing API names matters.

## Accessibility

- Inherits `Popover` keyboard and ARIA behavior, including outside dismissal and `Escape` handling when enabled.
- If you add a custom header close action, keep its accessible label explicit.
