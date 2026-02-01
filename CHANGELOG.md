# Changelog

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
