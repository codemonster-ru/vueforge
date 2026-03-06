# ButtonGroup

Group related buttons into one cohesive action cluster with shared size, variant, and spacing rules.

## Import

```ts
import { ButtonGroup } from '@codemonster-ru/vueforge';
```

## Examples

Use `ButtonGroup` when adjacent actions belong to one decision set or compact control cluster.

### Basic

Use the default horizontal layout for related actions.

```vue
<template>
    <ButtonGroup size="small">
        <Button label="Refresh" />
        <Button label="Export" variant="outlined" />
    </ButtonGroup>
</template>
```

### Attached

Use `attached` when the buttons should read as one segmented action strip.

```vue
<template>
    <ButtonGroup attached size="small" variant="outlined" severity="primary">
        <Button label="Day" />
        <Button label="Week" />
        <Button label="Month" />
    </ButtonGroup>
</template>
```

### With SplitButton

Mix `Button` and `SplitButton` when one action has secondary options.

```vue
<template>
    <ButtonGroup attached>
        <Button label="Save" />
        <SplitButton
            label="More"
            :items="[
                { label: 'Save draft' },
                { label: 'Save and publish' }
            ]"
        />
    </ButtonGroup>
</template>
```

### Vertical

Use vertical orientation in side panels and stacked tool palettes.

```vue
<template>
    <ButtonGroup orientation="vertical" size="small">
        <Button label="Move up" />
        <Button label="Move down" />
    </ButtonGroup>
</template>
```

## Props

- `size?: 'small' | 'normal' | 'large'`
- `variant?: 'filled' | 'outlined' | 'text'`
- `severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger'`
- `disabled?: boolean` (default `false`)
- `orientation?: 'horizontal' | 'vertical'` (default `horizontal`)
- `attached?: boolean` (default `false`)

## Events

- This component does not emit component-specific events.

## Slots

- `default`

## Theming

- Override via `theme.overrides.components.buttonGroup`.

## Tokens

Component tokens (override via `theme.overrides.components.buttonGroup`):

- `gap`, `borderRadius`, `disabledOpacity`

## Recipes

- Use `ButtonGroup` for related controls, not arbitrary neighboring buttons.
- Let the group provide shared size and variant defaults instead of repeating them on every child.
- Prefer `attached` only when the actions are tightly related and should read as one control strip.

## Accessibility

- The wrapper exposes `role="group"` and disabled state semantics through `aria-disabled`.
- Keep grouped actions logically related so the grouping makes sense to keyboard and screen-reader users.
