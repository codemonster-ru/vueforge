# PermissionMatrix

## Purpose

Render role-versus-capability access grid with tri-state controls (`Inherit`, `Allow`, `Deny`) for RBAC configuration screens.

## Props

- `modelValue?: PermissionMatrixValue` (default `{}`)
- `roles?: Array<PermissionMatrixRole>` (default `[]`)
- `capabilities?: Array<PermissionMatrixCapability>` (default `[]`)
- `disabled?: boolean` (default `false`)
- `ariaLabel?: string` (default `Permission matrix`)
- `stateLabels?: Record<'inherit' | 'allow' | 'deny', string>` (default labels)

`PermissionMatrixRole`:

- `id: string | number`
- `label: string`
- `description?: string`

`PermissionMatrixCapability`:

- `id: string | number`
- `label: string`
- `description?: string`

`PermissionMatrixValue`:

- `Record<string, Record<string, 'inherit' | 'allow' | 'deny'>>`

## Events

- `update:modelValue`
- `cellChange({ role, capability, state, previousState })`
- `change(modelValue)`

## Slots

- N/A

## Examples

```vue
<PermissionMatrix v-model="permissionMap" :roles="roles" :capabilities="capabilities" @cellChange="onCellChange" />
```

## Theming

- Override via `theme.overrides.components.permissionMatrix`.

## Tokens

- `borderColor`, `borderRadius`, `backgroundColor`, `textColor`
- `dividerColor`, `headerBackgroundColor`, `stickyBackgroundColor`
- `cellPadding`
- `labelFontSize`, `labelFontWeight`
- `descriptionFontSize`, `descriptionColor`
- `toggleMinWidth`, `toggleBorderColor`, `toggleBorderRadius`, `togglePadding`
- `toggleBackgroundColor`, `toggleTextColor`, `toggleFontSize`
- `allowBorderColor`, `allowBackgroundColor`, `allowTextColor`
- `denyBorderColor`, `denyBackgroundColor`, `denyTextColor`
- `disabledOpacity`

## Recipes

- Bind `modelValue` to backend RBAC map and persist via explicit save action in parent screen.
- Use `cellChange` to collect audit payloads for who changed which permission cell.
- Treat emitted state as UI intent only; enforce authorization in backend handlers (see `docs/guides/rbac-api-boundaries.md`).

## Accessibility

- Uses semantic table with row/column headers and button controls per cell.
- Each cell control has contextual aria label (`Role Capability: State`).
- Tri-state cycle is keyboard-accessible through native button interaction.

## Responsive

- Matrix container supports horizontal overflow for small screens.
- Sticky role column preserves row context while scrolling capabilities.

## SSR/Hydration

- Pure deterministic render from props; no DOM-specific logic in setup.

## Testing

- Cover tri-state cycle, disabled behavior, modelValue emission, and aria labeling.
