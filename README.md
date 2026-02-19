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
    ButtonGroup,
    Input,
    InputGroup,
    InputAddon,
    InlineEdit,
    SearchInput,
    MentionInput,
    PasswordInput,
    OtpInput,
    ColorPicker,
    MaskedInput,
    NumberInput,
    Form,
    FormField,
    Textarea,
    RichTextEditor,
    FileUpload,
    Breadcrumbs,
    Divider,
    Select,
    Autocomplete,
    Combobox,
    MultiSelect,
    TagInput,
    DatePicker,
    Calendar,
    DateRangePicker,
    TimePicker,
    DateTimePicker,
    Pagination,
    DataTable,
    Checkbox,
    Switch,
    SegmentedControl,
    Alert,
    EmptyState,
    Skeleton,
    Progress,
    Spinner,
    Badge,
    Chip,
    FilterChips,
    Accordion,
    AccordionItem,
    Slider,
    Splitter,
    SplitterPanel,
    Stepper,
    Wizard,
    WizardStep,
    Timeline,
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
    NotificationCenter,
    AppShell,
    KanbanBoard,
    Tour,
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
<ButtonGroup attached variant="outlined" size="small">
    <Button label="Day" />
    <Button label="Week" />
    <Button label="Month" />
</ButtonGroup>
<Form v-model="formValues" :validate="validateForm" @submit="onSubmit">
    <template #default="{ values, errors, touched, setFieldValue, setFieldTouched }">
        <FormField label="Email" :error="touched.email ? errors.email : ''">
            <template #default>
                <Input
                    :model-value="String(values.email ?? '')"
                    @update:model-value="value => setFieldValue('email', value)"
                    @blur="() => setFieldTouched('email', true)"
                />
            </template>
        </FormField>
        <Button type="submit" label="Submit" />
    </template>
</Form>
<FormField label="Name" hint="Required field">
    <Input v-model="name" placeholder="Your name" />
</FormField>
<InputGroup>
    <InputAddon>$</InputAddon>
    <NumberInput v-model="price" :min="0" :step="0.5" />
    <InputAddon>.00</InputAddon>
</InputGroup>
<InlineEdit v-model="name" placeholder="No name" />
<SearchInput v-model="query" placeholder="Search components" clearable />
<MentionInput v-model="message" :suggestions="mentionSuggestions" placeholder="Type @name" />
<PasswordInput v-model="password" placeholder="Enter password" show-strength />
<OtpInput v-model="otp" :length="6" />
<ColorPicker v-model="brandColor" :presets="['#2b6cb0', '#0cbc87', '#d6293e']" />
<MaskedInput v-model="phone" mask="+7 (###) ###-##-##" />
<NumberInput v-model="age" :min="0" :max="120" :step="1" />
<Textarea v-model="bio" placeholder="Tell us about yourself" />
<RichTextEditor v-model="article" />
<FileUpload v-model="resume" accept=".pdf,.doc,.docx" />
<Breadcrumbs :items="breadcrumbItems" />
<Divider label="OR" />
<Select v-model="role" :options="roles" placeholder="Choose role" />
<Autocomplete v-model="country" :options="countries" placeholder="Find country" />
<Combobox v-model="countryId" :options="countries" placeholder="Pick country" clearable />
<MultiSelect v-model="countries" :options="countryOptions" placeholder="Select countries" clearable />
<TagInput v-model="skills" :options="skillOptions" placeholder="Add skills" clearable />
<DatePicker v-model="birthday" placeholder="Pick birthday" />
<Calendar v-model="selectedDate" />
<DateRangePicker v-model="range" placeholder="Pick range" />
<TimePicker v-model="meetingTime" placeholder="Pick time" />
<DateTimePicker v-model="meetingAt" placeholder="Pick date and time" />
<Pagination v-model="page" :total-items="240" :page-size="20" />
<DataTable :columns="columns" :rows="rows" sortable striped />
<Checkbox v-model="agreed" label="I agree" />
<Switch v-model="darkMode" label="Dark mode" />
<SegmentedControl
    v-model="view"
    :options="[
        { label: 'List', value: 'list' },
        { label: 'Grid', value: 'grid' },
    ]"
/>
<Alert severity="info" title="Heads up" message="Project settings were updated." />
<EmptyState title="No projects yet" description="Create your first project to get started." icon="📂" />
<Skeleton height="12px" width="140px" />
<Progress :value="64" />
<Spinner label="Loading..." />
<Badge label="Beta" />
<Chip label="New" />
<FilterChips
    v-model="filters"
    :options="[
        { label: 'Open', value: 'open' },
        { label: 'Done', value: 'done' },
    ]"
    clearable
/>
<Slider v-model="volume" :min="0" :max="100" :step="5" show-value />
<Splitter v-model="splitSizes" style="height: 280px">
    <SplitterPanel :min-size="20">Left panel</SplitterPanel>
    <SplitterPanel :min-size="20">Right panel</SplitterPanel>
</Splitter>
<Stepper v-model="step" :steps="steps" clickable />
<Wizard v-model="wizardStep" :steps="wizardSteps">
    <WizardStep value="account">Account step</WizardStep>
    <WizardStep value="confirm">Confirm step</WizardStep>
