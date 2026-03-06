# Calendar

Keep a full month grid visible in the page layout for direct date browsing and selection.

## Import

```ts
import { Calendar } from '@codemonster-ru/vueforge';
```

## Examples

Use `Calendar` when the calendar itself should remain visible instead of being hidden behind a trigger.

### Basic

Use an inline calendar for dashboard filters, side panels, and booking surfaces.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const selectedDate = ref('2026-03-12');
</script>

<template>
    <Calendar v-model="selectedDate" />
</template>
```

### With Bounds

Use `min` and `max` to disable invalid dates directly in the grid.

```vue
<template>
    <Calendar model-value="2026-05-15" min="2026-05-01" max="2026-05-31" />
</template>
```

### Monday Week Start

Override `firstDayOfWeek` when the surrounding product convention expects Monday-first calendars.

```vue
<template>
    <Calendar model-value="2026-04-07" locale="fr-FR" :first-day-of-week="1" />
</template>
```

### Outlined Variant

Use `outlined` to reduce visual weight on filled or tinted surfaces.

```vue
<template>
    <Calendar model-value="2026-08-20" variant="outlined" />
</template>
```

## Props

- `modelValue?: string` (v-model, ISO date `YYYY-MM-DD`)
- `disabled?: boolean` (default `false`)
- `readonly?: boolean` (default `false`)
- `min?: string` (ISO date `YYYY-MM-DD`)
- `max?: string` (ISO date `YYYY-MM-DD`)
- `locale?: string` (default from global date/time locale config, fallback `en-US`)
- `firstDayOfWeek?: number` (default from global date/time locale config, fallback `0`, Sunday)
- `ariaLabel?: string` (default `Calendar`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)

## Events

- `update:modelValue`
- `change`

## Slots

- This component does not expose named slots.

## Theming

- Override via `theme.overrides.components.calendar`.

## Tokens

Component tokens (override via `theme.overrides.components.calendar`):

- `width`, `fontSize`, `padding`
- `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`
- `disabledOpacity`
- `headerGap`, `headerPadding`, `monthLabelFontSize`, `monthLabelFontWeight`
- `navButtonSize`, `navButtonRadius`, `navButtonFontSize`
- `weekdayColor`, `weekdayFontSize`, `weekdaysMarginBottom`
- `daysGap`, `daySize`, `dayFontSize`, `dayBorderRadius`
- `dayHoverBackgroundColor`, `daySelectedBackgroundColor`, `daySelectedTextColor`, `dayMutedColor`, `dayTodayBorderColor`
- `small.fontSize`, `small.padding`, `small.daySize`
- `large.fontSize`, `large.padding`, `large.daySize`

## Recipes

- Prefer `Calendar` over `DatePicker` when the grid should always stay visible and interactive.
- Keep the model in ISO date format and localize only the visible labels.
- Apply `min` and `max` for booking or reporting windows so disabled dates are obvious before interaction.

## Accessibility

- Grid day navigation supports arrow keys, `Home`, `End`, `PageUp`, and `PageDown`.
- Date commit is keyboard-accessible via `Enter` and `Space`.
- Locale and week-start defaults can be configured globally in [date-time-locale-setup.md](/Users/kolesnikov_k_a/Projects/Codemonster/JS/vueforge/docs/guides/date-time-locale-setup.md).
