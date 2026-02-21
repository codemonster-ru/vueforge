# Changelog

## [0.83.0] - 2026-02-21

- DataTable sticky behavior: added `stickyHeader` and per-column `sticky` support (`left`/`right`).
- Added tests for sticky header/columns and keyboard focus in interactive table state.
- Added docs recipe for sticky header/columns usage.

## [0.82.0] - 2026-02-21

- DataTable selection baseline: added selection API (`selectionMode`, `selection`) with single and multiple row selection.
- DataTable bulk actions: added integration points via `bulkActions`, `bulk-actions` slot, and `bulkAction` event.
- Added tests for selection/bulk action hooks and docs recipe for selectable tables with bulk actions.

## [0.81.0] - 2026-02-21

- DataTable production baseline: added server-mode API contracts (`server`, `page`, `pageSize`, `filters`) and emitted events for server handoff.
- DataTable server-mode handoff now emits unified `request` payloads on sorting, paging, and filtering updates.
- Added DataTable server-mode tests and a server-side table recipe in docs.
- DataTable visuals: removed duplicate bottom border on the last table row to avoid double border rendering.

## [0.80.0] - 2026-02-21

- Build stability: fixed declaration generation errors by exporting shared `Props`/`Item` interfaces from `Modal` and `Dropdown`.
- Tooling cleanup: applied lint auto-fixes in Vue templates (`form`, `menu`, `rating`) to remove warnings.

## [0.79.0] - 2026-02-21

- PageHeader hardening: added responsive mobile breakpoint class handling and tests for responsive behavior.
- PageHeader accessibility: added grouped `meta`/`actions` aria labeling and documented `h1` usage rules.
- Breadcrumbs hardening: verified nav semantics and default/custom `aria-label` behavior.
- Added Breadcrumbs tests for active item `aria-current` and separator rendering/slot customization.
- Expanded Breadcrumbs accessibility usage guidance in docs.
- Menu demo follow-ups: fixed hidden submenu visibility behavior and horizontal dropdown positioning.
- Refined Menu demo readability in HomeView (labels, spacing, and chevron offset).

## [0.78.0] - 2026-02-21

- Menu hardening: improved nested keyboard navigation (`ArrowRight`/`ArrowDown` open, `ArrowLeft`/`Escape` close).
- Menu accessibility: added `aria-orientation`, `aria-haspopup`, `aria-controls`, and `aria-current` wiring.
- Menu behavior: fixed parent active-state propagation for nested item activation.
- Added Menu unit tests for keyboard and nested active-state behavior plus top-nav/sidebar-nav examples in docs and HomeView.
- Link hardening: improved disabled semantics for anchor and router-link modes (`aria-disabled`, keyboard guard, no `href` when disabled).
- Added focus-visible styling consistency for Link.
- Added Link unit tests for keyboard and `aria-disabled` behavior plus docs notes for external/internal usage.

## [0.77.0] - 2026-02-21

- Added Inline layout primitive with `gap`, `align`, `justify`, `wrap`, and `as` props.
- Added default theme tokens and typed token support for `components.inline`.
- Added Inline export, documentation page, and unit tests.

## [0.76.0] - 2026-02-21

- Added Stack layout primitive with `gap`, `align`, `justify`, `wrap`, and `as` props.
- Added default theme tokens and typed token support for `components.stack`.
- Added Stack export, documentation page, and unit tests.

## [0.75.0] - 2026-02-21

- Added Grid and GridItem layout primitives with columns/gap/align/justify props and responsive breakpoint overrides.
- Added span/start/end API for grid items with responsive per-breakpoint placement.
- Added default theme tokens and typed token support for `components.grid`.
- Added Grid/GridItem exports, docs page with layout recipes, and unit tests.

## [0.74.0] - 2026-02-21

- Added Section layout component with `paddingY`, `background`, `bordered`, and `as` props plus responsive vertical rhythm.
- Added default theme tokens and typed token support for `components.section`.
- Added Section export, docs page (with Container composition guidance), and unit tests.
- AppShell hardening: added landmark/accessibility test coverage and documented app-level layout composition recipe.

## [0.73.0] - 2026-02-20

