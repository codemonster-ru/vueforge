# Slider

Capture numeric values and ranges through direct drag or keyboard adjustment.

## Import

```ts
import { Slider } from '@codemonster-ru/vueforge';
```

## Examples

Use `Slider` when relative scale matters and the user benefits from continuous adjustment instead of typing.

### Basic

Use a single-value slider for volume, zoom, or threshold controls.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const volume = ref(60);
</script>

<template>
    <Slider v-model="volume" :min="0" :max="100" :step="5" showValue />
</template>
```

### Range

Enable `range` when the user should define a start and end boundary.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const priceRange = ref<[number, number]>([200, 700]);
</script>

<template>
    <Slider v-model="priceRange" :min="0" :max="1000" :step="10" range showValue />
</template>
```

### With Marks

Use marks for discrete milestones or commonly understood thresholds.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const retention = ref(30);
</script>

<template>
    <Slider
        v-model="retention"
        :min="7"
        :max="90"
        :step="1"
        :marks="[
            { value: 7, label: '7d' },
            { value: 30, label: '30d' },
            { value: 60, label: '60d' },
            { value: 90, label: '90d' },
        ]"
    />
</template>
```

### Sizes

Adjust size for compact control bars or more spacious settings surfaces.

```vue
<template>
    <Stack gap="1rem">
        <Slider :model-value="25" size="small" />
        <Slider :model-value="50" />
        <Slider :model-value="75" size="large" />
    </Stack>
</template>
```

## Props

- `modelValue?: number | [number, number]` (v-model)
- `min?: number` (default `0`)
- `max?: number` (default `100`)
- `step?: number` (default `1`)
- `range?: boolean` (default `false`)
- `disabled?: boolean` (default `false`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `showValue?: boolean` (default `false`)
- `marks?: Array<{ value: number; label?: string }>`
- `ariaLabel?: string` (default `Slider`)
- `ariaLabelStart?: string` (default `Start value`, range mode)
- `ariaLabelEnd?: string` (default `End value`, range mode)

## Events

- `update:modelValue`
- `input`
- `change`
- `focus`
- `blur`

## Slots

- This component does not expose named slots.

## Theming

- Override via `theme.overrides.components.slider`.

## Tokens

Component tokens (override via `theme.overrides.components.slider`):

- `width`, `gap`
- `textColor`
- `trackHeight`, `trackBackgroundColor`, `trackRadius`, `fillBackgroundColor`
- `thumbSize`, `thumbColor`, `thumbBorderColor`, `thumbBorderWidth`, `thumbShadow`
- `focusRingShadow`, `disabledOpacity`
- `markSize`, `markColor`, `markLabelFontSize`, `markLabelColor`, `marksHeight`
- `valueFontSize`, `valueColor`
- `small.trackHeight`, `small.thumbSize`, `small.valueFontSize`
- `large.trackHeight`, `large.thumbSize`, `large.valueFontSize`

## Recipes

- Use sliders only when approximate adjustment is faster than typing an exact number.
- Add marks when certain milestones matter more than arbitrary intermediate values.
- For precise financial or configuration input, pair the slider with a numeric field or use `NumberInput` directly.

## Accessibility

- Uses native `input[type="range"]` semantics for keyboard and assistive technology support.
- Provide explicit labels via `ariaLabel` for single-value sliders or `ariaLabelStart` and `ariaLabelEnd` for ranges.
- Keep thumb, track, and focus styles with sufficient contrast in custom themes.
