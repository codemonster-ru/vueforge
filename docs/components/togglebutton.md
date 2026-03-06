# ToggleButton

Capture a binary pressed state with button semantics instead of checkbox-style form semantics.

## Import

```ts
import { ToggleButton } from '@codemonster-ru/vueforge';
```

## Examples

Use `ToggleButton` when the control should behave and read like an action button with a persisted pressed state.

### Basic

Use on and off labels to make the current state explicit.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const pinned = ref(true);
</script>

<template>
    <ToggleButton v-model="pinned" on-label="Pinned" off-label="Pin" />
</template>
```

### With Icons

Use state-specific icons when they improve quick recognition.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const watching = ref(false);
</script>

<template>
    <ToggleButton
        v-model="watching"
        on-label="Watching"
        off-label="Watch"
        on-icon="eye"
        off-icon="eyeSlash"
    />
</template>
```

### Variants

Switch variant to match the surrounding surface and action density.

```vue
<template>
    <Inline gap="0.5rem" wrap="wrap">
        <ToggleButton :model-value="true" variant="filled" on-label="Filled" />
        <ToggleButton :model-value="true" variant="outlined" on-label="Outlined" />
        <ToggleButton :model-value="true" variant="text" on-label="Text" />
    </Inline>
</template>
```

### Sizes

Adjust size for toolbar actions or more prominent action strips.

```vue
<template>
    <Inline gap="0.5rem" wrap="wrap">
        <ToggleButton :model-value="true" size="small" on-label="Small" />
        <ToggleButton :model-value="true" on-label="Default" />
        <ToggleButton :model-value="true" size="large" on-label="Large" />
    </Inline>
</template>
```

## Props

- `modelValue?: boolean` (default `false`)
- `disabled?: boolean` (default `false`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined' | 'text'` (default `filled`)
- `label?: string`
- `onLabel?: string`
- `offLabel?: string`
- `icon?: string`
- `onIcon?: string`
- `offIcon?: string`
- `ariaLabel?: string`
- `ariaLabelOn?: string`
- `ariaLabelOff?: string`

## Events

- `update:modelValue`
- `change`

## Slots

- `default` - label content (overrides resolved label text)

## Theming

- Override via `theme.overrides.components.toggleButton`.

## Tokens

Component tokens (override via `theme.overrides.components.toggleButton`):

- `fontSize`, `padding`, `borderRadius`
- `borderColor`, `backgroundColor`, `textColor`
- `hoverBackgroundColor`
- `activeBorderColor`, `activeBackgroundColor`, `activeTextColor`
- `focusRingShadow`, `disabledOpacity`, `iconGap`
- `small.fontSize`, `small.padding`
- `large.fontSize`, `large.padding`

## Recipes

- Prefer `ToggleButton` over `Switch` when the control belongs in a toolbar, action row, or formatting UI.
- Prefer `Switch` when the state is a settings preference and should read as enabled or disabled.
- Use state-specific labels or icons so the pressed state remains understandable at a glance.

## Accessibility

- Exposes `aria-pressed` for toggle state.
- Use `ariaLabelOn` and `ariaLabelOff` when the visible text is ambiguous or icon-only.
- Keep focus styles and pressed-state contrast visible in every theme.
