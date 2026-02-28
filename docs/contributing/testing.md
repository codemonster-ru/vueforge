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

Mandatory quality gates for new public components:

- API contract documented (props/events/slots/defaults) and migration note added if behavior is breaking.
- Responsive behavior validated on mobile/tablet/desktop breakpoints.
- SSR/hydration behavior validated for dynamic/interactive paths.
- Visual regression baseline added for critical states/variants.
- Component row added to `docs/audits/component-compliance-matrix.md` with all gates set to `Yes` (or justified `N/A`) before merge.
- Package-level API spec entry in `docs/audits/component-api-package-specs.md` must be complete (`props/events/slots/a11y/responsive/SSR/tokens/tests`) before package closeout.

## Overlay-Specific Minimums

For `Modal`, `Drawer`, `Dropdown`, `Popover`, `Tooltip`, `ContextMenu`:

- close behavior (`Escape`, outside click where applicable)
- focus management (entry, trap if required, restore)
- positioning/collision behavior smoke assertions

## Review/PR Test Checklist

Before merge:

- [ ] Added/updated unit tests for changed behavior
- [ ] Added/updated docs for API/interaction changes
- [ ] Checked component catalog parity impact (`docs/audits/component-catalog-mapping.md`) and updated status for new/changed components
- [ ] Updated compliance rows for touched components in `docs/audits/component-compliance-matrix.md`
- [ ] All gate columns for touched implemented components are `Yes` (or explicitly justified `N/A`) in `docs/audits/component-compliance-matrix.md`
- [ ] For not-yet-implemented components, updated planning status in `docs/audits/planned-component-compliance-matrix.md`
- [ ] Updated package-level API specs in `docs/audits/component-api-package-specs.md` for touched components (`props/events/slots/a11y/responsive/SSR/tokens/tests`)
- [ ] Verified responsive behavior on mobile/tablet/desktop breakpoints and updated `Responsive` status in compliance matrix
- [ ] Confirmed no functional duplicate component is introduced; if alias/equivalent is intentional, documented rationale in `docs/audits/component-catalog-mapping.md`
- [ ] Ran `npm run lint`
- [ ] Ran `npm run typecheck`
- [ ] Ran targeted tests for changed components
- [ ] Confirmed no regressions in related component family

## Release/Semver Checklist

For any versioned release, complete the semver checklist in `CHANGELOG.md` and keep it checked.

- Required template and rules: [Semver Release Checklist](./semver-release-checklist.md)
- API consistency contribution process: [API Consistency Contribution Guide](./api-consistency-contribution-guide.md)
- Scope admission policy for new components/APIs: [What Belongs in Core Policy](./what-belongs-in-core-policy.md)
- Docs artifact output contract: [Docs Build Artifact Strategy](./docs-build-artifact-strategy.md)
- Docs SSH deployment contract and rollback: [Docs SSH Deployment Pipeline](./docs-ssh-deployment.md)
- Deprecation rules and lifecycle: [Deprecation Policy](./deprecation-policy.md)
- Breaking change classification rules: [Component-Level Breaking Change Rules](./component-breaking-change-rules.md)
- Enforcement command: `npm run verify:semver`
- Bundle-size gate command (after build): `npm run verify:bundle-size`

## CI Recommendation

- Keep at least one targeted test command in PR description.
- For large refactors, include quick summary of covered interaction paths.
- CI runs dedicated `ssr-hydration` (`npm run test:ssr`) in addition to core lint/typecheck/unit/build checks.
- CI validates docs static bundle generation with `npm run build:docs`.
- Use the standard failure workflow: [Regression Triage Playbook](./regression-triage-playbook.md)

## SSR/Hydration Baseline Checks

- Run SSR/hydration regression checks: `npm run test:ssr`
- Full guidance: [SSR and Hydration Checks](./ssr-hydration-checks.md)
