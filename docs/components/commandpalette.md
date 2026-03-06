# CommandPalette

CommandPalette provides a searchable global action launcher with scopes, recent commands, keyboard navigation, and optional entity search.

## Import

```ts
import CommandPalette from '@/package/components/command-palette.vue';
```

## Examples

### Basic

Use CommandPalette for app-wide navigation, quick actions, and fuzzy command lookup.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const open = ref(false);
const scope = ref('all');
const items = [
    { label: 'Open docs', value: 'docs', group: 'Navigation', scope: 'project' },
    { label: 'Save and publish', value: 'publish', group: 'Actions', scope: 'project', shortcut: 'Ctrl+Enter' },
];
</script>

<template>
    <CommandPalette v-model="open" v-model:scope="scope" :items="items" @select="onCommand" />
</template>
```

### Scoped Commands

Use scopes and scope tabs when the same palette serves multiple product domains.

```vue
<CommandPalette
    v-model="open"
    v-model:scope="scope"
    :items="items"
    :scopes="[
        { id: 'project', label: 'Project', aliases: ['p'] },
        { id: 'billing', label: 'Billing', aliases: ['b'] },
    ]"
/>
```

### Recent Commands

Persist recent usage locally to surface common actions before the user starts typing.

```vue
<CommandPalette
    v-model="open"
    :items="items"
    show-recent
    recent-storage-key="workspace.commandPalette.recent"
/>
```

### Entity Search

Use entity metadata when the palette should search live records in addition to static commands.

```vue
<CommandPalette
    v-model="open"
    :items="entityResults"
    entity-search
    @search="onSearch"
    @entitySearch="onEntitySearch"
/>
```

## API

### Types

```ts
interface CommandPaletteItem {
    label: string;
    value?: string | number;
    description?: string;
    shortcut?: string;
    group?: string;
    scope?: string;
    disabled?: boolean;
    keywords?: string[];
    entityType?: string;
    entityId?: string | number;
    entityKeywords?: string[];
    command?: () => void;
}

interface CommandPaletteScope {
    id: string;
    label: string;
    aliases?: string[];
}
```

### Props

| Name | Type | Default |
| --- | --- | --- |
| `modelValue` | `boolean \| undefined` | `undefined` |
| `items` | `CommandPaletteItem[]` | `[]` |
| `placeholder` | `string \| undefined` | `undefined` |
| `emptyText` | `string \| undefined` | `undefined` |
| `ariaLabel` | `string \| undefined` | `undefined` |
| `closeOnOverlay` | `boolean` | `true` |
| `closeOnEsc` | `boolean` | `true` |
| `closeOnSelect` | `boolean` | `true` |
| `filter` | `boolean` | `true` |
| `enableShortcut` | `boolean` | `true` |
| `shortcutKey` | `string` | `'k'` |
| `scopes` | `CommandPaletteScope[]` | `[]` |
| `scope` | `string` | `'all'` |
| `showScopeTabs` | `boolean` | `true` |
| `showRecent` | `boolean` | `true` |
| `recentLimit` | `number` | `6` |
| `recentStorageKey` | `string \| undefined` | `undefined` |
| `entitySearch` | `boolean` | `true` |

### Events

| Name | Payload |
| --- | --- |
| `update:modelValue` | `boolean` |
| `update:scope` | `string` |
| `update:recent` | recent keys payload |
| `open` | none |
| `close` | none |
| `select` | selected item payload |
| `search` | query string |
| `scopeChange` | scope id |
| `entitySearch` | entity search payload |

## Theming

Override component tokens through `theme.overrides.components.commandPalette`.

## Tokens

- Panel: `width`, `maxWidth`, `maxHeight`, `padding`, `borderRadius`, `borderColor`, `backgroundColor`, `textColor`, `overlayBackgroundColor`, `shadow`, `zIndex`
- Header and input: `headerGap`, `inputPadding`, `inputBorderRadius`, `inputBorderColor`, `inputBackgroundColor`, `inputTextColor`, `inputPlaceholderColor`, `inputFocusBorderColor`, `inputFocusRingShadow`
- Groups and items: `listGap`, `groupGap`, `groupLabelPadding`, `groupLabelColor`, `groupLabelFontSize`, `itemPadding`, `itemBorderRadius`, `itemGap`, `itemTextColor`, `itemDescriptionColor`, `itemDescriptionFontSize`, `itemActiveBackgroundColor`, `itemActiveTextColor`, `itemDisabledOpacity`
- Shortcut and empty state: `shortcutPadding`, `shortcutBorderRadius`, `shortcutBorderColor`, `shortcutBackgroundColor`, `shortcutTextColor`, `shortcutFontSize`, `emptyPadding`, `emptyColor`

## Recipes

- Use CommandPalette for `Cmd/Ctrl+K` app launchers, command-driven navigation, and search-first admin workflows.
- Keep `closeOnSelect` enabled for action palettes; disable it for search-style palettes that should stay open between selections.

## Accessibility

- CommandPalette renders a `dialog` and a `listbox`-style command list.
- Opening focuses the search input and closing restores focus to the previously active element.
- Keyboard support includes shortcut open, arrow navigation, `Enter` selection, and `Escape` dismissal.

