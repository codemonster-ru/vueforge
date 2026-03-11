# ColorPicker

ColorPicker provides a compact color input with presets, text entry, and optional alpha control.

## Import

```ts
import { ColorPicker } from '@codemonster-ru/vueforge';
```

## Examples

### Basic

Use `ColorPicker` for theme settings, tag colors, and visual annotation tools.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const brandColor = ref('#3b82f6');
</script>

<template>
    <ColorPicker v-model="brandColor" />
</template>
```

### RGB With Alpha

Use `format="rgb"` and `alpha` when transparency is part of the authoring workflow.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const brandColorRgba = ref('rgba(59, 130, 246, 0.8)');
</script>

<template>
    <ColorPicker v-model="brandColorRgba" format="rgb" alpha variant="outlined" />
</template>
```

### Presets

Use presets when the product should guide users toward a controlled palette.

```vue
<ColorPicker v-model="brandColor" :presets="['#2563eb', '#0f766e', '#dc2626', '#f59e0b']" />
```

### Readonly

Keep the control focusable but non-editable with `readonly`.

```vue
<ColorPicker model-value="#111827" readonly />
```

## API

### Props

| Name          | Type                             | Default          |
| ------------- | -------------------------------- | ---------------- |
| `modelValue`  | `string`                         | `'#3b82f6'`      |
| `format`      | `'hex' \| 'rgb' \| 'hsl'`        | `'hex'`          |
| `alpha`       | `boolean`                        | `false`          |
| `presets`     | `string[]`                       | `[]`             |
| `placeholder` | `string`                         | `'#3b82f6'`      |
| `disabled`    | `boolean`                        | `false`          |
| `readonly`    | `boolean`                        | `false`          |
| `size`        | `'small' \| 'normal' \| 'large'` | `'normal'`       |
| `variant`     | `'filled' \| 'outlined'`         | `'filled'`       |
| `ariaLabel`   | `string`                         | `'Color picker'` |

### Events

| Name                | Payload  |
| ------------------- | -------- |
| `update:modelValue` | `string` |
| `change`            | `string` |
| `open`              | none     |
| `close`             | none     |

## Theming

Override component tokens through `theme.overrides.components.colorPicker`.

## Tokens

- Field: `minWidth`, `gap`, `fontSize`, `padding`, `borderRadius`, `borderColor`, `backgroundColor`, `textColor`, `placeholderColor`
- States: `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`, `disabledOpacity`
- Swatch and panel: `swatchSize`, `swatchRadius`, `panelPadding`, `panelBorderColor`, `panelBackgroundColor`, `panelShadow`, `panelGap`, `rangeAccentColor`
- Presets and sizes: `presetSize`, `presetRadius`, `presetBorderColor`, `presetHoverBorderColor`, `small.*`, `large.*`

## Recipes

- Use presets when color choice should stay aligned with brand or severity systems.
- Keep free-form formats for editor-like tools where arbitrary values are expected.

## Accessibility

- The trigger uses `aria-haspopup="dialog"` and exposes `aria-expanded` while the panel is open.
- `readonly` keeps the control focusable but prevents panel interaction and value changes.
