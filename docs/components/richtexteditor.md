# RichTextEditor

RichTextEditor is a lightweight textarea-based authoring surface with formatting actions, markdown or HTML output, counters, and paste sanitization.

## Import

```ts
import RichTextEditor from '@/package/components/rich-text-editor.vue';
```

## Examples

### Markdown Editing

Use markdown mode for comment systems, docs tooling, and lightweight editorial inputs.

```vue
<RichTextEditor
    v-model="article"
    format="markdown"
    :rows="8"
    :max-length="2000"
    :toolbar="['bold', 'italic', 'link', 'bulletList', 'code']"
/>
```

### HTML Editing

Switch to `html` when downstream rendering expects sanitized HTML fragments.

```vue
<RichTextEditor
    v-model="htmlBody"
    format="html"
    sanitization-profile="strict"
    :sanitize-on-paste="true"
/>
```

### Minimal Toolbar

Restrict toolbar actions when the content model is intentionally simple.

```vue
<RichTextEditor
    v-model="summary"
    :toolbar="['bold', 'italic', 'link']"
    toolbar-label="Summary formatting"
/>
```

### Readonly Review

Use `readonly` to preserve content visibility while disabling edits and toolbar interactions.

```vue
<RichTextEditor v-model="content" readonly :show-toolbar="false" aria-label="Review content" />
```

## API

### Types

```ts
type RichTextEditorAction =
    | 'bold'
    | 'italic'
    | 'underline'
    | 'link'
    | 'bulletList'
    | 'orderedList'
    | 'code';
```

### Props

| Name | Type | Default |
| --- | --- | --- |
| `modelValue` | `string` | `''` |
| `placeholder` | `string` | `''` |
| `disabled` | `boolean` | `false` |
| `readonly` | `boolean` | `false` |
| `size` | `'small' \| 'normal' \| 'large'` | `'normal'` |
| `variant` | `'filled' \| 'outlined'` | `'filled'` |
| `format` | `'markdown' \| 'html'` | `'markdown'` |
| `rows` | `number` | `6` |
| `maxLength` | `number` | `0` |
| `showToolbar` | `boolean` | `true` |
| `toolbar` | `RichTextEditorAction[]` | full default set |
| `toolbarLabel` | `string` | `'Text formatting toolbar'` |
| `ariaLabel` | `string` | `'Rich text editor'` |
| `sanitizeOnPaste` | `boolean` | `true` |
| `sanitizationProfile` | `'none' \| 'basic' \| 'strict'` | `'basic'` |

### Events

| Name | Payload |
| --- | --- |
| `update:modelValue` | `string` |
| `input` | input event |
| `change` | change event |
| `focus` | focus event |
| `blur` | blur event |
| `action` | `action, nextValue` |
| `pasteSanitized` | `{ profile, changed, format }` |

## Theming

Override component tokens through `theme.overrides.components.richTextEditor`.

## Tokens

- Surface: `gap`, `fontSize`, `padding`, `borderRadius`, `borderColor`, `backgroundColor`, `textColor`, `placeholderColor`, `focusBorderColor`, `focusRingShadow`, `hoverBorderColor`, `disabledOpacity`, `minHeight`, `resize`
- Toolbar: `toolbarGap`, `toolbarPadding`, `toolbarBorderColor`, `toolbarBackgroundColor`, `toolbarButtonMinWidth`, `toolbarButtonPadding`, `toolbarButtonRadius`, `toolbarButtonBorderColor`, `toolbarButtonBackgroundColor`, `toolbarButtonTextColor`, `toolbarButtonHoverBackgroundColor`, `toolbarButtonActiveBackgroundColor`
- Counter: `counterFontSize`, `counterColor`, `counterDangerColor`
- Size variants: `small.*`, `large.*`

## Recipes

- Use RichTextEditor for lightweight comments, internal docs, templates, and sanitized HTML fragments.
- Prefer `CodeEditor` when the content model is structured code rather than prose with inline formatting.

## Accessibility

- The toolbar uses `role="toolbar"` and the editing surface remains a native textarea.
- Paste sanitization preserves selection and emits explicit state for consumers that need auditing or analytics.
- Counter-based limits are visual only unless you pair them with form validation.

