# CodeEditor

## Purpose

Provide an adapter-driven code editor wrapper for Monaco/CodeMirror style engines with readonly and theme controls.

## Props

- `modelValue?: string` (default `''`)
- `adapter?: CodeEditorAdapter`
- `language?: string` (default `plaintext`)
- `theme?: string` (default `light`)
- `readonly?: boolean` (default `false`)
- `disabled?: boolean` (default `false`)
- `loading?: boolean` (default `false`)
- `loadingText?: string` (default `Loading editor...`)
- `noAdapterText?: string` (default `Editor adapter is not configured.`)
- `showHeader?: boolean` (default `true`)
- `languageLabel?: string` (default `Language`)
- `readonlyLabel?: string` (default `Read-only`)
- `editableLabel?: string` (default `Editable`)
- `ariaLabel?: string` (default `Code editor`)
- `lazy?: boolean` (default `true`)
- `lazyRootMargin?: string` (default `200px`)
- `lazyThreshold?: number` (default `0`)
- `options?: Record<string, unknown>`

## Events

- `update:modelValue`
- `change({ value })`
- `ready(instance)`
- `error(error)`

## Slots

- `loading`
- `empty`

## Examples

```vue
<script setup lang="ts">
import { CodeEditor, createMonacoAdapter } from '@codemonster-ru/vueforge';
import * as monaco from 'monaco-editor';

const adapter = createMonacoAdapter(monaco);
</script>

<template>
    <CodeEditor v-model="source" :adapter="adapter" language="typescript" theme="dark" :readonly="readonly" />
</template>
```

## Theming

- Override via `theme.overrides.components.codeEditor`.

## Adapter API

- `mount(container, config)` is required.
- Optional hooks: `update`, `setValue`, `getValue`, `setReadonly`, `setTheme`, `focus`, `destroy`.
- Helpers exported:
    - `createMonacoAdapter(monaco)`
    - `createCodeMirrorAdapter(factory)`

## Tokens

- Surface/layout: `gap`, `padding`, `borderColor`, `borderRadius`, `backgroundColor`, `textColor`
- Header/meta: `headerGap`, `metaFontSize`, `metaColor`
- Editor surface: `surfaceBorderColor`, `surfaceBorderRadius`, `surfaceBackgroundColor`, `minHeight`
- States: `stateMinHeight`, `stateColor`, `stateFontSize`, `disabledOpacity`
- Dark mode: `dark*` token group

## Recipes

- Feature flag editor modules can lazy-mount heavy engines with `lazy=true`.
- Use `readonly` for audit/review screens where editing is prohibited.

## Accessibility

- Provide meaningful `ariaLabel` for the editable region.
- Keep readonly state mirrored in editor engine options (`readOnly`/equivalent).

## Responsive

- Wrapper is block-level and uses tokenized min heights; place in responsive panels without fixed pixel locking.

## SSR/Hydration

- Editor engines are client-only; wrapper renders deterministic shell during SSR.
- `lazy` mount delays engine initialization until intersection.

## Testing

- Cover adapter lifecycle, `v-model` propagation, readonly/theme synchronization, and lazy mount behavior.
