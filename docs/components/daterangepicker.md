# DateRangePicker

Capture a start and end date through one trigger and a shared range-selection calendar.

## Import

```ts
import { DateRangePicker } from '@codemonster-ru/vueforge';
```

## Examples

Use `DateRangePicker` for reporting, booking, and filter flows where start and end dates belong to one decision.

### Basic

Use the default picker for a simple reporting range.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const dateRange = ref<[string | null, string | null] | null>(['2026-03-01', '2026-03-15']);
</script>

<template>
    <DateRangePicker v-model="dateRange" placeholder="Pick date range" />
</template>
```

### Partial Range

Allow partial values while the user is still choosing the second date.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const inProgress = ref<[string | null, string | null] | null>(['2026-04-01', null]);
</script>

<template>
    <DateRangePicker v-model="inProgress" start-placeholder="Start date" end-placeholder="End date" />
</template>
```

### With Bounds

Use `min` and `max` to constrain the selectable reporting window.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const fiscalRange = ref();
</script>

<template>
    <DateRangePicker v-model="fiscalRange" min="2026-01-01" max="2026-12-31" separator=" to " />
</template>
```

### Outlined Variant

Use `outlined` when the control sits on a filled surface.

```vue
<template>
    <DateRangePicker :model-value="['2026-06-01', '2026-06-30']" variant="outlined" />
</template>
```

## Props

- `modelValue?: [string | null, string | null] | null` (v-model, ISO dates `YYYY-MM-DD`)
- `placeholder?: string`
- `startPlaceholder?: string` (default `Start`)
- `endPlaceholder?: string` (default `End`)
- `separator?: string` (default `-`)
- `disabled?: boolean` (default `false`)
- `readonly?: boolean` (default `false`)
- `min?: string` (ISO date `YYYY-MM-DD`)
- `max?: string` (ISO date `YYYY-MM-DD`)
- `locale?: string` (default from global date/time locale config, fallback `en-US`)
- `firstDayOfWeek?: number` (default from global date/time locale config, fallback `0`, Sunday)
- `ariaLabel?: string` (default `Date range picker`)
- `panelAriaLabel?: string` (default `Calendar range`)
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

- Override via `theme.overrides.components.daterangepicker`.

## Tokens

Component tokens (override via `theme.overrides.components.daterangepicker`):

- `minWidth`, `fontSize`, `controlGap`, `chevronSize`
- `padding`, `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`
- `disabledOpacity`
- `panelWidth`, `panelBackgroundColor`, `panelBorderColor`, `panelPadding`, `panelRadiusOffset`, `panelShadow`
- `headerGap`, `headerPadding`, `monthLabelFontSize`, `monthLabelFontWeight`
- `navButtonSize`, `navButtonRadius`, `navButtonFontSize`
- `weekdayColor`, `weekdayFontSize`, `weekdaysMarginBottom`
- `daysGap`, `daySize`, `dayFontSize`, `dayBorderRadius`
- `dayHoverBackgroundColor`, `daySelectedBackgroundColor`, `daySelectedTextColor`
- `dayRangeBackgroundColor`, `dayRangeTextColor`, `dayMutedColor`, `dayTodayBorderColor`
- `small.fontSize`, `small.padding`, `small.daySize`
- `large.fontSize`, `large.padding`, `large.daySize`

## Recipes

- Use one range picker instead of two separate date pickers when the dates are conceptually one filter.
- Keep placeholders explicit so partial ranges remain understandable.
- When the range must include time-of-day, compose `DateTimePicker` values explicitly instead of stretching this component.

## Accessibility

- The trigger exposes popup semantics via `aria-haspopup="dialog"`, `aria-expanded`, and `aria-controls`.
- The day grid supports arrow-key navigation, `Home`, `End`, `PageUp`, `PageDown`, `Enter`, and `Space`.
- Invalid ISO values are ignored and rendered as an empty or partial state rather than coerced.
- Locale and week-start defaults can be configured globally in [date-time-locale-setup.md](/Users/kolesnikov_k_a/Projects/Codemonster/JS/vueforge/docs/guides/date-time-locale-setup.md).
