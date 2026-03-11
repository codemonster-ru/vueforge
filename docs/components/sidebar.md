# Sidebar

Provide a compatibility-oriented alias over `Drawer` for sidebar-style overlays.

## Import

```ts
import { Sidebar } from '@codemonster-ru/vueforge';
```

## Examples

Use `Sidebar` only when maintaining compatibility with an older API. Prefer `Drawer` for new code.

### Basic

Use the legacy `visible` contract when migrating existing code incrementally.

```vue
<template>
    <Sidebar v-model:visible="sidebarOpen" title="Filters" position="left">
        <template #body>
            <p>Sidebar content</p>
        </template>
    </Sidebar>
</template>
```

### Vue Standard v-model

Use `modelValue` if the surrounding codebase has already switched to the canonical Vue pattern.

```vue
<template>
    <Sidebar v-model="open" title="Workspace navigation">
        <template #body>
            <Menu
                :items="[
                    { label: 'Overview', to: '/' },
                    { label: 'Members', to: '/members' },
                ]"
            />
        </template>
    </Sidebar>
</template>
```

### Footer Actions

The forwarded slots are the same as `Drawer`, so header/body/footer composition still works.

```vue
<template>
    <Sidebar v-model="open" title="Filters">
        <template #body>
            <p>Filter controls</p>
        </template>
        <template #footer>
            <Button label="Reset" variant="outlined" severity="secondary" />
            <Button label="Apply" />
        </template>
    </Sidebar>
</template>
```

## Props

- `visible?: boolean` (legacy v-model alias)
- `modelValue?: boolean` (Vue standard v-model)
- `title?: string`
- `position?: 'left' | 'right' | 'top' | 'bottom'` (default `left`)
- `size?: 'sm' | 'md' | 'lg'`
- `modal?: boolean` (alias for `overlay`)
- `overlay?: boolean`
- `dismissable?: boolean` (alias for `closeOnOverlay`)
- `closeOnOverlay?: boolean`
- `closeOnEscape?: boolean` (alias for `closeOnEsc`)
- `closeOnEsc?: boolean`
- `showCloseIcon?: boolean` (alias for `showClose`)
- `showClose?: boolean`
- `blockScroll?: boolean` (alias for `lockScroll`)
- `lockScroll?: boolean`

## Events

- `update:visible`
- `update:modelValue`
- `show`, `onShow` (alias events)
- `hide`, `onHide` (alias events)
- `open`, `close`

## Slots

- `header`, `body`, `footer`, `close`, default

## Guidance vs Drawer

- `Drawer` is the canonical component for new code.
- `Sidebar` is compatibility-oriented and forwards behavior to `Drawer`.
- Prefer migrating to `Drawer` API gradually (`modelValue`, `closeOnOverlay`, `closeOnEsc`, `showClose`, `lockScroll`).

## Theming

- Override via `theme.overrides.components.sidebar` only if your project intentionally keeps a separate alias token entry.
- In practice this component follows the same visual contract as `Drawer`.

## Tokens

- Uses the `Drawer` token contract (`width*`, `height*`, `padding`, `borderRadius`, `overlayBackgroundColor`, `shadow`, `zIndex`, header/body/footer gaps, close tokens).

## Accessibility

- Inherits dialog semantics and focus trapping from `Drawer`.
- Keyboard `Escape` close depends on `closeOnEsc`/`closeOnEscape`.
