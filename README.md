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
import { VueForge, DefaultTheme, Button, Input, Textarea, Select, Checkbox, Switch } from '@codemonster-ru/vueforge';
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
<Input v-model="name" placeholder="Your name" />
<Textarea v-model="bio" placeholder="Tell us about yourself" />
<Select v-model="role" :options="roles" placeholder="Choose role" />
<Checkbox v-model="agreed" label="I agree" />
<Switch v-model="darkMode" label="Dark mode" />
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
- Input
- Textarea
- Link
- Menu
- Modal
- Popover
- Select
- Switch
- Tooltip

Input / Textarea (quick API):

- `Input`: single-line control, supports `v-model`, `size`, `variant`, `disabled`, `readonly`.
- `Textarea`: multi-line control, same as Input plus `rows`.
- `Checkbox` and `Select` also support `variant: 'filled' | 'outlined'`.

Note: default filled backgrounds for Input/Select/Textarea use `controls.backgroundColor` (defaults to `bgSoftColor`). Set it to `bgColor` to disable soft backgrounds.

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
- `components.*` accepts component-specific tokens (typed keys: button/card/checkbox/radio/tabs/input/textarea/link/menu/popover/select/switch).

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
