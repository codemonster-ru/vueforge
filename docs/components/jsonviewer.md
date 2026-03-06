# JSONViewer

JSONViewer renders structured JSON with expandable nodes, copy actions, and optional root and toolbar controls.

## Import

```ts
import JSONViewer from '@/package/components/json-viewer.vue';
```

## Examples

### Basic

Use `JSONViewer` for payload inspection, audit details, or developer-facing diagnostics.

```vue
<script setup lang="ts">
const payload = {
    id: 'evt_1024',
    type: 'payment.succeeded',
    amount: 2490,
    customer: {
        id: 'cus_42',
        email: 'team@example.com',
    },
};
</script>

<template>
    <JSONViewer :value="payload" />
</template>
```

### Controlled Depth

Lower `expanded-depth` when large payloads should stay scannable on first render.

```vue
<JSONViewer :value="payload" :expanded-depth="1" />
```

### Sorted Keys And Root

Enable root and sorted keys when viewers are used for support tooling or diff-oriented inspection.

```vue
<JSONViewer
    :value="payload"
    show-root
    sort-keys
    show-toolbar
/>
```

### Copy Actions

Turn on copy helpers when operators need to reuse paths or raw values during debugging.

```vue
<JSONViewer
    :value="payload"
    copyable
    show-toolbar
    @copy="({ text }) => console.log('Copied', text)"
    @copy-path="({ path }) => console.log('Path', path)"
/>
```

## API

### Props

| Name | Type | Default |
| --- | --- | --- |
| `value` | `unknown` | `undefined` |
| `expandedDepth` | `number` | `2` |
| `sortKeys` | `boolean` | `false` |
| `showRoot` | `boolean` | `false` |
| `copyable` | `boolean` | `false` |
| `showToolbar` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `copyLabel` | `string` | `'Copy value'` |
| `copyPathLabel` | `string` | `'Copy path'` |
| `expandLabel` | `string` | `'Expand node'` |
| `collapseLabel` | `string` | `'Collapse node'` |

### Events

| Name | Payload |
| --- | --- |
| `toggle` | `{ path, expanded }` |
| `copyPath` | `{ path }` |
| `copy` | `{ text }` |

## Theming

Override component tokens through `theme.overrides.components.jsonViewer`.

## Tokens

- Layout and surface: `padding`, `borderRadius`, `borderColor`, `backgroundColor`
- Typography: `fontFamily`, `fontSize`, `lineHeight`
- Controls: `toggleSize`, `toggleTextColor`, `toolbarGap`, `toolbarButtonSize`, `toolbarButtonBackgroundColor`, `toolbarButtonTextColor`
- Syntax colors: `keyColor`, `stringColor`, `numberColor`, `booleanColor`, `nullColor`, `punctuationColor`, `pathColor`

## Recipes

- Use `JSONViewer` in admin tools, request inspectors, and audit trails where raw structure matters more than polished prose.
- Keep `expandedDepth` conservative for large payloads to avoid noisy initial renders.

## Accessibility

- Expand and collapse controls are keyboard reachable and should keep their accessible labels when customized.
- If copy actions are important to the workflow, pair them with nearby live feedback such as a toast confirmation.
