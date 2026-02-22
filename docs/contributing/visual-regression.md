# Visual Regression Testing

VueForge uses Playwright screenshot comparisons to detect unintended visual changes in core components.

## Commands

- Install browser runtime once:
    - `npx playwright install chromium`
- Run visual regression checks:
    - `npm run test:visual`
- Update visual baselines intentionally:
    - `npm run test:visual:update`

## Scope

- Visual tests run against a deterministic showcase route: `/visual-regression`.
- Baseline snapshots are stored in `tests/visual/visual-regression.spec.ts-snapshots`.
- Current baseline target is Chromium only.

## Triage Rules

- If a screenshot diff is unexpected, treat it as regression and fix component/theme code.
- If UI change is intentional, update snapshots and include rationale in PR/changelog notes.
- Keep the showcase route stable: avoid async data, system-time output, or animation-dependent states.
- Use the full incident workflow: [Regression Triage Playbook](./regression-triage-playbook.md)
