# Kbd

Kbd displays keyboard keys and shortcuts with consistent styling for docs, onboarding, and command references.

## Import

```ts
import { Kbd } from '@codemonster-ru/vueforge';
```

## Examples

### Basic

Use `Kbd` to show a single key or a short shortcut inline with body copy.

```vue
<p>Press <Kbd :keys="['K']" /> to focus search.</p>
```

### Key Combinations

Pass multiple keys for composite shortcuts like command palette and productivity flows.

```vue
<p><Kbd :keys="['Ctrl', 'Shift', 'P']" /> opens the command palette.</p>
```

### Custom Separator

Change `separator` when product copy prefers a platform-specific shortcut style.

```vue
<Kbd :keys="['Cmd', 'K']" separator="" />
```

### Sizes

Use the size variants to match dense docs tables or more prominent onboarding callouts.

```vue
<div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
    <Kbd :keys="['Esc']" size="small" />
    <Kbd :keys="['Enter']" />
    <Kbd :keys="['Shift', 'Enter']" size="large" />
</div>
```

## API

### Props

| Name        | Type                             | Default               |
| ----------- | -------------------------------- | --------------------- |
| `keys`      | `string[]`                       | `[]`                  |
| `separator` | `string`                         | `'+'`                 |
| `size`      | `'small' \| 'medium' \| 'large'` | `'medium'`            |
| `disabled`  | `boolean`                        | `false`               |
| `ariaLabel` | `string`                         | `'Keyboard shortcut'` |

### Slots

| Name      | Description                                    |
| --------- | ---------------------------------------------- |
| `default` | Replaces the entire rendered shortcut content. |
| `key`     | Customizes individual key rendering.           |

## Theming

Override component tokens through `theme.overrides.components.kbd`.

## Tokens

- Typography and spacing: `fontFamily`, `fontSize`, `padding`, `gap`
- Key surface: `borderRadius`, `borderColor`, `backgroundColor`, `textColor`, `shadow`
- Separator and states: `separatorColor`, `disabledOpacity`
- Sizes: `small.fontSize`, `small.padding`, `large.fontSize`, `large.padding`

## Recipes

- Keep shortcuts short and literal. If the actual trigger differs by platform, show the product-specific variant instead of an abstract description.
- Use surrounding prose for action meaning and `Kbd` only for the key notation itself.

## Accessibility

- `Kbd` is presentational and should stay adjacent to readable instructional text.
- If you fully override the content through slots, preserve a usable accessible label for screen readers.
