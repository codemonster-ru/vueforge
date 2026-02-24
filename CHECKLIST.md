# VueForge Core Baseline Checklist (Component-by-Component)

Goal: build a competitive core UI library where teams can ship most interfaces with VueForge alone and minimal custom CSS.

Priority rules:

- `P0` = core baseline required for competitiveness
- `P1` = advanced competitiveness features
- `P2` = scaling, ecosystem, and adoption

Execution rules:

- Work in strict order: `P0` -> `P1` -> `P2`.
- Inside each priority, work top-to-bottom.
- Mark an item done only when code + tests + docs are complete.

Definition of Done (applies to each item):

- Implementation is complete and exported (if public component/API).
- Tests are added/updated and passing.
- Accessibility checks are covered for interactive behavior.
- Documentation is updated (API + usage example).
- Changelog/release note entry is prepared (for user-facing changes).
- Responsive behavior is verified for mobile/tablet/desktop breakpoints (including touch and overflow handling).
- SSR/hydration behavior is verified for interactive/dynamic rendering paths.
- Visual regression coverage is added/updated for critical variants and states.

P0 first slice (ship this first):

1. `P0.1` `Container`
2. `P0.2` `Section`
3. `P0.3` `Grid`
4. `P0.4` `Stack`
5. `P0.5` `Inline`
6. `P0.10` `DataTable` production baseline
7. `P0.11` `Form` DX baseline
8. `P0.22` Core accessibility QA gate
9. `P0.23` Core documentation baseline
10. `P0.24` API consistency baseline
11. `P0.25` Browser support baseline

Execution dependencies:

1. Layout docs and recipes depend on `P0.1`-`P0.5`.
2. A11y docs and audits in `P0.22` depend on component hardening tasks.
3. `P0.23` docs template should be finalized before mass docs updates.
4. `P0.24` API conventions should be defined before API normalization changes.
5. `P1` work starts only after P0 first slice is mostly completed.

## P0 (Mandatory Core Baseline)

### P0.0 `AppShell` (existing)

- [x] `AppShell` component is implemented
- [x] Audit shell accessibility and landmark semantics
- [x] Add docs recipe for app-level layout composition

### P0.1 `Container` (new)

- [x] Define props: `size`, `maxWidth`, `paddingX`, `as`
- [x] Implement responsive paddings and max-width behavior
- [x] Add theme tokens and typings
- [x] Add unit tests (props, classes, slots)
- [x] Export from `src/index.ts`
- [x] Add docs (API + examples)

### P0.2 `Section` (new)

- [x] Define props: `paddingY`, `background`, `bordered`, `as`
- [x] Implement vertical rhythm and background variants
- [x] Add theme tokens and typings
- [x] Add unit tests
- [x] Export from `src/index.ts`
- [x] Add docs (composition with `Container`)

### P0.3 `Grid` (new)

- [x] Define props: columns, gaps, breakpoints, align, justify
- [x] Add item API for span/start/end
- [x] Implement responsive class/style generation
- [x] Add theme tokens and typings
- [x] Add unit tests (breakpoints and span behavior)
- [x] Export from `src/index.ts`
- [x] Add docs (layout recipes)

### P0.4 `Stack` (new)

- [x] Define props: `gap`, `align`, `justify`, `wrap`, `as`
- [x] Implement vertical layout primitive
- [x] Add theme tokens and typings
- [x] Add unit tests
- [x] Export from `src/index.ts`
- [x] Add docs

### P0.5 `Inline` (new)

- [x] Define props: `gap`, `align`, `justify`, `wrap`, `as`
- [x] Implement horizontal layout primitive
- [x] Add theme tokens and typings
- [x] Add unit tests
- [x] Export from `src/index.ts`
- [x] Add docs

### P0.6 `Menu` (existing hardening)

- [x] `Menu` component is implemented
- [x] Audit keyboard navigation for nested items
- [x] Ensure ARIA roles/states are complete
- [x] Add official presets/examples: top-nav and sidebar-nav
- [x] Add tests for keyboard and active-state behavior
- [x] Add a11y section in docs

### P0.7 `Link` (existing hardening)

- [x] `Link` component is implemented
- [x] Verify disabled/accessibility semantics for router and anchor modes
- [x] Add focus-visible consistency
- [x] Add tests for keyboard and aria-disabled behavior
- [x] Add docs notes for external/internal links

### P0.8 `PageHeader` (existing hardening)

- [x] `PageHeader` component is implemented
- [x] Audit heading semantics (`h1` usage rules in docs)
- [x] Verify slot accessibility for actions/meta
- [x] Add tests for responsive behavior
- [x] Add docs examples with `Breadcrumbs` and actions

### P0.9 `Breadcrumbs` (existing hardening)

- [x] `Breadcrumbs` component is implemented
- [x] Verify `aria-label` defaults and nav semantics
- [x] Add tests for active item and separator behavior
- [x] Add docs for accessibility usage

### P0.10 `DataTable` (core production baseline)

