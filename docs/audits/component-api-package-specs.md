# Component API Package Specs

Last updated: 2026-02-26

Purpose: define API specifications for all rollout packages (implemented and planned) so implementation follows explicit contracts instead of ad-hoc decisions.

Source of truth:

- Rollout sequencing: `docs/audits/component-rollout-plan.md`
- Implemented quality status: `docs/audits/component-compliance-matrix.md`
- Planned quality status: `docs/audits/planned-component-compliance-matrix.md`
- Catalog scope and overlap policy: `docs/audits/component-catalog-mapping.md`

## API Contract Schema (Mandatory for Every Component)

Each component specification must include:

- `Purpose`: use-cases and non-goals.
- `Props`: name, type, default, required, controlled/uncontrolled behavior, responsive behavior.
- `Events`: payload types and emission timing.
- `Slots`: slot names and slot-prop contracts.
- `Accessibility`: roles, ARIA attributes, keyboard behavior, focus management.
- `Responsive`: mobile/tablet/desktop behavior, touch targets, overflow/wrapping strategy.
- `SSR/Hydration`: server output assumptions, client-only behavior boundaries.
- `Theming/Tokens`: tokens used and override strategy.
- `States`: empty/loading/error/disabled/readonly/interactive variants.
- `Testing`: required unit/integration/a11y/visual/SSR assertions.
- `Migration`: alias/deprecation notes when applicable.

Implementation gate:

- A package cannot be marked done until all its component specs are complete and reflected in compliance matrices.

## Competitor API Reference Workflow

Use competitor docs as input, not as copy source:

- PrimeVue: `https://primevue.org`
- Vuetify: `https://vuetifyjs.com`

For each planned component:

- Capture parity targets (must-have behaviors and API shapes).
- Record intentional deviations and rationale.
- Mark alias-first cases explicitly (`alias` vs `split` vs `merge`) per catalog mapping policy.

Alias-only ownership mapping (canonical package ownership):

| Alias-facing item | Canonical owner           | Owning package | Alias package note                                                        |
| ----------------- | ------------------------- | -------------- | ------------------------------------------------------------------------- |
| `Dropdown`        | `Select`                  | `W2-PR3`       | `W2-PR6` keeps compatibility API surface only.                            |
| `OverlayPanel`    | `Popover`                 | `W2-PR6`       | `W4-PR14` is alias-parity baseline, no separate rendering core ownership. |
| `Sidebar`         | `Drawer`                  | `W2-PR6`       | `P-PR1` covers alias parity behavior/docs only.                           |
| `Message`         | `Alert` / `InlineMessage` | `W2-PR7`       | `P-PR5` tracks naming parity, not a distinct behavior core.               |
| `TieredMenu`      | `Menu`                    | `W1-PR3`       | `P-PR2` tracks hierarchical preset parity only.                           |

## Implemented Package API Specs

### Wave 1 (Implemented Backfill)

#### W1-PR1 Layout core

- `Container` -> `docs/components/container.md`
- `Section` -> `docs/components/section.md`
- `Grid` -> `docs/components/grid-griditem.md`
- `GridItem` -> `docs/components/grid-griditem.md`

#### W1-PR2 Layout flow

- `Stack` -> `docs/components/stack.md`
- `Inline` -> `docs/components/inline.md`
- `AppShell` -> `docs/components/appshell.md`

#### W1-PR3 Navigation shell

- `Menu` -> `docs/components/menu.md`
- `Link` -> `docs/components/link.md`
- `Breadcrumbs` -> `docs/components/breadcrumbs.md`
- `PageHeader` -> `docs/components/pageheader.md`

#### W1-PR4 Surface baseline

- `Card` -> `docs/components/card.md`
- `Divider` -> `docs/components/divider.md`
- `EmptyState` -> `docs/components/emptystate.md`
- `Skeleton` -> `docs/components/skeleton.md`

#### W1-PR5 Controls baseline

- `Button` -> `docs/components/button.md`
- `ButtonGroup` -> `docs/components/buttongroup.md`
- `SegmentedControl` -> `docs/components/segmentedcontrol.md`
- `Spinner` -> `docs/components/spinner.md`
- `Progress` -> `docs/components/progress.md`

#### W1-PR6 Closeout

- Resolve open API contract gaps and ensure all W1 rows in compliance matrix remain fully green.

### Wave 2 (Implemented Backfill)

#### W2-PR1 Input core

- `Input`, `Textarea`, `PasswordInput`, `NumberInput`, `SearchInput`, `MaskedInput`, `MentionInput`, `OtpInput`

#### W2-PR2 Form composition

- `Form`, `FormField`, `InputGroup`, `InputAddon`, `InlineEdit`, `Checkbox`, `Switch`, `RadioGroup`, `RadioButton`

#### W2-PR3 Selection family

- `Select`, `Autocomplete`, `Combobox`, `MultiSelect`, `TagInput`, `TreeSelect`

#### W2-PR4 Date/time family

- `DatePicker`, `DateRangePicker`, `DateTimePicker`, `TimePicker`, `Calendar`

#### W2-PR5 Navigation/disclosure controls

- `Tabs`, `Tab`, `TabPanel`, `Accordion`, `AccordionItem`, `Stepper`, `Wizard`, `WizardStep`, `Pagination`

