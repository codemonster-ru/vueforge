# AuditLogViewer

## Purpose

Display operational audit events as a table with quick detail inspection in a side drawer, including payload diff (`before`/`after`).

## Props

- `entries?: Array<AuditLogEntry>` (default `[]`)
- `drawerTitle?: string` (default `Audit details`)
- `emptyText?: string` (default `No audit records.`)
- `detailsLabel?: string` (default `View`)
- `ariaLabel?: string` (default `Audit log`)
- `showDiff?: boolean` (default `true`)
- `locale?: string` (default `en`)
- `timeZone?: string` (optional IANA timezone)

`AuditLogEntry`:

- `id?: string | number`
- `event: string`
- `summary?: string`
- `actor?: { id?: string | number; name: string; meta?: string }`
- `entity?: string`
- `timestamp?: string | number | Date`
- `payload?: unknown`
- `previousPayload?: unknown`

## Events

- `select({ entry, index })`
- `openDetails({ entry, index })`
- `closeDetails()`

## Slots

- `empty`

## Examples

```vue
<AuditLogViewer :entries="auditEvents" drawer-title="Audit event" @openDetails="trackOpen" />
```

## Theming

- Override via `theme.overrides.components.auditLogViewer`.

## Tokens

- `borderColor`, `borderRadius`, `backgroundColor`, `textColor`
- `dividerColor`, `headerBackgroundColor`
- `fontSize`, `cellPadding`
- `eventFontWeight`
- `metaColor`, `metaFontSize`
- `actionColor`, `actionFontSize`
- `detailsGap`, `sectionTitleFontSize`
- `monoFontFamily`, `monoFontSize`

## Recipes

- Use for admin and security pages where operators scan many events and inspect only selected records in the drawer.
- Keep `showDiff=true` for change-heavy entities (RBAC, billing, settings) to show field-level payload transitions.

## Accessibility

- Table uses semantic header/cell structure and configurable `ariaLabel`.
- Row details action is a native button.
- Detail pane uses `Drawer` dialog semantics with focus trap and `Escape` close behavior.

## Responsive

- Main table keeps horizontal overflow support on narrow screens.
- Detail drawer remains readable on mobile with wrapped diff payload blocks.

## SSR/Hydration

- Timestamp formatting is deterministic for static values; provide stable `locale`/`timeZone` where needed.
- Drawer interaction is client-driven and hydration-safe.

## Testing

- Cover table render, empty state, drawer open/close events, and payload diff output.