- [x] `DataTable` component is implemented
- [x] Define server-mode API contracts (props + emitted events)
- [x] Implement server-mode handoff for sorting
- [x] Implement server-mode handoff for pagination
- [x] Implement server-mode handoff for filtering
- [x] Define row selection API shape
- [x] Implement row selection (single)
- [x] Implement row selection (multi)
- [x] Add bulk action integration points/events
- [x] Implement sticky header behavior
- [x] Implement sticky columns behavior
- [x] Add tests: server-mode sorting/pagination/filtering
- [x] Add tests: selection and bulk action hooks
- [x] Add tests: sticky header/columns
- [x] Add tests: keyboard focus behavior in interactive table state
- [x] Add docs recipe: server-side table
- [x] Add docs recipe: selectable table with bulk actions
- [x] Add docs recipe: sticky header/columns

### P0.11 `Form` (core DX baseline)

- [x] `Form` component is implemented
- [x] Define official async submit pattern in API/docs
- [x] Add zod adapter example
- [x] Add yup adapter example
- [x] Add tests for async validation and submit error handling
- [x] Add docs recipes: async submit, API errors, reset flows

### P0.12 `FormField` (existing hardening)

- [x] `FormField` component is implemented
- [x] Validate aria-describedby wiring in all states
- [x] Ensure error/hint/required semantics are consistent
- [x] Add tests for slot props and accessibility
- [x] Add docs do/don't examples

### P0.13 Input family (existing hardening)

- [x] Input family baseline is implemented (`Input`, `Textarea`, `NumberInput`, `PasswordInput`, `SearchInput`, `MaskedInput`, `MentionInput`, `OtpInput`)
- [x] Input family audit framework is defined (shared keyboard + ARIA checklist)
- [x] `Input` keyboard/focus-visible/ARIA audit + tests
- [x] `Textarea` keyboard/focus-visible/ARIA audit + tests
- [x] `NumberInput` keyboard/focus-visible/ARIA audit + tests
- [x] `PasswordInput` keyboard/focus-visible/ARIA audit + tests
- [x] `SearchInput` keyboard/focus-visible/ARIA audit + tests
- [x] `MaskedInput` keyboard/focus-visible/ARIA audit + tests
- [x] `MentionInput` keyboard/focus-visible/ARIA audit + tests
- [x] `OtpInput` keyboard/focus-visible/ARIA audit + tests
- [x] Add consolidated docs matrix for shared input props (`size`, `variant`, `disabled`, `readonly`)

### P0.14 Selection family (existing hardening)

- [x] Selection family baseline is implemented (`Select`, `Autocomplete`, `Combobox`, `MultiSelect`, `TagInput`, `TreeSelect`)
- [x] Selection family audit framework is defined (open/close, focus, keyboard, ARIA)
- [x] `Select` audit + tests (keyboard, clearability, disabled states)
- [x] `Autocomplete` audit + tests (search, navigation, selection)
- [x] `Combobox` audit + tests (custom value flows, keyboard)
- [x] `MultiSelect` audit + tests (multi selection, chip removal, clearability)
- [x] `TagInput` audit + tests (token creation/removal, keyboard)
- [x] `TreeSelect` audit + tests (hierarchy navigation, selection behavior)
- [x] Standardize active/selected/disabled behavior across the family
- [x] Add docs patterns for simple, large-list, and async options

### P0.15 Date/time family (existing hardening)

- [x] Date/time family baseline is implemented (`DatePicker`, `Calendar`, `DateRangePicker`, `TimePicker`, `DateTimePicker`)
- [x] Date/time family audit framework is defined (keyboard + parsing + constraints)
- [x] `DatePicker` audit + tests
- [x] `Calendar` audit + tests
- [x] `DateRangePicker` audit + tests
- [x] `TimePicker` audit + tests
- [x] `DateTimePicker` audit + tests
- [x] Add docs for constraints and parsing/format behavior
- [x] Add edge-case tests (empty/null/range boundaries)

### P0.16 `Modal` (overlay baseline)

- [x] `Modal` component is implemented
- [x] Verify focus trap and focus restore contracts
- [x] Verify escape and outside-click behavior contracts
- [x] Verify scroll-lock behavior
- [x] Align z-index policy
- [x] Add regression tests
- [x] Add docs interaction contract

### P0.17 `Drawer` (overlay baseline)

- [x] `Drawer` component is implemented
- [x] Verify focus trap and focus restore contracts
- [x] Verify escape and outside-click behavior contracts
- [x] Verify scroll-lock behavior
- [x] Align z-index policy
- [x] Add regression tests
- [x] Add docs interaction contract

### P0.18 `Dropdown` (overlay baseline)

- [x] `Dropdown` component is implemented
- [x] Verify keyboard open/close/navigation/select behavior
- [x] Verify positioning and viewport collision behavior
- [x] Align z-index policy
- [x] Add regression tests
- [x] Add docs interaction contract

### P0.19 `Popover` (overlay baseline)

- [x] `Popover` component is implemented
- [x] Verify trigger/focus behavior and dismiss rules
- [x] Verify positioning and collision behavior
- [x] Align z-index policy
- [x] Add regression tests
- [x] Add docs interaction contract