</Wizard>
<Timeline :items="timelineItems" />
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
<NotificationCenter v-model="notificationsOpen" v-model:items="notificationsItems" />
<AppShell v-model="sidebarCollapsed">
    <template #sidebar>Sidebar content</template>
    <template #header>Header content</template>
    <div>Main content</div>
</AppShell>
<KanbanBoard v-model:items="kanbanItems" :columns="kanbanColumns" />
<Tour v-model="tourOpen" :steps="tourSteps" />
```

## Components

- Button
- ButtonGroup
- Card
- Checkbox
- RadioGroup
- RadioButton
- SegmentedControl
- Tabs
- Tab
- TabPanel
- Accordion
- AccordionItem
- Toast
- ToastContainer
- Alert
- EmptyState
- Input
- InputGroup
- InputAddon
- InlineEdit
- SearchInput
- MentionInput
- PasswordInput
- OtpInput
- ColorPicker
- MaskedInput
- NumberInput
- Form
- FormField
- Textarea
- RichTextEditor
- FileUpload
- Link
- Breadcrumbs
- Divider
- Menu
- Modal
- ConfirmDialog
- Drawer
- Dropdown
- SplitButton
- ContextMenu
- CommandPalette
- NotificationCenter
- AppShell
- KanbanBoard
- Tour
- Popover
- Select
- Autocomplete
- Combobox
- MultiSelect
- TagInput
- DatePicker
- Calendar
- DateRangePicker
- TimePicker
- DateTimePicker
- Pagination
- DataTable
- Switch
- Tooltip
- Skeleton
- Progress
- Spinner
- Badge
- Chip
- FilterChips
- Avatar
- Slider
- Splitter
- SplitterPanel
- Stepper
- Wizard
- WizardStep
- Timeline
- Rating
- Tree
- TreeSelect
- VirtualScroller

Input / InputGroup / Search / Password / Textarea (quick API):

- `Input`: single-line control, supports `v-model`, `size`, `variant`, `disabled`, `readonly`.
- `ButtonGroup`: grouped button actions with shared size/variant/severity and attached/stacked layouts.
- `InputGroup`: horizontal control combiner for field/addon/button layouts with unified corners and borders.
- `EmptyState`: reusable empty-data block with icon/title/description/actions for table/list/search blank states.
- `InlineEdit`: inline value editing with view/edit states, save/cancel actions, and text/number modes.
- `SearchInput`: search-focused control with `debounce`, `clearable`, `loading`, `size`, and `variant`.
- `MentionInput`: text input with `@`/`#` triggers, suggestions panel, keyboard selection, and mention insertion events.
- `PasswordInput`: password control, supports visibility toggle, strength meter, CapsLock hint, `size`, and `variant`.
- `OtpInput`: one-time code control, supports fixed length, paste handling, numeric/alphanumeric modes, `size`, and `variant`.
- `ColorPicker`: color control with presets, optional alpha channel, and output formats (`hex`/`rgb`/`hsl`).
- `MaskedInput`: formatted input control with string/function masks and optional raw output (`unmask`).
- `NumberInput`: numeric control, supports `v-model`, `min`, `max`, `step`, `precision`, `controls`, `size`, `variant`.
- `Splitter`: resizable multi-panel container with draggable separators and `v-model` percentage sizes.
- `Tour`: guided step-by-step onboarding overlay anchored to target elements.
- `NotificationCenter`: persistent notifications inbox with read/unread state and bulk actions.
- `AppShell`: application layout shell with sidebar/header/main/footer regions, collapse toggle, and mobile drawer behavior.
- `KanbanBoard`: task board with draggable cards, customizable column/card slots, and move events.
- `RichTextEditor`: formatting editor with toolbar actions and Markdown/HTML output.
- `Divider`: horizontal/vertical visual separator with optional label and style variants.
- `Spinner`: lightweight loading indicator with inline/overlay variants and severity colors.
- `Wizard`: multi-step flow container with linear navigation, per-step validation, and completion events.
- `Textarea`: multi-line control, same as Input plus `rows`.
- `TagInput`: token/tag control, supports `v-model` (array), suggestions, custom tags, `maxTags`, `clearable`, `size`, `variant`.
- `FilterChips`: compact chip-based filter toggles with single/multiple selection modes and optional clear action.
- `SearchInput`, `MentionInput`, `InlineEdit`, `OtpInput`, `ColorPicker`, `MaskedInput`, `RichTextEditor`, `Checkbox`, `Select`, `Autocomplete`, `MultiSelect`, `TagInput`, `DatePicker`, `Calendar`, `DateRangePicker`, `DateTimePicker`, `Pagination`, `DataTable`, `SegmentedControl`, and `TreeSelect` also support `variant: 'filled' | 'outlined'`.

## Form

Props:

- `modelValue?: Record<string, unknown>` (v-model)
- `initialValues?: Record<string, unknown>`
- `validate?: (values) => Record<string, string> | string | boolean | null | Promise<...>`
- `validateOn?: 'submit' | 'input' | 'change' | 'blur' | Array<'submit' | 'input' | 'change' | 'blur'>` (default `submit`)
- `disabled?: boolean`
- `novalidate?: boolean` (default `true`)
- `id?: string`
- `ariaLabel?: string`
- `ariaLabelledby?: string`

Events:

- `update:modelValue`
- `change`
- `blur`
- `validate`
- `submit`
- `invalidSubmit`
- `reset`

Slots:

