# Must-have Parity A11y Regression

Purpose: track keyboard and ARIA coverage for `P1.11` must-have parity scope.

Regression suite:

- `src/package/components/__tests__/must-have-parity-a11y.test.ts`

Per-component references:

| Component                      | Keyboard contract                          | ARIA contract                                | Regression references                                                                                                      |
| ------------------------------ | ------------------------------------------ | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| DialogService / ConfirmService | Renderer-level (consumer overlay controls) | Renderer-level                               | `docs/components/dialogservice-confirmservice.md` + service tests                                                          |
| TreeTable                      | Arrow/Home/End/Enter                       | `treegrid`, row state attrs                  | `src/package/components/__tests__/tree-table.test.ts`, `src/package/components/__tests__/must-have-parity-a11y.test.ts`    |
| DataView                       | Native button keyboard on controls         | `list`/`grid`, `aria-pressed`                | `src/package/components/__tests__/data-view.test.ts`, `src/package/components/__tests__/must-have-parity-a11y.test.ts`     |
| Listbox                        | Arrow/Home/End/Enter/Space                 | `listbox`/`option`, `aria-selected`          | `src/package/components/__tests__/listbox.test.ts`, `src/package/components/__tests__/must-have-parity-a11y.test.ts`       |
| MenuBar                        | Menu keyboard via `Menu`                   | `nav` landmark                               | `src/package/components/__tests__/menu-bar.test.ts`, `src/package/components/__tests__/must-have-parity-a11y.test.ts`      |
| MegaMenu                       | Enter/Space/Arrow/Escape                   | `menubar`, trigger `aria-expanded`           | `src/package/components/__tests__/mega-menu.test.ts`, `src/package/components/__tests__/must-have-parity-a11y.test.ts`     |
| PanelMenu                      | Enter/Space on toggles                     | `tree`, `aria-expanded`                      | `src/package/components/__tests__/panel-menu.test.ts`, `src/package/components/__tests__/must-have-parity-a11y.test.ts`    |
| Carousel                       | Arrow/Home/End                             | `region` + `aria-roledescription="carousel"` | `src/package/components/__tests__/carousel.test.ts`, `src/package/components/__tests__/must-have-parity-a11y.test.ts`      |
| SpeedDial                      | Enter/Space/Escape + Arrow/Home/End        | `menu`/`menuitem`, trigger `aria-expanded`   | `src/package/components/__tests__/speed-dial.test.ts`, `src/package/components/__tests__/must-have-parity-a11y.test.ts`    |
| Chart                          | N/A (non-interactive canvas wrapper)       | `role="img"` + label                         | `src/package/components/__tests__/chart.test.ts`, `src/package/components/__tests__/must-have-parity-a11y.test.ts`         |
| Image                          | Escape close for preview dialog            | trigger label + dialog semantics             | `src/package/components/__tests__/image.test.ts`, `src/package/components/__tests__/must-have-parity-a11y.test.ts`         |
| Skeleton advanced presets      | N/A (non-interactive)                      | `aria-hidden` placeholder semantics          | `src/package/components/__tests__/skeleton.test.ts`                                                                        |
| OverlayPanel alias             | Escape/outside dismiss via `Popover`       | inherits `Popover` ARIA contract             | `src/package/components/__tests__/overlay-panel.test.ts`, `src/package/components/__tests__/must-have-parity-a11y.test.ts` |
| Pass-through / unstyled API    | N/A (infrastructure)                       | N/A                                          | `src/package/components/__tests__/image.test.ts` (`pt`/`unstyled`)                                                         |
