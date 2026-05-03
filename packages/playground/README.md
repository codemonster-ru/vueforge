# @codemonster-ru/vueforge-playground

Vue 3 playground UI adapter for `@codemonster-ru/vueforge-playground-core`.

## MVP features

- Tabs: `Code`, `Preview`, `Console`
- Code tab uses `@codemonster-ru/vueforge-codeblock` with line numbers
- Client-only runtime execution (SSR-safe)
- Token-based theming with install-time overrides

## Props

- `files: Record<string, string>`
- `entry: string`
- `framework?: 'vanilla' | 'vue' | 'html'`
- `autorun?: boolean`
- `showCode?: boolean`
- `height?: number | string`
- `theme?: 'light' | 'dark' | 'inherit'`
- `tabsRenderer?: Component`
- `actionsRenderer?: Component`
- `filesRenderer?: Component`

## Emits

- `run`
- `error`

## Style entry

```ts
import '@codemonster-ru/vueforge-playground/style.css';
```

## Plugin + tokens

```ts
import { createApp } from 'vue';
import { VuePlaygroundPlugin } from '@codemonster-ru/vueforge-playground';

createApp(App).use(VuePlaygroundPlugin, {
  theme: {
    light: {
      surface: '#ffffff',
      border: '#c9d4e4'
    },
    dark: {
      surface: '#161b22',
      border: '#334155'
    }
  }
});
```

You can also update tokens at runtime:

```ts
import { setVuePlaygroundTheme } from '@codemonster-ru/vueforge-playground';

setVuePlaygroundTheme({
  light: { runBg: '#0f766e' },
  dark: { runBg: '#0f766e' }
});
```

## Basic usage

```vue
<script setup lang="ts">
import { VuePlayground } from '@codemonster-ru/vueforge-playground';

const files = {
  '/index.html': '<!doctype html><html><body><h1>Hello</h1></body></html>'
};
</script>

<template>
  <VuePlayground :files="files" entry="/index.html" theme="inherit" />
</template>
```

## Custom chrome via props

You can replace default tabs/actions/files UI by passing renderer components:

- `tabsRenderer` receives: `{ activeTab, showCode, setActiveTab }`
- `actionsRenderer` receives: `{ isRunning, run }`
- `filesRenderer` receives: `{ files, activeFile, setActiveFile }`
