# Footer

Footer provides a consistent footer layout with left, center, and right content regions.

## Import

```ts
import Footer from '@/package/components/footer.vue';
```

## Examples

### Region Layout

Use named regions when a shell or page footer needs stable alignment for metadata and links.

```vue
<Footer>
    <template #left>
        © 2026 Codemonster
    </template>
    <template #center>
        <a href="/status">Status</a>
    </template>
    <template #right>
        <a href="/terms">Terms</a>
    </template>
</Footer>
```

### Default Slot

Use the default slot when the footer is a single compact content block.

```vue
<Footer>
    Built with VueForge
</Footer>
```

### Dense

Use `dense` for compact shells and admin workspaces where vertical space is tight.

```vue
<Footer dense bordered={false}>
    <template #left>Workspace footer</template>
</Footer>
```

## API

### Props

| Name | Type | Default |
| --- | --- | --- |
| `as` | `string` | `'footer'` |
| `bordered` | `boolean` | `true` |
| `dense` | `boolean` | `false` |
| `wrap` | `boolean` | `true` |
| `stackOnMobile` | `boolean` | `true` |
| `mobileBreakpoint` | `number` | `720` |
| `ariaLabel` | `string` | `''` |
| `groupAriaLabel` | `string` | `'Footer content'` |
| `leftAriaLabel` | `string` | `'Footer left section'` |
| `centerAriaLabel` | `string` | `'Footer center section'` |
| `rightAriaLabel` | `string` | `'Footer right section'` |

### Slots

| Name | Description |
| --- | --- |
| `left` | Left-aligned section. |
| `center` | Center-aligned section. |
| `right` | Right-aligned section. |
| `default` | Used only when named regions are absent. |

## Theming

Override component tokens through `theme.overrides.components.footer`.

## Tokens

- `minHeight`
- `denseMinHeight`
- `padding`
- `densePadding`
- `gap`
- `mobileGap`
- `sectionGap`
- `borderColor`
- `backgroundColor`
- `textColor`

## Recipes

- Use named regions for persistent app shells and the default slot for document-style or marketing footers.
- Keep mobile stacking enabled when footer content can wrap into multiple rows.

## Accessibility

- Native `footer` is used by default. Non-footer tags receive `role="contentinfo"`.
- Region groups expose explicit labels for screen-reader navigation.
