# PermissionMatrix

PermissionMatrix renders a role-versus-capability grid with tri-state permission toggles.

## Import

```ts
import PermissionMatrix from '@/package/components/permission-matrix.vue';
```

## Examples

### Basic

Use `PermissionMatrix` for RBAC configuration screens where multiple roles must be compared side by side.

```vue
<PermissionMatrix
    v-model="permissionMap"
    :roles="roles"
    :capabilities="capabilities"
/>
```

### Change Tracking

Listen to `cell-change` when the parent screen needs audit or save-dirty tracking.

```vue
<PermissionMatrix
    v-model="permissionMap"
    :roles="roles"
    :capabilities="capabilities"
    @cell-change="onCellChange"
/>
```

## API

### Types

```ts
type PermissionMatrixState = 'inherit' | 'allow' | 'deny';
type PermissionMatrixValue = Record<string, Record<string, PermissionMatrixState>>;
```

### Props

| Name | Type | Default |
| --- | --- | --- |
| `modelValue` | `PermissionMatrixValue` | `{}` |
| `roles` | `PermissionMatrixRole[]` | `[]` |
| `capabilities` | `PermissionMatrixCapability[]` | `[]` |
| `disabled` | `boolean` | `false` |
| `ariaLabel` | `string` | `'Permission matrix'` |
| `stateLabels` | `Record<'inherit' \| 'allow' \| 'deny', string>` | default labels |

### Events

| Name | Payload |
| --- | --- |
| `update:modelValue` | `PermissionMatrixValue` |
| `cellChange` | `{ role, capability, state, previousState }` |
| `change` | `PermissionMatrixValue` |

## Theming

Override component tokens through `theme.overrides.components.permissionMatrix`.

## Tokens

- Table surface: `borderColor`, `borderRadius`, `backgroundColor`, `textColor`, `dividerColor`, `headerBackgroundColor`, `stickyBackgroundColor`
- Labels: `cellPadding`, `labelFontSize`, `labelFontWeight`, `descriptionFontSize`, `descriptionColor`
- Toggles: `toggleMinWidth`, `toggleBorderColor`, `toggleBorderRadius`, `togglePadding`, `toggleBackgroundColor`, `toggleTextColor`, `toggleFontSize`
- States: `allowBorderColor`, `allowBackgroundColor`, `allowTextColor`, `denyBorderColor`, `denyBackgroundColor`, `denyTextColor`, `disabledOpacity`

## Recipes

- Treat matrix state as UI intent only; authorization enforcement still belongs in backend policy code.
- Use `cellChange` to construct audit payloads instead of diffing the whole matrix after every click.

## Accessibility

- The grid uses semantic table markup with row and column headers.
- Each cell button exposes a contextual label of role, capability, and current state.
