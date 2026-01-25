# VueForge

Open source UI components for Vue.js.

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
import { VueForge, DefaultTheme, Button } from '@codemonster-ru/vueforge';
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
```

## Theming

VueForge maps the theme preset to CSS variables. You can override parts of the preset and it will recompute shades for color tokens.

```ts
app.use(VueForge, {
    theme: {
        preset: {
            ...DefaultTheme,
            colors: {
                ...DefaultTheme.colors,
                green: '#18a66a',
            },
        },
    },
});
```

## Author

[@KolesnikovKirill](https://github.com/kolesnikovKirill)
