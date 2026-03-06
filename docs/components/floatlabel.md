# FloatLabel

Wrap an input-like control with a floating label that moves above the field when focused or filled.

## Import

```ts
import { FloatLabel } from '@codemonster-ru/vueforge';
```

## Examples

Use `FloatLabel` when the label should stay visually attached to the field without occupying permanent top space.

### Basic

Use it around a single text-like control.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const email = ref('');
</script>

<template>
    <FloatLabel label="Email" :value="email" for-id="email">
        <Input id="email" v-model="email" />
    </FloatLabel>
</template>
```

### Required

Use `required` when the field is mandatory and the visual marker should stay with the label.

```vue
<template>
    <FloatLabel label="Workspace name" value="VueForge" for-id="workspace-name" required>
        <Input id="workspace-name" model-value="VueForge" />
    </FloatLabel>
</template>
```

### Always Float

Set `alwaysFloat` when the label must remain above the control even when empty.

```vue
<template>
    <FloatLabel label="Search" always-float for-id="search">
        <Input id="search" placeholder="Type query" />
    </FloatLabel>
</template>
```

## Props

- `label?: string`
- `modelValue?: unknown`
- `value?: unknown`
- `active?: boolean`
- `alwaysFloat?: boolean`
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

- Override via `theme.overrides.components.floatLabel`.

## Tokens

Component tokens (override via `theme.overrides.components.floatLabel`):

- `labelOffsetX`, `labelFloatingTop`, `labelPadding`
- `labelFontSize`, `labelFloatingFontSize`
- `labelColor`, `labelFloatingColor`, `labelBackgroundColor`
- `requiredColor`, `invalidColor`, `transition`, `disabledOpacity`
- `small.labelFontSize`, `large.labelFontSize`

## Recipes

- Treat `FloatLabel` as a utility wrapper, not as a form control by itself.
- Bind `value` or `modelValue` so the floating state reflects the wrapped control reliably.
- Use it with controls that visually support in-field labeling; for denser enterprise forms, `IftaLabel` may read more clearly.

## Accessibility

- Uses native `<label>` association through `forId`.
- Required marker is decorative and exposed with `aria-hidden`.
