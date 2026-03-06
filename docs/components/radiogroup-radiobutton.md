# RadioGroup / RadioButton

Capture one choice from a small predefined set with native radio semantics.

## Import

```ts
import { RadioButton, RadioGroup } from '@codemonster-ru/vueforge';
```

## Examples

Use `RadioGroup` when exactly one option from a short list may be selected.

### Basic

Use a vertical group for straightforward settings and form sections.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const plan = ref('pro');
</script>

<template>
    <RadioGroup v-model="plan" name="plan">
        <RadioButton value="starter">Starter</RadioButton>
        <RadioButton value="pro">Pro</RadioButton>
        <RadioButton value="enterprise">Enterprise</RadioButton>
    </RadioGroup>
</template>
```

### Horizontal Layout

Use horizontal direction when the option count is small and labels are short.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const density = ref('comfortable');
</script>

<template>
    <RadioGroup v-model="density" direction="horizontal" name="density">
        <RadioButton value="compact">Compact</RadioButton>
        <RadioButton value="comfortable">Comfortable</RadioButton>
        <RadioButton value="spacious">Spacious</RadioButton>
    </RadioGroup>
</template>
```

### Outlined Variant

Use `outlined` when the radios sit on a filled surface and need lighter chrome.

```vue
<template>
    <RadioGroup model-value="weekly" variant="outlined" name="digest">
        <RadioButton value="daily">Daily</RadioButton>
        <RadioButton value="weekly">Weekly</RadioButton>
        <RadioButton value="never">Never</RadioButton>
    </RadioGroup>
</template>
```

### Standalone RadioButton

Use standalone mode only when integrating a single radio into an existing form abstraction.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const selected = ref('a');
</script>

<template>
    <RadioButton v-model="selected" value="a" name="standalone" label="Standalone option" />
</template>
```

## RadioGroup Props

- `modelValue?: string | number | boolean` (v-model)
- `name?: string`
- `disabled?: boolean` (default `false`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `direction?: 'vertical' | 'horizontal'` (default `vertical`)
- `ariaLabel?: string`
- `ariaLabelledby?: string`

## RadioButton Props

- `modelValue?: string | number | boolean` (standalone mode)
- `value?: string | number | boolean`
- `label?: string`
- `disabled?: boolean` (default `false`)
- `name?: string`
- `variant?: 'filled' | 'outlined'` (default `filled`)

## Events

- `RadioGroup`: `update:modelValue`, `change`
- `RadioButton`: `update:modelValue` (standalone mode), `change`

## Slots

- `RadioGroup`: `default` for `RadioButton` items
- `RadioButton`: `default` - label content (fallbacks to `label`)

## Theming

- Override via `theme.overrides.components.radio`.

## Tokens

Component tokens (override via `theme.overrides.components.radio`):

- `size`, `dotSize`, `gap`, `groupGap`
- `borderRadius`, `dotBorderRadius`
- `borderColor`, `backgroundColor`
- `checkedBackgroundColor`, `checkedBorderColor`, `dotColor`
- `textColor`, `disabledOpacity`

## Recipes

- Use radios when the user should compare mutually exclusive options side by side.
- Keep option labels short and parallel so scanning the set is easy.
- Prefer `RadioGroup` over standalone radios whenever the options belong to one decision.

## Accessibility

- `RadioGroup` uses `role="radiogroup"` and supports group labels via `ariaLabel` or `ariaLabelledby`.
- Native radio inputs preserve expected arrow-key, tab, and checked-state behavior.
- Keep visible focus styles and contrast for both the indicator and label text.
