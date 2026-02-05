# VueForge

[![npm](https://img.shields.io/npm/v/@codemonster-ru/vueforge)](https://www.npmjs.com/package/@codemonster-ru/vueforge)
[![downloads](https://img.shields.io/npm/dw/@codemonster-ru/vueforge)](https://www.npmjs.com/package/@codemonster-ru/vueforge)
[![license](https://img.shields.io/npm/l/@codemonster-ru/vueforge)](LICENSE.md)

Open source component-level UI library for Vue.js.

## Install

```bash
npm i @codemonster-ru/vueforge
```

Peer dependencies:

- `vue` (v3)
- `vue-router` (v4)
- `@codemonster-ru/vueiconify`

## Usage

```ts
import { createApp } from 'vue';
import {
    VueForge,
    DefaultTheme,
    Button,
    Input,
    FormField,
    Textarea,
    Select,
    Autocomplete,
    MultiSelect,
    DatePicker,
    Pagination,
    DataTable,
    Checkbox,
    Switch,
    Alert,
    Skeleton,
    Progress,
    Badge,
    Accordion,
    AccordionItem,
} from '@codemonster-ru/vueforge';
import '@codemonster-ru/vueforge/dist/index.css';

const app = createApp(App);

app.use(VueForge, {
    theme: {
        preset: DefaultTheme,
    },
});
```

```vue
<Button label="Hello" severity="primary" />
<FormField label="Name" hint="Required field">
    <Input v-model="name" placeholder="Your name" />
</FormField>
<Textarea v-model="bio" placeholder="Tell us about yourself" />
<Select v-model="role" :options="roles" placeholder="Choose role" />
<Autocomplete v-model="country" :options="countries" placeholder="Find country" />
<MultiSelect v-model="countries" :options="countryOptions" placeholder="Select countries" clearable />
<DatePicker v-model="birthday" placeholder="Pick birthday" />
<Pagination v-model="page" :total-items="240" :page-size="20" />
<DataTable :columns="columns" :rows="rows" sortable striped />
<Checkbox v-model="agreed" label="I agree" />
<Switch v-model="darkMode" label="Dark mode" />
<Alert severity="info" title="Heads up" message="Project settings were updated." />
<Skeleton height="12px" width="140px" />
<Progress :value="64" />
<Badge label="Beta" />
<Accordion v-model="faq">
    <AccordionItem value="shipping" title="Shipping">
        Shipping details
    </AccordionItem>
    <AccordionItem value="returns" title="Returns">
        Returns policy
    </AccordionItem>
</Accordion>
```

## Components

- Button
- Card
- Checkbox
- RadioGroup
- RadioButton
- Tabs
- Tab
- TabPanel
- Accordion
- AccordionItem
- Toast
- ToastContainer
- Alert
- Input
- FormField
- Textarea
- Link
- Menu
- Modal
- Popover
- Select
- Autocomplete
- MultiSelect
- DatePicker
- Pagination
- DataTable
- Switch
- Tooltip
- Skeleton
- Progress
- Badge

Input / Textarea (quick API):

- `Input`: single-line control, supports `v-model`, `size`, `variant`, `disabled`, `readonly`.
- `Textarea`: multi-line control, same as Input plus `rows`.
- `Checkbox`, `Select`, `Autocomplete`, `MultiSelect`, `DatePicker`, `Pagination`, and `DataTable` also support `variant: 'filled' | 'outlined'`.

## FormField

Props:

- `id?: string` (used in `label for` and slot props)
- `label?: string`
- `hint?: string`
- `error?: string`
- `required?: boolean`
- `disabled?: boolean`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)

Slots:

- `default` - form control wrapper slot props: `{ id, describedBy, invalid, required }`
- `label` (optional)
- `hint` (optional)
- `error` (optional)

Example:

```vue
<FormField label="Email" hint="We never share it" :error="emailError">
    <template #default="{ id, describedBy }">
        <Input :id="id" v-model="email" :aria-describedby="describedBy" placeholder="name@example.com" />
    </template>
</FormField>
```

Note: default filled backgrounds for Input/Select/Textarea use `controls.backgroundColor` (defaults to `bgSoftColor`). Set it to `bgColor` to disable soft backgrounds.

## Autocomplete

Props:

- `modelValue?: string | number` (v-model)
- `options?: Array<{ label: string; value: string | number; disabled?: boolean }>`
- `optionLabel?: string` (default `label`)
- `optionValue?: string` (default `value`)
- `placeholder?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `loading?: boolean`
- `loadingText?: string` (default `Loading...`)
- `emptyText?: string` (default `No results`)
- `filter?: boolean` (default `true`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)

Events:

- `update:modelValue`
- `change`
- `search`
- `focus`
- `blur`

Example:

```vue
<Autocomplete v-model="country" :options="countries" placeholder="Find country" />
```

## MultiSelect

Props:

- `modelValue?: Array<string | number>` (v-model)
- `options?: Array<{ label: string; value: string | number; disabled?: boolean }>`
- `optionLabel?: string` (default `label`)
- `optionValue?: string` (default `value`)
- `placeholder?: string`
- `searchPlaceholder?: string` (default `Search...`)
- `disabled?: boolean`
- `readonly?: boolean`
- `loading?: boolean`
- `loadingText?: string` (default `Loading...`)
- `emptyText?: string` (default `No results`)
- `filter?: boolean` (default `true`)
- `clearable?: boolean` (default `false`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)

Events:

- `update:modelValue`
- `change`
- `search`
- `focus`
- `blur`

Example:

```vue
<MultiSelect v-model="countries" :options="countryOptions" placeholder="Select countries" clearable />
```

### MultiSelect tokens

Component tokens (override via `theme.overrides.components.multiselect`):

- `minWidth`, `fontSize`, `controlGap`, `chevronSize`
- `padding`, `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`
- `disabledOpacity`
- `panelBackgroundColor`, `panelBorderColor`, `panelPadding`, `panelMaxHeight`, `panelRadiusOffset`, `panelShadow`
- `searchPadding`, `searchBorderColor`, `searchBorderRadius`
- `optionPadding`, `optionBorderRadius`
- `optionHoverBackgroundColor`, `optionActiveBackgroundColor`, `optionActiveTextColor`, `optionHighlightedBackgroundColor`
- `emptyPadding`, `emptyColor`
- `loadingPadding`, `loadingColor`
- `clearSize`, `clearRadius`, `clearHoverBackgroundColor`
- `small.fontSize`, `small.padding`
- `large.fontSize`, `large.padding`

## DatePicker

Props:

- `modelValue?: string` (v-model, ISO date `YYYY-MM-DD`)
- `placeholder?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `min?: string` (ISO date `YYYY-MM-DD`)
- `max?: string` (ISO date `YYYY-MM-DD`)
- `locale?: string` (default `en-US`)
- `firstDayOfWeek?: number` (default `0`, Sunday)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)

Events:

- `update:modelValue`
- `change`
- `focus`
- `blur`

Example:

```vue
<DatePicker v-model="startDate" placeholder="Pick date" min="2026-01-01" max="2026-12-31" />
```

## Pagination

Props:

- `modelValue?: number` (v-model, default `1`)
- `totalItems?: number` (default `0`)
- `pageSize?: number` (default `10`)
- `totalPages?: number` (optional override instead of `totalItems/pageSize`)
- `siblingCount?: number` (default `1`)
- `boundaryCount?: number` (default `1`)
- `disabled?: boolean`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `prevLabel?: string` (default `Prev`)
- `nextLabel?: string` (default `Next`)
- `ellipsisLabel?: string` (default `...`)

Events:

- `update:modelValue`
- `change`

Example:

```vue
<Pagination v-model="page" :total-items="240" :page-size="20" />
```

### Pagination tokens

Component tokens (override via `theme.overrides.components.pagination`):

- `gap`, `itemMinWidth`, `fontSize`, `padding`
- `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`
- `hoverBackgroundColor`
- `activeBorderColor`, `activeBackgroundColor`, `activeTextColor`
- `focusBorderColor`, `focusRingShadow`
- `disabledOpacity`, `ellipsisPadding`
- `small.fontSize`, `small.padding`
- `large.fontSize`, `large.padding`

## DataTable

Props:

- `rows?: Array<Record<string, unknown>>`
- `columns?: Array<{ field: string; header?: string; sortable?: boolean; align?: 'left' | 'center' | 'right'; width?: string; minWidth?: string; formatter?: (row, value, column) => string | number }>`
- `rowKey?: string | ((row, index) => string | number)`
- `sortable?: boolean`
- `sortField?: string | null`
- `sortOrder?: 'asc' | 'desc' | null`
- `loading?: boolean`
- `loadingText?: string` (default `Loading...`)
- `emptyText?: string` (default `No data`)
- `striped?: boolean` (default `false`)
- `hover?: boolean` (default `true`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `showHeader?: boolean` (default `true`)
- `ariaLabel?: string` (default `Data table`)

Events:

- `update:sortField`
- `update:sortOrder`
- `sort`
- `rowClick`

Slots:

- `header-{field}`
- `cell-{field}`
- `empty`
- `loading`

Example:

```vue
<DataTable
    :columns="[
        { field: 'name', header: 'Name', sortable: true },
        { field: 'role', header: 'Role' },
        { field: 'age', header: 'Age', align: 'right', sortable: true },
    ]"
    :rows="[
        { id: 1, name: 'Alice', role: 'Developer', age: 29 },
        { id: 2, name: 'Bob', role: 'Designer', age: 34 },
    ]"
    row-key="id"
    sortable
    striped
/>
```

### DataTable tokens

Component tokens (override via `theme.overrides.components.datatable`):

- `borderColor`, `borderRadius`, `backgroundColor`
- `fontSize`, `textColor`
- `headerBackgroundColor`, `headerTextColor`, `headerFontSize`, `headerFontWeight`, `headerBorderColor`, `headerGap`
- `rowBackgroundColor`, `rowTextColor`, `rowBorderColor`
- `cellPadding`
- `stripedBackgroundColor`, `hoverBackgroundColor`
- `sortIconColor`, `sortIconActiveColor`, `sortIconSize`
- `statePadding`, `stateTextColor`
- `small.fontSize`, `small.cellPadding`
- `large.fontSize`, `large.cellPadding`

## Textarea

Props:

- `modelValue?: string` (v-model)
- `placeholder?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `rows?: number` (default `3`)

Events:

- `update:modelValue`
- `input`
- `change`
- `focus`
- `blur`

Example:

```vue
<Textarea v-model="bio" placeholder="Tell us about yourself" rows="4" />
```

## RadioGroup / RadioButton

Props (RadioGroup):

- `modelValue?: string | number | boolean` (v-model)
- `name?: string`
- `disabled?: boolean`
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `direction?: 'vertical' | 'horizontal'` (default `vertical`)

Props (RadioButton):

- `value?: string | number | boolean`
- `label?: string`
- `disabled?: boolean`
- `name?: string`
- `variant?: 'filled' | 'outlined'` (default `filled`)

Example:

```vue
<RadioGroup v-model="plan" direction="horizontal">
    <RadioButton value="basic">Basic</RadioButton>
    <RadioButton value="pro">Pro</RadioButton>
</RadioGroup>
```

## Tabs / Tab / TabPanel

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

Example:

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

### Tabs tokens

Component tokens (override via `theme.overrides.components.tabs`):

- `gap`, `listGap`, `listBorderWidth`, `listBorderColor`, `listVerticalPadding`
- `tabPadding`, `tabFontSize`, `tabBorderRadius`
- `tabTextColor`, `tabBackgroundColor`, `tabHoverBackgroundColor`
- `tabActiveTextColor`, `tabActiveBackgroundColor`, `tabActiveBorderColor`, `tabActiveBorderWidth`
- `panelPadding`, `panelBorderRadius`, `panelBackgroundColor`, `panelTextColor`
- `disabledOpacity`

## Accordion / AccordionItem

Props (Accordion):

- `modelValue?: string | number | Array<string | number>` (v-model)
- `multiple?: boolean` (default `false`)
- `disabled?: boolean`
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `ariaLabel?: string`
- `ariaLabelledby?: string`

Props (AccordionItem):

- `value: string | number`
- `title?: string`
- `disabled?: boolean`
- `unmount?: boolean` (default `false`)

Events:

- `update:modelValue`
- `change`

Example:

```vue
<Accordion v-model="faq">
    <AccordionItem value="shipping" title="Shipping">
        Shipping details
    </AccordionItem>
    <AccordionItem value="returns" title="Returns">
        Returns policy
    </AccordionItem>
</Accordion>
```

### Accordion tokens

Component tokens (override via `theme.overrides.components.accordion`):

- `gap`, `borderRadius`, `borderColor`, `backgroundColor`
- `headerGap`, `headerPadding`, `headerFontSize`, `headerFontWeight`
- `headerTextColor`, `headerBackgroundColor`, `headerHoverBackgroundColor`, `headerActiveBackgroundColor`
- `contentPadding`, `contentTextColor`, `contentBackgroundColor`
- `iconSize`, `iconColor`, `dividerColor`
- `focusRingShadow`, `disabledOpacity`
- `small.headerPadding`, `small.headerFontSize`, `small.contentPadding`
- `large.headerPadding`, `large.headerFontSize`, `large.contentPadding`

## Toast / ToastContainer

Props (Toast):

- `modelValue?: boolean` (v-model)
- `title?: string`
- `message?: string`
- `severity?: 'neutral' | 'info' | 'success' | 'warn' | 'danger'` (default `neutral`)
- `closable?: boolean` (default `true`)
- `duration?: number` (ms, default `0`, no auto-close)

Props (ToastContainer):

- `position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'` (default `top-right`)

Example:

```vue
<ToastContainer position="top-right">
    <Toast v-model="toastOpen" title="Saved" message="Changes are saved." severity="success" :duration="2500" />
</ToastContainer>
```

### Toast tokens

Component tokens (override via `theme.overrides.components.toast`):

- `gap`, `padding`, `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `shadow`, `minWidth`
- `fontSize`, `lineHeight`, `bodyGap`
- `titleFontSize`, `titleFontWeight`, `closeSize`
- `containerGap`, `containerPadding`, `containerMaxWidth`, `zIndex`
- `info.*`, `success.*`, `warn.*`, `danger.*` (backgroundColor/borderColor/textColor)

## Alert

Props:

- `modelValue?: boolean` (optional v-model)
- `title?: string`
- `message?: string`
- `severity?: 'neutral' | 'info' | 'success' | 'warn' | 'danger'` (default `neutral`)
- `closable?: boolean` (default `false`)
- `icon?: string`

Slots:

- `default` - message content (fallbacks to `message`)
- `title` (optional)
- `icon` (optional)
- `actions` (optional)
- `close` (optional)

Events:

- `update:modelValue`
- `close`

Example:

```vue
<Alert v-model="alertOpen" severity="warn" title="Unsaved changes" closable>
    You have unsaved form changes.
    <template #actions>
        <Button label="Save" size="small" />
    </template>
</Alert>
```

### Alert tokens

Component tokens (override via `theme.overrides.components.alert`):

- `gap`, `padding`, `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `iconColor`
- `fontSize`, `lineHeight`, `bodyGap`
- `titleFontSize`, `titleFontWeight`
- `actionsGap`, `closeSize`, `closeRadius`, `closeFontSize`, `closeHoverBackgroundColor`
- `info.*`, `success.*`, `warn.*`, `danger.*` (backgroundColor/borderColor/textColor)

### Textarea tokens

Component tokens (override via `theme.overrides.components.textarea`):

- `gap`, `fontSize`, `padding`
- `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`
- `disabledOpacity`
- `minHeight`, `resize`
- `small.fontSize`, `small.padding`
- `large.fontSize`, `large.padding`

## Modal

Props:

- `modelValue?: boolean` (v-model)
- `title?: string`
- `size?: 'sm' | 'md' | 'lg'`
- `closeOnOverlay?: boolean` (default true)
- `closeOnEsc?: boolean` (default true)
- `showClose?: boolean` (default true)
- `lockScroll?: boolean` (default true)

Slots:

- `header` (optional) - replaces the title area
- `body` (optional) - modal content (defaults to default slot if not provided)
- `default` (optional) - modal content if `body` slot is not used
- `footer` (optional)
- `close` (optional) - custom close button; slot props: `{ close }`

Events:

- `update:modelValue`
- `open`
- `close`

Example:

```vue
<Modal v-model="open" title="Confirm action" size="sm">
    <template #body>
        <p>Are you sure?</p>
    </template>
    <template #footer>
        <Button label="Cancel" severity="secondary" @click="open = false" />
        <Button label="Confirm" @click="open = false" />
    </template>
</Modal>
```

### Modal tokens

Component tokens (override via `theme.overrides.components.modal`):

- `width`, `maxWidth`, `maxHeight`
- `widthSm`, `maxWidthSm`
- `widthLg`, `maxWidthLg`
- `padding`, `borderRadius`
- `backgroundColor`, `textColor`
- `overlayBackgroundColor`
- `shadow`
- `zIndex`
- `headerGap`, `bodyGap`, `footerGap`
- `titleFontSize`, `titleLineHeight`, `titleFontWeight`
- `closeSize`, `closeRadius`, `closeOffset`
- `closeColor`, `closeFontSize`, `closeHoverBackgroundColor`

## Tooltip

Props:

- `text?: string`
- `placement?: 'top' | 'bottom' | 'left' | 'right'` (default `top`)
- `disabled?: boolean`
- `arrow?: boolean` (default `false`)

Slots:

- `default` - trigger content
- `content` (optional) - tooltip content (fallbacks to `text`)

Example:

```vue
<Tooltip text="Helpful hint" arrow>
    <Button label="Hover me" />
</Tooltip>
```

## Skeleton

Props:

- `width?: string | number`
- `height?: string | number`
- `variant?: 'text' | 'rect' | 'circle'` (default `text`)
- `animated?: boolean` (default `true`)

Example:

```vue
<Skeleton width="240px" height="14px" />
<Skeleton width="180px" height="14px" />
<Skeleton variant="circle" width="48" />
```

## Badge

Props:

- `label?: string`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'solid' | 'soft' | 'outline'` (default `soft`)
- `severity?: 'neutral' | 'info' | 'success' | 'warn' | 'danger'` (default `neutral`)
- `ariaLabel?: string`

Slots:

- `default` - badge content (fallbacks to `label`)

Example:

```vue
<Badge label="Beta" />
<Badge severity="success" variant="outline">Active</Badge>
```

### Badge tokens

Component tokens (override via `theme.overrides.components.badge`):

- `fontSize`, `lineHeight`, `paddingX`, `paddingY`, `borderRadius`, `gap`
- `backgroundColor`, `textColor`, `borderColor`
- `softBackgroundColor`, `softTextColor`, `softBorderColor`
- `outlineTextColor`, `outlineBorderColor`
- `info.*`, `success.*`, `warn.*`, `danger.*` (backgroundColor/textColor/borderColor/soft*/outline*)
- `small.fontSize`, `small.paddingX`, `small.paddingY`
- `large.fontSize`, `large.paddingX`, `large.paddingY`

## Progress

Props:

- `value?: number` (0-100; omit for indeterminate)
- `variant?: 'linear' | 'circular'` (default `linear`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `label?: string`
- `showValue?: boolean` (default `false`)
- `severity?: 'neutral' | 'info' | 'success' | 'warn' | 'danger'` (default `neutral`)
- `ariaLabel?: string`

Example:

```vue
<Progress :value="64" />
<Progress variant="circular" :value="42" size="small" />
<Progress variant="linear" severity="success" showValue :value="85" />
<Progress variant="linear" />
```

### Progress tokens

Component tokens (override via `theme.overrides.components.progress`):

- `width`, `height`, `borderRadius`
- `backgroundColor`, `barColor`
- `labelColor`, `labelFontSize`, `gap`
- `circularSize`, `circularThickness`
- `animationDuration`
- `info.barColor`, `success.barColor`, `warn.barColor`, `danger.barColor`
- `small.height`, `small.labelFontSize`, `small.circularSize`, `small.circularThickness`
- `large.height`, `large.labelFontSize`, `large.circularSize`, `large.circularThickness`

## Tokens

VueForge exposes design tokens as CSS variables generated from the theme preset. Core groups:

- `colors.*` → `--vf-{color}` + shades (`--vf-{color}-100..900`)
- `radii.*` → corner radii
- `typography.*` → base font size & line height
- `states.*` → focus ring, disabled opacity
- `controls.*` → base control sizing (height, padding)
- `sizes.sm/lg` → shared small/large sizing for Button/Input/Select

Typed tokens:

- `ThemeTokens`/`ThemeOptions`/`ThemePreset` are exported for type-safe theming in TS.
- `components.*` accepts component-specific tokens (typed keys: button/card/checkbox/radio/tabs/accordion/toast/alert/input/formField/textarea/link/menu/popover/select/autocomplete/multiselect/datepicker/pagination/switch/tooltip/skeleton/progress/badge/datatable).

Default core values (from `DefaultTheme`):

| Token                    | Value                                          |
| ------------------------ | ---------------------------------------------- |
| `borderWidth`            | `1px`                                          |
| `controls.height`        | `2rem`                                         |
| `controls.paddingY`      | `0.25rem`                                      |
| `controls.paddingX`      | `0.6rem`                                       |
| `radii.sm`               | `4px`                                          |
| `radii.md`               | `6px`                                          |
| `radii.lg`               | `10px`                                         |
| `typography.fontSize`    | `1rem`                                         |
| `typography.lineHeight`  | `1.4`                                          |
| `states.disabledOpacity` | `0.6`                                          |
| `states.focusRingShadow` | `0 0 0 3px rgba(var(--vf-blue-600-rgb), 0.12)` |
| `sizes.sm.fontSize`      | `0.875rem`                                     |
| `sizes.sm.paddingY`      | `0.2rem`                                       |
| `sizes.sm.paddingX`      | `0.5rem`                                       |
| `sizes.lg.fontSize`      | `1.125rem`                                     |
| `sizes.lg.paddingY`      | `0.5rem`                                       |
| `sizes.lg.paddingX`      | `1rem`                                         |

Example override:

```ts
setTheme({
    preset: DefaultTheme,
    overrides: {
        typography: {
            fontSize: '0.9375rem',
            lineHeight: '1.4',
        },
        controls: {
            height: '2rem',
            paddingY: '0.25rem',
            paddingX: '0.6rem',
        },
        sizes: {
            sm: { fontSize: '0.8125rem', paddingY: '0.2rem', paddingX: '0.45rem' },
            lg: { fontSize: '1.125rem', paddingY: '0.5rem', paddingX: '1rem' },
        },
    },
});
```

## Examples

The example app lives in `src/example` and showcases all components.

```bash
npm run dev
```

## Theming

VueForge maps the theme preset to CSS variables. You can override parts of the preset and it will recompute shades for color tokens.

```ts
app.use(VueForge, {
    theme: {
        preset: DefaultTheme,
        strict: false,
        overrides: {
            colors: {
                green: '#18a66a',
            },
        },
        selector: ':root',
        darkSelector: ':root[data-theme=dark]',
    },
});
```

You can also update the theme at runtime:

```ts
import { setTheme, updateTheme } from '@codemonster-ru/vueforge';

setTheme({ preset: DefaultTheme });
updateTheme({
    overrides: {
        colors: { blue: '#2b6cb0' },
    },
});
```

Notes:

- Non-hex colors (e.g. `rgb(...)`, `hsl(...)`, `var(--brand)`) are allowed, but shade variables (`--vf-*-100..900`) will not be generated.
- Set `theme.strict: true` to throw on invalid token values (non-string / non-plain object) during theme application.

## Theme API

Core methods:

- `setTheme(options)` — apply a theme preset (with optional overrides).
- `updateTheme(partial)` — update only parts of the current theme.
- `getTheme()` — get the last applied theme options.

Key options:

- `preset`: base theme object (e.g. `DefaultTheme`)
- `overrides`: partial overrides merged into preset
- `selector`: CSS selector for base variables (default `:root`)
- `darkSelector`: selector for dark scheme (default `:root[data-theme=dark]`)
- `strict`: throw on invalid token values (otherwise warnings)

Example:

```ts
setTheme({
    preset: DefaultTheme,
    overrides: {
        colors: { blue: '#2b6cb0' },
        typography: { fontSize: '0.95rem' },
    },
    strict: true,
});
```

## License

[MIT](https://github.com/codemonster-ru/vueforge/blob/main/LICENSE)

## Author

[@KolesnikovKirill](https://github.com/kolesnikovKirill)