- Added Container layout component with size presets (`sm`/`md`/`lg`/`xl`/`full`) and optional runtime `maxWidth`/`paddingX` overrides.
- Added default theme tokens and typed token support for `components.container`.
- Added Container export, README docs, unit tests, and example app showcase updates (including a full-width HomeView demo card).
- Added and refined the core baseline execution checklist for roadmap-driven development.
- Reorganized documentation: migrated from monolithic reference to per-component pages under `docs/components`, normalized page structure, and simplified root `README.md`.

## [0.72.0] - 2026-02-19

- Added PageHeader component with title/subtitle props, optional divider, and slots for breadcrumbs, meta, actions, and custom body.
- Added default theme tokens and typed token support for `components.pageHeader`.
- Added PageHeader export, README docs, example app showcase, and unit tests.

## [0.71.0] - 2026-02-19

- Added ButtonGroup component with horizontal/vertical layouts, attached mode, and Button/SplitButton inheritance for size, variant, and severity.
- Added default theme tokens and typed token support for `components.buttonGroup`.
- Added ButtonGroup export, README docs, example app showcase, and unit tests.

## [0.70.0] - 2026-02-19

- Added Spinner component with inline/overlay variants, size and severity options, and optional label slot.
- Added default theme tokens and typed token support for `components.spinner`.
- Added Spinner export, README docs, example app showcase, and unit tests.

## [0.69.0] - 2026-02-19

- Added Divider component with horizontal/vertical orientations, solid/dashed/dotted variants, inset mode, and optional label.
- Added default theme tokens and typed token support for `components.divider`.
- Added Divider export, README docs, example app showcase, and unit tests.

## [0.68.0] - 2026-02-19

- Added RichTextEditor component with Markdown/HTML formatting modes, toolbar actions, and optional character counter.
- Added default theme tokens and typed token support for `components.richTextEditor`.
- Added RichTextEditor export, README docs, example app showcase, and unit tests.

## [0.67.0] - 2026-02-18

- Added KanbanBoard component with draggable cards, column/card slots, and move events.
- Added default theme tokens and typed token support for `components.kanbanBoard`.
- Added KanbanBoard export, README docs, example app showcase, and unit tests.

## [0.66.0] - 2026-02-18

- Added AppShell layout component with sidebar/header/main/footer slots, desktop collapse state, and mobile drawer behavior.
- Added default theme tokens and typed token support for `components.appShell`.
- Added AppShell export, README docs, example app showcase, and unit tests.
- Updated HomeView examples: grouped components by category and introduced compact/large cards for better layout of complex demos.

## [0.65.0] - 2026-02-18

- Added NotificationCenter component for persistent in-app notifications with read/unread state, bulk actions, and item slots.
- Added default theme tokens and typed token support for `components.notificationCenter`.
- Added NotificationCenter export, README docs, example app showcase, and unit tests.

## [0.64.0] - 2026-02-18

- Added Wizard and WizardStep components for multi-step workflows with linear navigation, per-step validation hooks, and completion events.
- Added default theme tokens and typed token support for `components.wizard`.
- Added Wizard/WizardStep exports, README docs, example app showcase, and unit tests.

## [0.63.0] - 2026-02-18

- Added Tour component for guided onboarding flows with target-based step anchoring, spotlight mask, and keyboard/overlay close behavior.
- Added default theme tokens and typed token support for `components.tour`.
- Added Tour export, README docs, example app showcase, and unit tests.

## [0.62.0] - 2026-02-18

- Added Splitter and SplitterPanel components for resizable multi-panel layouts with drag and keyboard separator controls.
- Added default theme tokens and typed token support for `components.splitter`.
- Added Splitter/SplitterPanel exports, README docs, example app showcase, and unit tests.

## [0.61.0] - 2026-02-18

- Added EmptyState component for reusable empty-data views with icon/title/description/actions slots and filled/outlined variants.
- Added default theme tokens and typed token support for `components.emptyState`.
- Added EmptyState export, README docs, example app showcase, and unit tests.

## [0.60.0] - 2026-02-18

- Added InputGroup component for composing adjacent input controls, add-ons, and action buttons with unified borders and corner radii.
- Added InputAddon helper component for prefix/suffix content inside InputGroup.
- Added default theme tokens and typed token support for `components.inputGroup`.
- Added InputGroup/InputAddon exports, README docs, example app showcase, and unit tests.

