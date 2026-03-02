# Live Examples in Component Docs

VueForge component pages now render examples directly inside the `Features` tab instead of routing users to a separate playground.

## What it includes

- example sections rendered inline on the page
- live preview above each code block when the example is template-only
- automatic reuse of the existing `## Examples` content from component markdown
- code-first fallback for stateful examples that still rely on local setup logic

## Why use it

- users see the component output immediately without opening another tab
- visual states and usage snippets stay coupled in one place
- `Features` becomes the primary discovery surface, while `API` stays reference-focused

## Suggested workflow

1. Start dev server: `npm run dev`
2. Open a component page under `/docs/components/...`
3. Add or refine the `## Examples` section in the component markdown
4. Keep simple template snippets previewable; leave stateful examples as code blocks until they need a dedicated live pattern
