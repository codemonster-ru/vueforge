# Button

Trigger actions with a clear visual hierarchy, optional icons, loading feedback, and link-style navigation.

## Import

```ts
import { Button } from '@codemonster-ru/vueforge';
```

## Examples

Compact scenario-based examples work best for this component. Treat each section as a production baseline and adjust labels, icons, and severity in product code as needed.

### Basic

Use the default filled button for the main action in a form, card, or page header.

```vue
<template>
    <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
        <Button label="Save" />
        <Button label="Cancel" severity="secondary" />
    </div>
</template>
```

### Variants

Switch between `filled`, `outlined`, and `text` to express action priority without changing layout.

```vue
<template>
    <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
        <Button label="Primary" />
        <Button label="Outlined" variant="outlined" />
        <Button label="Text" variant="text" />
    </div>
</template>
```

### Severities

Use `severity` to communicate action intent, especially in confirmation flows and toolbars.

```vue
<template>
    <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
        <Button label="Primary" severity="primary" />
        <Button label="Secondary" severity="secondary" />
        <Button label="Success" severity="success" />
        <Button label="Info" severity="info" />
        <Button label="Warning" severity="warning" />
        <Button label="Danger" severity="danger" />
    </div>
</template>
```

### With Icons

Icons can reinforce intent or replace text in tighter layouts. Use `iconPos` for right, top, and bottom alignment.

```vue
<template>
    <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: flex-start;">
        <Button label="Add item" icon="plus" />
        <Button label="Open" icon="arrowRight" icon-pos="right" />
        <Button label="Upload" icon="upload" icon-pos="top" />
        <Button label="Details" icon="chevronDown" icon-pos="bottom" />
    </div>
</template>
```

### Loading And Disabled

Use `loading` during async work. It blocks interaction and replaces the icon with a spinner.

```vue
<template>
    <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
        <Button label="Saving" loading />
        <Button label="Disabled" disabled />
    </div>
</template>
```

### Sizes And Rounded

Adjust size for density and use `rounded` for icon-forward or accent actions.

```vue
<template>
    <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;">
        <Button label="Small" size="small" />
        <Button label="Default" />
        <Button label="Large" size="large" />
        <Button label="Rounded" rounded icon="star" />
    </div>
</template>
```

### Links

When navigation is the primary goal, pass `to`, `href`, or `url` and the component renders through `Link`.

```vue
<template>
    <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
        <Button label="Docs" to="/docs" />
        <Button label="GitHub" href="https://github.com/codemonster-ru/vueforge" />
    </div>
</template>
```

## Props

- `to?: string | object`
- `href?: string`
- `url?: string`
- `as?: 'button' | 'link'`
- `icon?: string`
- `type?: 'button' | 'submit' | 'reset' | string` (default `button`)
- `size?: 'small' | 'normal' | 'large'`
- `label?: string`
- `loading?: boolean` (default `false`)
- `rounded?: boolean` (default `false`)
- `iconPos?: 'top' | 'right' | 'bottom' | 'left'` (default `left`)
- `variant?: 'filled' | 'outlined' | 'text'`
- `severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger'` (default `primary`)
- `disabled?: boolean` (default `false`)

## Events

- Native `click` from rendered button/link

## Slots

- `default` for button content when `label` is not used

## Theming

- Override via `theme.overrides.components.button`.

## Tokens

Component tokens:

- `fontSize`, `padding`, `borderRadius`, `roundedBorderRadius`, `iconGap`
- `small.fontSize`, `small.padding`
- `large.fontSize`, `large.padding`
- `colorScheme.light.primary.*`
- `colorScheme.light.secondary.*`
- `colorScheme.light.success.*`
- `colorScheme.light.info.*`
- `colorScheme.light.warning.*`
- `colorScheme.light.danger.*`
- `colorScheme.light.text.primary.*`
- `colorScheme.light.text.secondary.*`
- `colorScheme.light.text.success.*`
- `colorScheme.light.text.info.*`
- `colorScheme.light.text.warning.*`
- `colorScheme.light.text.danger.*`
- `colorScheme.light.outlined.primary.*`
- `colorScheme.light.outlined.secondary.*`
- `colorScheme.light.outlined.success.*`
- `colorScheme.light.outlined.info.*`
- `colorScheme.light.outlined.warning.*`
- `colorScheme.light.outlined.danger.*`

## Recipes

- Use filled primary for the dominant page action.
- Use `outlined` or `text` for secondary and tertiary actions in dense layouts.
- Prefer icon + label over icon-only buttons unless surrounding context already labels the action.
- Use `to` for in-app navigation and `href`/`url` for external destinations.

## Accessibility

- Native button semantics are used unless the component resolves to a link.
- Keep visible text or provide an accessible name when using icon-only content.
- Ensure focus visibility and contrast remain intact across `filled`, `outlined`, and `text` variants.
