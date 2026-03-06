# DatePicker

Capture a single calendar date through a compact trigger with a floating month grid.

## Import

```ts
import { DatePicker } from '@codemonster-ru/vueforge';
```

## Examples

Use `DatePicker` when the user should choose one date and keep the value in canonical ISO form.

### Basic

Use the default picker for a single date field.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const startDate = ref('2026-03-16');
</script>

<template>
    <DatePicker v-model="startDate" placeholder="Pick date" />
</template>
```

### With Bounds

Use `min` and `max` to prevent invalid scheduling windows.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const billingDate = ref();
</script>

<template>
    <DatePicker
        v-model="billingDate"
        placeholder="Choose billing date"
        min="2026-01-01"
        max="2026-12-31"
    />
</template>
```

### Localized Week Start

Override `locale` and `firstDayOfWeek` when the surrounding workflow requires a specific calendar convention.

```vue
<template>
    <DatePicker
        model-value="2026-04-06"
        locale="de-DE"
        :first-day-of-week="1"
        placeholder="Wahle ein Datum"
    />
</template>
```

### Outlined Variant

Use `outlined` when the picker sits on a filled surface and needs lighter chrome.

```vue
<template>
    <DatePicker model-value="2026-06-01" variant="outlined" />
</template>
```

## Props

- `modelValue?: string` (v-model, ISO date `YYYY-MM-DD`)
- `placeholder?: string`
- `disabled?: boolean` (default `false`)
- `readonly?: boolean` (default `false`)
- `min?: string` (ISO date `YYYY-MM-DD`)
- `max?: string` (ISO date `YYYY-MM-DD`)
- `locale?: string` (default from global date/time locale config, fallback `en-US`)
- `firstDayOfWeek?: number` (default from global date/time locale config, fallback `0`, Sunday)
- `ariaLabel?: string` (default `Date picker`)
- `panelAriaLabel?: string` (default `Calendar`)
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

- Override via `theme.overrides.components.datepicker`.

## Tokens

Component tokens (override via `theme.overrides.components.datepicker`):

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
- `dayHoverBackgroundColor`, `daySelectedBackgroundColor`, `daySelectedTextColor`, `dayMutedColor`, `dayTodayBorderColor`
- `small.fontSize`, `small.padding`, `small.daySize`
- `large.fontSize`, `large.padding`, `large.daySize`

## Recipes

- Keep the emitted value in ISO format and localize only the display label.
- Use `Calendar` instead when the calendar grid itself should stay visible in the page layout.
- Apply `min` and `max` whenever the valid date window is bounded by business rules.

## Accessibility

- The trigger exposes popup semantics via `aria-haspopup="dialog"`, `aria-expanded`, and `aria-controls`.
- Keyboard support includes `ArrowDown` to open the panel and `Escape` to close it.
- Invalid ISO values are ignored and treated as an empty state rather than coerced.
- Locale and week-start defaults can be configured globally in [date-time-locale-setup.md](/Users/kolesnikov_k_a/Projects/Codemonster/JS/vueforge/docs/guides/date-time-locale-setup.md).
