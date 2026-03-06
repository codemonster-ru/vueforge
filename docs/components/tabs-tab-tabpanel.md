# Tabs / Tab / TabPanel

Organize related content into mutually exclusive panels with explicit tab navigation semantics.

## Import

```ts
import { Tabs, Tab, TabPanel } from '@codemonster-ru/vueforge';
```

## Examples

Use `Tabs` when users should stay in one page context and switch between peer sections without route changes.

### Basic

Use horizontal tabs for common content segmentation inside a page.

```vue
<template>
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
</template>
```

### Vertical Tabs

Use `orientation="vertical"` for settings pages or workflows with longer section labels.

```vue
<template>
    <Tabs v-model="section" orientation="vertical" aria-label="Settings sections">
        <template #tabs>
            <Tab value="profile">Profile</Tab>
            <Tab value="security">Security</Tab>
            <Tab value="billing">Billing</Tab>
        </template>
        <template #panels>
            <TabPanel value="profile">Profile settings</TabPanel>
            <TabPanel value="security">Security settings</TabPanel>
            <TabPanel value="billing">Billing settings</TabPanel>
        </template>
    </Tabs>
</template>
```

### Disabled Tabs

Disable a tab when the section should remain visible in navigation but unavailable.

```vue
<template>
    <Tabs v-model="activeTab">
        <template #tabs>
            <Tab value="details">Details</Tab>
            <Tab value="history" :disabled="true">History</Tab>
        </template>
        <template #panels>
            <TabPanel value="details">Details content</TabPanel>
            <TabPanel value="history">History content</TabPanel>
        </template>
    </Tabs>
</template>
```

### Label Props

Use `label` props when slot content is unnecessary and a compact declaration is preferred.

```vue
<template>
    <Tabs v-model="summaryTab">
        <template #tabs>
            <Tab value="activity" label="Activity" />
            <Tab value="members" label="Members" />
        </template>
        <template #panels>
            <TabPanel value="activity">Activity feed</TabPanel>
            <TabPanel value="members">Members list</TabPanel>
        </template>
    </Tabs>
</template>
```

## API

### Tabs Props

| Name | Type | Default |
| --- | --- | --- |
| `modelValue` | `string \| number \| undefined` | `undefined` |
| `disabled` | `boolean` | `false` |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `ariaLabel` | `string \| undefined` | `undefined` |
| `ariaLabelledby` | `string \| undefined` | `undefined` |

### Tab Props

| Name | Type | Default |
| --- | --- | --- |
| `value` | `string \| number` | required |
| `label` | `string \| undefined` | `undefined` |
| `disabled` | `boolean` | `false` |

### TabPanel Props

| Name | Type | Default |
| --- | --- | --- |
| `value` | `string \| number` | required |

## Events

- `Tabs`: `update:modelValue`, `change`
- `Tab`: `change`
- `TabPanel`: no emitted events

## Slots

- `Tabs`: named slots `tabs` and `panels`
- `Tab`: default slot for tab label
- `TabPanel`: default slot for panel content

## Theming

- Override via `theme.overrides.components.tabs`.

## Tokens

Component tokens (override via `theme.overrides.components.tabs`):

- `gap`, `listGap`, `listBorderWidth`, `listBorderColor`, `listVerticalPadding`
- `tabPadding`, `tabFontSize`, `tabFontWeight`, `tabBorderRadius`
- `tabTextColor`, `tabBackgroundColor`, `tabHoverBackgroundColor`
- `tabActiveTextColor`, `tabActiveBackgroundColor`, `tabActiveBorderColor`, `tabActiveBorderWidth`, `tabActiveFontWeight`
- `panelPadding`, `panelBorderRadius`, `panelBackgroundColor`, `panelTextColor`
- `disabledOpacity`

## Recipes

- Use tabs for peer sections within one workflow, not for deep navigation between unrelated pages.
- Keep labels short and parallel so scanning is immediate.
- Prefer vertical tabs when labels are long enough to wrap awkwardly in horizontal mode.

## Accessibility

- Supports tablist keyboard navigation with arrow keys and `Home`/`End`.
- Uses `tab`/`tabpanel` semantics with `aria-controls` and `aria-labelledby`.
- Ensure visible focus state and sufficient color contrast in usage contexts.
