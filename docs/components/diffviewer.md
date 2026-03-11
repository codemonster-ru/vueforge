# DiffViewer

DiffViewer compares two values in inline or split mode and can format them as plain text or JSON.

## Import

```ts
import { DiffViewer } from '@codemonster-ru/vueforge';
```

## Examples

### Basic

Use `DiffViewer` for config changes, revision history, or review tooling.

```vue
<script setup lang="ts">
const before = { retries: 3, region: 'eu-west-1', enabled: false };
const after = { retries: 5, region: 'eu-west-1', enabled: true };
</script>

<template>
    <DiffViewer :before="before" :after="after" format="json" />
</template>
```

### Split Mode

Use split mode when reviewers need side-by-side comparison instead of compact inline output.

```vue
<DiffViewer :before="before" :after="after" format="json" mode="split" />
```

### Text Diff

Switch to text mode for release notes, markdown, or source snippets that should not be parsed as JSON.

```vue
<DiffViewer before="Status: pending" after="Status: approved" format="text" />
```

### Toolbar And Copy

Keep the toolbar visible when operators need fast mode switching or copy actions.

```vue
<DiffViewer :before="before" :after="after" show-toolbar copyable @copy="({ text }) => console.log(text)" />
```

## API

### Props

| Name          | Type                         | Default         |
| ------------- | ---------------------------- | --------------- |
| `before`      | `unknown`                    | `undefined`     |
| `after`       | `unknown`                    | `undefined`     |
| `mode`        | `'inline' \| 'split'`        | `'inline'`      |
| `format`      | `'auto' \| 'text' \| 'json'` | `'auto'`        |
| `showToolbar` | `boolean`                    | `false`         |
| `copyable`    | `boolean`                    | `false`         |
| `disabled`    | `boolean`                    | `false`         |
| `inlineLabel` | `string`                     | `'Inline diff'` |
| `splitLabel`  | `string`                     | `'Split diff'`  |
| `copyLabel`   | `string`                     | `'Copy diff'`   |

### Events

| Name          | Payload               |
| ------------- | --------------------- |
| `update:mode` | `'inline' \| 'split'` |
| `copy`        | `{ text }`            |

## Theming

Override component tokens through `theme.overrides.components.diffViewer`.

## Tokens

- Layout and surface: `padding`, `borderRadius`, `borderColor`, `backgroundColor`
- Typography: `fontFamily`, `fontSize`, `lineHeight`
- Toolbar: `toolbarGap`, `toolbarPadding`, `toolbarButtonBackgroundColor`, `toolbarButtonTextColor`
- Diff rows and cells: `addedBackgroundColor`, `removedBackgroundColor`, `changedBackgroundColor`, `gutterTextColor`, `separatorColor`

## Recipes

- Prefer `format="json"` for API payloads and configuration objects so structure stays readable.
- Use inline mode for compact history views and split mode for focused review tasks.

## Accessibility

- Mode controls should keep clear labels when restyled or replaced through pass-through APIs.
- Long diffs still need surrounding summary text so screen-reader users understand the overall change before traversing rows.
