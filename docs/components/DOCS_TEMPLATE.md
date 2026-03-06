# Component Docs Template

Use this structure for every component page in `docs/components`.

## Structure

Component pages should read like compact product docs:

- Start with a one-line summary directly under `# ComponentName`.
- Add `## Import` early with the package import users should copy.
- Put short scenario-driven examples before dense API details.
- Keep prose short; prefer multiple compact examples over one large tutorial.

## Standard Sections

1. `# ComponentName`
2. one short summary paragraph
3. `## Import`
4. `## Examples`
5. `## Props` or `## API`
6. `## Events` when applicable
7. `## Slots` when applicable
8. `## Theming`
9. `## Tokens`
10. `## Recipes`
11. `## Accessibility` (required)

## Examples Section Rules

- Prefer `### Basic`, `### Variants`, `### States`, `### Sizes`, `### Links`, or similarly concrete scenario titles.
- Add one short sentence before each example to explain when to use it.
- Keep examples previewable in the docs app: use plain template snippets and avoid `<script>` or `<style>` blocks.
- Treat examples as consumer-facing usage, not implementation tests.

## Accessibility Section Rules

- Must describe keyboard behavior (or explicitly state "no keyboard interaction" for display-only components).
- Must describe ARIA/state attributes used by the component.
- Must describe disabled/readonly/error semantics when applicable.
- For overlays/popups, must include open/close/focus/escape/outside-click behavior.

## Optional Sections

- `## API` instead of separate props/events/slots tables when that reads better
- `## Scope` for reference and pattern pages
- `## Guidance`
- `## Interaction Contract`
- `## Positioning and Z-Index Policy`
- `## Exposed Methods`

## Reference Pages

Shared-contract and pattern pages do not need to mimic visual component docs exactly.

- Prefer `## Scope` over `## Import` when the page documents a family contract rather than a concrete component.
- Keep the same rhythm: short intro, practical examples, then contract or guidance sections.
