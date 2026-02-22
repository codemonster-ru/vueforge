# SSR and Hydration Checks

VueForge includes a dedicated SSR/hydration regression test to detect server-client markup mismatches early.

## Command

- Run SSR/hydration checks:
    - `npm run test:ssr`

## What is verified

- Core baseline components can be rendered to HTML via `@vue/server-renderer`.
- Client hydration of the same markup completes without Vue hydration mismatch warnings.
- Hydrated DOM keeps expected content and key structural nodes.

## Scope and limits

- This check is a fast baseline guard, not a full Nuxt/SSR integration suite.
- Add focused SSR tests when a component introduces browser-only runtime behavior.
- Use the shared failure workflow: [Regression Triage Playbook](./regression-triage-playbook.md)