- `default` - form helpers:
  `{ values, errors, touched, isValid, isDirty, isSubmitting, setFieldValue, setFieldTouched, setFieldError, validate, submit, reset }`

Example:

```vue
<Form v-model="values" :validate="validateForm" validate-on="blur" @submit="send">
    <template #default="{ values, errors, touched, setFieldValue, setFieldTouched }">
        <FormField label="Email" :error="touched.email ? errors.email : ''">
            <template #default>
                <Input
                    :model-value="String(values.email ?? '')"
                    @update:model-value="value => setFieldValue('email', value)"
                    @blur="() => setFieldTouched('email', true)"
                />
            </template>
        </FormField>
        <Button type="submit" label="Send" />
    </template>
</Form>
```

### Form tokens

Component tokens (override via `theme.overrides.components.form`):

- `gap`, `textColor`, `disabledOpacity`

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

When `error` is set, `FormField` applies invalid-state border highlighting to nested form controls.
Customize these colors via `theme.overrides.components.formField.errorBorderColor` and `errorFocusBorderColor`.

## InputGroup / InputAddon

Props (`InputGroup`):

- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `disabled?: boolean` (default `false`)

Props (`InputAddon`):

- `as?: string` (default `span`)

Slots:

- `default` - group controls/addons content

Example:

```vue
<InputGroup>
    <InputAddon>$</InputAddon>
    <NumberInput v-model="price" :min="0" :step="0.5" />
    <Button label="Apply" />
</InputGroup>
```

### InputGroup tokens

Component tokens (override via `theme.overrides.components.inputGroup`):

- `gap`, `borderRadius`
- `addonPadding`, `addonFontSize`
- `addonBackgroundColor`, `addonOutlinedBackgroundColor`
- `addonTextColor`, `addonBorderColor`, `disabledOpacity`
- `small.addonPadding`, `small.addonFontSize`
- `large.addonPadding`, `large.addonFontSize`

## InlineEdit

Props:

