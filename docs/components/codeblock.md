# CodeBlock

## Purpose

Read-only code snippet viewer with lightweight syntax highlighting, copy action, and custom action slot.

## Props

- `code?: string` (default `''`)
- `language?: string` (default `plaintext`)
- `filename?: string`
- `showHeader?: boolean` (default `true`)
- `showLineNumbers?: boolean` (default `false`)
- `copyable?: boolean` (default `true`)
- `copyLabel?: string` (default `Copy`)
- `copiedLabel?: string` (default `Copied`)
- `copiedDuration?: number` (default `1200`)
- `languageLabel?: string` (default `Language`)
- `disabled?: boolean` (default `false`)
- `wrap?: boolean` (default `false`)
- `highlight?: boolean` (default `true`)
- `maxHeight?: string`
- `ariaLabel?: string` (default `Code block`)

## Events

- `copy({ text })`

## Slots

- `actions` (custom header actions)

## Example

```vue
<CodeBlock language="ts" filename="api.ts" :show-line-numbers="true" code="const answer = 42;" @copy="onCopy" />
```

## Tokens

Override via `theme.overrides.components.codeBlock`:

- Surface/layout: `gap`, `borderColor`, `borderRadius`, `backgroundColor`, `textColor`, `fontFamily`, `fontSize`, `lineHeight`, `padding`
- Header/meta: `headerGap`, `headerPadding`, `headerBorderColor`, `metaGap`, `metaColor`, `metaFontSize`, `filenameColor`, `filenameFontWeight`
- Actions: `actionsGap`, `actionBorderColor`, `actionBorderRadius`, `actionBackgroundColor`, `actionTextColor`, `actionPadding`, `actionFontSize`
- Lines/tokens: `lineGap`, `lineNumberColor`, `lineNumberMinWidth`, `tokenKeywordColor`, `tokenStringColor`, `tokenNumberColor`, `tokenCommentColor`, `tokenVariableColor`
- States: `disabledOpacity`
