# ThemeModeSwitch

## Purpose

Provide a compact reusable theme-mode selector (`system`, `light`, `dark`) for app headers, docs shells, and settings toolbars.

## Props

- `modelValue?: 'system' | 'light' | 'dark'` (default `system`)
- `disabled?: boolean` (default `false`)
- `size?: 'small' | 'normal' | 'large'` (default `small`)
- `ariaLabel?: string` (default `Theme mode`)
- `systemLabel?: string` (default `System`)
- `lightLabel?: string` (default `Light`)
- `darkLabel?: string` (default `Dark`)

## Events

- `update:modelValue` (`'system' | 'light' | 'dark'`)
- `change` (`'system' | 'light' | 'dark'`, `Event`)

## Example

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { ThemeModeSwitch } from '@codemonster-ru/vueforge';

const mode = ref<'system' | 'light' | 'dark'>('system');
</script>

<template>
    <ThemeModeSwitch v-model="mode" />
</template>
```

## Accessibility

- Uses segmented control radiogroup semantics.
- Provide `ariaLabel` in contexts where nearby text does not describe purpose.

## Theming

- Supports component tokens via `components.themeModeSwitch`.
- Key tokens: `backgroundColor`, `borderColor`, `textColor`, `hoverBackgroundColor`, `activeBackgroundColor`, `activeTextColor`, `focusRingShadow`, `segmentPadding`, `small.segmentPadding`, `large.segmentPadding`.

```ts
setTheme({
    preset: defaultTheme,
    overrides: {
        components: {
            themeModeSwitch: {
                borderColor: '#334155',
                activeBackgroundColor: '#1d4ed8',
                activeTextColor: '#dbeafe',
            },
        },
    },
});
```

## Testing

- Verify model updates on option clicks.
- Verify keyboard navigation inherited from segmented control behavior.
