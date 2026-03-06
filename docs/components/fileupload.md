# FileUpload

FileUpload handles file selection, drag and drop, validation limits, and an optional chunked upload pipeline with retry state.

## Import

```ts
import FileUpload from '@/package/components/file-upload.vue';
```

## Examples

### Basic

Use `v-model` for local file selection with size and count limits.

```vue
<FileUpload v-model="attachments" multiple :max-files="5" :max-size="10_000_000" />
```

### Drag And Drop

The component supports drag and drop by default, so it can act as a dropzone without extra wiring.

```vue
<FileUpload
    v-model="files"
    multiple
    placeholder="Drop product assets here or click to browse"
    button-label="Select files"
/>
```

### Advanced Upload Pipeline

Enable `advanced` when uploads should show progress, retries, and chunked transport.

```vue
<FileUpload
    v-model="attachments"
    multiple
    advanced
    :chunk-size="4_000_000"
    :max-retries="3"
    :signed-url-resolver="resolveSignedUrl"
    :upload-request="uploadChunk"
    upload-button-label="Start upload"
/>
```

### Auto Upload

Use `autoUpload` when selected files should begin uploading immediately.

```vue
<FileUpload
    v-model="attachments"
    multiple
    advanced
    auto-upload
    :upload-request="uploadChunk"
/>
```

## API

### Props

| Name | Type | Default |
| --- | --- | --- |
| `modelValue` | `File \| File[] \| null` | `null` |
| `multiple` | `boolean` | `false` |
| `accept` | `string \| undefined` | `undefined` |
| `disabled` | `boolean` | `false` |
| `readonly` | `boolean` | `false` |
| `maxSize` | `number \| undefined` | `undefined` |
| `maxFiles` | `number \| undefined` | `undefined` |
| `placeholder` | `string` | `'Drop files here or click to browse'` |
| `buttonLabel` | `string` | `'Browse'` |
| `size` | `'small' \| 'normal' \| 'large'` | `'normal'` |
| `variant` | `'filled' \| 'outlined'` | `'filled'` |
| `advanced` | `boolean` | `false` |
| `autoUpload` | `boolean` | `false` |
| `chunkSize` | `number` | `5000000` |
| `maxRetries` | `number` | `2` |
| `uploadButtonLabel` | `string` | `'Upload'` |
| `signedUrlResolver` | upload resolver function \| `undefined` | `undefined` |
| `uploadRequest` | upload transport function \| `undefined` | `undefined` |

### Events

| Name | Payload |
| --- | --- |
| `update:modelValue` | `File \| File[] \| null` |
| `change` | selected file payload |
| `reject` | `Array<{ file, reason, maxSize?, maxFiles? }>` |
| `focus` | `FocusEvent` |
| `blur` | `FocusEvent` |
| `uploadStart` | `file, { key, totalChunks, totalBytes }` |
| `uploadProgress` | `file, { key, uploadedBytes, totalBytes, progress, chunkIndex, totalChunks }` |
| `uploadSuccess` | `file, { key, uploadedBytes, totalBytes, retries }` |
| `uploadError` | `file, { key, error, chunkIndex, retries }` |
| `uploadComplete` | `{ total, success, failed }` |

## Theming

Override component tokens through `theme.overrides.components.fileUpload`.

## Tokens

- Surface and states: `minHeight`, `fontSize`, `gap`, `padding`, `borderRadius`, `borderColor`, `backgroundColor`, `textColor`, `placeholderColor`, `focusBorderColor`, `hoverBorderColor`, `focusRingShadow`, `disabledOpacity`, `dragBackgroundColor`
- Files and list: `listGap`, `itemPadding`, `itemBorderColor`, `itemBackgroundColor`, `itemRadius`, `itemTextColor`, `sizeTextColor`
- Buttons: `buttonPadding`, `buttonRadius`, `buttonBorderColor`, `buttonBackgroundColor`, `buttonTextColor`, `buttonHoverBackgroundColor`
- Remove affordance: `removeSize`, `removeRadius`, `removeHoverBackgroundColor`
- Size variants: `small.*`, `large.*`

## Recipes

- Use FileUpload for attachments, asset libraries, import workflows, and chunked uploads to signed URLs.
- Keep `advanced=false` for simple forms where upload is handled only after form submission.

## Accessibility

- The main control behaves like a focusable button and supports keyboard-triggered file selection.
- Disabled and readonly states remove interaction while preserving current file list visibility.
- Rejected files and upload errors should be paired with app-level messaging when the workflow requires explicit user feedback.

