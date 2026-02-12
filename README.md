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
    SearchInput,
    PasswordInput,
    OtpInput,
    ColorPicker,
    MaskedInput,
    NumberInput,
    FormField,
    Textarea,
    FileUpload,
    Breadcrumbs,
    Select,
    Autocomplete,
    MultiSelect,
    TagInput,
    DatePicker,
    DateRangePicker,
    TimePicker,
    DateTimePicker,
    Pagination,
    DataTable,
    Checkbox,
    Switch,
    Alert,
    Skeleton,
    Progress,
    Badge,
    Chip,
    Accordion,
    AccordionItem,
    Slider,
    Stepper,
    Rating,
    Tree,
    TreeSelect,
    VirtualScroller,
    Drawer,
    ConfirmDialog,
    Dropdown,
    SplitButton,
    ContextMenu,
    CommandPalette,
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
<SearchInput v-model="query" placeholder="Search components" clearable />
<PasswordInput v-model="password" placeholder="Enter password" show-strength />
<OtpInput v-model="otp" :length="6" />
<ColorPicker v-model="brandColor" :presets="['#2b6cb0', '#0cbc87', '#d6293e']" />
<MaskedInput v-model="phone" mask="+7 (###) ###-##-##" />
<NumberInput v-model="age" :min="0" :max="120" :step="1" />
<Textarea v-model="bio" placeholder="Tell us about yourself" />
<FileUpload v-model="resume" accept=".pdf,.doc,.docx" />
<Breadcrumbs :items="breadcrumbItems" />
<Select v-model="role" :options="roles" placeholder="Choose role" />
<Autocomplete v-model="country" :options="countries" placeholder="Find country" />
<MultiSelect v-model="countries" :options="countryOptions" placeholder="Select countries" clearable />
<TagInput v-model="skills" :options="skillOptions" placeholder="Add skills" clearable />
<DatePicker v-model="birthday" placeholder="Pick birthday" />
<DateRangePicker v-model="range" placeholder="Pick range" />
<TimePicker v-model="meetingTime" placeholder="Pick time" />
<DateTimePicker v-model="meetingAt" placeholder="Pick date and time" />
<Pagination v-model="page" :total-items="240" :page-size="20" />
<DataTable :columns="columns" :rows="rows" sortable striped />
<Checkbox v-model="agreed" label="I agree" />
<Switch v-model="darkMode" label="Dark mode" />
<Alert severity="info" title="Heads up" message="Project settings were updated." />
<Skeleton height="12px" width="140px" />
<Progress :value="64" />
<Badge label="Beta" />
<Chip label="New" />
<Slider v-model="volume" :min="0" :max="100" :step="5" show-value />
<Stepper v-model="step" :steps="steps" clickable />
<Rating v-model="rating" allow-half />
<Tree v-model="selectedNode" v-model:expandedKeys="expandedKeys" :items="treeItems" />
<TreeSelect v-model="selectedNode" v-model:expandedKeys="expandedKeys" :items="treeItems" placeholder="Select node" />
<VirtualScroller :items="largeItems" :item-height="40" height="320px">
    <template #default="{ item, index }">
        {{ index + 1 }}. {{ item.label }}
    </template>
</VirtualScroller>
<Accordion v-model="faq">
    <AccordionItem value="shipping" title="Shipping">
        Shipping details
    </AccordionItem>
    <AccordionItem value="returns" title="Returns">
        Returns policy
    </AccordionItem>
</Accordion>
<Drawer v-model="drawerOpen" title="Filters" position="right">
    <template #body>
        Drawer content
    </template>
</Drawer>
<ConfirmDialog
    v-model="confirmOpen"
    title="Delete item?"
    message="This action cannot be undone."
    confirm-label="Delete"
    @confirm="removeItem"
/>
<Dropdown :items="menuItems">
    <template #trigger>
        <Button label="Actions" />
    </template>
</Dropdown>
<SplitButton
    label="Save"
    :items="[
        { label: 'Save draft', command: saveDraft },
        { label: 'Save and publish', command: publish },
    ]"
    @click="save"
/>
<ContextMenu :items="menuItems">
    <div>Right-click here</div>
</ContextMenu>
<CommandPalette
    v-model="commandPaletteOpen"
    :items="[
        { label: 'Open docs', value: 'docs', group: 'Navigation' },
        { label: 'Save as draft', value: 'draft', group: 'Actions' },
    ]"
/>
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
- SearchInput
- PasswordInput
- OtpInput
- ColorPicker
- MaskedInput
- NumberInput
- FormField
- Textarea
- FileUpload
- Link
- Breadcrumbs
- Menu
- Modal
- ConfirmDialog
- Drawer
- Dropdown
- SplitButton
- ContextMenu
- CommandPalette
- Popover
- Select
- Autocomplete
- MultiSelect
- TagInput
- DatePicker
- DateRangePicker
- TimePicker
- DateTimePicker
- Pagination
- DataTable
- Switch
- Tooltip
- Skeleton
- Progress
- Badge
- Chip
- Avatar
- Slider
- Stepper
- Rating
- Tree
- TreeSelect
- VirtualScroller

