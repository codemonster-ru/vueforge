# Panel

Panel groups related content with built-in heading structure, optional actions, and optional collapse behavior.

## Import

```ts
import { Panel } from '@codemonster-ru/vueforge';
```

## Examples

### Basic

Use `title` and `subtitle` for a standard content block with a built-in header.

```vue
<Panel title="Project summary" subtitle="Sprint 12">
    <p>Delivery status and current risks for the active sprint.</p>
</Panel>
```

### Header Actions

Use the `actions` slot for local controls that belong to the panel itself.

```vue
<Panel title="Project summary" subtitle="Sprint 12">
    <template #actions>
        <Button size="sm">
            Edit
        </Button>
        <Button size="sm" variant="outlined">
            Share
        </Button>
    </template>

    <p>Delivery status and risks for current sprint.</p>
</Panel>
```

### Collapsible

Enable `collapsible` when the panel is useful as progressive disclosure.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const open = ref(true);
</script>

<template>
    <Panel v-model="open" title="Advanced filters" collapsible>
        <FilterPanel />
    </Panel>
</template>
```

### Sizes

Use `small` and `large` when the panel needs to align with denser or more editorial layouts.

```vue
<div class="panel-grid">
    <Panel size="small" title="Compact">Dense summary</Panel>
    <Panel title="Default">Standard block</Panel>
    <Panel size="large" title="Large">Editorial section</Panel>
</div>
```

### Custom Header Content

Override `title`, `subtitle`, or the whole `header` when the heading needs richer markup.

```vue
<Panel>
    <template #header>
        <div>
            <h3>Migration status</h3>
            <StatusBadge value="On track" />
        </div>
    </template>

    <p>Three of five environments have been migrated.</p>
</Panel>
```

## API

### Props

| Name               | Type                             | Default           |
| ------------------ | -------------------------------- | ----------------- |
| `modelValue`       | `boolean`                        | `true`            |
| `title`            | `string`                         | `''`              |
| `subtitle`         | `string`                         | `''`              |
| `size`             | `'small' \| 'normal' \| 'large'` | `'normal'`        |
| `variant`          | `'filled' \| 'outlined'`         | `'filled'`        |
| `collapsible`      | `boolean`                        | `false`           |
| `disabled`         | `boolean`                        | `false`           |
| `actionsAriaLabel` | `string`                         | `'Panel actions'` |
| `expandLabel`      | `string`                         | `'Expand'`        |
| `collapseLabel`    | `string`                         | `'Collapse'`      |

### Events

| Name                | Payload                           |
| ------------------- | --------------------------------- |
| `update:modelValue` | `boolean`                         |
| `toggle`            | `expanded: boolean, event: Event` |

### Slots

| Name       | Description                                           |
| ---------- | ----------------------------------------------------- |
| `default`  | Main panel body.                                      |
| `header`   | Replaces the whole header area.                       |
| `title`    | Replaces the title text inside the default header.    |
| `subtitle` | Replaces the subtitle text inside the default header. |
| `actions`  | Controls rendered beside the heading.                 |
| `footer`   | Footer rendered only while expanded.                  |

## Theming

Override component tokens through `theme.overrides.components.panel`.

## Tokens

- Surface: `borderColor`, `borderRadius`, `backgroundColor`, `textColor`
- Layout: `headerPadding`, `bodyPadding`, `footerPadding`, `footerBorderColor`, `headerGap`
- Typography: `titleFontSize`, `titleFontWeight`, `subtitleFontSize`, `subtitleColor`
- Actions and toggle: `actionsGap`, `toggleSize`, `toggleRadius`, `toggleBorderColor`, `toggleBackgroundColor`, `toggleTextColor`, `toggleHoverBackgroundColor`
- States and sizes: `disabledOpacity`, `small.padding`, `small.titleFontSize`, `large.padding`, `large.titleFontSize`

## Recipes

- Use Panel when the container needs a strong heading, local actions, or collapsible sections.
- Prefer `Sheet` for purely visual grouping without built-in title and disclosure behavior.

## Accessibility

- The actions area uses `role="group"` with `actionsAriaLabel` for grouped controls.
- The collapse button exposes `aria-expanded` and `aria-controls` for the body region.
