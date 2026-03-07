# CodeEditor

CodeEditor wraps adapter-driven engines such as Monaco or CodeMirror with lazy mounting, readonly control, and theme synchronization.

## Import

```ts
import CodeEditor from '@/package/components/code-editor.vue';
```

## Examples

### Basic

Mount the editor with an adapter and bind `v-model` to the source text.

```vue
<script setup lang="ts">
import { createMonacoAdapter } from '@codemonster-ru/vueforge';
import * as monaco from 'monaco-editor';

const adapter = createMonacoAdapter(monaco);
</script>

<template>
    <CodeEditor v-model="source" :adapter="adapter" language="typescript" />
</template>
```

### Readonly Review

Use `readonly` for diff viewers, audit screens, and generated output previews.

```vue
<CodeEditor
    v-model="generatedConfig"
    :adapter="adapter"
    language="json"
    readonly
    readonly-label="Read-only"
/>
```

### Lazy Mount

Keep `lazy` enabled for heavy editor engines inside tabs, drawers, and long pages.

```vue
<CodeEditor
    v-model="source"
    :adapter="adapter"
    language="yaml"
    lazy
    lazy-root-margin="300px"
/>
```

### Custom States

Use slots to brand the loading or no-adapter fallback.

```vue
<CodeEditor v-model="source" :adapter="adapter" :loading="loading">
    <template #loading>
        Preparing editor...
    </template>
</CodeEditor>
```

## API

### Props

| Name | Type | Default |
| --- | --- | --- |
| `modelValue` | `string` | `''` |
| `adapter` | `CodeEditorAdapter \| undefined` | `undefined` |
| `language` | `string` | `'plaintext'` |
| `theme` | `string` | `'light'` |
| `readonly` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `loading` | `boolean` | `false` |
| `loadingText` | `string` | `'Loading editor...'` |
| `noAdapterText` | `string` | `'Editor adapter is not configured.'` |
| `showHeader` | `boolean` | `true` |
| `languageLabel` | `string` | `'Language'` |
| `readonlyLabel` | `string` | `'Read-only'` |
| `editableLabel` | `string` | `'Editable'` |
| `ariaLabel` | `string` | `'Code editor'` |
| `lazy` | `boolean` | `true` |
| `lazyRootMargin` | `string` | `'200px'` |
| `lazyThreshold` | `number` | `0` |
| `options` | `Record<string, unknown>` | `{}` |

### Events

| Name | Payload |
| --- | --- |
| `update:modelValue` | `string` |
| `change` | `{ value }` |
| `ready` | editor instance |
| `error` | `Error` |

### Slots

| Name | Description |
| --- | --- |
| `loading` | Replaces the loading state content. |
| `empty` | Replaces the no-adapter state content. |

## Theming

Override component tokens through `theme.overrides.components.codeEditor`.

## Tokens

- Surface and layout: `gap`, `borderColor`, `borderRadius`, `backgroundColor`, `textColor`, `padding`
- Header: `headerGap`, `metaFontSize`, `metaColor`
- Editor surface: `surfaceBorderColor`, `surfaceBorderRadius`, `surfaceBackgroundColor`, `minHeight`
- States: `stateMinHeight`, `stateColor`, `stateFontSize`, `disabledOpacity`
- Dark mode: `darkBorderColor`, `darkBackgroundColor`, `darkTextColor`, `darkSurfaceBorderColor`, `darkSurfaceBackgroundColor`, `darkMetaColor`, `darkStateColor`

## Adapter API

- `mount(container, config)` is required.
- Optional hooks: `update`, `setValue`, `getValue`, `setReadonly`, `setTheme`, `focus`, `destroy`.
- Helpers are exported for common integrations such as Monaco and CodeMirror adapters.

## Recipes

- Use CodeEditor for developer-facing settings, code snippets, pipeline definitions, and schema editing.
- Prefer `RichTextEditor` when the primary content is prose rather than code.

## Accessibility

- The wrapper provides a labeled editor region and mirrors readonly state into the editor adapter config.
- SSR renders only the shell; the actual engine mounts client-side and can be delayed via `lazy`.
