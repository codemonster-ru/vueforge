# Date/Time Parsing and Constraints

Scope: `DatePicker`, `Calendar`, `DateRangePicker`, `TimePicker`, `DateTimePicker`.

## Accepted Model Formats

- `DatePicker`: `YYYY-MM-DD`
- `Calendar`: `YYYY-MM-DD`
- `DateRangePicker`: `{ start?: 'YYYY-MM-DD', end?: 'YYYY-MM-DD' }`
- `TimePicker`: `HH:mm` (24-hour internal value)
- `DateTimePicker`: `YYYY-MM-DDTHH:mm`

Invalid values are ignored (component falls back to empty/unselected state and does not emit coerced values).

## Display Format Behavior

- Date labels are localized via `locale` where supported (`DatePicker`, `Calendar`, `DateRangePicker`, `DateTimePicker`).
- Time labels support:
    - `format="24h"`: `HH:mm`
    - `format="12h"`: `h:mm AM/PM`
- `TimePicker` and `DateTimePicker` keep emitted model values in canonical 24-hour format even when 12-hour labels are used.

## Constraints

- Date constraints:
    - `min`/`max` date boundaries disable out-of-range days.
    - Disabled days are non-selectable by mouse and keyboard.
- Time constraints:
    - `min`/`max` boundaries disable out-of-range time options.
    - `step` (`TimePicker`) and `minuteStep` (`DateTimePicker`) generate discrete selectable options.
- Combined date-time constraints (`DateTimePicker`):
    - Date disabling is based on day part.
    - Time disabling is additionally evaluated against selected day when it equals `min`/`max` day.
- Range constraints (`DateRangePicker`):
    - Selecting end before start resets range anchor according to component behavior.
    - Boundaries are applied to both start and end picks.

## Empty and Partial States

- Empty `modelValue` keeps placeholder/empty label.
- Range value with missing `start` or `end` is treated as partial range in-progress.
- Components do not auto-correct malformed strings into nearest valid date/time.

## Testing Guidance

- Include tests for:
    - invalid parse inputs
    - min/max day boundaries
    - min/max time boundaries on same day (`DateTimePicker`)
    - step/minute-step option generation
    - empty and partial model states

## Theming

- Reference guide for behavior; visual customization is applied via concrete component theme tokens.

## Accessibility

- Date/time constraints must be reflected visually and through disabled interaction states.
- Keyboard users must receive equivalent constraint behavior (cannot commit disabled/out-of-range values).
