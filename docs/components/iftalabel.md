# IftaLabel

Wrap an input-like control with a compact in-field top-aligned label.

## Import

```ts
import { IftaLabel } from '@codemonster-ru/vueforge';
```

## Examples

Use `IftaLabel` when you want the label to stay visible inside the field chrome rather than float dynamically.

### Basic

Use it for compact enterprise-style form layouts.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const phone = ref('');
</script>

<template>
    <IftaLabel label="Phone" for-id="phone">
        <Input id="phone" v-model="phone" />
    </IftaLabel>
</template>
```

### Invalid

Use `invalid` to keep label styling aligned with an errored field.

```vue
<template>
    <IftaLabel label="Tax ID" for-id="tax-id" invalid required>
        <Input id="tax-id" model-value="12-ABC" />
    </IftaLabel>
</template>
```

### Larger Field

Adjust size with the wrapped control when the field density changes.

```vue
<template>
    <IftaLabel label="Company" for-id="company" size="large">
        <Input id="company" size="large" />
    </IftaLabel>
</template>
```

## Props

- `label?: string`
- `forId?: string`
- `required?: boolean` (default `false`)
- `disabled?: boolean` (default `false`)
- `invalid?: boolean` (default `false`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)

## Events

- This component does not emit component-specific events.

## Slots

- `default`
- `label`

## Theming

- Override via `theme.overrides.components.iftaLabel`.

## Tokens

Component tokens (override via `theme.overrides.components.iftaLabel`):

- `offsetX`, `offsetY`, `padding`
- `fontSize`, `color`, `backgroundColor`
- `requiredColor`, `invalidColor`, `disabledOpacity`
- `small.fontSize`, `large.fontSize`

## Recipes

- Use `IftaLabel` when forms are dense and the label should remain permanently visible.
- Treat it as a wrapper utility around the real form control.
- Keep the wrapped field padding visually compatible with the embedded label.

## Accessibility

- Uses native `<label>` association through `forId`.
- Required marker is decorative and exposed with `aria-hidden`.
