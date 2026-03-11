# TimePicker

Capture a time-of-day value through a trigger and option list while keeping a canonical `HH:mm` model.

## Import

```ts
import { TimePicker } from '@codemonster-ru/vueforge';
```

## Examples

Use `TimePicker` when the user should pick one discrete time value rather than type free-form text.

### Basic

Use the default picker for straightforward meeting or reminder times.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const meetingTime = ref('10:30');
</script>

<template>
    <TimePicker v-model="meetingTime" placeholder="Pick time" />
</template>
```

### With Bounds And Step

Use `min`, `max`, and `step` to match business-hour or scheduling increments.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const supportWindow = ref();
</script>

<template>
    <TimePicker v-model="supportWindow" placeholder="Choose start time" min="09:00" max="18:00" :step="15" />
</template>
```

### 12-Hour Labels

Use `format="12h"` when the UI should display AM or PM labels while still emitting `HH:mm`.

```vue
<template>
    <TimePicker model-value="14:15" format="12h" />
</template>
```

### Outlined Variant

Use `outlined` on filled cards or filter bars.

```vue
<template>
    <TimePicker model-value="08:00" variant="outlined" />
</template>
```

## Props

- `modelValue?: string` (v-model, time `HH:mm`)
- `placeholder?: string`
- `disabled?: boolean` (default `false`)
- `readonly?: boolean` (default `false`)
- `min?: string` (time `HH:mm`)
- `max?: string` (time `HH:mm`)
- `step?: number` (minutes, default `30`)
- `format?: '24h' | '12h'` (default `24h`)
- `ariaLabel?: string` (default `Time picker`)
- `panelAriaLabel?: string` (default `Time options`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)

## Events

- `update:modelValue`
- `change`
- `focus`
- `blur`

## Slots

- This component does not expose named slots.

## Theming

- Override via `theme.overrides.components.timepicker`.

## Tokens

Component tokens (override via `theme.overrides.components.timepicker`):

- `minWidth`, `fontSize`, `controlGap`, `chevronSize`
- `padding`, `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`
- `disabledOpacity`
- `panelBackgroundColor`, `panelBorderColor`, `panelPadding`, `panelMaxHeight`, `panelRadiusOffset`, `panelShadow`
- `optionPadding`, `optionBorderRadius`
- `optionHoverBackgroundColor`, `optionActiveBackgroundColor`, `optionActiveTextColor`
- `small.fontSize`, `small.padding`
- `large.fontSize`, `large.padding`

## Recipes

- Keep the model in `HH:mm` even when displaying 12-hour labels.
- Use bounded steps for appointment-like flows and coarser steps for lower-precision settings.
- Prefer `DateTimePicker` when the time must be selected in the context of a date.

## Accessibility

- The trigger exposes popup semantics via `aria-haspopup="listbox"`, `aria-expanded`, and `aria-controls`.
- The options list supports `ArrowUp`, `ArrowDown`, `Home`, `End`, `Enter`, `Space`, and `Escape`.
- Invalid time strings are ignored for display state and treated as empty placeholders.
