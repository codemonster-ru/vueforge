# Changelog

## [0.18.0] - 2026-02-04

- Added Alert component for inline status messages with severity variants, optional close control, and action slots.
- Added default theme tokens and typed token support for `components.alert`.
- Added Alert export, README docs, unit tests, and example app showcase.

## [0.17.0] - 2026-02-04

- Added FormField component with label/hint/error/required states and size variants.
- Added slot props (`id`, `describedBy`, `invalid`, `required`) to wire accessibility attributes on nested controls.
- Added default theme tokens and typed token support for `components.formField`.
- Added FormField export, README docs, unit tests, and example app showcase.

## [0.16.0] - 2026-02-04

- Added DatePicker component with calendar popup, min/max bounds, locale support, and keyboard/open-close handling.
- Added default theme tokens and typed token support for `components.datepicker`.
- Added DatePicker export, README docs, unit tests, and example app showcase.

## [0.15.0] - 2026-02-04

- Added Autocomplete component (combobox behavior) with local filtering, keyboard navigation, and search event.
- Added default theme tokens and typed token support for `components.autocomplete`.
- Added Autocomplete export, README docs, and example app showcase.
- Tests: added autocomplete unit tests.

## [0.14.0] - 2026-02-03

- Added Toast and ToastContainer components with theming tokens and auto-close support.
- Example app: added Toast showcase.
- Tests: added toast unit tests.
- Toast UI: close button aligned to the right.
- Docs: documented Toast API and tokens.

## [0.13.0] - 2026-02-03

- Added Tabs components (Tabs/Tab/TabPanel) with keyboard navigation and theming tokens.
- Example app: added Tabs showcase.
- Docs: documented Tabs API.

## [0.12.0] - 2026-02-03

- Added RadioGroup and RadioButton components with theming tokens.
- Example app: added RadioGroup/RadioButton showcase.
- Tests: added radio component unit tests.
- Docs: documented RadioGroup/RadioButton API.

## [0.11.0] - 2026-02-02

- Added Textarea component with theming tokens, example usage, and unit tests.
- Added `variant` support for Checkbox and Select (`filled`/`outlined`).
- Theme: added `controls.backgroundColor` token (defaults to `bgSoftColor`) and wired Input/Select/Textarea/Checkbox to it.
- Theme: removed CodeBlock tokens and default theme entry (component moved to separate package).

## [0.10.0] - 2026-02-02

- Added Tooltip component with theming tokens, arrow option, and example usage.
- Tooltip styling: arrow sizing/placement refinements and drop-shadow to match tooltip appearance.
- Tests: added tooltip unit tests.
- Tooling: migrated ESLint config to `eslint.config.ts` and updated lint script/deps.

## [0.9.0] - 2026-02-01

- Added Modal/Dialog component with theming tokens, size variants, and focus management.
- Docs: documented Modal API and theming tokens.
- Tooling: migrated ESLint config to flat format and upgraded lint/test tooling.

## [0.8.0] - 2026-02-01

- Theme core/runtime split: extracted pure theming logic and added runtime warnings for invalid token values.
- Theme sizes: centralized sm/lg sizing tokens and wired Button/Input/Select to them.
- Theme sizes: refined sm/lg padding values for better rhythm.
- Docs: added Tokens section with override examples.
- Lint: aligned switch/case indentation rule to avoid formatting conflicts.
- Theme strict mode: added `strict` option for invalid token values; non-hex colors now skip shade generation.
- Tests: added vitest coverage for theme core helpers.
- Types: exported `ThemeTokens`/`ThemeOptions`/`ThemePreset` and typed `components` tokens.
- Docs: documented default core token values.
- Theme API: added documentation for core theming methods and options.
- CI: added workflow to run lint/typecheck/test/build on push/PR.

## [0.7.0] - 2026-02-01

- UI sizing: unified control heights (32px) and box-sizing for Button/Input/Select.
- Typography: normalized font-size/line-height across components and enforced inherited font-family on form controls.
- Theme tokens: added base typography/radii/states/controls tokens and aligned component tokens to them.
- Example app: applied base typography on body.
- Dependencies: bumped `@codemonster-ru/floater.js` to 1.0.8 and removed local type shims.

## [0.6.1] - 2026-02-01

- Link: RouterLink type handling tightened to avoid undefined `to` at compile time.

## [0.6.0] - 2026-02-01

- Removed layout-related components and exports (Container, Header, Footer, Content, DefaultLayout, LeftSidebarLayout).
- Removed Demo and Logo components and their theme tokens.
- Example app now focuses only on component-level UI demos (layouts/routes removed).
- Styling tokens expanded to cover previously hardcoded component sizes/spacing and a shared border width token.
- Link: RouterLink type handling tightened to avoid undefined `to` at compile time.

## [0.5.0] - 2026-01-31

- Example app now includes demos for all components and layout previews.
- Accessibility improvements for Select, Popover, and Menu (ARIA attributes, keyboard support).
- Select: fixed outside‑click handling and cleanup of floating listeners on close.
- Link: active state resolution improved for path/name targets.
- Menu: separator styling fixed for consistent rendering.
- Build: entry selection now follows Vite `mode`, peer deps are externalized.

## [0.4.0] - 2026-01-25

- Theme manager with runtime updates and selector customization.
- Safer theme parsing and hex validation for color shade generation.
- Improved shade generation using HSL lightness adjustments.
- Demo page shows runtime theme switching in action.
- Unified component event/props patterns and improved slot naming in Popover.
- Added form components: Input, Select, Checkbox, Switch.

## [0.3.5] - 2025-05-11

- Core components: Button, Link, Card, Logo, Menu, Header, Footer, Content, Popover, Container, Demo.
- Layouts: DefaultLayout, LeftSidebarLayout.
- CSS variable theming with light/dark schemes and generated color shades.
- DefaultTheme preset.
- Vite lib build with type generation.
- Example app in `src/example`.
