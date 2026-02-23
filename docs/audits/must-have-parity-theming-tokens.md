# Must-have Parity Theming Tokens Coverage

Purpose: confirm that must-have parity components expose theme tokens in runtime schema and document them in component API pages.

Validation sources:

- Runtime schema: `src/package/config/theme-core.ts` (`ThemeComponentTokens`)
- Default token presets: `src/package/themes/default/index.ts`
- Component docs token sections: `docs/components/*.md`

Coverage summary:

| Component          | Token key                  | Docs page                         |
| ------------------ | -------------------------- | --------------------------------- |
| TreeTable          | `treetable`                | `docs/components/treetable.md`    |
| DataView           | `dataview`                 | `docs/components/dataview.md`     |
| Listbox            | `listbox`                  | `docs/components/listbox.md`      |
| MenuBar            | `menubar`                  | `docs/components/menubar.md`      |
| MegaMenu           | `megamenu`                 | `docs/components/megamenu.md`     |
| PanelMenu          | `panelmenu`                | `docs/components/panelmenu.md`    |
| Carousel           | `carousel`                 | `docs/components/carousel.md`     |
| SpeedDial          | `speeddial`                | `docs/components/speeddial.md`    |
| Chart              | `chart`                    | `docs/components/chart.md`        |
| Image              | `image`                    | `docs/components/image.md`        |
| Skeleton presets   | `skeleton`                 | `docs/components/skeleton.md`     |
| OverlayPanel alias | `popover` / `overlaypanel` | `docs/components/overlaypanel.md` |

Notes:

- `OverlayPanel` intentionally reuses `Popover` rendering/token contract and keeps an alias key for override compatibility.
- Service-only items (`DialogService`, `ConfirmService`) are non-visual and do not own theme token sets.
