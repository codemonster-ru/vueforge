# Rating

Rating captures or displays a score across a fixed number of steps, including fractional values.

## Import

```ts
import { Rating } from '@codemonster-ru/vueforge';
```

## Examples

### Basic

Use `Rating` for reviews, quality scores, and lightweight preference input.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const score = ref(3);
</script>

<template>
    <Rating v-model="score" />
</template>
```

### Half Steps

Enable `allow-half` when users need finer control than whole-star increments.

```vue
<Rating v-model="score" allow-half size="large" />
```

### Precision Display

Use `precision` with `readonly` for review summaries that need decimal accuracy.

```vue
<Rating :model-value="3.7" :precision="0.1" readonly />
```

### Clearable Input

Enable `clearable` when users should be able to remove a previously selected score.

```vue
<Rating v-model="score" clearable />
```

## API

### Props

| Name         | Type                             | Default     |
| ------------ | -------------------------------- | ----------- |
| `modelValue` | `number`                         | `0`         |
| `max`        | `number`                         | `5`         |
| `size`       | `'small' \| 'normal' \| 'large'` | `'normal'`  |
| `allowHalf`  | `boolean`                        | `false`     |
| `precision`  | `number \| undefined`            | `undefined` |
| `clearable`  | `boolean`                        | `false`     |
| `readonly`   | `boolean`                        | `false`     |
| `disabled`   | `boolean`                        | `false`     |
| `ariaLabel`  | `string`                         | `''`        |

### Events

| Name                | Payload      |
| ------------------- | ------------ |
| `update:modelValue` | `number`     |
| `change`            | `number`     |
| `focus`             | `FocusEvent` |
| `blur`              | `FocusEvent` |

### Slots

| Name          | Description               |
| ------------- | ------------------------- |
| `icon`        | Replaces the empty icon.  |
| `active-icon` | Replaces the filled icon. |

## Theming

Override component tokens through `theme.overrides.components.rating`.

## Tokens

- Base: `gap`, `size`, `color`, `activeColor`, `hoverColor`
- States: `focusRingShadow`, `focusRadius`, `disabledOpacity`
- Sizes: `small.size`, `large.size`

## Recipes

- Use `precision` for display-oriented ratings and `allowHalf` for interactive scoring that should stay simple.
- Use `clearable` when the form model distinguishes between no rating and a low rating.

## Accessibility

- The component uses `radiogroup` and `radio` semantics with keyboard support for arrows, `Home`, `End`, number keys, and clear shortcuts.
- Horizontal arrow behavior respects RTL layout direction.