- `modelValue?: string | number | null` (v-model)
- `type?: 'text' | 'number'` (default `text`)
- `placeholder?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `editLabel?: string` (default `Edit`)
- `saveLabel?: string` (default `Save`)
- `cancelLabel?: string` (default `Cancel`)

Events:

- `update:modelValue`
- `save`
- `cancel`
- `start`
- `end`
- `focus`
- `blur`

Example:

```vue
<InlineEdit v-model="projectName" placeholder="No project name" />
<InlineEdit v-model="budget" type="number" variant="outlined" />
```

### InlineEdit tokens

Component tokens (override via `theme.overrides.components.inlineEdit`):

- `gap`, `fontSize`, `padding`
- `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`, `disabledOpacity`
- `actionsGap`
- `buttonPadding`, `buttonRadius`, `buttonBorderColor`
- `buttonBackgroundColor`, `buttonTextColor`, `buttonHoverBackgroundColor`
- `cancelButtonBackgroundColor`, `cancelButtonTextColor`, `cancelButtonBorderColor`
- `small.fontSize`, `small.padding`, `small.buttonPadding`
- `large.fontSize`, `large.padding`, `large.buttonPadding`

## MentionInput

Props:

- `modelValue?: string` (v-model)
- `suggestions?: Array<{ label: string; value?: string | number; trigger?: string; disabled?: boolean }>` (default `[]`)
- `triggers?: Array<string>` (default `['@', '#']`)
- `placeholder?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `loading?: boolean` (default `false`)
- `loadingText?: string` (default `Loading...`)
- `emptyText?: string` (default `No matches`)
- `minQueryLength?: number` (default `1`)
- `maxSuggestions?: number` (default `8`)
- `appendSpace?: boolean` (default `true`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `ariaLabel?: string`

Events:

- `update:modelValue`
- `input`
- `change`
- `search` (payload: `{ trigger: string; query: string }`)
- `select`
- `insert` (payload: `{ trigger, query, option, text, range }`)
- `focus`
- `blur`

Example:

```vue
<MentionInput
    v-model="message"
    :suggestions="[
        { label: 'alice', value: 'alice', trigger: '@' },
        { label: 'frontend', value: 'frontend', trigger: '#' },
    ]"
    placeholder="Type @name or #topic"
/>
```

### MentionInput tokens

Component tokens (override via `theme.overrides.components.mentionInput`):

- `minWidth`, `fontSize`, `padding`
- `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`, `disabledOpacity`
- `panelBackgroundColor`, `panelBorderColor`, `panelPadding`, `panelMaxHeight`, `panelRadiusOffset`, `panelShadow`
- `optionPadding`, `optionGap`, `optionBorderRadius`, `optionFontSize`
- `optionHoverBackgroundColor`, `optionTriggerColor`
- `emptyPadding`, `emptyColor`
- `small.fontSize`, `small.padding`
- `large.fontSize`, `large.padding`

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

## Combobox

Props:

- `modelValue?: string | number` (v-model selected value)
- `inputValue?: string` (v-model:inputValue typed query)
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
- `strict?: boolean` (default `true`)
- `allowCreate?: boolean` (default `false`)
- `clearable?: boolean` (default `false`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)

Events:

- `update:modelValue`
- `update:inputValue`
- `change`
- `search`
- `create`
- `focus`
- `blur`

Example:

```vue
<Combobox v-model="countryId" v-model:inputValue="countryQuery" :options="countries" placeholder="Pick country" />
```

### Combobox tokens

Component tokens (override via `theme.overrides.components.combobox`):

- `minWidth`, `fontSize`, `controlGap`, `chevronSize`
- `padding`, `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`
- `disabledOpacity`
- `panelBackgroundColor`, `panelBorderColor`, `panelPadding`, `panelMaxHeight`, `panelRadiusOffset`, `panelShadow`
- `optionPadding`, `optionBorderRadius`
- `optionHoverBackgroundColor`, `optionActiveBackgroundColor`, `optionActiveTextColor`, `optionHighlightedBackgroundColor`
- `emptyPadding`, `emptyColor`
- `loadingPadding`, `loadingColor`
- `clearSize`, `clearRadius`, `clearHoverBackgroundColor`
- `small.fontSize`, `small.padding`
- `large.fontSize`, `large.padding`

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

## Calendar

Props:

- `modelValue?: string` (v-model, ISO date `YYYY-MM-DD`)
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

Example:

```vue
<Calendar v-model="selectedDate" min="2026-01-01" max="2026-12-31" />
<Calendar v-model="selectedDateAlt" variant="outlined" :first-day-of-week="1" />
```

### Calendar tokens

Component tokens (override via `theme.overrides.components.calendar`):

- `width`, `fontSize`, `padding`
- `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`
- `disabledOpacity`
- `headerGap`, `headerPadding`, `monthLabelFontSize`, `monthLabelFontWeight`
- `navButtonSize`, `navButtonRadius`, `navButtonFontSize`
- `weekdayColor`, `weekdayFontSize`, `weekdaysMarginBottom`
- `daysGap`, `daySize`, `dayFontSize`, `dayBorderRadius`
- `dayHoverBackgroundColor`, `daySelectedBackgroundColor`, `daySelectedTextColor`, `dayMutedColor`, `dayTodayBorderColor`
- `small.fontSize`, `small.padding`, `small.daySize`
- `large.fontSize`, `large.padding`, `large.daySize`

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

## RichTextEditor

Props:

- `modelValue?: string` (v-model)
- `placeholder?: string`
- `disabled?: boolean`
- `readonly?: boolean`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `format?: 'markdown' | 'html'` (default `markdown`)
- `rows?: number` (default `6`)
- `maxLength?: number` (default `0`, disabled when `0`)
- `showToolbar?: boolean` (default `true`)
- `toolbar?: Array<'bold' | 'italic' | 'underline' | 'link' | 'bulletList' | 'orderedList' | 'code'>`
- `toolbarLabel?: string` (default `Text formatting toolbar`)
- `ariaLabel?: string` (default `Rich text editor`)

Events:

- `update:modelValue`
- `input`
- `change`
- `focus`
- `blur`
- `action` (payload: `action`, `nextValue`)

Example:

```vue
<RichTextEditor
    v-model="article"
    format="markdown"
    :rows="8"
    :max-length="2000"
    :toolbar="['bold', 'italic', 'link', 'bulletList', 'code']"
/>
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

## ButtonGroup

Props:

- `size?: 'small' | 'normal' | 'large'` (inherits to nested `Button`/`SplitButton` when child props are not set)
- `variant?: 'filled' | 'outlined' | 'text'` (inherits to nested `Button`/`SplitButton`)
- `severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger'` (inherits to nested `Button`/`SplitButton`)
- `disabled?: boolean` (default `false`)
- `orientation?: 'horizontal' | 'vertical'` (default `horizontal`)
- `attached?: boolean` (default `false`)

Slots:

- `default` - place `Button` / `SplitButton` items

Example:

```vue
<ButtonGroup attached size="small" variant="outlined" severity="primary">
    <Button label="Day" />
    <Button label="Week" />
    <Button label="Month" />
</ButtonGroup>
```

### ButtonGroup tokens

Component tokens (override via `theme.overrides.components.buttonGroup`):

- `gap`, `borderRadius`, `disabledOpacity`

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

## Divider

Props:

- `orientation?: 'horizontal' | 'vertical'` (default `horizontal`)
- `variant?: 'solid' | 'dashed' | 'dotted'` (default `solid`)
- `inset?: boolean` (default `false`)
- `label?: string`
- `ariaLabel?: string` (default `Divider`)

Slots:

- `default` (optional) - custom label content (horizontal mode only)

Example:

```vue
<Divider />
<Divider label="OR" />
<div style="height: 32px; display: flex; align-items: center; gap: 8px">
    <span>Left</span>
    <Divider orientation="vertical" />
    <span>Right</span>
</div>
```

### Divider tokens

Component tokens (override via `theme.overrides.components.divider`):

- `color`, `textColor`, `thickness`, `minLength`
- `gap`, `inset`
- `labelPadding`, `labelFontSize`

## SegmentedControl

Props:

- `modelValue?: string | number` (v-model)
- `options?: Array<{ label: string; value: string | number; disabled?: boolean }>` (default `[]`)
- `disabled?: boolean`
- `fullWidth?: boolean` (default `false`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `ariaLabel?: string`
- `ariaLabelledby?: string`

Events:

- `update:modelValue`
- `change`
- `focus`
- `blur`

Example:

```vue
<SegmentedControl
    v-model="view"
    :options="[
        { label: 'List', value: 'list' },
        { label: 'Grid', value: 'grid' },
        { label: 'Board', value: 'board' },
    ]"
/>
```

### SegmentedControl tokens

Component tokens (override via `theme.overrides.components.segmentedControl`):

- `fontSize`, `padding`, `gap`
- `borderRadius`, `borderColor`, `backgroundColor`, `textColor`
- `hoverBackgroundColor`, `activeBackgroundColor`, `activeTextColor`
- `focusRingShadow`, `disabledOpacity`
- `segmentPadding`, `segmentRadius`, `segmentFontWeight`
- `small.fontSize`, `small.padding`, `small.segmentPadding`
- `large.fontSize`, `large.padding`, `large.segmentPadding`

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

## EmptyState

Props:

- `title?: string`
- `description?: string`
- `icon?: string`
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)

Slots:

- `default` - description content (fallbacks to `description`)
- `title` (optional)
- `icon` (optional)
- `actions` (optional)

Example:

```vue
<EmptyState title="No projects yet" description="Create your first project to get started." icon="📂">
    <template #actions>
        <Button label="Create project" size="small" />
        <Button label="Import" size="small" severity="secondary" />
    </template>
</EmptyState>
```

### EmptyState tokens

Component tokens (override via `theme.overrides.components.emptyState`):

- `gap`, `bodyGap`, `padding`, `borderRadius`
- `borderColor`, `backgroundColor`, `textColor`, `maxWidth`
- `iconSize`, `iconColor`
- `titleFontSize`, `titleLineHeight`, `titleFontWeight`, `titleColor`
- `descriptionFontSize`, `descriptionLineHeight`, `descriptionColor`
- `actionsGap`
- `small.padding`, `small.iconSize`, `small.titleFontSize`, `small.descriptionFontSize`
- `large.padding`, `large.iconSize`, `large.titleFontSize`, `large.descriptionFontSize`

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

### RichTextEditor tokens

Component tokens (override via `theme.overrides.components.richTextEditor`):

- `gap`, `fontSize`, `padding`
- `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `placeholderColor`
- `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`
- `disabledOpacity`
- `minHeight`, `resize`
- `toolbarGap`, `toolbarPadding`, `toolbarBorderColor`, `toolbarBackgroundColor`
- `toolbarButtonMinWidth`, `toolbarButtonPadding`, `toolbarButtonRadius`
- `toolbarButtonBorderColor`, `toolbarButtonBackgroundColor`, `toolbarButtonTextColor`
- `toolbarButtonHoverBackgroundColor`, `toolbarButtonActiveBackgroundColor`
- `counterFontSize`, `counterColor`, `counterDangerColor`
- `small.fontSize`, `small.padding`, `small.toolbarButtonPadding`
- `large.fontSize`, `large.padding`, `large.toolbarButtonPadding`

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

## NotificationCenter

Props:

- `modelValue?: boolean` (v-model)
- `items?: Array<{ id: string | number; title: string; message?: string; date?: string; read?: boolean; severity?: 'neutral' | 'info' | 'success' | 'warn' | 'danger'; avatar?: string }>`
- `title?: string` (default `Notifications`)
- `emptyText?: string` (default `No notifications`)
- `closeOnOverlay?: boolean` (default `true`)
- `closeOnEsc?: boolean` (default `true`)
- `markAllLabel?: string` (default `Mark all as read`)
- `clearLabel?: string` (default `Clear`)
- `closeLabel?: string` (default `Close notifications`)
- `readLabel?: string` (default `Mark as read`)
- `unreadLabel?: string` (default `Mark as unread`)

Slots:

- `item` (optional) - slot props `{ item, index, toggleRead }`
- `empty` (optional)

Events:

- `update:modelValue`
- `update:items`
- `open`
- `close`
- `click`
- `read`
- `readAll`
- `clear`

Example:

```vue
<NotificationCenter v-model="open" v-model:items="notifications" />
```

### NotificationCenter tokens

Component tokens (override via `theme.overrides.components.notificationCenter`):

- `zIndex`, `overlayBackgroundColor`
- `top`, `right`, `width`, `maxWidth`, `maxHeight`
- `borderColor`, `borderRadius`, `backgroundColor`, `textColor`, `shadow`
- `dividerColor`, `headerGap`, `headerPadding`
- `titleGap`, `titleFontSize`, `titleLineHeight`, `titleFontWeight`
- `badgeSize`, `badgeBackgroundColor`, `badgeTextColor`, `badgeFontSize`
- `actionsGap`, `closeSize`, `closeHoverBackgroundColor`, `disabledOpacity`
- `itemGap`, `itemPadding`, `unreadBackgroundColor`
- `avatarSize`, `avatarBackgroundColor`, `avatarTextColor`, `avatarFontSize`
- `itemTitleFontSize`, `itemTitleFontWeight`, `itemMetaFontSize`, `itemMetaColor`
- `emptyPadding`, `emptyColor`

## AppShell

Props:

- `modelValue?: boolean` (v-model collapsed state on desktop)
- `sidebarWidth?: string` (default `16rem`)
- `sidebarCollapsedWidth?: string` (default `4.25rem`)
- `mobileBreakpoint?: number` (default `1024`)
- `stickyHeader?: boolean` (default `true`)
- `fullHeight?: boolean` (default `true`)
- `showToggle?: boolean` (default `true`)
- `closeOnEsc?: boolean` (default `true`)
- `toggleLabel?: string` (default `Toggle sidebar`)
- `closeSidebarLabel?: string` (default `Close sidebar`)
- `toggleIcon?: string` (default `☰`)
- `mainAriaLabel?: string` (default `Main content`)

Slots:

- `sidebar` (optional) - slot props `{ mobile, collapsed }`
- `header` (optional) - slot props `{ mobile, collapsed, mobileSidebarOpen, toggleSidebar }`
- `default` - main content
- `footer` (optional) - slot props `{ mobile, collapsed }`

Events:

- `update:modelValue`
- `sidebar-toggle`
- `breakpoint-change`

Example:

```vue
<AppShell v-model="collapsed">
    <template #sidebar>Sidebar</template>
    <template #header>Header</template>
    <div>Main</div>
    <template #footer>Footer</template>
</AppShell>
```

### AppShell tokens

Component tokens (override via `theme.overrides.components.appShell`):

- `gap`, `backgroundColor`, `textColor`
- `sidebarBackgroundColor`, `sidebarBorderColor`
- `headerHeight`, `headerPadding`, `headerGap`, `headerBackgroundColor`, `headerBorderColor`
- `contentPadding`, `mainBackgroundColor`
- `footerPadding`, `footerBorderColor`, `footerBackgroundColor`
- `toggleSize`, `toggleBorderRadius`, `toggleBackgroundColor`, `toggleTextColor`, `toggleHoverBackgroundColor`
- `overlayBackgroundColor`, `zIndex`

## KanbanBoard

Props:

- `columns?: Array<{ id: string | number; title: string }>`
- `items?: Array<{ id: string | number; columnId: string | number; title: string; description?: string; assignee?: string; priority?: 'low' | 'medium' | 'high'; tags?: string[] }>`
- `ariaLabel?: string` (default `Kanban board`)
- `emptyColumnText?: string` (default `Drop cards here`)

Slots:

- `column-header` (optional) - slot props `{ column, items }`
- `card` (optional) - slot props `{ item, column, index }`
- `column-footer` (optional) - slot props `{ column, items }`
- `empty-column` (optional) - slot props `{ column }`

Events:

- `update:items`
- `move`
- `click`

Example:

```vue
<KanbanBoard v-model:items="items" :columns="columns" @move="onMove" />
```

### KanbanBoard tokens

Component tokens (override via `theme.overrides.components.kanbanBoard`):

- `gap`, `columnMinWidth`, `columnGap`
- `columnBorderColor`, `columnBorderRadius`, `columnBackgroundColor`
- `columnHeaderPadding`, `columnHeaderBorderColor`
- `columnTitleFontSize`, `columnTitleFontWeight`, `columnCountFontSize`, `columnCountColor`
- `bodyPadding`
- `cardGap`, `cardPadding`, `cardBorderRadius`, `cardBorderColor`, `cardBackgroundColor`, `cardHoverBorderColor`
- `cardTitleFontSize`, `cardTitleFontWeight`, `cardDescriptionFontSize`, `cardDescriptionColor`
- `priorityLowColor`, `priorityMediumColor`, `priorityHighColor`
- `tagGap`, `tagPadding`, `tagBorderRadius`, `tagBackgroundColor`, `tagTextColor`
- `assigneeFontSize`, `assigneeColor`
- `emptyPadding`, `emptyColor`
- `columnFooterPadding`, `columnFooterBorderColor`
- `dragOpacity`

## Tour

Props:

- `modelValue?: boolean` (v-model)
- `steps?: Array<{ target?: string | HTMLElement; title?: string; content?: string; placement?: 'top' | 'bottom' | 'left' | 'right'; offset?: number }>`
- `startIndex?: number` (default `0`)
- `placement?: 'top' | 'bottom' | 'left' | 'right'` (default `bottom`)
- `offset?: number` (default `10`)
- `mask?: boolean` (default `true`)
- `closeOnOverlay?: boolean` (default `true`)
- `closeOnEsc?: boolean` (default `true`)
- `showSkip?: boolean` (default `true`)
- `showProgress?: boolean` (default `true`)
- `spotlightPadding?: number` (default `6`)
- `nextLabel?: string` (default `Next`)
- `prevLabel?: string` (default `Back`)
- `finishLabel?: string` (default `Finish`)
- `skipLabel?: string` (default `Skip`)
- `ariaLabel?: string` (default `Tour`)

Slots:

- `default` - step content with slot props `{ step, index }`
- `title` (optional) - step title with slot props `{ step, index }`
- `actions` (optional) - custom actions with slot props `{ step, index, isFirst, isLast, prev, next, skip }`

Events:

- `update:modelValue`
- `open`
- `close` (payload reason: `overlay | esc | complete | skip`)
- `stepChange`
- `next`
- `prev`
- `complete`
- `skip`

Example:

```vue
<Tour
    v-model="tourOpen"
    :steps="[
        { target: '#tour-start', title: 'Start', content: 'Launch onboarding here.' },
        { target: '#tour-search', title: 'Search', content: 'Find projects quickly.', placement: 'bottom' },
    ]"
