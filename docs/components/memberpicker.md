# MemberPicker

MemberPicker selects people from searchable options with chips, avatars, async search hooks, and optional multi-select behavior.

## Import

```ts
import MemberPicker from '@/package/components/member-picker.vue';
```

## Examples

### Basic

```vue
<MemberPicker
    v-model="assignees"
    :options="memberOptions"
    :loading="loadingMembers"
    @search="loadMembers"
/>
```

### Single Assignee

```vue
<MemberPicker v-model="owner" :options="memberOptions" :multiple="false" placeholder="Assign owner" />
```

### Custom Option Meta

```vue
<MemberPicker v-model="assignees" :options="memberOptions">
    <template #role-hint="{ member }">
        <Badge v-if="member.roleHint" :value="member.roleHint" />
    </template>
</MemberPicker>
```

## API

### Types

```ts
interface MemberPickerItem {
    id: string | number;
    name: string;
    email?: string;
    avatar?: string;
    roleHint?: string;
    org?: string;
    disabled?: boolean;
}
```

### Props

| Name | Type | Default |
| --- | --- | --- |
| `modelValue` | `string \| number \| Array<string \| number> \| null` | `null` |
| `options` | `MemberPickerItem[]` | `[]` |
| `multiple` | `boolean` | `true` |
| `disabled` | `boolean` | `false` |
| `readonly` | `boolean` | `false` |
| `placeholder` | `string` | `'Search members...'` |
| `ariaLabel` | `string` | `'Member picker'` |
| `loading` | `boolean` | `false` |
| `loadingText` | `string` | `'Searching members...'` |
| `emptyText` | `string` | `'No members found.'` |
| `removeLabel` | `string` | `'Remove member'` |
| `filterLocal` | `boolean` | `true` |

### Events

| Name | Payload |
| --- | --- |
| `update:modelValue` | selection payload |
| `change` | selection payload |
| `search` | query string |
| `select` | member |
| `remove` | member |
| `focus` | `FocusEvent` |
| `blur` | `FocusEvent` |

### Slots

| Name | Description |
| --- | --- |
| `option` | Custom option content with `{ member, index, selected }`. |
| `selection` | Custom selected chip with `{ member, remove }`. |
| `role-hint` | Role/meta decoration with `{ member }`. |

## Theming

Override component tokens through `theme.overrides.components.memberPicker`.

## Tokens

- Control: `controlMinHeight`, `borderColor`, `borderRadius`, `backgroundColor`, `textColor`, `padding`, `gap`, `focusBorderColor`, `focusRingShadow`, `disabledOpacity`
- Chips: `chipGap`, `chipBackgroundColor`, `chipBorderColor`, `chipBorderRadius`, `chipFontSize`, `chipRemoveFontSize`
- Panel: `zIndex`, `panelBorderColor`, `panelBorderRadius`, `panelBackgroundColor`, `panelShadow`, `panelMaxHeight`
- Options and states: `optionPadding`, `optionGap`, `optionHighlightBackgroundColor`, `optionSelectedBackgroundColor`, `optionTitleFontSize`, `optionTitleFontWeight`, `optionMetaFontSize`, `optionMetaColor`, `statePadding`

## Recipes

- Use MemberPicker for assignees, reviewers, watchers, and any user-centric search and select flow.
- Set `filterLocal=false` when the source of truth is backend search rather than a local option list.

## Accessibility

- MemberPicker uses combobox and listbox semantics with keyboard navigation.
- Chips and remove controls are native buttons, so selection state stays keyboard-accessible.

