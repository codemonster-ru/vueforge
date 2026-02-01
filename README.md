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
import { VueForge, DefaultTheme, Button, Input, Select, Checkbox, Switch } from '@codemonster-ru/vueforge';
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
<Select v-model="role" :options="roles" placeholder="Choose role" />
<Checkbox v-model="agreed" label="I agree" />
<Switch v-model="darkMode" label="Dark mode" />
```

## Components

- Button
- Card
- Checkbox
- Input
- Link
- Menu
- Modal
- Popover
- Select
- Switch

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
- `components.*` accepts component-specific tokens (typed keys: button/card/checkbox/codeBlock/input/link/menu/popover/select/switch).

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
