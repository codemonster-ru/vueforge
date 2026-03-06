# DateTimePicker

Capture a combined date and time value with a shared calendar and time-option surface.

## Import

```ts
import { DateTimePicker } from '@codemonster-ru/vueforge';
```

## Examples

Use `DateTimePicker` when a timestamp matters and the user should choose date and time in one flow.

### Basic

Use the default picker for scheduling and event timestamps.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const meetingAt = ref('2026-03-18T14:30');
</script>

<template>
    <DateTimePicker v-model="meetingAt" placeholder="Pick date and time" />
</template>
```

### With Bounds

Use `min` and `max` when the timestamp must stay inside an operational window.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const releaseAt = ref();
</script>

<template>
    <DateTimePicker
        v-model="releaseAt"
        min="2026-03-01T09:00"
        max="2026-03-31T18:00"
        :minute-step="15"
    />
</template>
```

### 12-Hour Labels

Use `format="12h"` to show AM or PM labels while still emitting canonical 24-hour values.

```vue
<template>
    <DateTimePicker model-value="2026-07-10T17:45" format="12h" />
</template>
```

### Outlined Variant

Use `outlined` on filled panels, filter bars, and embedded forms.

```vue
<template>
    <DateTimePicker model-value="2026-08-12T10:00" variant="outlined" />
</template>
```

## Props

- `modelValue?: string` (v-model, ISO datetime `YYYY-MM-DDTHH:mm`)
- `placeholder?: string`
- `disabled?: boolean` (default `false`)
- `readonly?: boolean` (default `false`)
- `min?: string` (ISO datetime `YYYY-MM-DDTHH:mm`)
- `max?: string` (ISO datetime `YYYY-MM-DDTHH:mm`)
- `locale?: string` (default from global date/time locale config, fallback `en-US`)
- `firstDayOfWeek?: number` (default from global date/time locale config, fallback `0`, Sunday)
- `minuteStep?: number` (default `30`)
- `format?: '24h' | '12h'` (default `24h`)
- `ariaLabel?: string` (default `Date and time picker`)
- `panelAriaLabel?: string` (default `Date and time selection`)
- `timeListAriaLabel?: string` (default `Time options`)
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

- Override via `theme.overrides.components.datetimepicker`.

## Tokens

Component tokens (override via `theme.overrides.components.datetimepicker`):

- `minWidth`, `fontSize`, `controlGap`, `chevronSize`
- `padding`, `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`
- `disabledOpacity`
- `panelWidth`, `panelBackgroundColor`, `panelBorderColor`, `panelPadding`, `panelRadiusOffset`, `panelShadow`, `panelGap`
- `headerGap`, `headerPadding`, `monthLabelFontSize`, `monthLabelFontWeight`
- `navButtonSize`, `navButtonRadius`, `navButtonFontSize`
- `weekdayColor`, `weekdayFontSize`, `weekdaysMarginBottom`
- `daysGap`, `daySize`, `dayFontSize`, `dayBorderRadius`
- `dayHoverBackgroundColor`, `daySelectedBackgroundColor`, `daySelectedTextColor`, `dayMutedColor`, `dayTodayBorderColor`
- `timesWidth`, `timesMaxHeight`, `timesPaddingLeft`, `timesBorderColor`
- `timeOptionPadding`, `timeOptionBorderRadius`, `timeOptionFontSize`
- `timeOptionHoverBackgroundColor`, `timeOptionActiveBackgroundColor`, `timeOptionActiveTextColor`
- `small.fontSize`, `small.padding`, `small.daySize`
- `large.fontSize`, `large.padding`, `large.daySize`

## Recipes

- Prefer this component when the date and time constraints are coupled.
- Keep the emitted value in ISO datetime format and localize only the visible label.
- Use `minuteStep` to match how precise the user is expected to be.

## Accessibility

- The trigger exposes dialog semantics and the time column exposes a labeled listbox.
- Time options support keyboard navigation with `ArrowUp`, `ArrowDown`, `Home`, `End`, `Enter`, `Space`, and `Escape`.
- Locale and week-start defaults can be configured globally in [date-time-locale-setup.md](/Users/kolesnikov_k_a/Projects/Codemonster/JS/vueforge/docs/guides/date-time-locale-setup.md).
