# BottomSheet

BottomSheet presents mobile-first actions and contextual details in a bottom-anchored surface without fully replacing page context.

## Import

```ts
import BottomSheet from '@/package/components/bottom-sheet.vue';
```

## Examples

### Basic

Use `v-model` to control visibility. In docs preview, this example starts open so the sheet is visible immediately.

```vue
<BottomSheet v-model="open" title="Quick actions">
    <template #body>
        <p>Run mobile-first contextual actions here.</p>
    </template>
</BottomSheet>
```

### Header And Footer

Use named slots when the sheet needs custom chrome or persistent footer actions.

```vue
<BottomSheet v-model="open">
    <template #header>
        <div class="sheet-header">
            <h3>Invite collaborators</h3>
            <p>Share access without leaving the current page.</p>
        </div>
    </template>

    <template #body>
        <Input placeholder="Email address" />
    </template>

    <template #footer>
        <Button variant="outlined" @click="open = false">
            Cancel
        </Button>
        <Button>
            Send invite
        </Button>
    </template>
</BottomSheet>
```

### Sizes

Pick `sm`, `md`, or `lg` to match the amount of content shown in the sheet.

```vue
<BottomSheet v-model="open" title="Filters" size="lg">
    <template #body>
        <FilterPanel />
    </template>
</BottomSheet>
```

### Dismiss Behavior

Disable overlay or escape close when the flow should stay explicit.

```vue
<BottomSheet
    v-model="open"
    title="Confirm publish"
    :close-on-overlay="false"
    :close-on-esc="false"
>
    <template #footer>
        <Button variant="outlined" @click="open = false">
            Review again
        </Button>
        <Button>
            Publish
        </Button>
    </template>
</BottomSheet>
```

## API

### Props

| Name | Type | Default |
| --- | --- | --- |
| `modelValue` | `boolean` | `false` |
| `title` | `string` | `''` |
| `overlay` | `boolean` | `true` |
| `closeOnOverlay` | `boolean` | `true` |
| `closeOnEsc` | `boolean` | `true` |
| `showClose` | `boolean` | `true` |
| `lockScroll` | `boolean` | `true` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |

### Events

| Name | Payload |
| --- | --- |
| `update:modelValue` | `boolean` |
| `open` | none |
| `close` | none |

### Slots

| Name | Description |
| --- | --- |
| `header` | Replaces the built-in header content. |
| `body` | Overrides the body wrapper; falls back to the default slot. |
| `default` | Main sheet content. |
| `footer` | Footer actions area. |
| `close` | Custom close control with `{ close }` slot props. |

## Theming

Override component tokens through `theme.overrides.components.bottomSheet`.

## Tokens

- Surface and layering: `zIndex`, `maxWidth`, `maxHeight`, `minHeightSm`, `minHeight`, `minHeightLg`, `borderRadius`, `backgroundColor`, `textColor`, `overlayBackgroundColor`, `shadow`
- Safe area and handle: `safeAreaBottom`, `handleWidth`, `handleHeight`, `handleColor`, `handleMargin`
- Header and title: `headerGap`, `headerPadding`, `titleFontSize`, `titleLineHeight`, `titleFontWeight`
- Close button: `closeSize`, `closeRadius`, `closeColor`, `closeFontSize`, `closeHoverBackgroundColor`
- Body and footer: `bodyPadding`, `footerPadding`, `footerGap`

## Recipes

- Use BottomSheet for mobile row actions, quick detail reveal, and lightweight confirmation flows.
- Prefer `Modal` when the content is desktop-first or should clearly interrupt the page.

## Accessibility

- Focus is trapped while the sheet is open and restored to the previous trigger on close.
- Escape and overlay dismissal are configurable for flows that require explicit confirmation.
