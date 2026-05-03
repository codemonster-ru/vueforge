# @codemonster-ru/vueforge-layouts

[![npm](https://img.shields.io/npm/v/@codemonster-ru/vueforge-layouts)](https://www.npmjs.com/package/@codemonster-ru/vueforge-layouts)
[![downloads](https://img.shields.io/npm/dw/@codemonster-ru/vueforge-layouts)](https://www.npmjs.com/package/@codemonster-ru/vueforge-layouts)
[![license](https://img.shields.io/npm/l/@codemonster-ru/vueforge-layouts)](LICENSE)

Layout primitives, shell components, and responsive composables for Vue 3.

## Installation

```bash
npm install @codemonster-ru/vueforge-core @codemonster-ru/vueforge-layouts
```

```ts
import "@codemonster-ru/vueforge-core/foundation.css";
import "@codemonster-ru/vueforge-layouts/styles.css";
```

## Usage

```ts
import VueForgeLayouts, {
  defaultLayoutsPreset,
  type VfLayoutThemeConfig,
  VfAppShell,
  VfAsideArea,
  VfContainer,
  VfContentArea,
  VfDocumentLayout,
  VfErrorLayout,
  VfFooterArea,
  VfGrid,
  VfHeaderArea,
  VfInline,
  VfSection,
  VfSidebarArea,
  VfStack,
  vfBreakpoints,
  useBreakpoint,
  useBreakpointValue,
  useBreakpoints
} from "@codemonster-ru/vueforge-layouts";
```

```ts
app.use(VueForgeLayouts, {
  theme: {
    layouts: {
      preset: defaultLayoutsPreset,
      extend: {
        shellSidebarWidth: "19rem",
        headerBackground: "#ffffff"
      }
    }
  }
});
```

```ts
app.use(VueForgeLayouts, {
  defaultTheme: "system",
  themeStorageKey: "vf-theme",
  themeAttribute: "data-vf-theme",
  theme: {
    layouts: {
      preset: defaultLayoutsPreset,
      extend: {
        shellSidebarWidth: "19rem",
        headerBackground: "#ffffff"
      }
    },
    core: {
      extend: {
        colorPrimary: "#ff5a36"
      }
    }
  }
});
```

```ts
import {
  VfAppShell,
  VfAsideArea,
  VfContainer,
  VfContentArea,
  VfDocumentLayout,
  VfErrorLayout,
  VfFooterArea,
  VfGrid,
  VfHeaderArea,
  VfInline,
  VfSection,
  VfSidebarArea,
  VfStack
} from "@codemonster-ru/vueforge-layouts";
```

```vue
<VfAppShell
  layout="sidebar-content-aside"
  :show-subheader="showMobileActions"
  :show-content-subheader="showMobileContentActions"
  :sidebar-collapsed="isSidebarCollapsed"
  @update:sidebar-collapsed="isSidebarCollapsed = $event"
>
  <template #header>
    Header
  </template>

  <template #subheader>
    Mobile actions
  </template>

  <template #sidebar>
    Sidebar
  </template>

  <template #content-subheader>
    Content actions
  </template>

  <template #default>
    Content
  </template>

  <template #aside>
    Aside
  </template>

  <template #footer>
    Footer
  </template>
</VfAppShell>
```

```vue
<VfDocumentLayout
  layout="sidebar-content-aside"
  edge-notches
  :show-subheader="showMobileActions"
  :show-content-subheader="showMobileContentActions"
>
  <template #header>
    Header
  </template>

  <template #subheader>
    Mobile actions
  </template>

  <template #content-subheader>
    Content actions
  </template>

  <template #sidebar>
    Sidebar
  </template>

  <template #default>
    Content
  </template>

  <template #aside>
    Aside
  </template>

  <template #footer>
    Footer
  </template>
</VfDocumentLayout>
```

```vue
<VfErrorLayout
  code="404"
  title="Page not found"
  description="The page you requested does not exist."
>
  <template #actions>
    <a href="/">Go home</a>
  </template>
</VfErrorLayout>
```

```ts
const layoutTheme: VfLayoutThemeConfig = {
  preset: defaultLayoutsPreset,
  extend: {
    shellSidebarWidth: "19rem",
    contentBackground: "#ffffff"
  }
};
```

## Notes

- `VfDocumentLayout` is intended for bounded page layouts where header, content, and footer share the same `VfContainer` width.
- `VueForgeLayouts` provides optional install-time theme application for both layout tokens and the `vueforge-core` tokens that affect layout styling.
- `VueForgeLayouts` also forwards `defaultTheme`, `themeStorageKey`, and `themeAttribute` to `vueforge-core`, so `VfThemeProvider` can use the same `app.use(...)` config.
- `theme.layouts` customizes layout-specific tokens.
- `theme.core` lets `VueForgeLayouts` override `vueforge-core` tokens from the same `app.use(...)` call.
- `VfAppShell` is layout-only and supports controlled or uncontrolled sidebar collapsed state.
- `VfDocumentLayout` supports optional `edgeNotches` for small decorative triangular join markers on header/footer edges.
- `VfAppShell` supports optional `subheader` and `content-subheader` slots controlled by `showSubheader` and `showContentSubheader`.
- `VfDocumentLayout` supports optional `subheader` slot controlled by `showSubheader`.
- `VfDocumentLayout` supports optional `content-subheader` slot controlled by `showContentSubheader`.
- `VfErrorLayout` provides a reusable error-page scaffold with optional `code`, `title`, `description`, and `actions` content.
- `VfHeaderArea` supports `sticky`.
- `VfSidebarArea` supports `appearance="default|plain"`.
- `VfAsideArea` supports `appearance="default|plain"`.
- `VfContentArea` supports `padded`.
- Styling is class-based and token-based. The package does not expose per-instance spacing props.
- Responsive helpers come from `@codemonster-ru/vueforge-core/foundation`.
- Layout tokens can also be configured at runtime with `createLayoutsPreset` and `applyLayoutsThemeConfig`.
- Baseline layout CSS variables are generated from `defaultLayoutsPreset` into `.generated/theme/layout-tokens.css`, so runtime defaults and CSS fallbacks stay in sync.
- Shell chrome can be customized through layout tokens such as `appBackground`, `headerBackground`, `contentSubheaderBackground`, `sidebarBackground`, `asideBackground`, and matching border tokens.
- Mobile drawer behavior is no longer built into `VfAppShell`; compose overlays separately with `VfDrawer` from `vueforge-core` when needed.

## Tokens

The package exposes a small layout token layer on top of Vueforge core:

```css
:root {
  --vf-space-layout-base: 1rem;
  --vf-space-layout-roomy: 1.5rem;
  --vf-shell-area-padding-block: var(--vf-space-layout-base);
  --vf-shell-area-padding-inline: var(--vf-space-layout-base);
  --vf-shell-sidebar-width: 18rem;
  --vf-shell-aside-width: 20rem;
  --vf-shell-header-height: 4rem;
  --vf-subheader-height: 2.25rem;
  --vf-content-subheader-height: var(--vf-subheader-height);
  --vf-content-subheader-background: var(--vf-header-background);
  --vf-content-subheader-border: var(--vf-header-border);
  --vf-content-background: var(--vf-surface-base);
}
```

## License

[MIT](LICENSE)

## Author

[@KolesnikovKirill](https://github.com/kolesnikovKirill)
