# @codemonster-ru/vueforge-codeblock

[![npm version](https://img.shields.io/npm/v/%40codemonster-ru%2Fvueforge-codeblock)](https://www.npmjs.com/package/@codemonster-ru/vueforge-codeblock)
[![npm downloads](https://img.shields.io/npm/dw/%40codemonster-ru%2Fvueforge-codeblock)](https://www.npmjs.com/package/@codemonster-ru/vueforge-codeblock)
[![license](https://img.shields.io/npm/l/%40codemonster-ru%2Fvueforge-codeblock)](https://github.com/codemonster-ru/vueforge/blob/main/packages/codeblock/LICENSE)

Standalone Vue 3 code block component with Shiki-powered syntax highlighting, light/dark theme support, copy actions, and line numbers.

## Install

```bash
npm i @codemonster-ru/vueforge-codeblock
```

## Use Cases

- package documentation
- design system docs
- internal developer portals
- settings/admin panels that need to render code examples

## Component Usage

Register the plugin:

```ts
import { createApp } from "vue";
import App from "./App.vue";
import VueCodeBlock from "@codemonster-ru/vueforge-codeblock";

createApp(App).use(VueCodeBlock).mount("#app");
```

Register the plugin with runtime theme variables:

```ts
createApp(App)
  .use(VueCodeBlock, {
    themeScope: ":root",
    styleNonce: "nonce-from-csp",
    themeVars: {
      base: {
        "--vcb-border-radius": "0.75rem",
        "--vcb-padding": "0.75rem 1rem",
      },
      light: {
        "--vcb-background-color": "#ffffff",
      },
      dark: {
        "--vcb-dark-background-color": "#1f2430",
      },
    },
  })
  .mount("#app");
```

Or import the component directly:

```vue
<script setup lang="ts">
import { CodeBlock } from "@codemonster-ru/vueforge-codeblock";
</script>

<template>
  <CodeBlock
    language="vue"
    filename="ButtonExample.vue"
    :show-line-numbers="true"
    :code="`<Button label=&quot;Save&quot; />`"
  />
</template>
```

If you want the package CSS explicitly:

```ts
import "@codemonster-ru/vueforge-codeblock/style.css";
```

## Runtime Usage

The package also exports the shared highlighter:

```ts
import {
  highlightCodeBlock,
  escapeCodeHtml,
} from "@codemonster-ru/vueforge-codeblock";

const html = await highlightCodeBlock("ts", "const answer = 42;", "light");
const escaped = escapeCodeHtml("<Button />");
```

## Props

| Prop              | Type                             | Default        | Purpose                              |
| ----------------- | -------------------------------- | -------------- | ------------------------------------ |
| `code`            | `string`                         | `''`           | Raw source code                      |
| `language`        | `CodeBlockLanguage`              | `'plaintext'`  | Language hint for highlighting       |
| `filename`        | `string`                         | `''`           | Optional filename in header          |
| `showHeader`      | `boolean`                        | `true`         | Shows the top meta/action bar        |
| `showLineNumbers` | `boolean`                        | `false`        | Renders line numbers                 |
| `copyable`        | `boolean`                        | `true`         | Shows copy action                    |
| `copyLabel`       | `string`                         | `'Copy'`       | Copy button text                     |
| `copiedLabel`     | `string`                         | `'Copied'`     | Temporary copied state label         |
| `copiedDuration`  | `number`                         | `1200`         | Copied state timeout in ms           |
| `languageLabel`   | `string`                         | `'Language'`   | Header label before language         |
| `disabled`        | `boolean`                        | `false`        | Disables actions                     |
| `wrap`            | `boolean`                        | `false`        | Enables wrapped lines                |
| `highlight`       | `boolean`                        | `true`         | Turns highlighting on/off            |
| `maxHeight`       | `string`                         | `''`           | Optional scroll container max height |
| `ariaLabel`       | `string`                         | `'Code block'` | Accessibility label                  |
| `theme`           | `'inherit' \| 'light' \| 'dark'` | `'inherit'`    | Theme mode override                  |

## Events

| Event  | Payload            |
| ------ | ------------------ |
| `copy` | `{ text: string }` |

## Slots

| Slot      | Purpose                                    |
| --------- | ------------------------------------------ |
| `actions` | Add custom actions next to the copy button |

## Supported Languages

Canonical built-in values:

`plaintext`, `text`, `txt`, `js`, `javascript`, `ts`, `typescript`, `vue`, `html`, `json`, `bash`, `shell`, `sh`, `css`, `scss`, `sass`

You can import them as `SUPPORTED_CODE_BLOCK_LANGUAGES`.

## Theming

The component ships with light and dark defaults. You can override it with:

- `theme="light"`
- `theme="dark"`
- `theme="inherit"` and the nearest ancestor theme from `data-theme` or, if absent, `data-vf-theme`

Main CSS custom properties:

- `--vcb-background-color`
- `--vcb-text-color`
- `--vcb-border-color`
- `--vcb-border-radius`
- `--vcb-header-background-color`
- `--vcb-header-border-color`
- `--vcb-header-padding`
- `--vcb-code-background-color`
- `--vcb-action-background-color`
- `--vcb-action-border-color`
- `--vcb-padding`
- `--vcb-font-size`
- `--vcb-line-height`
- `--vcb-line-number-color`
- `--vcb-margin-block`
- `--vcb-margin-block-start`
- `--vcb-margin-block-end`

You can also provide these variables at plugin install time via `themeVars`:

- `themeVars.base` is applied to `:root`
- `themeVars.light` is applied to `:root[data-theme="light"]` and `:root[data-vf-theme="light"]`
- `themeVars.dark` is applied to `:root[data-theme="dark"]` and `:root[data-vf-theme="dark"]`

Optional plugin option:

- `themeScope` (`string`, default `:root`) controls where runtime variables are injected.
- `styleNonce` adds a CSP nonce to the runtime `<style>` tag.

For dynamic runtime updates after app initialization, use:

```ts
import { setCodeBlockThemeVars } from "@codemonster-ru/vueforge-codeblock";

setCodeBlockThemeVars(
  {
    dark: {
      "--vcb-dark-background-color": "#181c25",
    },
  },
  { themeScope: ":root" },
);
```

Example:

```css
.docs-surface {
  --vcb-background-color: #081224;
  --vcb-border-color: rgba(96, 165, 250, 0.28);
  --vcb-margin-block: 1rem;
}
```

By default, `CodeBlock` behaves like standalone prose block content with:

- `margin-block-start: var(--vcb-margin-block-start)` where `--vcb-margin-block-start` defaults to `--vcb-margin-block`
- `margin-block-end: var(--vcb-margin-block-end)` where `--vcb-margin-block-end` defaults to `--vcb-margin-block`
- `margin-block-start: 0` when `.vcb:first-child`
- `margin-block-end: 0` when `.vcb:last-child`

Syntax token colors are provided by Shiki themes:

- light mode uses `github-light`
- dark mode uses `github-dark`

The default styles are tuned to feel closer to a documentation surface:

- the outer container stays close to the page background
- separation comes mostly from border and header chrome
- the code area does not introduce a heavy extra panel by default
- light and dark themes follow the same surface logic

## Notes

- Highlighting is powered by Shiki and runs asynchronously.
- `plaintext`, `text`, and `txt` render as escaped plain text.
- Unsupported language hints safely fall back to escaped plain text.
