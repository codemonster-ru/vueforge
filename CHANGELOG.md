# Changelog

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
