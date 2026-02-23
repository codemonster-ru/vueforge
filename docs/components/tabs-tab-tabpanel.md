# Tabs / Tab / TabPanel

## Purpose

Organize multi-section and multi-step workflows with explicit progression and navigation semantics.
Support dense information architecture in settings, onboarding, and detail screens.

## Overview

Props (Tabs):

- `modelValue?: string | number` (v-model)
- `disabled?: boolean`
- `orientation?: 'horizontal' | 'vertical'` (default `horizontal`)
- `ariaLabel?: string`
- `ariaLabelledby?: string`

Props (Tab):

- `value: string | number`
- `label?: string`
- `disabled?: boolean`

Props (TabPanel):

- `value: string | number`

## Props

- No additional props documented for this component at the moment.

## Events

- `Tabs`: `update:modelValue`, `change`
- `Tab`: `change`
- `TabPanel`: no emitted events

## Slots

- `Tabs`: named slots `tabs` and `panels`
- `Tab`: default slot for tab label
- `TabPanel`: default slot for panel content

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

## Theming

- Override via theme component overrides for each component documented on this page.

## Tokens

Component tokens (override via `theme.overrides.components.tabs`):

- `gap`, `listGap`, `listBorderWidth`, `listBorderColor`, `listVerticalPadding`
- `tabPadding`, `tabFontSize`, `tabBorderRadius`
- `tabTextColor`, `tabBackgroundColor`, `tabHoverBackgroundColor`
- `tabActiveTextColor`, `tabActiveBackgroundColor`, `tabActiveBorderColor`, `tabActiveBorderWidth`
- `panelPadding`, `panelBorderRadius`, `panelBackgroundColor`, `panelTextColor`
- `disabledOpacity`

## Responsive

Validate tab/step headers for overflow, wrap, and scroll behavior on smaller viewports.
Ensure active indicator and navigation controls remain clear and tappable on touch devices.

## SSR/Hydration

Preserve initially active section/step state and panel visibility across server and client render.
Avoid hydration drift from client-only measurement used for indicator positioning.

## Testing

Cover controlled/uncontrolled active state, keyboard navigation, and disabled step/tab behavior.
Add tests for deep-link/page-state sync when applicable and ARIA tab/step semantics.

## Accessibility

- Supports tablist keyboard navigation with arrow keys and `Home`/`End`.
- Uses `tab`/`tabpanel` semantics with `aria-controls` and `aria-labelledby`.
- Ensure visible focus state and sufficient color contrast in usage contexts.
