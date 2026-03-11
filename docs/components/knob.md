# Knob

Knob is a circular range control for compact adjustments and value display.

## Import

```ts
import { Knob } from '@codemonster-ru/vueforge';
```

## Examples

### Basic

Use `Knob` when radial input communicates value better than a linear slider.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const volume = ref(42);
</script>

<template>
    <Knob v-model="volume" />
</template>
```

### Range And Step

Adjust range and step for domain-specific inputs like gain, progress, or scoring controls.

```vue
<Knob v-model="volume" :min="0" :max="100" :step="5" />
```

### Readonly Display

Use `readonly` for a dashboard-style radial metric that should not accept input.

```vue
<Knob :model-value="72" readonly />
```

### Hidden Value

Disable the center value when nearby labels already explain the metric.

```vue
<Knob v-model="volume" :show-value="false" />
```

## API

### Props

| Name          | Type      | Default  |
| ------------- | --------- | -------- |
| `modelValue`  | `number`  | `0`      |
| `min`         | `number`  | `0`      |
| `max`         | `number`  | `100`    |
| `step`        | `number`  | `1`      |
| `size`        | `number`  | `120`    |
| `strokeWidth` | `number`  | `12`     |
| `showValue`   | `boolean` | `true`   |
| `disabled`    | `boolean` | `false`  |
| `readonly`    | `boolean` | `false`  |
| `ariaLabel`   | `string`  | `'Knob'` |

### Events

| Name                | Payload      |
| ------------------- | ------------ |
| `update:modelValue` | `number`     |
| `input`             | `number`     |
| `change`            | `number`     |
| `focus`             | `FocusEvent` |
| `blur`              | `FocusEvent` |

## Theming

Override component tokens through `theme.overrides.components.knob`.

## Tokens

- Track and fill: `trackColor`, `valueColor`, `strokeLinecap`
- Thumb and focus: `thumbColor`, `thumbSize`, `focusRingColor`, `focusRingShadow`
- Value text: `valueFontSize`, `valueFontWeight`, `valueColor`
- States: `disabledOpacity`

## Recipes

- Prefer `Knob` for compact, tactile controls where circular motion fits the product metaphor.
- Use `Slider` instead when precise comparison across values matters more than visual character.

## Accessibility

- `Knob` exposes slider semantics and supports keyboard interaction, so keep `aria-label` specific to the adjusted value.
- Avoid using it as the only input for critical numeric entry when exact text input is required.