/>
```

### Tour tokens

Component tokens (override via `theme.overrides.components.tour`):

- `zIndex`, `overlayBackgroundColor`
- `width`, `maxWidth`, `padding`
- `borderRadius`, `borderColor`
- `backgroundColor`, `textColor`, `shadow`
- `titleGap`, `titleFontSize`, `titleLineHeight`, `titleFontWeight`
- `contentGap`, `contentFontSize`, `contentLineHeight`, `contentColor`
- `progressGap`, `progressFontSize`, `progressColor`
- `actionsGap`
- `buttonMinWidth`, `buttonPadding`, `buttonRadius`
- `buttonBorderColor`, `buttonBackgroundColor`, `buttonTextColor`, `buttonHoverBackgroundColor`
- `secondaryButtonBorderColor`, `secondaryButtonBackgroundColor`, `secondaryButtonTextColor`, `secondaryButtonHoverBackgroundColor`
- `spotlightRadius`, `spotlightBorderWidth`, `spotlightBorderColor`
- `disabledOpacity`

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

## FilterChips

Props:

- `modelValue?: string | number | Array<string | number> | null` (v-model)
- `options?: Array<{ label: string; value: string | number; disabled?: boolean; count?: number }>` (default `[]`)
- `multiple?: boolean` (default `true`)
- `allowEmpty?: boolean` (default `true`, used in single mode)
- `clearable?: boolean` (default `false`)
- `clearText?: string` (default `Clear`)
- `clearLabel?: string` (default `Clear filters`)
- `disabled?: boolean`
- `wrap?: boolean` (default `true`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'soft' | 'outline' | 'solid'` (default `soft`)
- `ariaLabel?: string`
- `ariaLabelledby?: string`

