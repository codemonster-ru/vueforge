# Fieldset

Fieldset provides semantic form grouping with native `fieldset` and `legend` structure, plus optional collapse behavior.

## Import

```ts
import Fieldset from '@/package/components/fieldset.vue';
```

## Examples

### Basic

Use Fieldset to group related form controls under a clear legend.

```vue
<Fieldset legend="Billing details">
    <Stack gap="md">
        <Input label="Company" />
        <Input label="Tax ID" />
    </Stack>
</Fieldset>
```

### Collapsible

Enable `collapsible` for advanced or optional groups that should stay hidden by default.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const advancedOpen = ref(true);
</script>

<template>
    <Fieldset v-model="advancedOpen" legend="Advanced filters" collapsible>
        <Grid>
            <GridItem cols="6"><Input label="Owner" /></GridItem>
            <GridItem cols="6"><Select :items="statuses" label="Status" /></GridItem>
        </Grid>
    </Fieldset>
</template>
```

### Legend Actions

Use the `actions` slot for reset, helper, or auxiliary controls tied to the group.

```vue
<Fieldset legend="Advanced filters" collapsible>
    <template #actions>
        <Button size="sm" variant="outlined">
            Reset
        </Button>
    </template>

    <FilterPanel />
</Fieldset>
```

### Custom Legend

Override the legend slot when the group title needs richer content.

```vue
<Fieldset>
    <template #legend>
        <span>
            Team access
            <Badge value="Required" />
        </span>
    </template>

    <Checkbox label="Allow workspace invites" />
</Fieldset>
```

## API

### Props

| Name | Type | Default |
| --- | --- | --- |
| `modelValue` | `boolean` | `true` |
| `legend` | `string` | `'Details'` |
| `variant` | `'filled' \| 'outlined'` | `'filled'` |
| `collapsible` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `actionsAriaLabel` | `string` | `'Fieldset actions'` |
| `expandLabel` | `string` | `'Expand'` |
| `collapseLabel` | `string` | `'Collapse'` |

### Events

| Name | Payload |
| --- | --- |
| `update:modelValue` | `boolean` |
| `toggle` | `expanded: boolean, event: Event` |

### Slots

| Name | Description |
| --- | --- |
| `default` | Fieldset content. |
| `legend` | Replaces the legend label. |
| `actions` | Controls rendered beside the legend. |

## Theming

Override component tokens through `theme.overrides.components.fieldset`.

## Tokens

- Surface: `borderColor`, `borderRadius`, `backgroundColor`, `textColor`
- Legend and content: `padding`, `legendPadding`, `legendFontSize`, `legendFontWeight`, `legendColor`, `contentPadding`
- Header actions: `headerGap`, `actionsGap`
- Toggle button: `toggleSize`, `toggleRadius`, `toggleBorderColor`, `toggleBackgroundColor`, `toggleTextColor`, `toggleHoverBackgroundColor`
- State: `disabledOpacity`

## Recipes

- Use Fieldset for semantically related form controls, filter groups, and settings clusters.
- Prefer `Panel` when the content is not primarily a form group and does not benefit from `fieldset` semantics.

## Accessibility

- Fieldset preserves native `fieldset` and `legend` semantics for screen readers and forms.
- The collapse button exposes `aria-expanded` and `aria-controls` when disclosure is enabled.

