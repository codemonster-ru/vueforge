# Testing Expectations and Review Checklist

## Minimum Test Coverage for New/Updated Components

For every new component or behavior update, include tests for:

- Render baseline:
    - default render
    - key prop/state render variants
- Core interactions:
    - primary user flow (click/input/select/etc.)
    - keyboard flow for interactive components
- Accessibility:
    - required role/aria state assertions
    - focus/open/close behavior for overlays
- Edge cases:
    - empty/invalid values
    - disabled/readonly behavior

## Overlay-Specific Minimums

For `Modal`, `Drawer`, `Dropdown`, `Popover`, `Tooltip`, `ContextMenu`:

- close behavior (`Escape`, outside click where applicable)
- focus management (entry, trap if required, restore)
- positioning/collision behavior smoke assertions

## Review/PR Test Checklist

Before merge:

- [ ] Added/updated unit tests for changed behavior
- [ ] Added/updated docs for API/interaction changes
- [ ] Ran `npm run lint`
- [ ] Ran `npm run typecheck`
- [ ] Ran targeted tests for changed components
- [ ] Confirmed no regressions in related component family

## Release/Semver Checklist

For any versioned release, complete the semver checklist in `CHANGELOG.md` and keep it checked.

- Required template and rules: [Semver Release Checklist](./semver-release-checklist.md)
- Enforcement command: `npm run verify:semver`

## CI Recommendation

- Keep at least one targeted test command in PR description.
- For large refactors, include quick summary of covered interaction paths.
