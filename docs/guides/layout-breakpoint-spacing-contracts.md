# Layout Breakpoint and Spacing Contracts

## Goal

Define one shared contract for responsive layout switching and spacing tokens across shell/page presets (`AppShell`, `PageLayout`, `SplitLayout`, `AppBar`, `Footer`, `StickyRegion`).

## Breakpoint Contract

Use min-width breakpoints:

- `sm`: `640px`
- `md`: `768px`
- `lg`: `1024px`
- `xl`: `1280px`

Usage rules:

- `mobile`: `< md`
- `tablet`: `>= md` and `< lg`
- `desktop`: `>= lg`
- For shell-style components, default `mobileBreakpoint` must stay aligned to `lg` (`1024`) unless product has explicit override requirements.

## Spacing Scale Contract

Use a single 4px-based spacing scale for layout primitives and shell presets:

- `s1`: `0.25rem` (4px)
- `s2`: `0.5rem` (8px)
- `s3`: `0.75rem` (12px)
- `s4`: `1rem` (16px)
- `s5`: `1.25rem` (20px)
- `s6`: `1.5rem` (24px)
- `s8`: `2rem` (32px)

Preferred mapping:

- dense control spacing: `s1`-`s2`
- toolbar/app-bar/footer internal gaps: `s2`-`s3`
- page content paddings: `s4`-`s6`
- section-to-section shell spacing: `s6`-`s8`

## Token Mapping Guidance

Keep component token values snapped to the scale above:

- `appShell.headerPadding`, `appShell.contentPadding`, `appShell.footerPadding`
- `pageLayout.contentPadding`, `pageLayout.headerPadding`, `pageLayout.footerPadding`
- `splitLayout.padding`, `splitLayout.panelPadding`
- `appBar.padding`, `appBar.densePadding`
- `footer.padding`, `footer.densePadding`
- `stickyRegion.padding`

Avoid arbitrary values (for example `13px`) in shell/layout token overrides.

## Implementation Checklist for New Layout Work

- Keep responsive switches at contract breakpoints unless justified.
- Keep spacing tokens on the shared scale.
- Verify mobile/tablet/desktop behavior in component tests or visual scenarios.
- Document any intentional contract deviation in component docs and changelog.