Input / Search / Password / Textarea (quick API):

- `Input`: single-line control, supports `v-model`, `size`, `variant`, `disabled`, `readonly`.
- `SearchInput`: search-focused control with `debounce`, `clearable`, `loading`, `size`, and `variant`.
- `PasswordInput`: password control, supports visibility toggle, strength meter, CapsLock hint, `size`, and `variant`.
- `OtpInput`: one-time code control, supports fixed length, paste handling, numeric/alphanumeric modes, `size`, and `variant`.
- `ColorPicker`: color control with presets, optional alpha channel, and output formats (`hex`/`rgb`/`hsl`).
- `MaskedInput`: formatted input control with string/function masks and optional raw output (`unmask`).
- `NumberInput`: numeric control, supports `v-model`, `min`, `max`, `step`, `precision`, `controls`, `size`, `variant`.
- `Textarea`: multi-line control, same as Input plus `rows`.
- `TagInput`: token/tag control, supports `v-model` (array), suggestions, custom tags, `maxTags`, `clearable`, `size`, `variant`.
- `SearchInput`, `OtpInput`, `ColorPicker`, `MaskedInput`, `Checkbox`, `Select`, `Autocomplete`, `MultiSelect`, `TagInput`, `DatePicker`, `DateRangePicker`, `DateTimePicker`, `Pagination`, `DataTable`, and `TreeSelect` also support `variant: 'filled' | 'outlined'`.

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

## TagInput

Props:

- `modelValue?: Array<string | number>` (v-model)
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
- `allowCustom?: boolean` (default `true`)
- `maxTags?: number`
- `clearable?: boolean` (default `false`)
- `validateTag?: (value: string) => boolean`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)

Events:

- `update:modelValue`
- `change`
- `search`
- `add` (payload: `{ value: string | number; source: 'option' | 'custom' }`)
- `remove`
- `reject` (payload: `{ reason: 'duplicate' | 'maxTags' | 'invalid' | 'readonly'; value: string }`)
- `focus`
- `blur`

Example:

```vue
<TagInput v-model="skills" :options="skillOptions" placeholder="Add skills" clearable />
```

### TagInput tokens

Component tokens (override via `theme.overrides.components.taginput`):

- `minWidth`, `minHeight`, `fontSize`, `controlGap`, `chevronSize`
- `padding`, `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`
- `disabledOpacity`
- `panelBackgroundColor`, `panelBorderColor`, `panelPadding`, `panelMaxHeight`, `panelRadiusOffset`, `panelShadow`
- `optionPadding`, `optionBorderRadius`
- `optionHoverBackgroundColor`, `optionHighlightedBackgroundColor`
- `emptyPadding`, `emptyColor`
- `loadingPadding`, `loadingColor`
- `inputMinWidth`
- `chipGap`, `chipPadding`, `chipRadius`, `chipBackgroundColor`, `chipTextColor`, `chipFontSize`
- `chipRemoveSize`, `chipRemoveRadius`, `chipRemoveHoverBackgroundColor`
- `clearSize`, `clearRadius`, `clearHoverBackgroundColor`
- `small.fontSize`, `small.padding`, `small.chipPadding`, `small.chipFontSize`
- `large.fontSize`, `large.padding`, `large.chipPadding`, `large.chipFontSize`

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

## DateRangePicker

Props:

- `modelValue?: [string | null, string | null] | null` (v-model, ISO date `YYYY-MM-DD`)
- `placeholder?: string`
- `startPlaceholder?: string` (default `Start`)
- `endPlaceholder?: string` (default `End`)
- `separator?: string` (default `-`)
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
<DateRangePicker v-model="dateRange" placeholder="Pick date range" min="2026-01-01" max="2026-12-31" />
```

## TimePicker

Props:

- `modelValue?: string` (v-model, time `HH:mm`)
- `placeholder?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `min?: string` (time `HH:mm`)
- `max?: string` (time `HH:mm`)
- `step?: number` (minutes, default `30`)
- `format?: '24h' | '12h'` (default `24h`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)

Events:

- `update:modelValue`
- `change`
- `focus`
- `blur`

Example:

```vue
<TimePicker v-model="meetingTime" placeholder="Pick time" min="09:00" max="18:00" :step="15" />
```

### TimePicker tokens

Component tokens (override via `theme.overrides.components.timepicker`):

- `minWidth`, `fontSize`, `controlGap`, `chevronSize`
- `padding`, `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`
- `disabledOpacity`
- `panelBackgroundColor`, `panelBorderColor`, `panelPadding`, `panelMaxHeight`, `panelRadiusOffset`, `panelShadow`
- `optionPadding`, `optionBorderRadius`
- `optionHoverBackgroundColor`, `optionActiveBackgroundColor`, `optionActiveTextColor`
- `small.fontSize`, `small.padding`
- `large.fontSize`, `large.padding`

## DateTimePicker

Props:

