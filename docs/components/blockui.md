# BlockUI

## Purpose

Block interaction on a local region or the full viewport while loading async operations.

## Props

- `modelValue?: boolean` (default `false`) - blocked state (`v-model`)
- `fullScreen?: boolean` (default `false`) - render overlay on viewport via `Teleport`
- `showSpinner?: boolean` (default `true`)
- `label?: string`
- `ariaLabel?: string` (default `Loading`)
- `zIndex?: number | string | null` (default `null`) - overrides overlay z-index
- `variant?: 'soft' | 'dim'` (default `soft`)
- `blur?: boolean` (default `false`)

## Events

- `block`
- `unblock`

## Slots

- `default` - wrapped content to protect/block
- `overlay` - custom overlay content

## Example

```vue
<BlockUI v-model="saving" label="Saving changes...">
    <DataTable :columns="columns" :rows="rows" />
</BlockUI>
```

```vue
<BlockUI v-model="loadingApp" full-screen variant="dim" :z-index="120">
    <template #overlay>
        <Spinner size="large" label="Preparing workspace..." />
    </template>
</BlockUI>
```

## Theming

- Override via `theme.overrides.components.blockui`.

## Tokens

- `zIndex`, `gap`, `textColor`
- `labelFontSize`, `labelFontWeight`
- `overlayBackgroundColor`, `overlayDimBackgroundColor`
- `blurSize`

## Accessibility

- Root reflects loading state with `aria-busy`.
- Default overlay uses spinner semantics with accessible loading label.

## Testing

- Cover local/fullscreen overlay rendering, custom slot, and block/unblock event emission.
