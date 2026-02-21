# Tabs / Tab / TabPanel

## Overview

Props (Tabs):

- `modelValue?: string | number` (v-model)
- `disabled?: boolean`
- `orientation?: 'horizontal' | 'vertical'` (default `horizontal`)

Props (Tab):

- `value: string | number`
- `label?: string`
- `disabled?: boolean`

Props (TabPanel):

- `value: string | number`

## Props

- No additional props documented for this component at the moment.

## Events

- This component does not emit component-specific events.

## Slots

- This component does not expose named slots.

## Examples

```vue
<Tabs v-model="tab">
    <template #tabs>
        <Tab value="overview">Overview</Tab>
        <Tab value="settings">Settings</Tab>
    </template>
    <template #panels>
        <TabPanel value="overview">Overview content</TabPanel>
        <TabPanel value="settings">Settings content</TabPanel>
    </template>
</Tabs>
```

## Recipes

### Settings page sections with vertical tabs

```vue
<Tabs v-model="section" orientation="vertical" aria-label="Settings sections">
    <template #tabs>
        <Tab value="profile">Profile</Tab>
        <Tab value="security">Security</Tab>
        <Tab value="billing" :disabled="isBillingDisabled">Billing</Tab>
    </template>
    <template #panels>
        <TabPanel value="profile">Profile settings</TabPanel>
        <TabPanel value="security">Security settings</TabPanel>
        <TabPanel value="billing">Billing settings</TabPanel>
    </template>
</Tabs>
```

## Tokens

Component tokens (override via `theme.overrides.components.tabs`):

- `gap`, `listGap`, `listBorderWidth`, `listBorderColor`, `listVerticalPadding`
- `tabPadding`, `tabFontSize`, `tabBorderRadius`
- `tabTextColor`, `tabBackgroundColor`, `tabHoverBackgroundColor`
- `tabActiveTextColor`, `tabActiveBackgroundColor`, `tabActiveBorderColor`, `tabActiveBorderWidth`
- `panelPadding`, `panelBorderRadius`, `panelBackgroundColor`, `panelTextColor`
- `disabledOpacity`

## Accessibility

- Supports tablist keyboard navigation with arrow keys and `Home`/`End`.
- Uses `tab`/`tabpanel` semantics with `aria-controls` and `aria-labelledby`.
- Ensure visible focus state and sufficient color contrast in usage contexts.
