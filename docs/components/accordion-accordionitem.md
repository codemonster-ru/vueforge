# Accordion / AccordionItem

Accordion organizes expandable sections, while `AccordionItem` defines each toggleable panel.

## Import

```ts
import { Accordion, AccordionItem } from '@codemonster-ru/vueforge';
import { Accordion, AccordionItem } from '@codemonster-ru/vueforge';
```

## Examples

### Basic

Use single-open mode for FAQ sections, settings groups, and compact detail panels.

```vue
<Accordion model-value="shipping">
    <AccordionItem value="shipping" title="Shipping">
        Shipping details
    </AccordionItem>
    <AccordionItem value="returns" title="Returns">
        Returns policy
    </AccordionItem>
</Accordion>
```

### Multiple Open Sections

Enable `multiple` when users need to compare or review several sections at once.

```vue
<Accordion :model-value="['privacy']" multiple>
    <AccordionItem value="privacy" title="Privacy">
        Privacy policy
    </AccordionItem>
    <AccordionItem value="terms" title="Terms">
        Terms of service
    </AccordionItem>
</Accordion>
```

### Grouped Settings

Use grouped mode when the accordion acts like a cohesive settings block with shared heading copy.

```vue
<Accordion
    :model-value="['policy']"
    multiple
    grouped
    group-title="Access controls"
    group-description="Policy and approval settings"
>
    <template #group-actions>
        <Button size="small" label="Manage roles" />
    </template>

    <AccordionItem value="policy" title="Policy rules">
        ...
    </AccordionItem>
    <AccordionItem value="approvals" title="Approval matrix">
        ...
    </AccordionItem>
</Accordion>
```

### Dense And Analytics

Use dense mode for admin screens and enable analytics only when product instrumentation needs expand and collapse events.

```vue
<Accordion model-value="overview" dense analytics analytics-context="security-settings">
    <AccordionItem value="overview" title="Overview">
        Summary content
    </AccordionItem>
    <AccordionItem value="history" title="History" unmount>
        Lazy content
    </AccordionItem>
</Accordion>
```

## API

### Accordion Props

| Name               | Type                                                       | Default     |
| ------------------ | ---------------------------------------------------------- | ----------- |
| `modelValue`       | `string \| number \| Array<string \| number> \| undefined` | `undefined` |
| `multiple`         | `boolean`                                                  | `false`     |
| `disabled`         | `boolean`                                                  | `false`     |
| `dense`            | `boolean`                                                  | `false`     |
| `grouped`          | `boolean`                                                  | `false`     |
| `groupTitle`       | `string`                                                   | `''`        |
| `groupDescription` | `string`                                                   | `''`        |
| `analytics`        | `boolean`                                                  | `false`     |
| `analyticsContext` | `string`                                                   | `''`        |
| `variant`          | `'filled' \| 'outlined'`                                   | `'filled'`  |
| `size`             | `'small' \| 'normal' \| 'large'`                           | `'normal'`  |
| `ariaLabel`        | `string`                                                   | `''`        |
| `ariaLabelledby`   | `string`                                                   | `''`        |

### AccordionItem Props

| Name       | Type               | Default  |
| ---------- | ------------------ | -------- |
| `value`    | `string \| number` | required |
| `title`    | `string`           | `''`     |
| `disabled` | `boolean`          | `false`  |
| `unmount`  | `boolean`          | `false`  |

### Events

| Name                | Payload                                           |
| ------------------- | ------------------------------------------------- |
| `update:modelValue` | `AccordionValue \| AccordionValue[] \| undefined` |
| `change`            | `(nextValue, event)`                              |
| `itemToggle`        | `{ value, expanded, values, event }`              |
| `itemExpand`        | `(value, values, event)`                          |
| `itemCollapse`      | `(value, values, event)`                          |
| `analytics`         | `{ type, value, values, context, at }`            |

### Slots

| Name                | Description                                            |
| ------------------- | ------------------------------------------------------ |
| `group-title`       | Replaces the group title area.                         |
| `group-description` | Replaces the group description area.                   |
| `group-actions`     | Adds actions to the grouped header.                    |
| `title`             | Customizes an individual `AccordionItem` header title. |

## Theming

Override component tokens through `theme.overrides.components.accordion`.

## Tokens

- Layout: `gap`, `borderRadius`, `borderColor`, `backgroundColor`
- Header: `headerGap`, `headerPadding`, `headerFontSize`, `headerFontWeight`, `headerTextColor`, `headerBackgroundColor`, `headerHoverBackgroundColor`, `headerActiveBackgroundColor`
- Content: `contentPadding`, `contentTextColor`, `contentBackgroundColor`
- Icons and states: `iconSize`, `iconColor`, `dividerColor`, `focusRingShadow`, `disabledOpacity`
- Sizes: `small.headerPadding`, `small.headerFontSize`, `small.contentPadding`, `large.headerPadding`, `large.headerFontSize`, `large.contentPadding`

## Recipes

- Use single-open mode when the accordion is primarily navigational or disclosure-oriented.
- Use `unmount` on expensive panels that should not stay in the DOM while collapsed.

## Accessibility

- Header buttons expose `aria-expanded` and `aria-controls`, and panels use `role="region"` with `aria-labelledby`.
- Keyboard traversal supports `ArrowUp`, `ArrowDown`, `Home`, and `End`.
