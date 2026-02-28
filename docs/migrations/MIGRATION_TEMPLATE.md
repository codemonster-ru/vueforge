# Migration Guide Template

Use this template when a release introduces breaking behavior, deprecated APIs, or mandatory adoption steps.

## Header

- Version: `x.y.z`
- Release date: `YYYY-MM-DD`
- Semver impact: `major` | `minor` (with deprecations)
- Affected scope: components/APIs/packages

## Executive Summary

- What changed and why.
- Who is affected.
- Estimated migration effort (`low` | `medium` | `high`).

## Breaking Changes

For each breaking item:

- Change: what was removed/changed.
- Old usage:

```ts
// previous API
```

- New usage:

```ts
// replacement API
```

- Required action.
- Automation possibility (`codemod`, `manual`, `mixed`).

## Deprecations

For each deprecated item:

- Deprecated API.
- Replacement API.
- First deprecated in version.
- Planned removal version.
- Temporary compatibility behavior (if any).

## Behavior Changes (Non-Breaking but Notable)

- Defaults changed.
- Accessibility behavior changes.
- Styling/theming token changes.
- Performance/runtime behavior changes.

## Component-by-Component Checklist

- [ ] Updated imports
- [ ] Updated renamed props/events/slots
- [ ] Updated removed aliases
- [ ] Updated theme token keys
- [ ] Updated tests for new behavior
- [ ] Verified SSR/hydration for affected flows
- [ ] Verified responsive behavior for affected flows

## Verification Commands

Run and record output in migration PR:

```bash
npm run lint
npm run typecheck
npm run test
npm run test:ssr
npm run build
npm run verify:bundle-size
```

## Rollback Plan

- Safe rollback target version.
- Data/config compatibility notes.
- Temporary feature flags/shims (if applicable).

## References

- Changelog section link.
- Related docs links.
- Related PR/issues links.
