# ThemeProvider

## Purpose

Provide local theme scope overrides for a component subtree without replacing global theme configuration.

## Props

- `preset?: ThemePreset` - optional local preset baseline.
- `overrides?: ThemePreset` - local token overrides merged with preset/global theme.
- `as?: string` (default `div`) - root element tag.
- `dark?: boolean` (default `false`) - use dark token variables for the scoped subtree.

## Slots

- `default`

## Example

```vue
<script setup lang="ts">
import { Button, ThemeProvider } from '@codemonster-ru/vueforge';
</script>

<template>
    <ThemeProvider
        :overrides="{
            colors: { primary: '#7c3aed' },
            components: { button: { backgroundColor: '#7c3aed' } },
        }"
    >
        <Button>Scoped Themed Action</Button>
    </ThemeProvider>
</template>
```

## Notes

- Theme scope is applied as CSS variables on provider root.
- Use `dark` mode for local dark-themed regions within mixed-layout pages.
