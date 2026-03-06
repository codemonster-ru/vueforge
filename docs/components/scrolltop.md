# ScrollTop

ScrollTop renders a floating action button that scrolls the page or a container back to the top.

## Import

```ts
import ScrollTop from '@/package/components/scroll-top.vue';
```

## Examples

### Basic

Use `ScrollTop` on long pages where returning to the top is a common repeated action.

```vue
<ScrollTop :threshold="320" />
```

### Container Target

Point `target` at a scrollable panel or list instead of the global window.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const listRef = ref<HTMLElement | null>(null);
</script>

<template>
    <div ref="listRef" style="max-height: 16rem; overflow: auto;">...</div>
    <ScrollTop :target="listRef" behavior="auto" show-label label="Back" />
</template>
```

### Always Visible

Use `always-visible` when discoverability matters more than keeping chrome minimal.

```vue
<ScrollTop always-visible variant="outlined" />
```

### Custom Content

Override the default slot when the floating action needs custom text or icon treatment.

```vue
<ScrollTop show-label label="Top">
    <span style="display: inline-flex; gap: 0.375rem; align-items: center;">
        <span>Top</span>
    </span>
</ScrollTop>
```

## API

### Props

| Name | Type | Default |
| --- | --- | --- |
| `threshold` | `number` | `240` |
| `behavior` | `'auto' \| 'smooth'` | `'smooth'` |
| `target` | `Window \| HTMLElement \| null` | `null` |
| `right` | `string` | `'1rem'` |
| `bottom` | `string` | `'1rem'` |
| `zIndex` | `number \| string` | `'60'` |
| `showLabel` | `boolean` | `false` |
| `label` | `string` | `'Top'` |
| `icon` | `string` | `'arrowUp'` |
| `ariaLabel` | `string` | `'Scroll to top'` |
| `alwaysVisible` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `variant` | `'filled' \| 'outlined'` | `'filled'` |

### Events

| Name | Payload |
| --- | --- |
| `click` | `MouseEvent` |

### Slots

| Name | Description |
| --- | --- |
| `default` | Replaces the button content. |

## Theming

`ScrollTop` currently uses a CSS variable contract in component styles, but this repo does not include a dedicated preset file in `src/package/themes/default/components/` for it yet.

## Tokens

- `size`
- `padding`
- `gap`
- `borderRadius`
- `borderColor`
- `backgroundColor`
- `textColor`
- `hoverBackgroundColor`
- `focusRingColor`
- `iconSize`
- `labelFontSize`
- `disabledOpacity`

## Recipes

- Use `ScrollTop` for long documents, overflow lists, and admin surfaces where top-level filters or actions sit above the fold.
- Prefer threshold-based visibility unless the surface is dense enough that persistent affordance is clearly worth the extra chrome.

## Accessibility

- ScrollTop uses a native button with explicit label text or `aria-label`.
- When replacing the slot content, preserve an accessible name and visible focus styling.
