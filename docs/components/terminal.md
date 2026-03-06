# Terminal

Terminal displays command history and output in a terminal-style log surface.

## Import

```ts
import Terminal from '@/package/components/terminal.vue';
```

## Examples

### Basic

Use `Terminal` for deploy logs, job output, and internal tooling consoles.

```vue
<Terminal :entries="logs" aria-label="Deploy log" />
```

### Copy And Clear

Enable toolbar actions when operators need to reuse or reset the visible log.

```vue
<Terminal
    :entries="logs"
    copyable
    clearable
    @copy="onCopy"
    @clear="logs = []"
/>
```

### Custom Entry Rendering

Use the `entry` slot when each log item needs richer formatting or badges.

```vue
<Terminal :entries="logs">
    <template #entry="{ entry }">
        <div>{{ entry.command }}</div>
        <pre>{{ entry.output }}</pre>
    </template>
</Terminal>
```

## API

### Types

```ts
interface TerminalEntry {
    id?: string | number;
    command?: string;
    output?: string;
    timestamp?: string;
    severity?: 'neutral' | 'info' | 'success' | 'warn' | 'error';
}
```

### Props

| Name | Type | Default |
| --- | --- | --- |
| `entries` | `TerminalEntry[]` | `[]` |
| `prompt` | `string` | `'$'` |
| `showTimestamps` | `boolean` | `true` |
| `maxHeight` | `string` | `'20rem'` |
| `clearable` | `boolean` | `false` |
| `copyable` | `boolean` | `false` |
| `autoScroll` | `boolean` | `true` |
| `disabled` | `boolean` | `false` |
| `ariaLabel` | `string` | `'Terminal log'` |
| `emptyText` | `string` | `'No command output yet'` |
| `clearLabel` | `string` | `'Clear'` |
| `copyLabel` | `string` | `'Copy log'` |

### Events

| Name | Payload |
| --- | --- |
| `clear` | none |
| `copy` | `{ text }` |
| `entryClick` | `{ entry, index, event }` |

### Slots

| Name | Description |
| --- | --- |
| `actions` | Replaces toolbar actions. |
| `entry` | Custom entry rendering with `{ entry, index }`. |
| `empty` | Replaces the empty state. |

## Theming

Override component tokens through `theme.overrides.components.terminal`.

## Tokens

- Surface: `borderColor`, `borderRadius`, `backgroundColor`, `textColor`, `fontFamily`, `fontSize`
- Toolbar: `toolbarPadding`, `actionsGap`, `dividerColor`, `actionBorderColor`, `actionRadius`, `actionBackgroundColor`, `actionTextColor`, `actionPadding`
- Body and entries: `bodyPadding`, `entryGap`, `timeFontSize`, `timeColor`, `promptColor`
- Severity colors: `entryNeutralColor`, `entryInfoColor`, `entrySuccessColor`, `entryWarnColor`, `entryErrorColor`, `emptyColor`, `disabledOpacity`

## Recipes

- Use `autoScroll` for live logs and disable it when operators need to inspect older output without forced jumping.
- Keep copy behavior as a convenience, not as the only way to extract machine-readable output.

## Accessibility

- The log body uses `role="log"` with `aria-live="polite"`.
- If log entries are clickable, make sure the surrounding workflow explains what clicking an entry does.