### P0.20 `Tooltip` (overlay baseline)

- [x] `Tooltip` component is implemented
- [x] Verify keyboard/focus access and delays
- [x] Verify non-hover accessibility behavior
- [x] Align z-index policy
- [x] Add regression tests
- [x] Add docs usage constraints

### P0.21 `ContextMenu` (overlay baseline)

- [x] `ContextMenu` component is implemented
- [x] Verify keyboard fallback and close behavior
- [x] Verify positioning and collision behavior
- [x] Align z-index policy
- [x] Add regression tests
- [x] Add docs interaction contract

### P0.22 Core accessibility QA gate

- [x] Define shared a11y checklist template for interactive components
- [x] Define a11y checklist template for non-interactive/display components
- [x] Add accessibility test suite: form flows
- [x] Add accessibility test suite: table flows
- [x] Add accessibility test suite: modal/drawer flows
- [x] Add accessibility test suite: navigation flows
- [x] Enforce required a11y docs section in component docs template

### P0.23 Core documentation baseline

- [x] Define standard docs template sections: Props, Events, Slots, A11y, Theming, Recipes
- [x] Apply docs template to layout primitives (`Container`, `Section`, `Grid`, `Stack`, `Inline`)
- [x] Apply docs template to navigation components (`Menu`, `Link`, `PageHeader`, `Breadcrumbs`)
- [x] Apply docs template to overlays (`Modal`, `Drawer`, `Dropdown`, `Popover`, `Tooltip`, `ContextMenu`)
- [x] Apply docs template to data components (`DataTable`, `Pagination`, `VirtualScroller`, `Card`, `Divider`)
- [x] Apply docs template to forms and input families (`Form`, `FormField`, input/selection/date-time groups)
- [x] Add "Build without Tailwind" guide
- [x] Add starter recipe: auth page
- [x] Add starter recipe: dashboard page
- [x] Add starter recipe: settings page

### P0.24 API consistency baseline (cross-library)

- [x] Define API conventions: prop naming and defaults
- [x] Define API conventions: emitted event naming
- [x] Define API conventions: slot naming and slot-prop patterns
- [x] Define API conventions: `v-model` contracts and controlled/uncontrolled behavior
- [x] Audit layout components against conventions
- [x] Audit navigation components against conventions
- [x] Audit data components against conventions
- [x] Audit overlays against conventions
- [x] Audit form/input/select/date-time families against conventions
- [x] Normalize high-priority inconsistencies (breaking-safe changes first)
- [x] Add migration notes for any normalized behavior
- [x] Add tests/docs notes for normalized contracts

### P0.25 Browser support baseline

- [x] Define official browser support matrix
- [x] Add compatibility checks for critical components against matrix
- [x] Document supported browsers and known limitations

### P0.26 Core theme system (existing hardening)

- [x] Theme runtime API is implemented (`setTheme`, `updateTheme`, `getTheme`)
- [x] Component token override system is implemented
- [x] Add stricter token validation guidance in docs
- [x] Add token usage examples for layout primitives

### P0.27 Core test baseline (existing hardening)

- [x] Unit-test baseline exists for many components
- [x] Define minimum test coverage expectations for new/updated components
- [x] Enforce test checklist in contribution/review process

### P0.28 Implemented coverage reconciliation

Goal: ensure every currently exported public component is explicitly tracked in checklist scope with quality expectations.

Hardening gate (mandatory for each implemented component):

- [x] API contract is documented and consistent (props/events/slots/defaults + migration note if behavior changes).
- [x] Tests are complete for render, interaction, edge cases, and regression-sensitive paths.
- [x] Accessibility contracts are verified (keyboard, ARIA, focus management where applicable).
- [x] Responsive behavior is verified on mobile/tablet/desktop breakpoints, including touch and overflow handling.
- [x] SSR/hydration behavior is verified for interactive/dynamic rendering paths.
- [x] Visual regression coverage exists for critical variants/states.
- [x] Docs include API reference and at least one production-style recipe.
- [x] Component row in `docs/audits/component-compliance-matrix.md` is updated.

Completion gate for `P0.28`:

- [x] `docs/audits/component-compliance-matrix.md` has no `No` values for implemented components (only `Yes` or justified `N/A`).
- [x] Every currently exported public component from `src/index.ts` is present in checklist scope and compliance matrix.

Policy for all future components:

- [x] No new public component can be marked complete unless all quality gates are `Yes` (or justified `N/A`) in the compliance matrix.

Backfill execution waves for implemented components:

- [x] Wave 1: backfill compliance gates for P0 first-slice components and shared layout primitives.
- [x] Wave 2: backfill compliance gates for input/selection/date-time families and overlays.
- [x] Wave 3: backfill compliance gates for advanced/data-heavy and DX components (`DataTable`, `Tree`, `VirtualScroller`, `KanbanBoard`, `CommandPalette`, `NotificationCenter`).
- [x] Wave 4: close remaining implemented components and reach fully green compliance matrix.
- [x] Create full rollout plan for all implemented and planned components: `docs/audits/component-rollout-plan.md`.
- [x] Create API package specification document for all implemented/planned rollout packages: `docs/audits/component-api-package-specs.md`.
- [x] Execute rollout packages and keep `component-compliance` / `planned-component-compliance` matrices synchronized.
- [x] Enforce per-package API spec completion (`props/events/slots/a11y/responsive/SSR/tokens/tests`) before package closeout.

Wave 1 execution plan (PR packages):

- [x] `W1-PR1` Layout core: `Container`, `Section`, `Grid`, `GridItem`.
- [x] `W1-PR2` Layout flow: `Stack`, `Inline`, `AppShell`.
- [x] `W1-PR3` Navigation shell: `Menu`, `Link`, `Breadcrumbs`, `PageHeader`.
- [x] `W1-PR4` Surface baseline: `Card`, `Divider`, `EmptyState`, `Skeleton`.
- [x] `W1-PR5` Controls baseline: `Button`, `ButtonGroup`, `SegmentedControl`, `Spinner`, `Progress`.
- [x] `W1-PR6` Wave closeout: resolve open QA findings, sync compliance matrix rows, and mark Wave 1 done.

Wave 1 package gate (applies to each `W1-PR*`):

- [x] All touched component rows are `Yes`/justified `N/A` across `DoD`, `Tests`, `A11y`, `SSR/Hydration`, `Responsive`, `Visual`, `Docs`, `Catalog`.
- [x] `npm run lint`, `npm run typecheck`, targeted `npm run test`, `npm run test:ssr`, and `npm run test:visual` are green.
- [x] At least one production-style docs recipe is updated/added for touched component group.

- [x] `AccordionItem` hardening baseline (API, tests, a11y/docs confirmation)
- [x] `ColorPicker` hardening baseline (API, tests, a11y/docs confirmation)
- [x] `ConfirmDialog` hardening baseline (API, tests, a11y/docs confirmation)
- [x] `EmptyState` hardening baseline (API, tests, a11y/docs confirmation)
- [x] `FilterChips` hardening baseline (API, tests, a11y/docs confirmation)
- [x] `GridItem` hardening baseline (API, tests, a11y/docs confirmation)
- [x] `InlineEdit` hardening baseline (API, tests, a11y/docs confirmation)
- [x] `InputAddon` hardening baseline (API, tests, a11y/docs confirmation)
- [x] `InputGroup` hardening baseline (API, tests, a11y/docs confirmation)
- [x] `RadioButton` hardening baseline (API, tests, a11y/docs confirmation)
- [x] `RadioGroup` hardening baseline (API, tests, a11y/docs confirmation)
- [x] `SegmentedControl` hardening baseline (API, tests, a11y/docs confirmation)
- [x] `Slider` hardening baseline (API, tests, a11y/docs confirmation)
- [x] `Spinner` hardening baseline (API, tests, a11y/docs confirmation)
- [x] `SplitButton` hardening baseline (API, tests, a11y/docs confirmation)
- [x] `SplitterPanel` hardening baseline (API, tests, a11y/docs confirmation)
- [x] `TabPanel` hardening baseline (API, tests, a11y/docs confirmation)
- [x] `ToastContainer` hardening baseline (API, tests, a11y/docs confirmation)
- [x] `WizardStep` hardening baseline (API, tests, a11y/docs confirmation)

## P1 (Advanced Competitiveness)

### P1.1 `DataTable` advanced

- [x] Add column resize
- [x] Add column reorder
- [x] Add tests for resize/reorder
- [x] Add docs for advanced usage

### P1.2 `Tree` and `TreeSelect` hardening

- [x] Improve keyboard navigation edge cases
- [x] Add tests for large tree behavior
- [x] Add RTL behavior verification
- [x] Add advanced docs recipes

### P1.3 `Tabs` / `Accordion` / `Stepper` / `Wizard` hardening

- [x] Audit keyboard and ARIA behavior for all four components
- [x] Add regression tests for navigation and state transitions
- [x] Add docs recipes for common multi-step flows and disclosures
- [x] Normalize shared API patterns where applicable

### P1.4 `NotificationCenter` / `Toast` / `Tour` / `CommandPalette` hardening

- [x] `NotificationCenter`, `Toast`, `Tour`, and `CommandPalette` are implemented
- [x] Define interaction and accessibility contracts for each component
- [x] Add keyboard and focus management regression tests
- [x] Verify overlay/layering behavior against global policy
- [x] Add docs recipes for real app usage patterns

### P1.5 Date/time locale maturity

- [x] Add global locale configuration for date/time components
- [x] Add locale-aware week/day behavior
- [x] Add tests for locale-specific behavior
- [x] Add docs for locale setup

### P1.6 Theme density and motion

- [x] Add density presets (`comfortable`, `compact`)
- [x] Add motion token guidance
- [x] Add reduced-motion support
- [x] Add tests/docs for density and motion behavior