## [0.59.0] - 2026-02-17

- Added Form component with `v-model` values, sync/async validation handlers, submit/reset lifecycle, and slot-based form helpers (`values`, `errors`, `touched`, setters, and actions).
- Added default theme tokens and typed token support for `components.form`.
- Added Form export, README docs, example app showcase, and unit tests.
- FormField invalid state now highlights borders of nested form controls using `errorBorderColor` and `errorFocusBorderColor` tokens.

## [0.58.0] - 2026-02-17

- Added Timeline component for rendering chronological event flows with vertical/horizontal layouts, status markers, and slot-based marker/item customization.
- Added default theme tokens and typed token support for `components.timeline`.
- Added Timeline export, README docs, and unit tests.

## [0.57.0] - 2026-02-17

- Added Combobox component with searchable single selection, strict/free-input modes, and optional custom value creation.
- Added default theme tokens and typed token support for `components.combobox`.
- Added Combobox export, README docs, and unit tests.

## [0.56.0] - 2026-02-12

- Added MentionInput component with `@`/`#` trigger suggestions, keyboard selection, and mention insertion support.
- Added default theme tokens and typed token support for `components.mentionInput`.
- Added MentionInput export, README docs, unit tests, and example app showcase.

## [0.55.0] - 2026-02-12

- Added InlineEdit component with inline view/edit mode, save/cancel actions, and text/number support.
- Added default theme tokens and typed token support for `components.inlineEdit`.
- Added InlineEdit export, README docs, unit tests, and example app showcase.

## [0.54.0] - 2026-02-12

- Added FilterChips component for compact filter toggles with single/multiple selection and optional clear action.
- Added default theme tokens and typed token support for `components.filterChips`.
- Added FilterChips export, README docs, unit tests, and example app showcase.

## [0.53.0] - 2026-02-12

- Added SegmentedControl component for compact single-choice mode switching with keyboard navigation.
- Added default theme tokens and typed token support for `components.segmentedControl`.
- Added SegmentedControl export, README docs, unit tests, and example app showcase.
- Refined SegmentedControl default sizing and example layout to a more compact appearance.

## [0.52.0] - 2026-02-12

- Added Calendar component as an inline monthly date selector with locale and min/max support.
- Added default theme tokens and typed token support for `components.calendar`.
- Added Calendar export, README docs, unit tests, and example app showcase.

## [0.51.0] - 2026-02-12

- Added SearchInput component with debounced `search` event, loading state, and optional clear control.
- Added default theme tokens and typed token support for `components.searchInput`.
- Added SearchInput export, README docs, unit tests, and example app showcase.

## [0.50.0] - 2026-02-12

- Added DateTimePicker component with combined calendar/time selection, min/max datetime bounds, and 12h/24h formatting.
- Added default theme tokens and typed token support for `components.datetimepicker`.
- Added DateTimePicker export, README docs, unit tests, and example app showcase.

## [0.49.0] - 2026-02-12

- Added MaskedInput component with string/function mask support, token-based formatting, and raw value (`unmask`) mode.
- Added default theme tokens and typed token support for `components.maskedInput`.
- Added MaskedInput export, README docs, unit tests, and example app showcase.

## [0.48.0] - 2026-02-12

- Added ColorPicker component with preset swatches, optional alpha channel, and `hex`/`rgb`/`hsl` output formats.
- Added default theme tokens and typed token support for `components.colorPicker`.
- Added ColorPicker export, README docs, unit tests, and example app showcase.

## [0.47.0] - 2026-02-12

- Added OtpInput component for fixed-length one-time code entry with keyboard navigation and paste handling.
- Added default theme tokens and typed token support for `components.otpInput`.
- Added OtpInput export, README docs, unit tests, and example app showcase.

## [0.46.0] - 2026-02-12

- Added PasswordInput component with show/hide toggle, password strength indicator, and CapsLock hint.
- Added default theme tokens and typed token support for `components.passwordInput`.
- Added PasswordInput export, README docs, unit tests, and example app showcase.

## [0.45.0] - 2026-02-11

