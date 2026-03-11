# OrgChart

OrgChart renders hierarchical organization-style structures with selectable nodes, collapsible branches, and card-based visual relationships.

## Import

```ts
import { OrgChart } from '@codemonster-ru/vueforge';
```

## Examples

### Basic

Use OrgChart for teams, reporting lines, capability maps, and high-level structure diagrams.

```vue
<OrgChart v-model="selectedNode" v-model:expandedKeys="expandedKeys" :items="orgItems" aria-label="Company structure" />
```

### Multiple Selection

Enable `multiple` when the chart needs compare or bulk-selection behavior.

```vue
<OrgChart v-model="selectedNodes" :items="orgItems" multiple />
```

### Collapsible Branches

Keep `collapsible` enabled when large charts should progressively reveal deeper levels.

```vue
<OrgChart v-model="selectedNode" v-model:expandedKeys="expandedKeys" :items="orgItems" collapsible />
```

### Custom Node Content

Use the `node` slot when cards need avatars, metrics, or richer role metadata.

```vue
<OrgChart :items="orgItems">
    <template #node="{ node }">
        <div>
            <strong>{{ node.label }}</strong>
            <div>{{ node.title }}</div>
        </div>
    </template>
</OrgChart>
```

## API

### Types

```ts
type OrgChartValue = string | number;

interface OrgChartNodeItem {
    key: OrgChartValue;
    label: string;
    title?: string;
    disabled?: boolean;
    children?: OrgChartNodeItem[];
}
```

### Props

| Name             | Type                                            | Default       |
| ---------------- | ----------------------------------------------- | ------------- |
| `items`          | `OrgChartNodeItem[]`                            | `[]`          |
| `modelValue`     | `OrgChartValue \| OrgChartValue[] \| undefined` | `undefined`   |
| `expandedKeys`   | `OrgChartValue[]`                               | `[]`          |
| `multiple`       | `boolean`                                       | `false`       |
| `selectable`     | `boolean`                                       | `true`        |
| `collapsible`    | `boolean`                                       | `true`        |
| `disabled`       | `boolean`                                       | `false`       |
| `size`           | `'small' \| 'normal' \| 'large'`                | `'normal'`    |
| `variant`        | `'filled' \| 'outlined'`                        | `'filled'`    |
| `ariaLabel`      | `string`                                        | `'Org chart'` |
| `ariaLabelledby` | `string`                                        | `''`          |

### Events

| Name                  | Payload                      |
| --------------------- | ---------------------------- |
| `update:modelValue`   | selected value payload       |
| `update:expandedKeys` | expanded keys array          |
| `change`              | selection payload            |
| `toggle`              | `key, expanded, node, event` |
| `nodeClick`           | `node, event`                |

### Slots

| Name   | Description                                                               |
| ------ | ------------------------------------------------------------------------- |
| `node` | Custom card content with `{ node, level, selected, expanded, disabled }`. |

## Theming

`OrgChart` currently exposes a CSS variable token contract through the component styles, but this repo does not yet include a dedicated `theme.overrides.components.orgChart` preset file in `packages/vueforge/src/themes/default/components/`.

## Tokens

- Layout and connectors: `gap`, `childrenMarginTop`, `connectorColor`, `textColor`
- Card: `cardMinWidth`, `cardMaxWidth`, `cardGap`, `cardPadding`, `cardBorderColor`, `cardBorderRadius`, `cardBackgroundColor`, `cardTextColor`, `cardHoverBackgroundColor`, `cardSelectedBackgroundColor`, `cardSelectedColor`
- Toggle and focus: `toggleSize`, `toggleRadius`, `toggleBorderColor`, `toggleBackgroundColor`, `toggleTextColor`, `focusRingColor`
- Typography and state: `labelFontSize`, `labelFontWeight`, `titleFontSize`, `titleColor`, `disabledOpacity`, `small.*`, `large.*`

## Recipes

- Use OrgChart for organization structures, dependency maps, and high-level node relationship views.
- Prefer `Tree` when the same hierarchy should behave more like a dense interactive list than a visual node chart.

## Accessibility

- OrgChart uses tree-style semantics and keyboard navigation for selection and branch traversal.
- The card layout is visual, but interaction still follows the same selected and expanded state model as hierarchical controls.
