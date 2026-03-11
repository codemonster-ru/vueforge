# Must-have Parity A11y Regression

Purpose: track keyboard and ARIA coverage for `P1.11` must-have parity scope.

Regression suite:

- `tests/integration/must-have-parity-a11y.test.ts`

Per-component references:

| Component                      | Keyboard contract                          | ARIA contract                                | Regression references                                                                                                 |
| ------------------------------ | ------------------------------------------ | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| DialogService / ConfirmService | Renderer-level (consumer overlay controls) | Renderer-level                               | `docs/components/dialogservice-confirmservice.md` + service tests                                                     |
| TreeTable                      | Arrow/Home/End/Enter                       | `treegrid`, row state attrs                  | `packages/vueforge/src/components/__tests__/tree-table.test.ts`, `tests/integration/must-have-parity-a11y.test.ts`    |
| DataView                       | Native button keyboard on controls         | `list`/`grid`, `aria-pressed`                | `packages/vueforge/src/components/__tests__/data-view.test.ts`, `tests/integration/must-have-parity-a11y.test.ts`     |
| Listbox                        | Arrow/Home/End/Enter/Space                 | `listbox`/`option`, `aria-selected`          | `packages/vueforge/src/components/__tests__/listbox.test.ts`, `tests/integration/must-have-parity-a11y.test.ts`       |
| MenuBar                        | Menu keyboard via `Menu`                   | `nav` landmark                               | `packages/vueforge/src/components/__tests__/menu-bar.test.ts`, `tests/integration/must-have-parity-a11y.test.ts`      |
| MegaMenu                       | Enter/Space/Arrow/Escape                   | `menubar`, trigger `aria-expanded`           | `packages/vueforge/src/components/__tests__/mega-menu.test.ts`, `tests/integration/must-have-parity-a11y.test.ts`     |
| PanelMenu                      | Enter/Space on toggles                     | `tree`, `aria-expanded`                      | `packages/vueforge/src/components/__tests__/panel-menu.test.ts`, `tests/integration/must-have-parity-a11y.test.ts`    |
| Carousel                       | Arrow/Home/End                             | `region` + `aria-roledescription="carousel"` | `packages/vueforge/src/components/__tests__/carousel.test.ts`, `tests/integration/must-have-parity-a11y.test.ts`      |
| SpeedDial                      | Enter/Space/Escape + Arrow/Home/End        | `menu`/`menuitem`, trigger `aria-expanded`   | `packages/vueforge/src/components/__tests__/speed-dial.test.ts`, `tests/integration/must-have-parity-a11y.test.ts`    |
| Image                          | Escape close for preview dialog            | trigger label + dialog semantics             | `packages/vueforge/src/components/__tests__/image.test.ts`, `tests/integration/must-have-parity-a11y.test.ts`         |
| Skeleton advanced presets      | N/A (non-interactive)                      | `aria-hidden` placeholder semantics          | `packages/vueforge/src/components/__tests__/skeleton.test.ts`                                                         |
| OverlayPanel alias             | Escape/outside dismiss via `Popover`       | inherits `Popover` ARIA contract             | `packages/vueforge/src/components/__tests__/overlay-panel.test.ts`, `tests/integration/must-have-parity-a11y.test.ts` |
| Pass-through / unstyled API    | N/A (infrastructure)                       | N/A                                          | `packages/vueforge/src/components/__tests__/image.test.ts` (`pt`/`unstyled`)                                          |