- Added TagInput component for token/tag entry with suggestions, custom tags, keyboard interactions, and validation hooks.
- Added default theme tokens and typed token support for `components.taginput`.
- Added TagInput export, README docs, unit tests, and example app showcase.

## [0.44.0] - 2026-02-11

- Added VirtualScroller component for rendering large item collections with virtual windowing, overscan tuning, and end-of-list detection events.
- Added default theme tokens and typed token support for `components.virtualScroller`.
- Added VirtualScroller export, README docs, unit tests, and example app showcase.

## [0.43.0] - 2026-02-11

- Added CommandPalette component for global command search and quick actions with keyboard shortcut support.
- Added default theme tokens and typed token support for `components.commandPalette`.
- Added CommandPalette export, README docs, unit tests, and example app showcase.

## [0.42.0] - 2026-02-11

- Added SplitButton component for primary action + dropdown actions flows.
- Added default theme tokens and typed token support for `components.splitbutton`.
- Added SplitButton export, README docs, unit tests, and example app showcase.

## [0.41.0] - 2026-02-11

- Added ContextMenu component for right-click actions with keyboard/open-close handling and menu item integration.
- Added default theme tokens and typed token support for `components.contextMenu`.
- Added ContextMenu export, README docs, unit tests, and example app showcase.

## [0.40.0] - 2026-02-09

- Added TreeSelect component with searchable tree popup, single/multiple selection, and clear control.
- Added default theme tokens and typed token support for `components.treeselect`.
- Added TreeSelect export, README docs, unit tests, and example app showcase.

## [0.39.0] - 2026-02-09

- Added ConfirmDialog component for confirmation flows with built-in actions and customizable slots.
- Added default theme tokens and typed token support for `components.confirmDialog`.
- Added ConfirmDialog export, README docs, unit tests, and example app showcase.

## [0.38.0] - 2026-02-09

- Added Tree component with nested nodes, single/multiple selection, keyboard navigation, and expand/collapse controls.
- Added default theme tokens and typed token support for `components.tree`.
- Added Tree export, README docs, unit tests, and example app showcase.

## [0.37.0] - 2026-02-07

- Added Rating component with half-step support, keyboard navigation, and theming tokens.
- Added default theme tokens and typed token support for `components.rating`.
- Added Rating export, README docs, unit tests, and example app showcase.

## [0.36.0] - 2026-02-07

- Added FileUpload component with drag-and-drop support, multi-file handling, and size/count limits.
- Added default theme tokens and typed token support for `components.fileUpload`.
- Added FileUpload export, README docs, unit tests, and example app showcase.
- Fixed FileUpload layout to prevent long filenames from overflowing demo grid cards.

## [0.35.0] - 2026-02-06

- Added TimePicker component with step/min/max bounds, 12h/24h display, and size/variant options.
- Added default theme tokens and typed token support for `components.timepicker`.
- Added TimePicker export, README docs, unit tests, and example app showcase.

## [0.34.0] - 2026-02-06

- Added Stepper component with horizontal/vertical layouts, status states, and sizing.
- Added default theme tokens and typed token support for `components.stepper`.
- Added Stepper export, README docs, unit tests, and example app showcase.

## [0.33.0] - 2026-02-06

- Added DateRangePicker component with range selection, min/max bounds, and locale support.
- Added default theme tokens and typed token support for `components.daterangepicker`.
- Added DateRangePicker export, README docs, unit tests, and example app showcase.

## [0.32.0] - 2026-02-06

- Added Dropdown component with trigger slot, Menu-based items rendering, and floater positioning.
- Added default theme tokens and typed token support for `components.dropdown`.
- Added Dropdown export, README docs, and example app showcase.

## [0.31.0] - 2026-02-06

- Added Chip component with size/variant/severity options, optional icon, and close action.
- Added default theme tokens and typed token support for `components.chip`.
- Added Chip export, README docs, and example app showcase.

## [0.30.0] - 2026-02-06

- Added NumberInput component with min/max/step/precision support and optional controls.
- Added default theme tokens and typed token support for `components.numberInput`.
- Added NumberInput export, README docs, unit tests, and example app showcase.

## [0.29.0] - 2026-02-06

- Added Breadcrumbs component with slots, separator customization, and theme tokens.
- Added default theme tokens and typed token support for `components.breadcrumbs`.
- Added Breadcrumbs export, README docs, unit tests, and example app showcase.

