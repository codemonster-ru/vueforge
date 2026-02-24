# Fieldset

## Purpose

Provide semantic form grouping with optional collapse/toggle and legend actions.

## Props

- `modelValue?: boolean` (default `true`) - expanded state (`v-model`)
- `legend?: string` (default `Details`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `collapsible?: boolean` (default `false`)
- `disabled?: boolean` (default `false`)
- `actionsAriaLabel?: string` (default `Fieldset actions`)
- `expandLabel?: string` (default `Expand`)
- `collapseLabel?: string` (default `Collapse`)

## Events

- `update:modelValue`
- `toggle` (payload: `boolean`, `event`)

## Slots

- `default`
- `legend`
- `actions`

## Example

```vue
<Fieldset v-model="advancedOpen" legend="Advanced Filters" collapsible>
    <template #actions>
        <Button size="small" variant="outlined">Reset</Button>
    </template>

    <Grid>
        <GridItem cols="6"><Input label="Owner" /></GridItem>
        <GridItem cols="6"><Select :items="statuses" label="Status" /></GridItem>
    </Grid>
</Fieldset>
```

## Theming

- Override via `theme.overrides.components.fieldset`.

## Tokens

- `borderColor`, `borderRadius`, `backgroundColor`, `textColor`
- `padding`, `legendPadding`, `legendFontSize`, `legendFontWeight`, `legendColor`
- `contentPadding`, `headerGap`, `actionsGap`
- `toggleSize`, `toggleRadius`, `toggleBorderColor`, `toggleBackgroundColor`, `toggleTextColor`, `toggleHoverBackgroundColor`
- `disabledOpacity`

## Accessibility

- Uses native `fieldset` and `legend` semantics.
- Collapse button exposes `aria-expanded` and `aria-controls`.

## Testing

- Cover collapse state updates and semantic legend rendering.
