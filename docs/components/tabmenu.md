# TabMenu

## Purpose

Render route-aware section navigation for dashboard/detail pages with tab-style semantics.
Supports controlled active state and keyboard navigation across tab items.

## Props

- `modelValue?: string | number | null` (v-model)
- `items?: Array<{ label: string; value?: string | number; to?: RouteLocationRaw; href?: string; url?: string; disabled?: boolean }>`
- `syncActiveFromRoute?: boolean` (default `true`)
- `ariaLabel?: string` (default `Tab menu`)

## Events

- `update:modelValue`
- `change`
- `active`

## Slots

- This component does not expose named slots.

## Examples

```vue
<TabMenu
    v-model="activeSection"
    :items="[
        { label: 'Overview', to: '/account/overview' },
        { label: 'Usage', to: '/account/usage' },
        { label: 'Billing', to: '/account/billing' },
    ]"
/>
```

## Theming

- Override via `theme.overrides.components.tabMenu`.

## Tokens

- `gap`, `borderWidth`, `borderColor`
- `tabPadding`, `tabBorderRadius`
- `tabTextColor`, `tabHoverTextColor`, `tabHoverBackgroundColor`
- `tabActiveTextColor`, `tabActiveBorderColor`
- `disabledOpacity`

## Accessibility

- Uses `role="tablist"` and `role="tab"` semantics.
- Keyboard support: `ArrowLeft`/`ArrowRight`, `Home`, `End`.
- Active tab state is exposed via `aria-selected`.
