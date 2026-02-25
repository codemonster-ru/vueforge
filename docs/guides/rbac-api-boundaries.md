# RBAC API Boundaries

Purpose: define where VueForge components provide UI state only and where backend authorization must be the source of truth.

## Core Rule

- VueForge components never enforce authorization.
- Components render and emit interaction intent.
- Backend services must validate every protected operation.

## UI-only vs Backend-enforced

Use this split for all SaaS flows:

- UI-only:
    - Visibility toggles (`disabled`, hidden controls, readonly states).
    - Local optimistic state (`selected rows`, temporary filters, draft permission edits).
    - Interaction telemetry (`analytics`, `change`, `toggle`, `action` events).
- Backend-enforced:
    - Final allow/deny decision for mutations.
    - Scope constraints (tenant/project/resource ownership).
    - Export/download authorization and data redaction.
    - Audit trail identity and persisted permission state.

## Component Mapping

High-risk SaaS components and required backend ownership:

- `PermissionMatrix`:
    - UI emits proposed state transitions (`inherit/allow/deny`).
    - Backend validates actor can modify each role-capability edge and persists canonical matrix.
- `DataTable` (`bulkAction`, `exportAction`):
    - UI emits selected keys/query context.
    - Backend validates each row/action and returns per-item failures when partially unauthorized.
- `SavedViewsManager` / `DataTableToolbar` filters:
    - UI stores/edit presets.
    - Backend enforces ownership/sharing ACL and rejects unauthorized preset changes.
- `CommandPalette` / `NotificationCenter` action links:
    - UI exposes shortcuts/actions.
    - Backend or route guards must verify permission at destination action handler.
- `FileManager` / `AuditLogViewer` / `CommentThread`:
    - UI can show candidate operations.
    - Backend validates read/write/resolve/delete operations and records actor identity.

## API Contract Recommendations

- Treat UI events as intent, not trust.
- Include stable identifiers (`resourceId`, `tenantId`, `roleId`) in mutation payloads.
- Return structured authorization errors (`code`, `resource`, `action`) for deterministic UI feedback.
- Support partial-success bulk responses to avoid silent unauthorized drops.

## Anti-patterns

- Relying on hidden buttons as security enforcement.
- Assuming disabled controls prevent direct API calls.
- Persisting RBAC decisions only in client storage.

## Testing Expectations

- Add backend authorization tests for every protected action path.
- Add UI tests for unauthorized responses (disabled states, error messaging, partial success handling).
- Keep audit logging tests in scope for permission-changing flows.
