# ThemeModeSwitch

Switch between `system`, `light`, and `dark` theme modes through a compact segmented control.

## Import

```ts
import { ThemeModeSwitch } from '@codemonster-ru/vueforge';
```

## Examples

Use `ThemeModeSwitch` in app headers, docs shells, and appearance settings where theme preference is a top-level choice.

### Basic

Use the default small size for header-level theme controls.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const mode = ref<'system' | 'light' | 'dark'>('system');
</script>

<template>
    <ThemeModeSwitch v-model="mode" />
</template>
```

### Larger Settings Surface

Use `size="large"` when the control appears inside a settings form or preferences page.

```vue
<template>
    <ThemeModeSwitch model-value="dark" size="large" />
</template>
```

### Localized Labels

Override the labels when the surrounding UI is localized or uses different wording.

```vue
<template>
    <ThemeModeSwitch
        model-value="light"
        aria-label="Theme selection"
        system-label="Auto"
        light-label="Light"
        dark-label="Dark"
    />
</template>
```

## Props

- `modelValue?: 'system' | 'light' | 'dark'` (default `system`)
- `disabled?: boolean` (default `false`)
- `size?: 'small' | 'normal' | 'large'` (default `small`)
- `ariaLabel?: string` (default `Theme mode`)
- `systemLabel?: string` (default `System`)
- `lightLabel?: string` (default `Light`)
- `darkLabel?: string` (default `Dark`)

## Events

- `update:modelValue`
- `change`

## Slots

- This component does not expose named slots.

## Theming

- Override via `theme.overrides.components.themeModeSwitch`.

## Tokens

Component tokens (override via `theme.overrides.components.themeModeSwitch`):

- `fontSize`, `padding`, `gap`
- `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`
- `hoverBackgroundColor`, `activeBackgroundColor`, `activeTextColor`
- `focusRingShadow`, `disabledOpacity`
- `segmentPadding`, `segmentRadius`, `segmentFontWeight`
- `small.fontSize`, `small.padding`, `small.segmentPadding`
- `large.fontSize`, `large.padding`, `large.segmentPadding`

## Recipes

- Keep the persisted value separate from the actual resolved color scheme if your app also supports `system`.
- Use the small size in navigation chrome and larger sizes inside settings panels.
- Prefer clear labels over icon-only theme controls unless the context already explains the options.

## Accessibility

- Uses segmented-control radiogroup semantics under the hood.
- Provide `ariaLabel` when nearby text does not already describe the control's purpose.
