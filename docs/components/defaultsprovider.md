# DefaultsProvider

## Purpose

Provide subtree-scoped default prop policies for VueForge components.

## Props

- `defaults?: ComponentDefaultsMap` - component-to-props default map.
- `as?: string` (default `div`) - root element tag.

## Example

```vue
<script setup lang="ts">
import { Button, DefaultsProvider } from '@codemonster-ru/vueforge';
</script>

<template>
    <DefaultsProvider
        :defaults="{
            Button: {
                size: 'lg',
                rounded: true,
            },
        }"
    >
        <Button>Large Rounded by Scope</Button>
    </DefaultsProvider>
</template>
```

## Policy Priority

1. Explicit component prop
2. Nearest `DefaultsProvider` scoped defaults
3. Component base defaults

## Notes

- Nested providers are supported; inner provider overrides outer policy per component key.
- Component keys map to public component names (for example `Button`, `Input`, `Chart`).
