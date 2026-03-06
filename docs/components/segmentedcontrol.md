# SegmentedControl

Switch between a small set of mutually exclusive modes with compact, always-visible options.

## Import

```ts
import { SegmentedControl } from '@codemonster-ru/vueforge';
```

## Examples

Use `SegmentedControl` when the user should switch modes quickly without opening a menu.

### Basic

Use it for list, grid, or board view switching.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const view = ref('list');
</script>

<template>
    <SegmentedControl
        v-model="view"
        :options="[
            { label: 'List', value: 'list' },
            { label: 'Grid', value: 'grid' },
            { label: 'Board', value: 'board' }
        ]"
    />
</template>
```

### Full Width

Use `fullWidth` when the control should fill a narrow mobile or settings container.

```vue
<template>
    <SegmentedControl
        model-value="monthly"
        fullWidth
        :options="[
            { label: 'Daily', value: 'daily' },
            { label: 'Weekly', value: 'weekly' },
            { label: 'Monthly', value: 'monthly' }
        ]"
    />
</template>
```

### Outlined Variant

Use `outlined` on filled cards or toolbars.

```vue
<template>
    <SegmentedControl
        model-value="light"
        variant="outlined"
        :options="[
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' }
        ]"
    />
</template>
```

### Disabled Option

Disable options that are visible but not currently available.

```vue
<template>
    <SegmentedControl
        model-value="team"
        :options="[
            { label: 'Personal', value: 'personal' },
            { label: 'Team', value: 'team' },
            { label: 'Enterprise', value: 'enterprise', disabled: true }
        ]"
    />
</template>
```

## Props

- `modelValue?: string | number`
- `options?: Array<{ label: string; value: string | number; disabled?: boolean }>` (default `[]`)
- `disabled?: boolean` (default `false`)
- `fullWidth?: boolean` (default `false`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `ariaLabel?: string`
- `ariaLabelledby?: string`

## Events

- `update:modelValue`
- `change`
- `focus`
- `blur`

## Slots

- This component does not expose named slots.

## Theming

- Override via `theme.overrides.components.segmentedControl`.

## Tokens

Component tokens (override via `theme.overrides.components.segmentedControl`):

- `fontSize`, `padding`, `gap`
- `borderRadius`, `borderColor`, `backgroundColor`, `textColor`
- `hoverBackgroundColor`, `activeBackgroundColor`, `activeTextColor`
- `focusRingShadow`, `disabledOpacity`
- `segmentPadding`, `segmentRadius`, `segmentFontWeight`
- `small.fontSize`, `small.padding`, `small.segmentPadding`
- `large.fontSize`, `large.padding`, `large.segmentPadding`

## Recipes

- Prefer segmented controls over tabs when the options switch one local mode rather than a major page section.
- Keep option labels short and parallel.
- Use `fullWidth` only when the container is narrow enough that the control should stretch.

## Accessibility

- Uses radiogroup and radio semantics.
- Arrow keys, `Home`, and `End` move focus and selection across enabled options.
