# Component Rollout Plan

Last updated: 2026-02-26

Purpose: execute full quality hardening and implementation coverage for all component scope (implemented and planned) with PR-sized batches.

Quality gate for every package:

- All touched rows in compliance matrix are `Yes` (or justified `N/A`) across `DoD`, `Tests`, `A11y`, `SSR/Hydration`, `Responsive`, `Visual`, `Docs`, `Catalog`.
- `npm run lint`, `npm run typecheck`, targeted `npm run test`, `npm run test:ssr`, and `npm run test:visual` are green.
- Docs include API updates and at least one production-style recipe for touched component group.

## Implemented Components Backfill

Wave 1 status:

- Completed: `W1-PR1`, `W1-PR2`, `W1-PR3`, `W1-PR4`, `W1-PR5`, `W1-PR6`.

Wave 2 status:

- Completed: `W2-PR1`, `W2-PR2`, `W2-PR3`, `W2-PR4`, `W2-PR5`, `W2-PR6`, `W2-PR7`, `W2-PR8`.

Wave 3 status:

- Completed: `W3-PR1`, `W3-PR2`, `W3-PR3`.

Wave 4 status:

- Completed: `W4-PR1`, `W4-PR2`, `W4-PR3`, `W4-PR4`, `W4-PR5`, `W4-PR6`, `W4-PR7`, `W4-PR8`, `W4-PR9`, `W4-PR10`, `W4-PR11`, `W4-PR12`, `W4-PR13`, `W4-PR14`.

Wave 2 packages (forms, input families, date/time, overlays):

- `W2-PR1` Input core: `Input`, `Textarea`, `PasswordInput`, `NumberInput`, `SearchInput`, `MaskedInput`, `MentionInput`, `OtpInput`.
- `W2-PR2` Form composition: `Form`, `FormField`, `InputGroup`, `InputAddon`, `InlineEdit`, `Checkbox`, `Switch`, `RadioGroup`, `RadioButton`.
- `W2-PR3` Selection family: `Select`, `Autocomplete`, `Combobox`, `MultiSelect`, `TagInput`, `TreeSelect`.
- `W2-PR4` Date/time family: `DatePicker`, `DateRangePicker`, `DateTimePicker`, `TimePicker`, `Calendar`.
- `W2-PR5` Navigation/disclosure controls: `Tabs`, `Tab`, `TabPanel`, `Accordion`, `AccordionItem`, `Stepper`, `Wizard`, `WizardStep`, `Pagination`.
- `W2-PR6` Overlay baseline: `Modal`, `Drawer`, `Dropdown`, `Popover`, `Tooltip`, `ContextMenu`, `ConfirmDialog`.
- `W2-PR7` Feedback and status: `Alert`, `Toast`, `ToastContainer`, `Timeline`, `Badge`, `Chip`, `Avatar` (`Progress` hardening only; baseline implementation is in `W1-PR5`).
- `W2-PR8` Utility controls: `Slider`, `Splitter`, `SplitterPanel`.

Wave 3 packages (data-heavy and DX):

- `W3-PR1` Data-heavy core: `DataTable`, `VirtualScroller`, `Tree`.
- `W3-PR2` Workspace and command UX: `KanbanBoard`, `CommandPalette`, `NotificationCenter`, `FilterChips`.
- `W3-PR3` Content and file workflows: `FileUpload`, `RichTextEditor`, `Rating`, `Tour`.

Wave 4 packages (remaining implemented coverage closure):

- `W4-PR1` Remaining implemented components reconciliation and matrix closure.
- `W4-PR2` Final green pass: matrix-wide validation, docs consistency pass, and checklist closure.
- `W4-PR3` Service parity baseline: `DialogService`, `ConfirmService`.
- `W4-PR4` Tree/data parity baseline: `TreeTable`.
- `W4-PR5` Data presentation parity baseline: `DataView`.
- `W4-PR6` Selection parity baseline: `Listbox`.
- `W4-PR7` Navigation parity baseline: `MenuBar`.
- `W4-PR8` Navigation expansion baseline: `MegaMenu`.
- `W4-PR9` Navigation tree baseline: `PanelMenu`.
- `W4-PR10` Media parity baseline: `Carousel`.
- `W4-PR11` Floating action parity baseline: `SpeedDial`.
- `W4-PR12` Visualization wrapper baseline: `Chart`.
- `W4-PR13` Media preview baseline: `Image`.
- `W4-PR14` Overlay alias parity baseline: `OverlayPanel`.

