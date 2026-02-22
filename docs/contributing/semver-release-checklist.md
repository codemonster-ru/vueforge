# Semver Release Checklist

Use this checklist for every versioned release entry in `CHANGELOG.md`.

## Required Block

Add this block inside the release section (`## [x.y.z] - YYYY-MM-DD`):

```md
- Semver checklist:
    - [x] Semver impact classified (`patch`|`minor`|`major`)
    - [x] Breaking-change assessment completed (`yes`|`no`)
    - [x] Deprecations documented (or N/A)
    - [x] Migration notes added when required (or N/A)
    - [x] Catalog mapping sync completed (`yes`|`n/a`)
```

## Rules

- `patch`: bugfixes/docs/tests/refactors with no API break and no new public API.
- `minor`: backward-compatible public API additions or behavior expansions.
- `major`: any breaking API/behavior change.
- If breaking changes are marked `yes`, add migration notes in the same release section.
- If deprecations are introduced, explicitly describe replacement path and removal intent.
- Mark catalog sync as `yes` when `docs/audits/component-catalog-mapping.md` was reviewed/updated for the release scope, otherwise use `n/a` with explanation.

## Enforcement

- CI and publish pipelines run `npm run verify:semver`.
- The check validates the current `package.json` version section in `CHANGELOG.md`.
- Release is blocked if the required semver checklist items are missing or unchecked.

## Catalog Sync Gate

Before cutting a versioned release:

- Update [`docs/audits/component-catalog-mapping.md`](../audits/component-catalog-mapping.md) for all component additions/renames/deprecations included in the release.
- Ensure every newly introduced public component/API is marked in the mapping and in `CHECKLIST.md` (`implemented` or `deferred` with rationale).
- Add a short note in the release PR description: `Catalog mapping synced: yes`.
