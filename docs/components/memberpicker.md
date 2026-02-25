# MemberPicker

## Purpose

Pick people/org members from async search results with avatars and customizable role hints.

## Props

- `modelValue?: string | number | Array<string | number> | null` (default `null`)
- `options?: Array<MemberPickerItem>` (default `[]`)
- `multiple?: boolean` (default `true`)
- `disabled?: boolean` (default `false`)
- `readonly?: boolean` (default `false`)
- `placeholder?: string` (default `Search members...`)
- `ariaLabel?: string` (default `Member picker`)
- `loading?: boolean` (default `false`)
- `loadingText?: string` (default `Searching members...`)
- `emptyText?: string` (default `No members found.`)
- `removeLabel?: string` (default `Remove member`)
- `filterLocal?: boolean` (default `true`)

`MemberPickerItem`:

- `id: string | number`
- `name: string`
- `email?: string`
- `avatar?: string`
- `roleHint?: string`
- `org?: string`
- `disabled?: boolean`

## Events

- `update:modelValue`
- `change`
- `search(query)`
- `select(member)`
- `remove(member)`
- `focus`
- `blur`

## Slots

- `option` (`{ member, index, selected }`)
- `selection` (`{ member, remove }`)
- `role-hint` (`{ member }`)

## Examples

```vue
<MemberPicker v-model="assignees" :options="memberOptions" :loading="loadingMembers" @search="loadMembers" />
```

## Theming

- Override via `theme.overrides.components.memberPicker`.

## Tokens

- `controlMinHeight`, `borderColor`, `borderRadius`, `backgroundColor`, `textColor`, `padding`, `gap`
- `focusBorderColor`, `focusRingShadow`, `disabledOpacity`
- `chipGap`, `chipBackgroundColor`, `chipBorderColor`, `chipBorderRadius`, `chipFontSize`, `chipRemoveFontSize`
- `zIndex`
- `panelBorderColor`, `panelBorderRadius`, `panelBackgroundColor`, `panelShadow`, `panelMaxHeight`
- `optionPadding`, `optionGap`, `optionHighlightBackgroundColor`, `optionSelectedBackgroundColor`
- `optionTitleFontSize`, `optionTitleFontWeight`, `optionMetaFontSize`, `optionMetaColor`
- `statePadding`

## Recipes

- Async member search: set `filterLocal=false`, update `options` from backend on `search` event.
- Role-aware assignees: use `role-hint` slot to show org role badges or access levels.

## Accessibility

- Uses combobox/listbox semantics with keyboard navigation (`ArrowUp/ArrowDown/Enter/Escape`).
- Selected chips and option actions use native buttons.

## Responsive

- Control and chips wrap on narrow layouts; options panel keeps constrained max height with scroll.

## SSR/Hydration

- Component is hydration-safe; async option loading should happen in client-driven flows.

## Testing

- Cover search emissions, option select/remove, role-hint slot rendering, and empty/loading states.