## Planned Components Implementation Tracks

Track A (services, overlays, menu/navigation parity):

- `P-PR1`: `ConfirmPopup`, `DynamicDialog`, `Sidebar`.
- `P-PR2`: `TieredMenu`, `TabMenu`, `BottomNavigation`, `SystemBar`.

Track B (selection/data-view and table parity):

- `P-PR3`: `CascadeSelect`.
- `P-PR4`: `PickList`, `OrderList`, `Panel`, `Fieldset`, `Toolbar`, `BlockUI`, `ScrollPanel`, `ScrollTop`.

Track C (media and visualization):

- `P-PR5`: `Galleria`, `Dock`, `Terminal`, `Inplace`, `OverlayBadge`, `InlineMessage`, `Message`, `OrgChart`.
- `P-PR6`: visualization expansions from checklist (`BarChart`, `LineChart`, `AreaChart`, `PieChart`, `DonutChart`, `ScatterChart`, `BubbleChart`, `Histogram`, `Heatmap`, `RadarChart`, `FunnelChart`, `TreemapChart`, `GaugeChart`, `CandlestickChart`, `Sparkline`, `ComposableChart`, `TimeSeriesPanel`, `GeoMap`, `NetworkGraph`, `SankeyDiagram`, `BoxPlot`, `ErrorBar`).

Track D (SaaS workflow components):

- `P-PR7`: `QueryBuilder`, `AdvancedFilterPanel`, `SavedViewsManager`, `DataTableToolbar`, `BulkActionBar`.
- `P-PR8`: `ActivityFeed`, `AuditLogViewer`, `CommentThread`, `MemberPicker`, `PermissionMatrix`, `KPIStatCard`.
- `P-PR9`: `FileManager`, `JSONViewer`, `DiffViewer`, `CodeEditor`, `Scheduler`, `BottomSheet`, `InfiniteScroll`.

Track E (foundation, providers, utilities, styling contracts):

- `P-PR10`: `ThemeProvider`, `DefaultsProvider`, `LocaleProvider`, `NoSsr`, `MainLayoutRegion`, `Sheet`, `Window`, `SlideGroup`, `SnackbarQueue`, `Banner`.
- `P-PR11`: `AvatarGroup`, `FloatLabel`, `IftaLabel`, `IconField`, `InputIcon`, `SelectionControl`, `SelectionControlGroup`, `ToggleButton`.
- `P-PR12`: `Hover`, `Hotkey`, `Kbd`, `CodeBlock`, `Lazy`, `Parallax`, `Validation`, `PassThrough`, `Icon`.

Execution rule:

- Any component introduced in planned tracks must be added to `docs/audits/component-catalog-mapping.md` and transitioned from `docs/audits/planned-component-compliance-matrix.md` to `docs/audits/component-compliance-matrix.md` only after quality gates are complete.

Alias-only ownership rule (rollout):

| Alias-facing item | Canonical owner           | Canonical rollout owner | Alias rollout scope                     |
| ----------------- | ------------------------- | ----------------------- | --------------------------------------- |
| `Dropdown`        | `Select`                  | `W2-PR3`                | `W2-PR6` compatibility alias only       |
| `OverlayPanel`    | `Popover`                 | `W2-PR6`                | `W4-PR14` alias-parity hardening only   |
| `Sidebar`         | `Drawer`                  | `W2-PR6`                | `P-PR1` alias API continuity only       |
| `Message`         | `Alert` / `InlineMessage` | `W2-PR7`                | `P-PR5` naming parity only              |
| `TieredMenu`      | `Menu`                    | `W1-PR3`                | `P-PR2` hierarchical preset parity only |