### P1.7 Visual and runtime quality pipeline

- [x] Add visual regression testing pipeline
- [x] Add SSR/hydration checks
- [x] Add CI jobs for both
- [x] Add regression triage playbook

### P1.8 i18n and RTL baseline

- [x] Add global locale text API (empty/loading/default labels)
- [x] Localize built-in component strings
- [x] Add RTL support for critical components
- [x] Add regression tests for RTL
- [x] Add i18n/RTL documentation

### P1.9 Performance baseline for heavy components

- [x] Define performance budgets for `DataTable`, `Tree`, `VirtualScroller`, and key overlays
- [x] Add benchmark scenarios and measurement scripts
- [x] Add CI/per-release performance checks
- [x] Document performance guidance and limits

### P1.10 Developer experience

- [x] Add live playground for core components
- [x] Add cookbook of copy-paste core recipes

### P1.11 Component parity track

Goal: close high-demand component gaps before full focus on adoption/governance tasks in `P2`.

Exit criteria:

- Reach at least 80% completion of `Must-have parity` items.
- Each completed item must satisfy Definition of Done (code + tests + docs + a11y).

#### Must-have parity (build most business UIs without external UI kits)

- [x] `DialogService` and `ConfirmService` APIs (programmatic open/close + promise flow)
- [x] `TreeTable` component (hierarchical rows + expand/collapse + selection)
- [x] `DataView` component (list/grid renderer with pagination/sorting handoff)
- [x] `Listbox` component parity (single/multi select, keyboard-first navigation, grouped options)
- [x] `MenuBar` component (horizontal app navigation with nested items)
- [x] `MegaMenu` component (multi-column navigation content)
- [x] `PanelMenu` component (accordion-style navigation tree)
- [x] `Carousel` component (keyboard + swipe + autoplay controls)
- [x] `SpeedDial` / floating action menu pattern
- [x] `Chart` wrapper component (official adapter around a stable chart engine)
- [x] `Image` component with preview/lightbox mode
- [x] `Skeleton` advanced presets parity (table/list/form presets)
- [x] `OverlayPanel` v1 alias parity (`Popover`-backed API subset with compatibility mapping)
- [x] Pass-through/unstyled customization API (class/style slots and render hooks without forking components)

Must-have acceptance criteria (applies to each item):

- [x] Keyboard and ARIA contracts documented and covered by regression tests.
- [x] SSR/hydration behavior verified where interaction is dynamic.
- [x] Responsive behavior verified across mobile/tablet/desktop breakpoints (including touch targets and overflow handling).
- [x] Theming tokens are exposed and documented.
- [x] At least one production-style docs recipe is added.

#### High-leverage parity (commonly requested after core launch)

- [x] `TreeTable` advanced mode (lazy loading + server handoff + column resize/reorder)
- [x] `DataTable` parity expansion (`row group`, `row expansion`, `column visibility manager`)
- [x] `Panel` / `Fieldset` / `Toolbar` parity set (layout actions, toggle/collapse patterns, grouped controls)
- [x] `BlockUI` / loading overlay component
- [x] `ScrollPanel` and `ScrollTop` utilities
- [x] `PickList` / `OrderList` parity (transfer, reorder, keyboard and drag/drop coverage)
- [x] `Splitter` parity hardening (nested panels + persistence + keyboard edge cases)
- [x] `FileUpload` advanced mode (chunking/resume + retry + signed URL flows)
- [x] `Editor` hardening (`RichTextEditor` security + paste sanitization profiles)
- [x] `OrgChart` component
- [x] Virtualized `Select`/`Autocomplete` parity for large datasets (windowing + async loading UX)
- [x] `Image` advanced mode (preview group, zoom steps, keyboard nav, download/alt guidance)
- [x] `Chart` adapter hardening (peer dependency policy, SSR-safe lazy mount, resize handling)
- [x] `Icon` system parity (official icon package strategy, tree-shaking, size/color/theming contracts)
- [x] `MenuBar`/`MegaMenu`/`PanelMenu` routing parity (router integration, active state sync, lazy child loading)
- [x] Headless parity matrix for key components (documented slot/part API coverage and tested contracts)

#### Nice-to-have parity (post-adoption expansion)

- [x] `Dock` / app launcher navigation pattern
- [x] `Galleria` / gallery-focused media component
- [x] `Knob` / radial input
- [x] `Terminal` / command log display component
- [x] `Inplace` display-edit pattern parity checks

#### ICP-driven optional parity (enable based on target product segments)

- [x] `Autocomplete` advanced parity (multi-value chips + grouped options + async grouping)
- [x] `Message` / inline status-message component parity and guidance vs `Alert`
- [x] `Sidebar` alias parity (`Drawer`-backed compatibility API + migration guidance)
- [x] Headless/unstyled track hardening (unstyled docs recipes + slot/part coverage matrix)

### P1.13 SaaS application component coverage

Goal: ensure the library can ship full-featured SaaS products (admin panels, ops backoffice, analytics, collaboration) without relying on additional UI kits.

#### SaaS core gaps (additions to parity track)