Events:

- `update:modelValue`
- `change`
- `clear`

Example:

```vue
<FilterChips
    v-model="activeFilters"
    :options="[
        { label: 'Open', value: 'open', count: 12 },
        { label: 'In progress', value: 'progress', count: 7 },
        { label: 'Done', value: 'done', count: 18 },
    ]"
    clearable
/>
<FilterChips v-model="activeStatus" :options="statusOptions" :multiple="false" variant="outline" />
```

### FilterChips tokens

Component tokens (override via `theme.overrides.components.filterChips`):

- `fontSize`, `gap`
- `chipGap`, `chipPadding`, `chipBorderRadius`
- `chipBorderColor`, `chipBackgroundColor`, `chipTextColor`
- `chipHoverBackgroundColor`, `chipHoverBorderColor`
- `chipActiveBackgroundColor`, `chipActiveBorderColor`, `chipActiveTextColor`
- `chipSolidActiveBackgroundColor`, `chipSolidActiveBorderColor`, `chipSolidActiveTextColor`
- `countPadding`, `countFontSize`, `countBackgroundColor`, `countTextColor`
- `countActiveBackgroundColor`, `countActiveTextColor`
- `disabledOpacity`
- `small.fontSize`, `small.chipPadding`
- `large.fontSize`, `large.chipPadding`

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