- `modelValue?: string` (v-model, ISO datetime `YYYY-MM-DDTHH:mm`)
- `placeholder?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `min?: string` (ISO datetime `YYYY-MM-DDTHH:mm`)
- `max?: string` (ISO datetime `YYYY-MM-DDTHH:mm`)
- `locale?: string` (default `en-US`)
- `firstDayOfWeek?: number` (default `0`, Sunday)
- `minuteStep?: number` (default `30`)
- `format?: '24h' | '12h'` (default `24h`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)

Events:

- `update:modelValue`
- `change`
- `focus`
- `blur`

Example:

```vue
<DateTimePicker v-model="meetingAt" placeholder="Pick date and time" />
<DateTimePicker
    v-model="meetingAtAlt"
    variant="outlined"
    min="2026-01-10T09:00"
    max="2026-12-31T18:00"
    :minute-step="15"
    format="12h"
/>
```

### DateTimePicker tokens

Component tokens (override via `theme.overrides.components.datetimepicker`):

- `minWidth`, `fontSize`, `controlGap`, `chevronSize`
- `padding`, `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`
- `disabledOpacity`
- `panelWidth`, `panelBackgroundColor`, `panelBorderColor`, `panelPadding`, `panelRadiusOffset`, `panelShadow`, `panelGap`
- `headerGap`, `headerPadding`, `monthLabelFontSize`, `monthLabelFontWeight`
- `navButtonSize`, `navButtonRadius`, `navButtonFontSize`
- `weekdayColor`, `weekdayFontSize`, `weekdaysMarginBottom`
- `daysGap`, `daySize`, `dayFontSize`, `dayBorderRadius`
- `dayHoverBackgroundColor`, `daySelectedBackgroundColor`, `daySelectedTextColor`, `dayMutedColor`, `dayTodayBorderColor`
- `timesWidth`, `timesMaxHeight`, `timesPaddingLeft`, `timesBorderColor`
- `timeOptionPadding`, `timeOptionBorderRadius`, `timeOptionFontSize`
- `timeOptionHoverBackgroundColor`, `timeOptionActiveBackgroundColor`, `timeOptionActiveTextColor`
- `small.fontSize`, `small.padding`, `small.daySize`
- `large.fontSize`, `large.padding`, `large.daySize`

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

Slots:

- `indicator` - slot props: `{ step, index, status, active, completed, upcoming, error }`
- `step` - slot props: `{ step, index, status, active, completed, upcoming, error }`

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

## FileUpload

Props:

- `modelValue?: File | File[] | null` (v-model)
- `multiple?: boolean`
- `accept?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `maxSize?: number` (bytes)
- `maxFiles?: number`
- `placeholder?: string`
- `buttonLabel?: string` (default `Browse`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)

Events:

- `update:modelValue`
- `change`
- `reject` (payload: `Array<{ file: File; reason: 'maxSize' | 'maxFiles'; maxSize?: number; maxFiles?: number }>` )
- `focus`
- `blur`

Example:

```vue
<FileUpload v-model="attachments" multiple :max-files="5" :max-size="10_000_000" />
```

### FileUpload tokens

Component tokens (override via `theme.overrides.components.fileUpload`):

- `minHeight`, `fontSize`, `gap`, `padding`
- `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`
- `disabledOpacity`, `dragBackgroundColor`
- `listGap`, `itemPadding`, `itemBorderColor`, `itemBackgroundColor`, `itemRadius`, `itemTextColor`, `sizeTextColor`
- `buttonPadding`, `buttonRadius`, `buttonBorderColor`, `buttonBackgroundColor`, `buttonTextColor`, `buttonHoverBackgroundColor`
- `removeSize`, `removeRadius`, `removeHoverBackgroundColor`
- `small.fontSize`, `small.padding`, `small.buttonPadding`
- `large.fontSize`, `large.padding`, `large.buttonPadding`

## SearchInput

Props:

