# IconField / InputIcon

Place icons inside input-like controls without hand-tuning spacing on every field.

## Import

```ts
import { IconField, InputIcon } from '@codemonster-ru/vueforge';
```

## Examples

Use `IconField` when an icon should live inside the same visual control surface as the input.

### Leading Icon

Use a start icon for search, email, or similar recognizable cues.

```vue
<template>
    <IconField>
        <template #start>
            <InputIcon icon="magnifyingGlass" />
        </template>
        <Input model-value="" placeholder="Search" />
    </IconField>
</template>
```

### Leading And Trailing Icons

Use both sides when the field needs a cue and a status or action indicator.

```vue
<template>
    <IconField>
        <template #start>
            <InputIcon icon="mail" />
        </template>
        <Input model-value="team@acme.dev" />
        <template #end>
            <InputIcon side="end" icon="check" />
        </template>
    </IconField>
</template>
```

### Meaningful Icon

Set `decorative="false"` when the icon itself conveys meaning.

```vue
<template>
    <InputIcon icon="triangleExclamation" :decorative="false" aria-label="Warning" />
</template>
```

## IconField Props

- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `disabled?: boolean` (default `false`)
- `ariaLabel?: string`
- `ariaLabelledby?: string`

## InputIcon Props

- `icon?: string`
- `side?: 'start' | 'end'` (default `start`)
- `as?: string` (default `span`)
- `decorative?: boolean` (default `true`)
- `ariaLabel?: string`

## Events

- This component does not emit component-specific events.

## Slots

- `IconField`: `start`, `default`, `end`
- `InputIcon`: `default`

## Theming

- Override via `theme.overrides.components.iconField` and `theme.overrides.components.inputIcon`.

## Tokens

- `iconField`: `iconSize`, `iconColor`, `slotOffset`, `controlPaddingStart`, `controlPaddingEnd`, `disabledOpacity`
- `inputIcon`: `size`, `color`

## Recipes

- Use `IconField` as a spacing utility around the real input-like control.
- Keep decorative icons non-interactive; if an icon should be clicked, use a proper button instead.
- Be careful combining trailing icons with controls that already have built-in affordances.

## Accessibility

- `IconField` exposes `role="group"` for grouped control semantics.
- Use `InputIcon` with `decorative=false` and `ariaLabel` when the icon conveys meaning.
