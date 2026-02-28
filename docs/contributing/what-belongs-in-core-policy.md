# What Belongs in Core Policy

This policy defines whether a new capability should be implemented in VueForge core, shipped as an addon, or rejected from roadmap scope.

## Decision Outcomes

- `core`: implement in the main package.
- `addon`: implement outside core package with documented integration contract.
- `not planned`: do not implement; record rationale in catalog mapping.

## Core Admission Criteria

A proposal should be accepted to `core` only when all are true:

1. Reusability:
    - Solves a repeated cross-product UI problem, not a single app/domain-specific flow.
2. Parity impact:
    - Closes a meaningful gap in `Must-have` or `High-leverage` parity scope.
3. API stability:
    - Can be expressed with stable, convention-aligned API (`props/events/slots/v-model`).
4. Accessibility viability:
    - Keyboard/ARIA/focus behavior can be implemented and tested to parity baseline.
5. Maintenance budget:
    - Team can own tests/docs/a11y/responsive/SSR/visual coverage after release.
6. Bundle budget fit:
    - No unacceptable impact on bundle-size budgets or runtime performance gates.

## Keep Out of Core

Default to `addon` or `not planned` when:

- Capability is highly niche or vertical-specific.
- Requires heavy/optional external engine better managed as peer/addon.
- Overlaps with existing canonical component without clear capability delta.
- Cannot meet accessibility or SSR/hydration standards.
- Requires unstable API likely to churn before v1.

## Duplicate and Alias Rule

- One canonical component per functional domain.
- Alias/equivalent entries are allowed only for migration compatibility.
- Alias proposals must include: canonical owner, API differences, and deprecation path.

## Required Proposal Template

Every new component/API proposal must include:

- Problem statement and target user flows.
- Why existing components cannot cover the need.
- Core vs addon decision and rationale.
- Expected parity category impact (`Must-have`, `High-leverage`, `Nice-to-have`, `ICP optional`).
- Risk notes: a11y, performance, SSR/hydration, docs complexity.
- Rollout plan and checklist touchpoints.

## Enforcement

- Record decision in `docs/audits/component-catalog-mapping.md` (`implemented` / `deferred` / `not planned` + rationale).
- Update `CHECKLIST.md` when accepted to scope.
- Apply API consistency and breaking/deprecation policies from contributing docs.
- Reject PRs that introduce duplicate functionality without policy-backed exception.