## [0.28.0] - 2026-02-06

- Added Drawer component with positions, overlay, focus handling, and close controls.
- Added default theme tokens and typed token support for `components.drawer`.
- Added Drawer export, README docs, unit tests, example app showcase, and entry/exit animations.

## [0.27.0] - 2026-02-05

- Added Slider component with single/range modes, marks, and size variants.
- Added default theme tokens and typed token support for `components.slider`.
- Added Slider export, README docs, unit tests, and example app showcase.

## [0.26.0] - 2026-02-05

- Added Avatar component with image/initials fallback, sizes, shapes, and status indicator.
- Added default theme tokens and typed token support for `components.avatar`.
- Added Avatar export, README docs, and example app showcase.

## [0.25.0] - 2026-02-05

- Added Badge component with solid/soft/outline variants, severity colors, and size variants.
- Added default theme tokens and typed token support for `components.badge`.
- Added Badge export, README docs, and example app showcase.

## [0.24.0] - 2026-02-05

- Added Progress component with linear/circular variants, determinate/indeterminate modes, severity colors, and size variants.
- Added default theme tokens and typed token support for `components.progress`.
- Added Progress export, README docs, unit tests, and example app showcase.

## [0.23.0] - 2026-02-05

- Added DataTable component with sorting, empty/loading states, and row click events.
- Added default theme tokens and typed token support for `components.datatable`.
- Added DataTable export, README docs, unit tests, and example app showcase.

## [0.22.0] - 2026-02-05

- Added Accordion and AccordionItem components with single/multiple modes and optional unmount.
- Added default theme tokens and typed token support for `components.accordion`.
- Added Accordion export, README docs, unit tests, and example app showcase.

## [0.21.0] - 2026-02-05

- Added Skeleton component with shimmer animation and `text/rect/circle` variants.
- Added default theme tokens and typed token support for `components.skeleton`.
- Added Skeleton export, README docs, unit tests, and example app showcase.

## [0.20.0] - 2026-02-04

- Added Pagination component with page range rendering, ellipsis compression, Prev/Next controls, and keyboard-focusable page buttons.
- Added default theme tokens and typed token support for `components.pagination`.
- Added Pagination export, README docs, unit tests, and example app showcase.

## [0.19.0] - 2026-02-04

- Added MultiSelect component with multi-value selection, local filtering, clear control, keyboard navigation, and loading/empty states.
- Added default theme tokens and typed token support for `components.multiselect`.
- Added MultiSelect export, README docs, unit tests, and example app showcase.

## [0.18.0] - 2026-02-04

- Added Alert component for inline status messages with severity variants, optional close control, and action slots.
- Added default theme tokens and typed token support for `components.alert`.
- Added Alert export, README docs, unit tests, and example app showcase.

## [0.17.0] - 2026-02-04

- Added FormField component with label/hint/error/required states and size variants.
- Added slot props (`id`, `describedBy`, `invalid`, `required`) to wire accessibility attributes on nested controls.
- Added default theme tokens and typed token support for `components.formField`.
- Added FormField export, README docs, unit tests, and example app showcase.

## [0.16.0] - 2026-02-04

- Added DatePicker component with calendar popup, min/max bounds, locale support, and keyboard/open-close handling.
- Added default theme tokens and typed token support for `components.datepicker`.
- Added DatePicker export, README docs, unit tests, and example app showcase.

## [0.15.0] - 2026-02-04

- Added Autocomplete component (combobox behavior) with local filtering, keyboard navigation, and search event.
- Added default theme tokens and typed token support for `components.autocomplete`.
- Added Autocomplete export, README docs, and example app showcase.
- Tests: added autocomplete unit tests.

## [0.14.0] - 2026-02-03

- Added Toast and ToastContainer components with theming tokens and auto-close support.
- Example app: added Toast showcase.
- Tests: added toast unit tests.
- Toast UI: close button aligned to the right.
- Docs: documented Toast API and tokens.

## [0.13.0] - 2026-02-03

- Added Tabs components (Tabs/Tab/TabPanel) with keyboard navigation and theming tokens.
- Example app: added Tabs showcase.
- Docs: documented Tabs API.

