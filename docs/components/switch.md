# Switch

Capture immediate on or off preferences with a compact toggle affordance.

## Import

```ts
import { Switch } from '@codemonster-ru/vueforge';
```

## Examples

Use `Switch` for settings that feel like an immediate system toggle rather than a form checklist item.

### Basic

Use a switch for simple preference toggles.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const darkMode = ref(true);
</script>

<template>
    <Switch v-model="darkMode" label="Dark mode" />
</template>
```

### With Slot Label

Use the default slot when the label needs more context.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const alerts = ref(false);
</script>

<template>
    <Switch v-model="alerts">
        Send deployment alerts to Slack
    </Switch>
</template>
```

### Disabled State

Use `disabled` when the preference is visible but currently controlled elsewhere.

```vue
<template>
    <Stack gap="0.5rem">
        <Switch :model-value="true" disabled label="Workspace backups" />
        <Switch :model-value="false" disabled label="Auto-merge pull requests" />
    </Stack>
</template>
```

## Props

- `modelValue?: boolean` (v-model, default `false`)
- `label?: string`
- `disabled?: boolean` (default `false`)
- `id?: string`
- `name?: string`
- `required?: boolean` (default `false`)
- `ariaLabel?: string`
- `ariaLabelledby?: string`
- `ariaDescribedby?: string`
- `ariaInvalid?: boolean | 'true' | 'false'`
- `ariaRequired?: boolean | 'true' | 'false'` (defaults to `'true'` when `required`)

## Events

- `update:modelValue`
- `change`

## Slots

- `default` - label content (fallbacks to `label`)

## Theming

- Override via `theme.overrides.components.switch`.

## Tokens

Component tokens (override via `theme.overrides.components.switch`):

- `width`, `height`, `thumbSize`, `gap`
- `thumbOffset`, `thumbTranslateOffset`
- `backgroundColor`, `checkedBackgroundColor`
- `thumbColor`, `textColor`, `disabledOpacity`

## Recipes

- Prefer `Switch` when the control reads naturally as enabled or disabled.
- Prefer `Checkbox` when the control is part of a larger selection list or form checklist.
- Keep labels state-neutral; the position already communicates whether the setting is on or off.

## Accessibility

- Uses native `input[type="checkbox"]` semantics for keyboard and assistive technologies.
- Provide accessible naming via visible label text or `ariaLabel` or `ariaLabelledby`.
- Use `ariaDescribedby` for hint or error linkage and `ariaInvalid` or `ariaRequired` for state semantics.
