# PassThrough

PassThrough is the shared utility layer behind component-level `pt` and `unstyled` props. It resolves part-level attributes and merges consumer classes without forking component internals.

## Import

```ts
import {
    resolvePassThrough,
    withPartClass,
    type PassThroughAttrs,
    type PassThroughEntry,
    type PassThroughOptions,
    type PassThroughResolverContext,
} from '@codemonster-ru/vueforge';
```

## Examples

### Resolve Part Attributes

```ts
const attrs = resolvePassThrough(
    {
        root: ({ active }: { active: boolean }) => ({ class: active ? 'is-active' : 'is-idle' }),
    },
    'root',
    { active: true },
);
```

### Merge Internal Class

```ts
const merged = withPartClass(attrs, 'vf-widget', false);
```

## API

### Types

```ts
type PassThroughAttrs = Record<string, unknown>;
type PassThroughResolverContext = Record<string, unknown>;
type PassThroughEntry<Context = PassThroughResolverContext> =
    | PassThroughAttrs
    | ((context: Context) => PassThroughAttrs | undefined | null);
type PassThroughOptions<Context = PassThroughResolverContext> = Record<string, PassThroughEntry<Context> | undefined>;
```

### Functions

| Name                                         | Description                                                             |
| -------------------------------------------- | ----------------------------------------------------------------------- |
| `resolvePassThrough(options, part, context)` | Resolves attrs for a specific component part.                           |
| `withPartClass(attrs, baseClass, unstyled)`  | Merges internal class with resolved attrs unless `unstyled` is enabled. |

## Recipes

- Use PassThrough when a component exposes `pt` for root, item, icon, label, or other internal parts.
- Pair it with `unstyled` when consumers should take over the visual class contract completely.