- `modelValue?: string` (v-model)
- `placeholder?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `debounce?: number` (default `300`)
- `loading?: boolean` (default `false`)
- `clearable?: boolean` (default `false`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `ariaLabel?: string` (default `Search input`)

Events:

- `update:modelValue`
- `input`
- `change`
- `search`
- `clear`
- `focus`
- `blur`

Example:

```vue
<SearchInput v-model="query" placeholder="Search..." clearable />
<SearchInput v-model="query" placeholder="Search..." :debounce="500" loading variant="outlined" />
```

### SearchInput tokens

Component tokens (override via `theme.overrides.components.searchInput`):

- `gap`, `fontSize`, `padding`
- `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`
- `disabledOpacity`
- `iconSize`, `iconColor`
- `clearSize`, `clearRadius`, `clearHoverBackgroundColor`
- `loadingSize`, `loadingBorderColor`, `loadingTopBorderColor`
- `small.fontSize`, `small.padding`, `small.iconSize`, `small.clearSize`
- `large.fontSize`, `large.padding`, `large.iconSize`, `large.clearSize`

## NumberInput

Props:

- `modelValue?: number | null` (v-model)
- `min?: number`
- `max?: number`
- `step?: number` (default `1`)
- `precision?: number`
- `placeholder?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `controls?: boolean` (default `true`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `ariaLabel?: string` (default `Number input`)

Events:

- `update:modelValue`
- `input`
- `change`
- `focus`
- `blur`

Example:

```vue
<NumberInput v-model="quantity" :min="0" :max="10" :step="1" />
```

## PasswordInput

Props:

- `modelValue?: string` (v-model)
- `placeholder?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `autocomplete?: string` (default `current-password`)
- `showToggle?: boolean` (default `true`)
- `showStrength?: boolean` (default `false`)
- `showCapsLockHint?: boolean` (default `true`)
- `revealLabel?: string` (default `Show password`)
- `hideLabel?: string` (default `Hide password`)
- `revealText?: string` (default `Show`)
- `hideText?: string` (default `Hide`)
- `capsLockHint?: string` (default `Caps Lock is on`)
- `weakLabel?: string` (default `Weak password`)
- `mediumLabel?: string` (default `Medium password`)
- `strongLabel?: string` (default `Strong password`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `ariaLabel?: string` (default `Password input`)

Events:

- `update:modelValue`
- `input`
- `change`
- `focus`
- `blur`
- `toggleVisibility` (payload: `boolean`)

Example:

```vue
<PasswordInput v-model="password" show-strength />
```

### PasswordInput tokens

Component tokens (override via `theme.overrides.components.passwordInput`):

- `gap`, `fontSize`, `padding`
- `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`
- `disabledOpacity`
- `toggleSize`, `toggleRadius`, `toggleColor`, `toggleHoverBackgroundColor`
- `strengthGap`, `strengthTrackHeight`, `strengthTrackRadius`, `strengthTrackBackgroundColor`
- `strengthWeakColor`, `strengthMediumColor`, `strengthStrongColor`
- `metaFontSize`, `hintColor`
- `small.fontSize`, `small.padding`
- `large.fontSize`, `large.padding`

## OtpInput

Props:

- `modelValue?: string` (v-model)
- `length?: number` (default `6`)
- `placeholder?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `mask?: boolean` (default `false`)
- `alphanumeric?: boolean` (default `false`)
- `autocomplete?: string` (default `one-time-code`)
- `autoFocus?: boolean` (default `false`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `ariaLabel?: string` (default `OTP input`)

Events:

- `update:modelValue`
- `change`
- `complete` (payload: `string`)
- `focus`
- `blur`
- `paste` (payload: `string`)

Example:

```vue
<OtpInput v-model="otp" :length="6" />
<OtpInput v-model="backupCode" :length="8" alphanumeric variant="outlined" />
```

### OtpInput tokens

Component tokens (override via `theme.overrides.components.otpInput`):

- `gap`, `fontSize`, `cellSize`, `padding`
- `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`
- `disabledOpacity`
- `small.cellSize`, `small.fontSize`, `small.padding`
- `large.cellSize`, `large.fontSize`, `large.padding`

## ColorPicker

Props:

- `modelValue?: string` (v-model)
- `format?: 'hex' | 'rgb' | 'hsl'` (default `hex`)
- `alpha?: boolean` (default `false`)
- `presets?: string[]` (default `[]`)
- `placeholder?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `ariaLabel?: string` (default `Color picker`)

Events:

- `update:modelValue`
- `change`
- `open`
- `close`

Example:

```vue
<ColorPicker v-model="brandColor" />
<ColorPicker v-model="brandColorRgba" format="rgb" alpha variant="outlined" />
```

### ColorPicker tokens

Component tokens (override via `theme.overrides.components.colorPicker`):

- `minWidth`, `gap`, `fontSize`, `padding`
- `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`
- `disabledOpacity`
- `swatchSize`, `swatchRadius`
- `panelPadding`, `panelBorderColor`, `panelBackgroundColor`, `panelShadow`, `panelGap`
- `rangeAccentColor`
- `presetSize`, `presetRadius`, `presetBorderColor`, `presetHoverBorderColor`
- `small.padding`, `small.fontSize`, `small.swatchSize`, `small.presetSize`
- `large.padding`, `large.fontSize`, `large.swatchSize`, `large.presetSize`

## MaskedInput

Props:

- `modelValue?: string` (v-model)
- `mask?: string | ((value: string) => string)` (default `''`)
- `placeholder?: string`
- `placeholderChar?: string` (default `_`)
- `disabled?: boolean`
- `readonly?: boolean`
- `unmask?: boolean` (default `false`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)

Events:

- `update:modelValue`
- `input`
- `change`
- `focus`
- `blur`
- `complete`

Example:

```vue
<MaskedInput v-model="phone" mask="+7 (###) ###-##-##" />
<MaskedInput v-model="licenseRaw" mask="AA-####" unmask variant="outlined" />
```

### MaskedInput tokens

Component tokens (override via `theme.overrides.components.maskedInput`):

- `gap`, `fontSize`, `padding`
- `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`
- `disabledOpacity`
- `small.fontSize`, `small.padding`
- `large.fontSize`, `large.padding`

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

## Breadcrumbs

Props:

- `items?: Array<{ label?: string; to?: string; href?: string; url?: string; active?: boolean; disabled?: boolean }>`
- `separator?: string` (default `/`)
- `ariaLabel?: string` (default `Breadcrumbs`)

Slots:

- `item` - slot props: `{ item, index, isLast, active }`
- `separator` (optional) - slot props: `{ separator }`

Example:

```vue
<Breadcrumbs
    :items="[
        { label: 'Home', to: '/' },
        { label: 'Settings', to: '/settings' },
        { label: 'Profile', active: true },
    ]"
/>
```

### Breadcrumbs tokens

Component tokens (override via `theme.overrides.components.breadcrumbs`):

- `gap`, `fontSize`, `textColor`, `hoverColor`, `activeColor`
- `separatorColor`, `disabledOpacity`

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

## ConfirmDialog

Props:

- `modelValue?: boolean` (v-model)
- `title?: string` (default `Confirm action`)
- `message?: string`
- `confirmLabel?: string` (default `Confirm`)
- `cancelLabel?: string` (default `Cancel`)
- `confirmSeverity?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger'` (default `danger`)
- `loading?: boolean` (default `false`)
- `closeOnConfirm?: boolean` (default `true`)
- `size?: 'sm' | 'md' | 'lg'` (default `sm`)
- `closeOnOverlay?: boolean` (default `true`)
- `closeOnEsc?: boolean` (default `true`)
- `showClose?: boolean` (default `true`)
- `lockScroll?: boolean` (default `true`)

Slots:

- `default` (optional) - dialog message/body content (fallbacks to `message`)
- `actions` (optional) - custom action buttons; slot props: `{ confirm, cancel }`

Events:

- `update:modelValue`
- `confirm`
- `cancel`
- `open`
- `close`

Example:

```vue
<ConfirmDialog
    v-model="open"
    title="Delete item?"
    message="This action cannot be undone."
    confirm-label="Delete"
    @confirm="removeItem"
/>
```

### ConfirmDialog tokens

Component tokens (override via `theme.overrides.components.confirmDialog`):

- `maxWidth`
- `messageColor`, `messageFontSize`, `messageLineHeight`
- `actionsGap`

## Drawer

Props:

- `modelValue?: boolean` (v-model)
- `title?: string`
- `position?: 'left' | 'right' | 'top' | 'bottom'` (default `right`)
- `size?: 'sm' | 'md' | 'lg'`
- `overlay?: boolean` (default `true`)
- `closeOnOverlay?: boolean` (default `true`)
- `closeOnEsc?: boolean` (default `true`)
- `showClose?: boolean` (default `true`)
- `lockScroll?: boolean` (default `true`)

Slots:

- `header` (optional) - replaces the title area
- `body` (optional) - drawer content (defaults to default slot if not provided)
- `default` (optional) - drawer content if `body` slot is not used
- `footer` (optional)
- `close` (optional) - custom close button; slot props: `{ close }`

Events:

- `update:modelValue`
- `open`
- `close`

Example:

```vue
<Drawer v-model="open" title="Filters" position="right">
    <template #body>
        <p>Drawer content</p>
    </template>
    <template #footer>
        <Button label="Reset" severity="secondary" size="small" />
        <Button label="Apply" size="small" @click="open = false" />
    </template>
</Drawer>
```

### Drawer tokens

Component tokens (override via `theme.overrides.components.drawer`):

- `width`, `widthSm`, `widthLg`
- `height`, `heightSm`, `heightLg`
- `padding`, `borderRadius`
- `backgroundColor`, `textColor`
- `overlayBackgroundColor`
- `shadow`
- `zIndex`
- `headerGap`, `bodyGap`, `footerGap`
- `titleFontSize`, `titleLineHeight`, `titleFontWeight`
- `closeSize`, `closeRadius`, `closeOffset`
- `closeColor`, `closeFontSize`, `closeHoverBackgroundColor`

## Dropdown

Props:

- `modelValue?: boolean` (v-model)
- `items?: Array<{ label?: string; to?: string; href?: string; url?: string; icon?: string; disabled?: boolean; separator?: boolean; command?: () => void }>`
- `placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'bottom' | 'top'` (default `bottom-start`)
- `offset?: number` (default `6`)
- `disabled?: boolean`
- `closeOnSelect?: boolean` (default `true`)
- `closeOnEsc?: boolean` (default `true`)
- `matchTriggerWidth?: boolean` (default `true`)

Slots:

- `trigger`
- `default` (optional) - dropdown content (defaults to `items` list if provided)

Note: For custom dropdown content, add `data-dropdown-close` to clickable elements to auto-close on click.

Events:

- `update:modelValue`
- `open`
- `close`
- `select`

Example:

```vue
<Dropdown :items="menuItems">
    <template #trigger>
        <Button label="Actions" />
    </template>
</Dropdown>
```

### Dropdown tokens

Component tokens (override via `theme.overrides.components.dropdown`):

- `panelPadding`, `panelBorderRadius`, `panelBorderColor`
- `panelBackgroundColor`, `panelShadow`, `zIndex`
- `disabledOpacity`, `itemPadding`

## ContextMenu

Props:

- `modelValue?: boolean` (v-model)
- `items?: Array<{ label?: string; to?: string; href?: string; url?: string; icon?: string; disabled?: boolean; separator?: boolean; command?: () => void }>`
- `disabled?: boolean`
- `closeOnSelect?: boolean` (default `true`)
- `closeOnEsc?: boolean` (default `true`)
- `offset?: number` (default `2`)

Slots:

- `default` - context area/target
- `menu` (optional) - menu content (defaults to `items` list if provided)

Note: For custom menu content, add `data-context-menu-close` to clickable elements to auto-close on click.

Events:

- `update:modelValue`
- `open`
- `close`
- `select`
- `contextmenu`

Example:

```vue
<ContextMenu :items="menuItems">
    <div class="surface">Right-click here</div>
</ContextMenu>
```

### ContextMenu tokens

Component tokens (override via `theme.overrides.components.contextMenu`):

- `minWidth`
- `panelPadding`, `panelBorderRadius`, `panelBorderColor`
- `panelBackgroundColor`, `panelShadow`, `zIndex`
- `disabledOpacity`, `itemPadding`

## CommandPalette

Props:

- `modelValue?: boolean` (v-model)
- `items?: Array<{ label: string; value?: string | number; description?: string; shortcut?: string; group?: string; disabled?: boolean; keywords?: Array<string>; command?: () => void }>`
- `placeholder?: string` (default `Type a command or search...`)
- `emptyText?: string` (default `No commands found`)
- `ariaLabel?: string` (default `Command palette`)
- `closeOnOverlay?: boolean` (default `true`)
- `closeOnEsc?: boolean` (default `true`)
- `closeOnSelect?: boolean` (default `true`)
- `filter?: boolean` (default `true`)
- `enableShortcut?: boolean` (default `true`)
- `shortcutKey?: string` (default `k`)

Events:

- `update:modelValue`
- `open`
- `close`
- `select`
- `search`

Example:

```vue
<CommandPalette
    v-model="open"
    :items="[
        { label: 'Open docs', value: 'docs', group: 'Navigation' },
        { label: 'Save and publish', value: 'publish', group: 'Actions', shortcut: 'Ctrl+Enter' },
    ]"
    @select="onCommand"
/>
```

### CommandPalette tokens

Component tokens (override via `theme.overrides.components.commandPalette`):

- `width`, `maxWidth`, `maxHeight`
- `padding`, `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `overlayBackgroundColor`
- `shadow`, `zIndex`, `headerGap`
- `inputPadding`, `inputBorderRadius`, `inputBorderColor`
- `inputBackgroundColor`, `inputTextColor`, `inputPlaceholderColor`
- `inputFocusBorderColor`, `inputFocusRingShadow`
- `listGap`, `groupGap`
- `groupLabelPadding`, `groupLabelColor`, `groupLabelFontSize`
- `itemPadding`, `itemBorderRadius`, `itemGap`
- `itemTextColor`, `itemDescriptionColor`, `itemDescriptionFontSize`
- `itemActiveBackgroundColor`, `itemActiveTextColor`, `itemDisabledOpacity`
- `shortcutPadding`, `shortcutBorderRadius`, `shortcutBorderColor`
- `shortcutBackgroundColor`, `shortcutTextColor`, `shortcutFontSize`
- `emptyPadding`, `emptyColor`

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

## Chip

Props:

- `label?: string`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'solid' | 'soft' | 'outline'` (default `soft`)
- `severity?: 'neutral' | 'info' | 'success' | 'warn' | 'danger'` (default `neutral`)
- `disabled?: boolean`
- `closable?: boolean` (default `false`)
- `icon?: string`
- `ariaLabel?: string`
- `closeLabel?: string` (default `Remove`)

Slots:

- `default` - chip content (fallbacks to `label`)
- `icon` (optional)
- `close` (optional)

Events:

- `close`

Example:

```vue
<Chip label="New" />
<Chip severity="info" closable>Info</Chip>
```

### Chip tokens

Component tokens (override via `theme.overrides.components.chip`):

- `fontSize`, `lineHeight`, `paddingX`, `paddingY`, `borderRadius`, `gap`
- `backgroundColor`, `textColor`, `borderColor`
- `softBackgroundColor`, `softTextColor`, `softBorderColor`
- `outlineTextColor`, `outlineBorderColor`
- `iconSize`, `closeSize`, `closeFontSize`, `closeRadius`, `closeColor`, `closeHoverBackgroundColor`, `disabledOpacity`
- `info.*`, `success.*`, `warn.*`, `danger.*` (backgroundColor/textColor/borderColor/soft*/outline*)
- `small.fontSize`, `small.paddingX`, `small.paddingY`
- `large.fontSize`, `large.paddingX`, `large.paddingY`

## Avatar

Props:

- `src?: string`
- `alt?: string`
- `name?: string`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `shape?: 'circle' | 'rounded'` (default `circle`)
- `status?: 'online' | 'offline' | 'busy' | 'away'`

Slots:

- `default` - custom avatar content

Example:

```vue
<Avatar name="Ada Lovelace" />
<Avatar src="/img/ada.png" alt="Ada Lovelace" size="large" />
<Avatar name="Ada Lovelace" status="online" />
```

### Avatar tokens

Component tokens (override via `theme.overrides.components.avatar`):

- `size`, `fontSize`, `fontWeight`
- `backgroundColor`, `textColor`, `borderColor`, `borderWidth`, `borderRadius`
- `statusSize`, `statusBorderWidth`, `statusBorderColor`
- `statusOnlineColor`, `statusOfflineColor`, `statusBusyColor`, `statusAwayColor`
- `small.size`, `small.fontSize`, `small.statusSize`
- `large.size`, `large.fontSize`, `large.statusSize`

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

## Slider

Props:

- `modelValue?: number | [number, number]` (v-model)
- `min?: number` (default `0`)
- `max?: number` (default `100`)
- `step?: number` (default `1`)
- `range?: boolean` (default `false`)
- `disabled?: boolean`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `showValue?: boolean` (default `false`)
- `marks?: Array<{ value: number; label?: string }>`

Events:

- `update:modelValue`
- `input`
- `change`
- `focus`
- `blur`

Example:

```vue
<Slider v-model="volume" :min="0" :max="100" :step="5" show-value />
<Slider v-model="priceRange" :min="0" :max="1000" :step="10" range />
```

### Slider tokens

Component tokens (override via `theme.overrides.components.slider`):

- `width`, `gap`
- `textColor`
- `trackHeight`, `trackBackgroundColor`, `trackRadius`, `fillBackgroundColor`
- `thumbSize`, `thumbColor`, `thumbBorderColor`, `thumbBorderWidth`, `thumbShadow`
- `focusRingShadow`, `disabledOpacity`
- `markSize`, `markColor`, `markLabelFontSize`, `markLabelColor`, `marksHeight`
- `valueFontSize`, `valueColor`
- `small.trackHeight`, `small.thumbSize`, `small.valueFontSize`
- `large.trackHeight`, `large.thumbSize`, `large.valueFontSize`

## Stepper

Props:

- `modelValue?: string | number` (v-model)
- `steps?: Array<{ label?: string; description?: string; value?: string | number; disabled?: boolean; status?: 'completed' | 'active' | 'upcoming' | 'error' }>`
- `orientation?: 'horizontal' | 'vertical'` (default `horizontal`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `clickable?: boolean` (default `false`)
- `ariaLabel?: string`
- `ariaLabelledby?: string`

Events:

- `update:modelValue`
- `change`

Example:

```vue
<Stepper v-model="step" :steps="steps" clickable />
<Stepper v-model="step" :steps="steps" orientation="vertical" size="small" />
```

### Stepper tokens

Component tokens (override via `theme.overrides.components.stepper`):

- `gap`, `itemGap`, `lineThickness`, `lineLength`, `lineColor`
- `indicatorSize`, `indicatorBorderRadius`, `indicatorBorderWidth`, `indicatorFontSize`
- `indicatorBackgroundColor`, `indicatorTextColor`, `indicatorBorderColor`
- `activeIndicatorBackgroundColor`, `activeIndicatorTextColor`, `activeIndicatorBorderColor`
- `completedIndicatorBackgroundColor`, `completedIndicatorTextColor`, `completedIndicatorBorderColor`
- `errorIndicatorBackgroundColor`, `errorIndicatorTextColor`, `errorIndicatorBorderColor`
- `labelFontSize`, `labelColor`, `descriptionFontSize`, `descriptionColor`
- `disabledOpacity`
- `small.indicatorSize`, `small.indicatorFontSize`, `small.labelFontSize`, `small.descriptionFontSize`, `small.lineLength`, `small.itemGap`
- `large.indicatorSize`, `large.indicatorFontSize`, `large.labelFontSize`, `large.descriptionFontSize`, `large.lineLength`, `large.itemGap`

## Rating

Props:

- `modelValue?: number` (v-model)
- `max?: number` (default `5`)
- `allowHalf?: boolean` (default `false`)
- `readonly?: boolean`
- `disabled?: boolean`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `ariaLabel?: string`

Events:

- `update:modelValue`
- `change`
- `focus`
- `blur`

Example:

```vue
<Rating v-model="score" />
<Rating v-model="score" allow-half size="large" />
```

### Rating tokens

Component tokens (override via `theme.overrides.components.rating`):

- `gap`, `size`, `color`, `activeColor`, `hoverColor`
- `focusRingShadow`, `focusRadius`, `disabledOpacity`
- `small.size`
- `large.size`

## Tree

Props:

- `items?: Array<{ key: string | number; label: string; disabled?: boolean; children?: Array<...> }>` (default `[]`)
- `modelValue?: string | number | Array<string | number>` (v-model)
- `expandedKeys?: Array<string | number>` (`v-model:expandedKeys`)
- `multiple?: boolean` (default `false`)
- `selectable?: boolean` (default `true`)
- `expandOnClick?: boolean` (default `true`)
- `disabled?: boolean`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `ariaLabel?: string`
- `ariaLabelledby?: string`

Events:

- `update:modelValue`
- `update:expandedKeys`
- `change`
- `toggle`
- `nodeClick`

Example:

```vue
<Tree v-model="selectedNode" v-model:expandedKeys="expandedKeys" :items="treeItems" />
<Tree v-model="selectedMany" :items="treeItems" multiple variant="outlined" />
```

### Tree tokens

Component tokens (override via `theme.overrides.components.tree`):

- `gap`, `indent`, `rowGap`, `rowPadding`, `rowPaddingInline`
- `rowBorderRadius`, `rowBorderColor`, `rowFontSize`, `rowTextColor`
- `rowBackgroundColor`, `rowHoverBackgroundColor`, `rowSelectedBackgroundColor`, `rowSelectedTextColor`
- `toggleSize`, `toggleRadius`, `toggleBorderColor`, `toggleBackgroundColor`, `toggleTextColor`, `toggleHoverBackgroundColor`
- `focusRingShadow`, `disabledOpacity`
- `small.rowPadding`, `small.rowPaddingInline`, `small.rowFontSize`, `small.toggleSize`
- `large.rowPadding`, `large.rowPaddingInline`, `large.rowFontSize`, `large.toggleSize`

## TreeSelect

Props:

- `items?: Array<{ key: string | number; label: string; disabled?: boolean; children?: Array<...> }>` (default `[]`)
- `modelValue?: string | number | Array<string | number>` (v-model)
- `expandedKeys?: Array<string | number>` (`v-model:expandedKeys`)
- `multiple?: boolean` (default `false`)
- `selectable?: boolean` (default `true`)
- `expandOnClick?: boolean` (default `true`)
- `placeholder?: string`
- `searchPlaceholder?: string` (default `Search...`)
- `disabled?: boolean`
- `readonly?: boolean`
- `loading?: boolean` (default `false`)
- `loadingText?: string` (default `Loading...`)
- `emptyText?: string` (default `No results`)
- `filter?: boolean` (default `true`)
- `clearable?: boolean` (default `false`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)

Events:

- `update:modelValue`
- `change`
- `update:expandedKeys`
- `toggle`
- `nodeClick`
- `search`
- `focus`
- `blur`

Slots:

- `label` - forwarded Tree node label slot props: `{ node, level, selected, expanded, disabled }`

Example:

```vue
<TreeSelect
    v-model="selectedNode"
    v-model:expandedKeys="expandedKeys"
    :items="treeItems"
    placeholder="Select docs section"
    clearable
/>
<TreeSelect v-model="selectedMany" :items="treeItems" multiple variant="outlined" />
```

### TreeSelect tokens

Component tokens (override via `theme.overrides.components.treeselect`):

- `minWidth`, `fontSize`, `controlGap`, `chevronSize`
- `padding`, `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`
- `disabledOpacity`
- `panelBackgroundColor`, `panelBorderColor`, `panelPadding`, `panelMaxHeight`, `panelRadiusOffset`, `panelShadow`
- `searchPadding`, `searchBorderColor`, `searchBorderRadius`
- `emptyPadding`, `emptyColor`
- `loadingPadding`, `loadingColor`
- `clearSize`, `clearRadius`, `clearHoverBackgroundColor`
- `small.fontSize`, `small.padding`
- `large.fontSize`, `large.padding`

## VirtualScroller

Props:

- `items?: Array<unknown>` (default `[]`)
- `itemHeight?: number` (default `36`)
- `height?: string` (default `18rem`)
- `overscan?: number` (default `4`)
- `keyField?: string` (default `id`)
- `virtual?: boolean` (default `true`)
- `ariaLabel?: string` (default `Virtual list`)
- `emptyText?: string` (default `No items`)

Events:

- `scroll`
- `rangeChange` (payload: `{ start: number; end: number }`)
- `reachEnd`

Slots:

- `default` - item content with slot props `{ item, index }`
- `empty` - empty state content

Example:

```vue
<VirtualScroller :items="users" :item-height="44" height="320px" :overscan="6" key-field="id">
    <template #default="{ item, index }">
        <div>{{ index + 1 }}. {{ item.name }}</div>
    </template>
</VirtualScroller>
```

### VirtualScroller tokens

Component tokens (override via `theme.overrides.components.virtualScroller`):

- `fontSize`
- `borderColor`, `borderRadius`
- `backgroundColor`, `textColor`
- `focusRingShadow`
- `itemPadding`, `itemBorderColor`
- `emptyPadding`, `emptyColor`

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
- `components.*` accepts component-specific tokens (typed keys: button/card/checkbox/radio/tabs/accordion/toast/alert/input/searchInput/passwordInput/otpInput/colorPicker/maskedInput/numberInput/formField/textarea/link/breadcrumbs/menu/modal/confirmDialog/drawer/popover/dropdown/contextMenu/commandPalette/select/autocomplete/multiselect/taginput/datepicker/daterangepicker/timepicker/datetimepicker/pagination/switch/tooltip/skeleton/progress/badge/chip/avatar/datatable/slider/stepper/rating/tree/treeselect/virtualScroller).

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
