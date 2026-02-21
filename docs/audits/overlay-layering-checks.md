# Overlay Layering Checks

Scope: verify default overlay-capable components follow a consistent z-index policy.

## Baseline Layer Map (Default Theme)

- `dropdown`: `50`
- `popover`: `70`
- `modal`: `100`
- `drawer`: `100`
- `commandPalette`: `110`
- `toast`: `120`
- `tour`: `120`
- `notificationCenter`: `125`

## Policy

- Navigation/context overlays (`dropdown`, `popover`) stay below blocking overlays.
- Blocking overlays (`modal`, `drawer`) form the baseline app-modal layer.
- Global command/search overlays (`commandPalette`) sit above blocking overlays.
- Feedback/onboarding overlays (`toast`, `tour`) stay above command palette.
- Notification hub (`notificationCenter`) is highest by default.

## Verification Notes

- Values are sourced from `src/package/themes/default/components/*`.
- Component docs include matching z-index guidance for the affected families.
- Changes to default token values should update this audit and related docs together.