#### W2-PR6 Overlay baseline

- `Modal`, `Drawer`, `Dropdown`, `Popover`, `Tooltip`, `ContextMenu`, `ConfirmDialog`

#### W2-PR7 Feedback and status

- `Alert`, `Toast`, `ToastContainer`, `Timeline`, `Badge`, `Chip`, `Avatar` (`Progress` hardening only; baseline API is covered in `W1-PR5`)

#### W2-PR8 Utility controls

- `Slider`, `Splitter`, `SplitterPanel`

### Wave 3 (Implemented Backfill)

#### W3-PR1 Data-heavy core

- `DataTable`, `VirtualScroller`, `Tree`

#### W3-PR2 Workspace and command UX

- `KanbanBoard`, `CommandPalette`, `NotificationCenter`, `FilterChips`

#### W3-PR3 Content and file workflows

- `FileUpload`, `RichTextEditor`, `Rating`, `Tour`

### Wave 4 (Implemented Closure)

#### W4-PR1/W4-PR2

- Reconcile all remaining implemented components and reach full green matrix.

#### W4-PR3 Service APIs

- `DialogService` + `ConfirmService` -> `docs/components/dialogservice-confirmservice.md`

#### W4-PR4 Tree/data parity baseline

- `TreeTable` -> `docs/components/treetable.md`

#### W4-PR5 Data presentation parity baseline

- `DataView` -> `docs/components/dataview.md`

#### W4-PR6 Selection parity baseline

- `Listbox` -> `docs/components/listbox.md`

#### W4-PR7 Navigation parity baseline

- `MenuBar` -> `docs/components/menubar.md`

#### W4-PR8 Navigation expansion baseline

- `MegaMenu` -> `docs/components/megamenu.md`

#### W4-PR9 Navigation tree baseline

- `PanelMenu` -> `docs/components/panelmenu.md`

#### W4-PR10 Media parity baseline

- `Carousel` -> `docs/components/carousel.md`

#### W4-PR11 Floating action parity baseline

- `SpeedDial` -> `docs/components/speeddial.md`

#### W4-PR12 Visualization wrapper baseline

- `Chart` -> `docs/components/chart.md`

#### W4-PR13 Media preview baseline

- `Image` -> `docs/components/image.md`

#### W4-PR14 Overlay alias parity baseline

- `OverlayPanel` -> `docs/components/overlaypanel.md`

## Planned Package API Specs

For each package below, create detailed API entries per component using the mandatory schema above before implementation starts.

### Track A

- `P-PR1`: `ConfirmPopup`, `DynamicDialog`, `Sidebar`
- `P-PR2`: `TieredMenu`, `TabMenu`, `BottomNavigation`, `SystemBar`

### Track B

- `P-PR3`: `CascadeSelect`
- `P-PR4`: `PickList`, `OrderList`, `Panel`, `Fieldset`, `Toolbar`, `BlockUI`, `ScrollPanel`, `ScrollTop`

### Track C

- `P-PR5`: `Galleria`, `Dock`, `Terminal`, `Inplace`, `OverlayBadge`, `InlineMessage`, `Message`, `OrgChart`
- `P-PR6`: `BarChart`, `LineChart`, `AreaChart`, `PieChart`, `DonutChart`, `ScatterChart`, `BubbleChart`, `Histogram`, `Heatmap`, `RadarChart`, `FunnelChart`, `TreemapChart`, `GaugeChart`, `CandlestickChart`, `Sparkline`, `ComposableChart`, `TimeSeriesPanel`, `GeoMap`, `NetworkGraph`, `SankeyDiagram`, `BoxPlot`, `ErrorBar`

### Track D

- `P-PR7`: `QueryBuilder`, `AdvancedFilterPanel`, `SavedViewsManager`, `DataTableToolbar`, `BulkActionBar`
- `P-PR8`: `ActivityFeed`, `AuditLogViewer`, `CommentThread`, `MemberPicker`, `PermissionMatrix`, `KPIStatCard`
- `P-PR9`: `FileManager`, `JSONViewer`, `DiffViewer`, `CodeEditor`, `Scheduler`, `BottomSheet`, `InfiniteScroll`

### Track E

- `P-PR10`: `ThemeProvider`, `DefaultsProvider`, `LocaleProvider`, `NoSsr`, `MainLayoutRegion`, `Sheet`, `Window`, `SlideGroup`, `SnackbarQueue`, `Banner`
- `P-PR11`: `AvatarGroup`, `FloatLabel`, `IftaLabel`, `IconField`, `InputIcon`, `SelectionControl`, `SelectionControlGroup`, `ToggleButton`
- `P-PR12`: `Hover`, `Hotkey`, `Kbd`, `CodeBlock`, `Lazy`, `Parallax`, `Validation`, `PassThrough`, `Icon`

## Package Completion Checklist

For each package (`W*` or `P-PR*`):

- [ ] API specs are complete for every component in the package.
- [ ] Competitor parity notes and intentional deviations are documented.
- [ ] Compliance matrix rows are updated (`implemented` or `planned`) for all touched components.
- [ ] Quality gates are green (`lint`, `typecheck`, targeted tests, `test:ssr`, `test:visual`).
