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

- [ ] Add visual regression testing pipeline
- [ ] Add SSR/hydration checks
- [ ] Add CI jobs for both
- [ ] Add regression triage playbook

### P1.8 i18n and RTL baseline

- [ ] Add global locale text API (empty/loading/default labels)
- [ ] Localize built-in component strings
- [ ] Add RTL support for critical components
- [ ] Add regression tests for RTL
- [ ] Add i18n/RTL documentation

### P1.9 Performance baseline for heavy components

- [ ] Define performance budgets for `DataTable`, `Tree`, `VirtualScroller`, and key overlays
- [ ] Add benchmark scenarios and measurement scripts
- [ ] Add CI/per-release performance checks
- [ ] Document performance guidance and limits

### P1.10 Developer experience

- [ ] Add live playground for core components
- [ ] Add cookbook of copy-paste core recipes

## P2 (Scaling and Adoption)

### P2.1 Release discipline

- [ ] Add bundle-size tracking per release
- [x] Add and enforce semver checklist
- [ ] Add deprecation policy
- [ ] Add migration guide template
- [ ] Define component-level breaking-change rules and examples

### P2.2 Governance

- [ ] Add contribution guide focused on API consistency
- [ ] Add "what belongs in core" policy

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