- [ ] `QueryBuilder` component (rule groups, AND/OR nesting, operator/value editors, serialization)
- [ ] `AdvancedFilterPanel` component (field filters, presets, URL-sync-friendly state)
- [ ] `SavedViewsManager` component (save/rename/share/default views for list pages)
- [ ] `DataTableToolbar` component (search, filters, column presets, density, export entry points)
- [ ] `BulkActionBar` component (selection-aware actions with confirm/undo hooks)
- [ ] `TieredMenu` v1 alias parity (`Menu` preset/mode for hierarchical navigation)
- [ ] `TabMenu` component (route-aware section navigation for dashboard/detail pages)
- [ ] `CascadeSelect` component (hierarchical selection with async branch loading support)
- [ ] `ConfirmPopup` component (anchor-based confirm interactions for row/list actions)
- [ ] `DynamicDialog` service/component pair (programmatic modal composition for feature modules)
- [ ] `ActivityFeed` component (typed events, grouping, relative time, actor metadata)
- [ ] `AuditLogViewer` component (event table + detail drawer + diff payload view)
- [ ] `CommentThread` component (inline replies, mentions, resolve/reopen flows)
- [ ] `MemberPicker` component (async people/org search with avatars and role hint slots)
- [ ] `PermissionMatrix` component (role vs capability matrix with tri-state controls)
- [ ] `KPIStatCard` component set (value, trend, delta, sparkline slot)
- [ ] `MeterGroup` component (progressive KPI blocks with thresholds and labels)
- [ ] `OverlayBadge` utility component/directive (status/count overlays for actionable icons)
- [ ] `InlineMessage` component (field-local status/error/info messaging separate from global alerts)
- [ ] `FileManager` / asset-browser component (list/grid modes, preview, bulk actions)
- [ ] `JSONViewer` component (expand/collapse, syntax highlight, path copy)
- [ ] `DiffViewer` component (inline/split modes for text/JSON payload comparison)
- [ ] `CodeEditor` wrapper component (Monaco/CodeMirror adapter with theming and readonly modes)
- [ ] `Scheduler` component (calendar timeline for resource/time-slot planning)
- [ ] `BottomSheet` component (mobile-first action/details surface for responsive SaaS flows)
- [ ] `InfiniteScroll` utility/component (cursor/offset loading with sentinel and recovery states)

#### SaaS hardening for existing components

- [ ] `KanbanBoard` production hardening (keyboard DnD, virtualization, swimlane performance tests)
- [ ] `NotificationCenter` SaaS mode (read/unread filters, grouping, action links, persistence contract)
- [ ] `CommandPalette` SaaS actions mode (entity search, recent items, scoped commands)
- [ ] `DataTable` SaaS ops mode (server-driven saved filters, export hooks, long-running action states)
- [ ] `Tree` hardening as `TreeView` parity (virtualized expansion, selection modes, async branch states)
- [ ] `Accordion` hardening as `ExpansionPanel` parity (dense mode, grouped control patterns, analytics hooks)
- [ ] `Rating` hardening for form/review scenarios (readonly precision, keyboard/a11y edge cases)

SaaS acceptance criteria (applies to each item):

- [ ] RBAC-friendly API boundaries are documented (what is UI-only vs permission-enforced by backend).
- [ ] Large-dataset behavior is validated (pagination/virtualization/loading and empty/error states).
- [ ] Internationalization and timezone-sensitive behavior are covered where relevant.
- [ ] At least one end-to-end SaaS recipe is added (`list page`, `detail page`, or `settings/billing` flow).

### P1.14 Layout parity

Goal: provide production-grade application layout patterns for complex SaaS products across desktop and mobile without custom layout scaffolding.

#### Missing layout primitives and shells

- [ ] `AppBar` component (fixed/sticky/dense variants, action slots, responsive behavior)
- [ ] `NavigationRail` component (collapsed/expanded states, icon+label patterns, keyboard support)
- [ ] `Footer` component (app/page footer layout with left/center/right slots)
- [ ] `PageLayout` preset component (sidebar/content/aside composition with responsive collapse)
- [ ] `SplitLayout` presets (master-detail, inspector panel, and editor-preview compositions)
- [ ] `ResizableSidebar` behavior (drag resize + collapse + persisted width/state)
- [ ] `StickyRegion` utility (header/subheader/action bars with offset and z-index contracts)
- [ ] Responsive visibility utilities (`Show`, `Hide`, breakpoint-aware rendering helpers)

#### Layout hardening and consistency

- [ ] Define layout breakpoint contracts and tokenized spacing scale for app shells and page templates
- [ ] Verify SSR/hydration stability for responsive layout switching
- [ ] Add keyboard/a11y checks for collapsible/resizable navigation regions
- [ ] Add docs recipes: dashboard shell, settings shell, analytics shell, and mobile adaptive shell
- [ ] Add visual regression scenarios for major layout presets and breakpoint transitions

### P1.15 Data visualization parity

Goal: provide first-class charting and analytics visualization coverage for SaaS dashboards, reports, and monitoring pages.

