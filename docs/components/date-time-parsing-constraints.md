# Date/Time Parsing And Constraints

This page documents accepted model formats and constraint behavior for the date and time input family.

## Scope

The contract below applies to `DatePicker`, `Calendar`, `DateRangePicker`, `TimePicker`, and `DateTimePicker`.

## Examples

### Canonical Model Values

Use canonical string formats in app state even when the UI displays localized labels.

```ts
const dueDate = '2026-03-10';
const reviewTime = '14:30';
const publishedAt = '2026-03-10T14:30';
const vacationRange = ['2026-03-10', '2026-03-14'] as const;
```

### Range With Partial Selection

`DateRangePicker` supports partial tuples while the second boundary is still being chosen.

```ts
const inProgressRange: [string | null, string | null] = ['2026-03-01', null];
```

### Constraint-Driven UI

Bounds should disable invalid choices instead of silently coercing the value.

```vue
<DateTimePicker
    min="2026-03-10T09:00"
    max="2026-03-10T18:00"
    :minute-step="15"
/>
```

## Accepted Model Formats

- `DatePicker`: `YYYY-MM-DD`
- `Calendar`: `YYYY-MM-DD`
- `DateRangePicker`: `[start, end] | null`, where each item is `YYYY-MM-DD` or `null`
- `TimePicker`: `HH:mm`
- `DateTimePicker`: `YYYY-MM-DDTHH:mm`

Invalid values are ignored. Components fall back to an empty or unselected display state and do not emit coerced replacements.

## Display Behavior

- Date labels are localized through `locale` where supported: `DatePicker`, `Calendar`, `DateRangePicker`, and `DateTimePicker`.
- Locale and week-start defaults can be configured globally in [date-time-locale-setup.md](/Users/kolesnikov_k_a/Projects/Codemonster/JS/vueforge/docs/guides/date-time-locale-setup.md).
- `TimePicker` and `DateTimePicker` support:
  - `format="24h"` -> `HH:mm`
  - `format="12h"` -> `h:mm AM/PM`
- Even in `12h` mode, emitted time values stay in canonical 24-hour format.

## Constraints

- Date bounds:
  - `min` and `max` disable out-of-range days.
  - Disabled days are not selectable by pointer or keyboard.
- Time bounds:
  - `min` and `max` disable out-of-range time options.
  - `step` in `TimePicker` and `minuteStep` in `DateTimePicker` generate discrete selectable options.
- Combined datetime bounds:
  - `DateTimePicker` disables dates by day and then filters time options again when the selected day matches the min or max boundary day.
- Range bounds:
  - `DateRangePicker` applies limits to both start and end picks.
  - Selecting an end date before the current start resets the in-progress range anchor according to component behavior.

## Empty And Partial States

- Empty values keep the placeholder or empty label.
- `DateRangePicker` supports partial tuples such as `['2026-03-01', null]` while the second date is still being chosen.
- Components do not auto-correct malformed strings into the nearest valid date or time.

## Validation Guidance

- Test invalid parse inputs and empty-state fallback rendering.
- Test `min` and `max` day boundaries for `DatePicker`, `Calendar`, and `DateRangePicker`.
- Test `min` and `max` time boundaries for `TimePicker`.
- Test same-day min or max logic in `DateTimePicker`.
- Test `step` and `minuteStep` option generation.
- Test partial range tuples and range reset behavior.

## Accessibility

- Constraint state must be reflected both visually and through disabled interaction state.
- Keyboard users should receive the same blocked behavior for out-of-range dates and times as pointer users.
