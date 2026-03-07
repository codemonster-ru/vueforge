# BlockUI

BlockUI prevents interaction with a surface or the full viewport while background work is in progress.

## Import

```ts
import BlockUI from '@/package/components/block-ui.vue';
```

## Examples

### Basic

Use `BlockUI` to disable a card, form, or pane while keeping its content visible.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const blocked = ref(true);
</script>

<template>
    <BlockUI v-model="blocked" label="Saving changes">
        <div style="padding: 1rem; min-height: 10rem;">Form content</div>
    </BlockUI>
</template>
```

### Full Screen

Enable `full-screen` when the whole application shell should be blocked during critical operations.

```vue
<BlockUI v-model="blocked" full-screen label="Deploying release">
    <div style="padding: 1rem; min-height: 10rem;">Release dashboard</div>
</BlockUI>
```

### Soft Overlay

Use the default soft variant when content should remain legible underneath the overlay.

```vue
<BlockUI v-model="blocked" variant="soft" :blur="2">
    <div style="padding: 1rem; min-height: 10rem;">Workspace summary</div>
</BlockUI>
```

### Custom Overlay

Override the overlay slot when a richer blocking state needs custom messaging or actions.

```vue
<BlockUI v-model="blocked" :show-spinner="false">
    <template #overlay>
        <div style="display: grid; gap: 0.5rem; text-align: center;">
            <strong>Sync in progress</strong>
            <span>Please wait while we update workspace data.</span>
        </div>
    </template>

    <div style="padding: 1rem; min-height: 10rem;">Dashboard content</div>
</BlockUI>
```

## API

### Props

| Name | Type | Default |
| --- | --- | --- |
| `modelValue` | `boolean` | `false` |
| `fullScreen` | `boolean` | `false` |
| `showSpinner` | `boolean` | `true` |
| `label` | `string` | `''` |
| `ariaLabel` | `string` | `'Blocked content'` |
| `zIndex` | `number` | `1000` |
| `variant` | `'soft' \| 'dim'` | `'soft'` |
| `blur` | `number` | `0` |

### Events

| Name | Payload |
| --- | --- |
| `block` | none |
| `unblock` | none |

### Slots

| Name | Description |
| --- | --- |
| `default` | Content that becomes blocked. |
| `overlay` | Custom overlay content. |

## Theming

Override component tokens through `theme.overrides.components.blockUi`.

## Tokens

- Overlay layout: `zIndex`, `gap`, `padding`
- Overlay surface: `softBackgroundColor`, `dimBackgroundColor`, `blur`
- Text and indicators: `textColor`, `labelFontSize`

## Recipes

- Use `BlockUI` for short, blocking operations where interaction must stop but context should remain visible.
- Prefer non-blocking feedback such as `Spinner` or `Toast` when users can continue working elsewhere.

## Accessibility

- Blocking overlays should explain what is happening, especially for operations that last more than a moment.
- For full-screen blocking states, make sure product code also prevents accidental background shortcuts or conflicting actions.