#### Core chart components

- [ ] `BarChart` component (grouped/stacked/horizontal variants)
- [ ] `LineChart` component (multi-series, gaps/nulls, threshold overlays)
- [ ] `AreaChart` component (stacked and normalized variants)
- [ ] `PieChart` / `DonutChart` component (legend interaction and drilldown hooks)
- [ ] `ScatterChart` component (regression line and point clustering options)
- [ ] `BubbleChart` component (size encoding and tooltip contracts)
- [ ] `Histogram` component (bin strategies and density overlays)
- [ ] `Heatmap` component (cell scaling, axis labeling, range legend)
- [ ] `RadarChart` component (multi-series comparison)
- [ ] `FunnelChart` component (conversion-stage visualization)
- [ ] `TreemapChart` component (hierarchical area encoding)
- [ ] `GaugeChart` component (single KPI arc/radial gauge)
- [ ] `CandlestickChart` component (OHLC/volume overlays for financial/time-series use cases)
- [ ] `Sparkline` component (inline trend visualizations)

#### Advanced analytics visuals

- [ ] `ComposableChart` container (mixed chart types on shared axes)
- [ ] `TimeSeriesPanel` component (range selection, compare periods, timezone-aware ticks)
- [ ] `GeoMap` / choropleth component (region-level metric rendering with legend and drilldown hooks)
- [ ] `NetworkGraph` component (node-link visualization for dependency/relationship data)
- [ ] `SankeyDiagram` component (flow magnitude visualization)
- [ ] `BoxPlot` component (distribution and outlier analysis)
- [ ] `ErrorBar` support for statistical confidence intervals

#### Visualization platform and quality

- [ ] Define official chart engine adapter strategy (single default adapter + extension interface)
- [ ] Define shared data schema contracts for series, axes, legend, tooltip, and annotation layers
- [ ] Add accessibility contracts (keyboard navigation, screen-reader summaries, data table fallback)
- [ ] Add responsive and high-density rendering strategy (resize observers, decimation, virtualization where needed)
- [ ] Add theming/token contracts for chart colors, grids, typography, and states
- [ ] Add export contracts (PNG/SVG/CSV) and print-friendly rendering mode
- [ ] Add performance budgets and benchmark scenarios for large datasets
- [ ] Add visual regression suites for chart variants and theme modes
- [ ] Add docs recipes: executive dashboard, product analytics, finance/reporting, and ops monitoring
- [ ] Add secure data-rendering guidance (untrusted labels/tooltips/HTML formatters)

### P1.16 Catalog delta parity (foundation and utility components)

Goal: close remaining catalog-level gaps for foundation, utility, and compositional components that are commonly available in mature Vue UI libraries.

#### Foundation and provider layer

- [ ] `ThemeProvider` component/API (local theme scope overrides per subtree)
- [ ] `DefaultsProvider` component/API (local default prop policies per subtree)
- [ ] `LocaleProvider` component/API (local i18n scope overrides)
- [ ] `NoSsr` utility component (client-only rendering boundary)
- [ ] `MainLayoutRegion` primitive (`main` area contract for shell composition)
- [ ] `SystemBar` component (global top status/utility strip)

#### Navigation and surface utilities

- [ ] `BottomNavigation` component (mobile-first primary navigation)
- [ ] `Banner` component (inline page-level announcements/actions)
- [ ] `Sheet` component (generic elevated/flat container surface with variants)
- [ ] `Window` / pager container component (stateful pane switching and transitions)
- [ ] `SlideGroup` component (scrollable chip/tab/button group navigation)
- [ ] `SnackbarQueue` behavior (queued toast/snackbar orchestration)

#### Input and form composition helpers

- [ ] `AvatarGroup` component (overlap/stack/grouped avatar patterns)
- [ ] `FloatLabel` utility (floating label composition for inputs/selects)
- [ ] `IftaLabel` utility (in-field top-aligned label pattern support)
- [ ] `IconField` and `InputIcon` helpers (consistent icon slots/placement contracts)
- [ ] `SelectionControl` and `SelectionControlGroup` primitives (shared checkbox/radio/switch base behavior)
- [ ] `ToggleButton` component parity (binary action toggle separate from segmented control)

#### Interaction and content helpers

- [ ] `Hover` utility wrapper (hover state exposure with keyboard parity constraints)
- [ ] `Hotkey` utility component/composable (scoped shortcuts with accessibility-safe defaults)
- [ ] `Kbd` component (keyboard key visual tokens in docs/UI)
- [ ] `CodeBlock` component (syntax-highlighted display with copy/action slots)
- [ ] `Lazy` utility component (deferred mount/render for heavy subtree content)
- [ ] `Parallax` component (optional decorative motion container with reduced-motion compliance)
- [ ] `Validation` utility contracts (shared validation-state primitives and message wiring)
- [ ] `PassThrough` utility contracts (part-level prop/attr forwarding hooks for deep customization)

#### Delivery waves

MVP wave (required for immediate product impact):

