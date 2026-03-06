# AuditLogViewer

AuditLogViewer displays audit events in a table with a detail drawer for payload inspection and diffs.

## Import

```ts
import AuditLogViewer from '@/package/components/audit-log-viewer.vue';
```

## Examples

### Basic

Use `AuditLogViewer` on admin and security screens where operators scan many records and open only selected details.

```vue
<AuditLogViewer :entries="auditEvents" drawer-title="Audit event" />
```

### Diff-Focused Details

Keep `show-diff` enabled for configuration or permission changes where before and after payloads matter.

```vue
<AuditLogViewer
    :entries="auditEvents"
    show-diff
    @open-details="trackOpen"
/>
```

### Custom Empty State

Use the `empty` slot when the audit surface needs product-specific onboarding or guidance.

```vue
<AuditLogViewer :entries="[]">
    <template #empty>
        No audit entries for the selected period.
    </template>
</AuditLogViewer>
```

## API

### Types

```ts
interface AuditLogEntry {
    id?: string | number;
    event: string;
    summary?: string;
    actor?: { id?: string | number; name: string; meta?: string };
    entity?: string;
    timestamp?: string | number | Date;
    payload?: unknown;
    previousPayload?: unknown;
}
```

### Props

| Name | Type | Default |
| --- | --- | --- |
| `entries` | `AuditLogEntry[]` | `[]` |
| `drawerTitle` | `string` | `'Audit details'` |
| `emptyText` | `string` | `'No audit records.'` |
| `detailsLabel` | `string` | `'View'` |
| `ariaLabel` | `string` | `'Audit log'` |
| `showDiff` | `boolean` | `true` |
| `locale` | `string` | `'en'` |
| `timeZone` | `string \| undefined` | `undefined` |

### Events

| Name | Payload |
| --- | --- |
| `select` | `{ entry, index }` |
| `openDetails` | `{ entry, index }` |
| `closeDetails` | none |

### Slots

| Name | Description |
| --- | --- |
| `empty` | Replaces the empty-state row. |

## Theming

Override component tokens through `theme.overrides.components.auditLogViewer`.

## Tokens

- Table surface: `borderColor`, `borderRadius`, `backgroundColor`, `textColor`, `dividerColor`, `headerBackgroundColor`
- Typography: `fontSize`, `eventFontWeight`, `metaColor`, `metaFontSize`, `actionColor`, `actionFontSize`
- Detail drawer content: `detailsGap`, `sectionTitleFontSize`, `monoFontFamily`, `monoFontSize`, `cellPadding`

## Recipes

- Use `showDiff` for change-heavy domains like RBAC, billing, and settings.
- Provide explicit `locale` and `timeZone` when audit timestamps must be stable across operators.

## Accessibility

- The main table uses semantic rows and headers.
- Detail inspection runs through `Drawer`, so focus and escape behavior follow dialog conventions.
