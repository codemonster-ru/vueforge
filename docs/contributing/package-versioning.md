# Package Versioning

VueForge now uses independent package versioning.

Each published package has its own version, its own release tag, and its own NPM publish flow.

## Release Tags

- `vueforge-vx.y.z` publishes `@codemonster-ru/vueforge`
- `layouts-vx.y.z` publishes `@codemonster-ru/vueforge-layouts`

The version in the tag must exactly match the version in the target package's `package.json`.

## Version Ownership

- `packages/vueforge/package.json` controls `@codemonster-ru/vueforge`
- `packages/layouts/package.json` controls `@codemonster-ru/vueforge-layouts`

The root workspace `package.json` version is not the release source of truth for package publishing.

## Bump Rules

- Bump only the package whose public API, runtime behavior, CSS, types, or docs contract changed.
- Do not bump sibling packages unless they actually changed or their dependency range must move.
- Use normal semver rules per package:
    - `patch`: bugfix/docs/tests/internal refactor with no public break
    - `minor`: additive backward-compatible API
    - `major`: breaking API/behavior change

## Cross-Package Dependency Rules

`layouts` depends on `@codemonster-ru/vueforge`.

When `@codemonster-ru/vueforge` changes:

- If the existing dependency range in a consumer package still accepts the new core version, you do not need to release that consumer package.
- If a consumer package requires a newer core range, bump that consumer package too and update its dependency range.

Examples:

1. Core bugfix only:
    - `@codemonster-ru/vueforge` goes from `0.100.0` to `0.100.1`
    - `layouts` stays unchanged if its range already allows it
2. New layouts feature that uses existing core API:
    - bump only `@codemonster-ru/vueforge-layouts`
3. New layouts feature that requires a newly added core API:
    - bump `@codemonster-ru/vueforge`
    - update `packages/layouts/package.json` dependency range
    - bump `@codemonster-ru/vueforge-layouts`

## Release Flow

1. Update the target package version in its `package.json`.
2. If needed, update dependency ranges in sibling package manifests.
3. Add release notes to `CHANGELOG.md`.
4. Push the matching package tag.

Examples:

```bash
git tag vueforge-v0.101.0
git tag layouts-v0.100.2
```

## Changelog Discipline

`CHANGELOG.md` remains repository-wide, but every release entry should clearly name the package scope it applies to.

Recommended wording:

- `Package: @codemonster-ru/vueforge`
- `Package: @codemonster-ru/vueforge-layouts`

If one change affects multiple packages, list all affected packages explicitly.

## Current Limitation

The publish workflow validates tag-to-package version matching and publishes only the targeted package.

It does not automatically infer sibling version bumps. Dependency range updates remain an explicit maintainer responsibility.