## Spinner

Props:

- `variant?: 'inline' | 'overlay'` (default `inline`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `severity?: 'neutral' | 'info' | 'success' | 'warn' | 'danger'` (default `neutral`)
- `label?: string`
- `ariaLabel?: string` (default `Loading`)

Slots:

- `default` (optional) - custom label content

Example:

```vue
<Spinner />
<Spinner label="Loading users..." size="small" />
<Spinner variant="overlay" severity="info" label="Sync in progress" />
```

### Spinner tokens

Component tokens (override via `theme.overrides.components.spinner`):

- `size`, `thickness`, `color`, `trackColor`
- `gap`, `labelColor`, `labelFontSize`
- `animationDuration`
- `overlayMinHeight`, `overlayPadding`, `overlayBorderRadius`, `overlayBackgroundColor`
- `info.color`, `success.color`, `warn.color`, `danger.color`
- `small.size`, `small.thickness`, `small.labelFontSize`
- `large.size`, `large.thickness`, `large.labelFontSize`

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

## Splitter / SplitterPanel

Props (`Splitter`):

- `modelValue?: number[]` (v-model panel sizes in %)
- `minSizes?: number[]` (panel minimum sizes in %)
- `direction?: 'horizontal' | 'vertical'` (default `horizontal`)
- `gutterSize?: number | string` (default `8`)
- `disabled?: boolean` (default `false`)

Props (`SplitterPanel`):

- `size?: number` (initial panel size in % when `v-model` is not provided)
- `minSize?: number` (minimum panel size in %)

Events (`Splitter`):

- `update:modelValue`
- `change`

Example:

```vue
<Splitter v-model="splitSizes" :min-sizes="[20, 20]" style="height: 280px">
    <SplitterPanel>Navigation</SplitterPanel>
    <SplitterPanel>Content</SplitterPanel>
</Splitter>
```

### Splitter tokens

Component tokens (override via `theme.overrides.components.splitter`):

- `borderColor`, `borderRadius`
- `panelBackgroundColor`
- `handleWidth`, `handleHeight`, `handleRadius`, `handleColor`
- `gutterActiveBackgroundColor`
- `disabledOpacity`

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

## Wizard / WizardStep

Props (`Wizard`):

- `modelValue?: string | number` (v-model active step value)
- `steps?: Array<{ value: string | number; title?: string; description?: string; optional?: boolean; disabled?: boolean; validate?: (value, index) => boolean | string | Promise<...> }>`
- `linear?: boolean` (default `true`)
- `disabled?: boolean` (default `false`)
- `nextLabel?: string` (default `Next`)
- `prevLabel?: string` (default `Back`)
- `finishLabel?: string` (default `Finish`)
- `validateStep?: (step, index, value) => boolean | string | Promise<...>`
- `ariaLabel?: string`
- `ariaLabelledby?: string`

Props (`WizardStep`):

- `value: string | number` (must match one of `Wizard.steps[].value`)

Slots (`Wizard`):

- `default` - place `WizardStep` components
- `indicator` (optional) - slot props `{ step, index }`
- `actions` (optional) - slot props `{ step, index, isFirst, isLast, next, prev, complete }`

Events (`Wizard`):

- `update:modelValue`
- `change`
- `next`
- `prev`
- `complete`
- `invalidStep`

Example:

```vue
<Wizard v-model="wizardStep" :steps="wizardSteps">
    <WizardStep value="account">
        <Input v-model="email" placeholder="Email" />
    </WizardStep>
    <WizardStep value="plan">
        <Select v-model="plan" :options="plans" />
    </WizardStep>
    <WizardStep value="confirm">
        Review and finish
    </WizardStep>
</Wizard>
```

### Wizard tokens

Component tokens (override via `theme.overrides.components.wizard`):

- `gap`, `borderColor`, `headerPaddingBottom`
- `itemGap`, `stepGap`
- `indicatorSize`, `indicatorBorderRadius`, `indicatorFontSize`
- `indicatorBorderColor`, `indicatorBackgroundColor`, `indicatorTextColor`
- `activeIndicatorBorderColor`, `activeIndicatorBackgroundColor`, `activeIndicatorTextColor`
- `completedIndicatorBorderColor`, `completedIndicatorBackgroundColor`, `completedIndicatorTextColor`
- `errorIndicatorBorderColor`, `errorIndicatorBackgroundColor`, `errorIndicatorTextColor`
- `titleFontSize`, `titleColor`, `descriptionFontSize`, `descriptionColor`
- `actionsGap`
- `buttonMinWidth`, `buttonPadding`, `buttonBorderRadius`
- `buttonBorderColor`, `buttonBackgroundColor`, `buttonTextColor`, `buttonHoverBackgroundColor`
- `secondaryButtonBorderColor`, `secondaryButtonBackgroundColor`, `secondaryButtonTextColor`, `secondaryButtonHoverBackgroundColor`
- `disabledOpacity`

## Timeline

Props:

- `items?: Array<{ id?: string | number; title?: string; description?: string; date?: string; icon?: string; status?: 'neutral' | 'info' | 'success' | 'warn' | 'danger' }>` (default `[]`)
- `orientation?: 'vertical' | 'horizontal'` (default `vertical`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `ariaLabel?: string`
- `ariaLabelledby?: string`

Slots:

- `marker` (props: `item`, `index`)
- `item` (props: `item`, `index`)

Example:

```vue
<Timeline
    :items="[
        { title: 'Created', description: 'Issue created', date: '2026-02-17', status: 'info' },
        { title: 'In progress', description: 'Developer started work', date: '2026-02-18', status: 'warn' },
        { title: 'Done', description: 'Issue closed', date: '2026-02-19', status: 'success' },
    ]"
/>
<Timeline :items="events" orientation="horizontal" size="small" />
```

### Timeline tokens

Component tokens (override via `theme.overrides.components.timeline`):

- `gap`, `itemGap`
- `markerSize`, `markerBorderRadius`, `markerBorderWidth`, `markerBackgroundColor`, `markerBorderColor`, `markerTextColor`, `markerIconSize`, `dotSize`
- `lineThickness`, `lineLength`, `lineColor`
- `titleFontSize`, `titleColor`, `descriptionFontSize`, `descriptionColor`, `dateFontSize`, `dateColor`
- `info.markerBackgroundColor`, `info.markerBorderColor`, `info.markerTextColor`, `info.lineColor`
- `success.markerBackgroundColor`, `success.markerBorderColor`, `success.markerTextColor`, `success.lineColor`
- `warn.markerBackgroundColor`, `warn.markerBorderColor`, `warn.markerTextColor`, `warn.lineColor`
- `danger.markerBackgroundColor`, `danger.markerBorderColor`, `danger.markerTextColor`, `danger.lineColor`
- `small.itemGap`, `small.markerSize`, `small.markerIconSize`, `small.dotSize`, `small.lineLength`, `small.dateFontSize`, `small.titleFontSize`, `small.descriptionFontSize`
- `large.itemGap`, `large.markerSize`, `large.markerIconSize`, `large.dotSize`, `large.lineLength`, `large.dateFontSize`, `large.titleFontSize`, `large.descriptionFontSize`

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
- `components.*` accepts component-specific tokens (typed keys: button/buttonGroup/card/checkbox/radio/tabs/accordion/toast/alert/emptyState/input/inputGroup/inlineEdit/searchInput/mentionInput/passwordInput/otpInput/colorPicker/maskedInput/numberInput/form/formField/textarea/richTextEditor/link/breadcrumbs/divider/menu/modal/confirmDialog/drawer/popover/dropdown/contextMenu/commandPalette/notificationCenter/appShell/kanbanBoard/tour/select/autocomplete/combobox/multiselect/taginput/datepicker/calendar/daterangepicker/timepicker/datetimepicker/pagination/switch/segmentedControl/tooltip/skeleton/progress/spinner/badge/chip/filterChips/avatar/datatable/slider/splitter/stepper/wizard/rating/tree/treeselect/virtualScroller).

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
