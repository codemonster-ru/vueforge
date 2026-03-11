# SaaS i18n and Timezone Validation

Purpose: capture explicit validation for localization and timezone-sensitive behavior across SaaS-oriented components.

## Coverage Scope

- Locale text API coverage (`localeText` config and per-component overrides).
- RTL interaction regression coverage for directional controls.
- Timezone-aware timestamp formatting where components render dates/times.

## Validation Matrix

| Area                          | Components                                                          | Covered |
| ----------------------------- | ------------------------------------------------------------------- | ------- |
| Global locale text            | `DataTable`, `Autocomplete`, `MultiSelect`, `VirtualScroller`       | Yes     |
| RTL interaction               | `DataTable`, `MultiSelect`, `TagInput`, `Rating`, `VirtualScroller` | Yes     |
| Date locale defaults          | `DatePicker`, `Calendar`, `DateRangePicker`, `DateTimePicker`       | Yes     |
| Timezone-sensitive timestamps | `CommentThread`                                                     | Yes     |

## Test Evidence

- `packages/vueforge/src/components/__tests__/comment-thread.test.ts`
    - Locale + explicit `timeZone` timestamp rendering.
- `tests/integration/rtl-regression.test.ts`
    - RTL behavior regression suite for critical components.
- `packages/vueforge/src/components/__tests__/calendar.test.ts`
- `packages/vueforge/src/components/__tests__/datepicker.test.ts`
- `packages/vueforge/src/components/__tests__/date-range-picker.test.ts`
- `packages/vueforge/src/components/__tests__/datetimepicker.test.ts`
    - Global date locale config and locale override behavior.

## Consumer Guidance

- For SSR-sensitive date/time UI, pass explicit `locale` and `timeZone` from app-level runtime config.
- Keep `localeText` and `dir` (`ltr`/`rtl`) synchronized with app i18n state.
- Avoid relying on environment-local timezone defaults for persisted audit/activity timestamps.
