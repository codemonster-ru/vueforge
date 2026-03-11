# SplitButton

Combine one primary action with a secondary action menu in a compact two-part control.

## Import

```ts
import { SplitButton } from '@codemonster-ru/vueforge';
```

## Examples

Use `SplitButton` when one action is the default and related alternatives should stay nearby.

### Basic

Use the main button for the default action and the dropdown for alternatives.

```vue
<template>
    <SplitButton label="Save" :items="[{ label: 'Save draft' }, { label: 'Save and publish' }]" @click="save" />
</template>
```

### Custom Primary Content

Use the default slot when the primary action label needs richer content.

```vue
<template>
    <SplitButton :items="[{ label: 'Duplicate' }, { label: 'Archive' }]"> Save changes </SplitButton>
</template>
```

### Outlined In A Group

Combine `SplitButton` with `ButtonGroup` for compact page toolbars.

```vue
<template>
    <ButtonGroup attached variant="outlined">
        <Button label="Preview" />
        <SplitButton label="Publish" :items="[{ label: 'Publish now' }, { label: 'Schedule' }]" />
    </ButtonGroup>
</template>
```

### Top Placement

Change placement when the menu opens near the bottom edge of the viewport.

```vue
<template>
    <SplitButton label="Run" placement="top-end" :items="[{ label: 'Run once' }, { label: 'Run nightly' }]" />
</template>
```

## Props

- `modelValue?: boolean`
- `items?: Array<SplitButtonItem>`
- `label?: string`
- `icon?: string`
- `type?: 'button' | 'submit' | 'reset'` (default `button`)
- `size?: 'small' | 'normal' | 'large'`
- `variant?: 'filled' | 'outlined' | 'text'`
- `severity?: string`
- `disabled?: boolean` (default `false`)
- `loading?: boolean` (default `false`)
- `placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'bottom' | 'top'`
- `offset?: number` (default `6`)
- `closeOnSelect?: boolean` (default `true`)
- `closeOnEsc?: boolean` (default `true`)
- `matchTriggerWidth?: boolean` (default `true`)
- `toggleAriaLabel?: string` (default `Toggle actions`)
- `ariaLabel?: string` (default `Split button`)

## Events

- `click`
- `update:modelValue`
- `open`
- `close`
- `select`

## Slots

- `default`
- `menu`

## Theming

- Override via `theme.overrides.components.splitbutton`.

## Tokens

Component tokens (override via `theme.overrides.components.splitbutton`):

- `borderRadius`
- `toggleMinWidth`, `togglePaddingX`, `toggleIconSize`
- `disabledOpacity`
- `small.toggleMinWidth`
- `large.toggleMinWidth`

## Recipes

- Use `SplitButton` when one action is clearly primary and the alternatives are related, not unrelated menu items.
- Keep the primary button safe to click without forcing users into the dropdown.
- In cramped layouts, pair it with `ButtonGroup` instead of scattering adjacent action menus.

## Accessibility

- Wrapper exposes `role="group"` to describe the combined primary and toggle actions.
- Use `toggleAriaLabel` to clearly describe the menu toggle for screen readers.
- Keep both the primary action and the menu toggle keyboard reachable and visually distinct.
