# SystemBar

## Purpose

Render a compact top status/utility strip for global environment, tenant, or system state indicators.

## Props

- `as?: string` (default `div`)
- `fixed?: boolean` (default `false`)
- `sticky?: boolean` (default `false`)
- `dense?: boolean` (default `false`)
- `bordered?: boolean` (default `true`)
- `ariaLabel?: string` (default `System bar`)
- `startAriaLabel?: string` (default `System status`)
- `centerAriaLabel?: string` (default `System bar content`)
- `endAriaLabel?: string` (default `System actions`)
- `zIndex?: string | number`

## Slots

- `start`
- `center` (or default slot)
- `end`

## Example

```vue
<SystemBar sticky>
    <template #start>Production</template>
    <template #center>EU-Central • 99.98% uptime</template>
    <template #end><Button size="sm">Status</Button></template>
</SystemBar>
```

## Tokens

- `height`, `denseHeight`
- `padding`, `densePadding`
- `gap`, `sectionGap`
- `borderColor`, `backgroundColor`, `textColor`
- `zIndex`
