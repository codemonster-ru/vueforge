# NoSsr

## Purpose

Render client-only content while keeping SSR/hydration markup deterministic.

## Props

- `placeholder?: boolean` (default `true`) - render built-in fallback placeholder when `#fallback` slot is not provided.
- `fallbackTag?: string` (default `span`) - placeholder element tag.

## Slots

- `default` - content rendered only after client mount.
- `fallback` - SSR/initial-hydration fallback content.

## Example

```vue
<script setup lang="ts">
import { NoSsr, RichTextEditor } from '@codemonster-ru/vueforge';
</script>

<template>
    <NoSsr>
        <RichTextEditor />
        <template #fallback>
            <div>Editor is loading...</div>
        </template>
    </NoSsr>
</template>
```

## Notes

- Use for components that depend on browser-only APIs.
- Keep fallback deterministic to avoid hydration mismatch warnings.
