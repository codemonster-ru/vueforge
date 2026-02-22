# Component Docs Template

Use this structure for every component page in `docs/components`.

## Required Sections

1. `# ComponentName`
2. `## Purpose`
3. `## Props`
4. `## Events`
5. `## Slots`
6. `## Examples`
7. `## Theming`
8. `## Tokens`
9. `## Recipes`
10. `## Accessibility` (required)
11. `## Responsive`
12. `## SSR/Hydration`
13. `## Testing`

## Accessibility Section Rules

- Must describe keyboard behavior (or explicitly state "no keyboard interaction" for display-only components).
- Must describe ARIA/state attributes used by the component.
- Must describe disabled/readonly/error semantics when applicable.
- For overlays/popups, must include open/close/focus/escape/outside-click behavior.

## Optional Sections

- `## States`
- `## Migration`
- `## Interaction Contract`
- `## Positioning and Z-Index Policy`
- `## Usage Constraints`
- `## Exposes`
