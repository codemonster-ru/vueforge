# Regression Triage Playbook

Use this playbook when any CI quality gate fails (`core`, `ssr-hydration`, `visual-regression`).

## Triage Flow

1. Reproduce locally with the exact failing command from CI.
2. Classify the failure:
    - product regression (behavior/UI/a11y changed unintentionally)
    - intentional change not yet reflected in tests/snapshots/docs
    - test flake or environment issue
3. Scope impact:
    - affected component(s)
    - affected user flow(s)
    - release risk (`high`, `medium`, `low`)
4. Decide action:
    - fix code for regressions
    - update tests/snapshots for intentional changes
    - stabilize test for flaky checks
5. Document outcome in PR:
    - root cause
    - fix/mitigation
    - verification commands run

## Command Map

- Core checks:
    - `npm run lint`
    - `npm run typecheck`
    - `npm run test`
    - `npm run build`
- SSR/hydration checks:
    - `npm run test:ssr`
- Visual regression checks:
    - `npm run test:visual`
    - `npm run test:visual:update` (intentional UI changes only)

## Decision Rules

- `core` or `ssr-hydration` failure:
    - Treat as blocker by default.
    - Merge only after behavior and test expectations are aligned.
- `visual-regression` failure:
    - If unintentional, fix UI/theme/component code.
    - If intentional, update snapshots and include rationale in PR/changelog.
    - Never update snapshots without confirming expected UI outcome.

## Flake Handling

- If failure is non-deterministic, rerun the same command once.
- If second run passes:
    - mark as flaky risk in PR notes
    - open follow-up to stabilize the test
- If second run fails:
    - treat as real regression until proven otherwise.

## PR Checklist Add-on

- [ ] Failure reproduced locally
- [ ] Failure type classified (regression/intentional/flake)
- [ ] Root cause documented
- [ ] Fix or snapshot update justified
- [ ] Relevant commands rerun and passed
