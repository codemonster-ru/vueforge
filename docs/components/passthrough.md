# PassThrough

## Purpose

Part-level prop/attr forwarding contracts for deep component customization without forking.

## Core API

- `resolvePassThrough(options, part, context)` - resolve static/resolver attrs for a specific part
- `withPartClass(attrs, baseClass, unstyled)` - merge internal class with external attrs respecting `unstyled`

## Types

- `PassThroughAttrs`
- `PassThroughResolverContext`
- `PassThroughEntry`
- `PassThroughOptions`

## Example

```ts
import { resolvePassThrough, withPartClass } from '@codemonster-ru/vueforge';

const attrs = withPartClass(
    resolvePassThrough(
        {
            root: ({ active }: { active: boolean }) => ({ class: active ? 'is-active' : 'is-idle' }),
        },
        'root',
        { active: true },
    ),
    'vf-widget',
    false,
);
```

## Notes

- This is the shared utility layer behind component-level `pt` and `unstyled` props.
- For usage patterns and supported parts per component, see guide: `docs/guides/pass-through-unstyled.md`.