## [0.12.0] - 2026-02-03

- Added RadioGroup and RadioButton components with theming tokens.
- Example app: added RadioGroup/RadioButton showcase.
- Tests: added radio component unit tests.
- Docs: documented RadioGroup/RadioButton API.

## [0.11.0] - 2026-02-02

- Added Textarea component with theming tokens, example usage, and unit tests.
- Added `variant` support for Checkbox and Select (`filled`/`outlined`).
- Theme: added `controls.backgroundColor` token (defaults to `bgSoftColor`) and wired Input/Select/Textarea/Checkbox to it.
- Theme: removed CodeBlock tokens and default theme entry (component moved to separate package).

## [0.10.0] - 2026-02-02

- Added Tooltip component with theming tokens, arrow option, and example usage.
- Tooltip styling: arrow sizing/placement refinements and drop-shadow to match tooltip appearance.
- Tests: added tooltip unit tests.
- Tooling: migrated ESLint config to `eslint.config.ts` and updated lint script/deps.

## [0.9.0] - 2026-02-01

- Added Modal/Dialog component with theming tokens, size variants, and focus management.
- Docs: documented Modal API and theming tokens.
- Tooling: migrated ESLint config to flat format and upgraded lint/test tooling.

## [0.8.0] - 2026-02-01

- Theme core/runtime split: extracted pure theming logic and added runtime warnings for invalid token values.
- Theme sizes: centralized sm/lg sizing tokens and wired Button/Input/Select to them.
- Theme sizes: refined sm/lg padding values for better rhythm.
- Docs: added Tokens section with override examples.
- Lint: aligned switch/case indentation rule to avoid formatting conflicts.
- Theme strict mode: added `strict` option for invalid token values; non-hex colors now skip shade generation.
- Tests: added vitest coverage for theme core helpers.
- Types: exported `ThemeTokens`/`ThemeOptions`/`ThemePreset` and typed `components` tokens.
- Docs: documented default core token values.
- Theme API: added documentation for core theming methods and options.
- CI: added workflow to run lint/typecheck/test/build on push/PR.

## [0.7.0] - 2026-02-01

- UI sizing: unified control heights (32px) and box-sizing for Button/Input/Select.
- Typography: normalized font-size/line-height across components and enforced inherited font-family on form controls.
- Theme tokens: added base typography/radii/states/controls tokens and aligned component tokens to them.
- Example app: applied base typography on body.
- Dependencies: bumped `@codemonster-ru/floater.js` to 1.0.8 and removed local type shims.

## [0.6.1] - 2026-02-01

- Link: RouterLink type handling tightened to avoid undefined `to` at compile time.

## [0.6.0] - 2026-02-01

- Removed layout-related components and exports (Container, Header, Footer, Content, DefaultLayout, LeftSidebarLayout).
- Removed Demo and Logo components and their theme tokens.
- Example app now focuses only on component-level UI demos (layouts/routes removed).
- Styling tokens expanded to cover previously hardcoded component sizes/spacing and a shared border width token.
- Link: RouterLink type handling tightened to avoid undefined `to` at compile time.

## [0.5.0] - 2026-01-31

- Example app now includes demos for all components and layout previews.
- Accessibility improvements for Select, Popover, and Menu (ARIA attributes, keyboard support).
- Select: fixed outside‑click handling and cleanup of floating listeners on close.
- Link: active state resolution improved for path/name targets.
- Menu: separator styling fixed for consistent rendering.
- Build: entry selection now follows Vite `mode`, peer deps are externalized.

## [0.4.0] - 2026-01-25

- Theme manager with runtime updates and selector customization.
- Safer theme parsing and hex validation for color shade generation.
- Improved shade generation using HSL lightness adjustments.
- Demo page shows runtime theme switching in action.
- Unified component event/props patterns and improved slot naming in Popover.
- Added form components: Input, Select, Checkbox, Switch.

## [0.3.5] - 2025-05-11

- Core components: Button, Link, Card, Logo, Menu, Header, Footer, Content, Popover, Container, Demo.
- Layouts: DefaultLayout, LeftSidebarLayout.
- CSS variable theming with light/dark schemes and generated color shades.
- DefaultTheme preset.
- Vite lib build with type generation.
- Example app in `src/example`.
