# Show / Hide

## Purpose

- Provide breakpoint-aware rendering helpers for responsive visibility.

## Shared Props

- `as?: string` (default `div`)
- `from?: 'sm' | 'md' | 'lg' | 'xl'`
- `to?: 'sm' | 'md' | 'lg' | 'xl'`
- `when?: boolean` (default `true`)

Breakpoints:

- `sm=640`, `md=768`, `lg=1024`, `xl=1280` (px, min-width).

## Behavior

- `Show`: renders only inside the selected range (`from <= width < to`).
- `Hide`: inverse helper for hide rules:
    - hides on/above `from`
    - hides below `to`

## Example

```vue
<Show from="md">
    <Toolbar />
</Show>

<Hide from="md">
    <BottomSheet />
</Hide>
```

## Responsive

- Helpers listen to viewport resize and update render result immediately.

## SSR/Hydration

- On server, visibility defaults to rendered output; client width finalizes state after hydration.

## Testing

- Covers `from`/`to` range checks, custom tags, and explicit `when=false`.
