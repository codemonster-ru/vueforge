# SpeedDial

Provide a floating quick-action menu for a small set of high-priority actions.

## Import

```ts
import { SpeedDial } from '@codemonster-ru/vueforge';
```

## Examples

Use `SpeedDial` when important actions should stay reachable without occupying permanent toolbar space.

### Basic

Use it for quick create or workflow shortcuts.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const open = ref(false);
</script>

<template>
    <SpeedDial
        v-model="open"
        :actions="[
            { label: 'Create task', value: 'create' },
            { label: 'Invite member', value: 'invite' },
            { label: 'Export', value: 'export' }
        ]"
        @action="onQuickAction"
    />
</template>
```

### Different Direction

Change direction to fit the surrounding viewport and avoid collisions.

```vue
<template>
    <SpeedDial
        :model-value="true"
        direction="left"
        :actions="[
            { label: 'Pin' },
            { label: 'Share' },
            { label: 'Archive' }
        ]"
    />
</template>
```

### Custom Trigger

Use the `trigger` slot when the floating trigger should match product language or iconography.

```vue
<template>
    <SpeedDial :actions="actions">
        <template #trigger="{ open }">
            {{ open ? 'Close' : 'Quick' }}
        </template>
    </SpeedDial>
</template>
```

## Props

- `modelValue?: boolean` (default `false`)
- `actions?: Array<SpeedDialAction>`
- `direction?: 'up' | 'down' | 'left' | 'right'` (default `up`)
- `disabled?: boolean` (default `false`)
- `ariaLabel?: string` (default `Speed dial actions`)
- `openLabel?: string` (default `Open actions`)
- `closeLabel?: string` (default `Close actions`)
- `closeOnAction?: boolean` (default `true`)
- `closeOnOutsideClick?: boolean` (default `true`)
- `pt?: PassThroughOptions`
- `unstyled?: boolean` (default `false`)

## Events

- `update:modelValue`
- `toggle`
- `action`

## Slots

- `trigger` with `{ open }`
- `action` with `{ action, index }`

## Theming

- Override via `theme.overrides.components.speeddial`.

## Tokens

Component tokens (override via `theme.overrides.components.speeddial`):

- `gap`, `zIndex`, `offsetX`, `offsetY`, `offsetXMobile`, `offsetYMobile`
- `transitionDuration`, `transitionEasing`
- `triggerSize`, `triggerPaddingX`, `triggerBorderRadius`, `triggerBorderColor`, `triggerBackgroundColor`, `triggerTextColor`, `triggerShadow`
- `actionSize`, `actionPaddingX`, `actionBorderRadius`, `actionBorderColor`, `actionBackgroundColor`, `actionTextColor`, `actionShadow`
- `labelBackgroundColor`, `labelTextColor`, `labelPadding`
- `focusRingShadow`, `focusBorderColor`, `disabledOpacity`

## Recipes

- Keep the action set short; a floating menu should not turn into a second full navigation.
- Use direction and offsets intentionally so the menu does not cover critical content.
- Prefer concise labels because floating actions consume limited screen space.

## Accessibility

- Trigger exposes `aria-haspopup="menu"` and `aria-expanded`.
- Actions render as `menuitem` controls in a `role="menu"` container.
- Keyboard support includes trigger toggle, arrow navigation, `Home`, `End`, and `Escape`.