- [ ] `ThemeProvider`
- [ ] `DefaultsProvider`
- [ ] `LocaleProvider`
- [ ] `NoSsr`
- [ ] `BottomNavigation`
- [ ] `Sheet`
- [ ] `Window`
- [ ] `AvatarGroup`
- [ ] `FloatLabel`
- [ ] `IconField` / `InputIcon`
- [ ] `ToggleButton`
- [ ] `CodeBlock`

Next wave (high leverage after MVP):

- [ ] `SystemBar`
- [ ] `Banner`
- [ ] `SlideGroup`
- [ ] `SnackbarQueue`
- [ ] `SelectionControl` / `SelectionControlGroup`
- [ ] `Hotkey`
- [ ] `Lazy`
- [ ] `Validation`
- [ ] `PassThrough`

Later wave (specialized/optional utility coverage):

- [ ] `MainLayoutRegion`
- [ ] `IftaLabel`
- [ ] `Hover`
- [ ] `Kbd`
- [ ] `Parallax`

Catalog delta acceptance criteria:

- [ ] Every new item is added to `docs/audits/component-catalog-mapping.md` in the same PR.
- [ ] For aliases/equivalents, document mapping rationale and API differences.
- [ ] Alias-only items are explicitly mapped to canonical package ownership in rollout/API package specs.
- [ ] Components classified as `not planned` include explicit product rationale.

## P2 (Scaling and Adoption)

### P2.1 Release discipline

- [ ] Add bundle-size tracking per release
- [x] Add and enforce semver checklist
- [ ] Add deprecation policy
- [ ] Add migration guide template
- [ ] Define component-level breaking-change rules and examples
- [x] Add release gate: catalog mapping sync required before versioned release (`docs/contributing/semver-release-checklist.md`)

### P2.2 Governance

- [ ] Add contribution guide focused on API consistency
- [ ] Add "what belongs in core" policy
- [x] Add PR review checklist item for component catalog parity impact (`docs/contributing/testing.md`)
- [x] Define recurring catalog audit cadence (monthly + pre-release) in mapping doc
- [x] Add anti-duplicate component policy and PR gate (canonical component per functional domain)
- [x] Create initial overlap triage matrix (`docs/audits/component-catalog-mapping.md`) with `merge/split/alias` decisions
- [x] Define v1 alias-first scope reduction decisions to avoid duplicate implementation tracks

### P2.3 Ecosystem support

- [ ] Add Nuxt integration guide
- [ ] Add starter template repository/examples
- [ ] Add design token export guide (JSON/Figma-friendly)
- [ ] Document i18n translation key conventions

### P2.4 Security and robustness

- [ ] Add security checklist for input-rich components (`RichTextEditor`, link-like components, content rendering)
- [ ] Define sanitization/escaping recommendations and boundaries
- [ ] Add tests for critical unsafe-input scenarios
- [ ] Document secure usage patterns for consumers

### P2.5 Competitive parity scorecard

Goal: measure practical competitiveness vs established Vue UI libraries with explicit scoring instead of binary "has component / no component".

Scoring model:

- Each tracked component gets 6 dimensions scored 0-2.
- `0` = missing, `1` = partial, `2` = parity-ready.
- Maximum per component: `12` points.

Dimensions (per component):

- Feature surface parity (core scenarios and key variants).
- API depth parity (props/events/slots and controlled patterns).
- A11y parity (keyboard + ARIA + focus behavior).
- Responsive parity (mobile/tablet/desktop behavior and touch interaction quality).
- Quality parity (tests, SSR/hydration checks, performance guardrails where relevant).
- Documentation parity (API docs + production recipe + migration notes if needed).

Library-level targets:

- [ ] `>= 90%` score for `Must-have parity` set.
- [ ] `>= 85%` score for `High-leverage parity` set.
- [ ] No `Must-have parity` component with `A11y parity` score below `2`.
- [ ] No `Must-have parity` component with `Responsive parity` score below `2`.
- [ ] No `Must-have parity` component with `Documentation parity` score below `2`.
- [ ] Bundle-size and runtime performance regressions are tracked per release.

Release gates by maturity:

- [ ] "Competitive Beta": `Must-have >= 90%` and all safety gates in `P2.4` complete.
- [ ] "v1 Competitive": `Must-have >= 95%` and `High-leverage >= 90%`.
- [ ] "v1 Competitive+" (optional): ICP-driven optional set reaches `>= 80%` for target segment.

Parity scope governance:

- [x] Create initial component catalog mapping for target libraries: `docs/audits/component-catalog-mapping.md`.
- [ ] Maintain component catalog mapping each release: `implemented` / `deferred` / `not planned` with rationale.
- [x] Create component compliance matrix for all public components: `docs/audits/component-compliance-matrix.md`.
- [ ] Maintain component compliance matrix in every PR for touched components.
- [x] Create planned component compliance matrix for not-yet-implemented scope: `docs/audits/planned-component-compliance-matrix.md`.
- [ ] Maintain planned component compliance matrix and enforce transition `Planned -> Implemented` on release.
