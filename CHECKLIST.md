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
- [ ] Audit keyboard navigation for nested items
- [ ] Ensure ARIA roles/states are complete
- [ ] Add official presets/examples: top-nav and sidebar-nav
- [ ] Add tests for keyboard and active-state behavior
- [ ] Add a11y section in docs

### P0.7 `Link` (existing hardening)

- [x] `Link` component is implemented
- [ ] Verify disabled/accessibility semantics for router and anchor modes
- [ ] Add focus-visible consistency
- [ ] Add tests for keyboard and aria-disabled behavior
- [ ] Add docs notes for external/internal links

### P0.8 `PageHeader` (existing hardening)

- [x] `PageHeader` component is implemented
- [ ] Audit heading semantics (`h1` usage rules in docs)
- [ ] Verify slot accessibility for actions/meta
- [ ] Add tests for responsive behavior
- [ ] Add docs examples with `Breadcrumbs` and actions

### P0.9 `Breadcrumbs` (existing hardening)

- [x] `Breadcrumbs` component is implemented
- [ ] Verify `aria-label` defaults and nav semantics
- [ ] Add tests for active item and separator behavior
- [ ] Add docs for accessibility usage

### P0.10 `DataTable` (core production baseline)

- [x] `DataTable` component is implemented
- [ ] Define server-mode API contracts (props + emitted events)
- [ ] Implement server-mode handoff for sorting
- [ ] Implement server-mode handoff for pagination
- [ ] Implement server-mode handoff for filtering
- [ ] Define row selection API shape
- [ ] Implement row selection (single)
- [ ] Implement row selection (multi)
- [ ] Add bulk action integration points/events
- [ ] Implement sticky header behavior
- [ ] Implement sticky columns behavior
- [ ] Add tests: server-mode sorting/pagination/filtering
- [ ] Add tests: selection and bulk action hooks
- [ ] Add tests: sticky header/columns
- [ ] Add tests: keyboard focus behavior in interactive table state
- [ ] Add docs recipe: server-side table
- [ ] Add docs recipe: selectable table with bulk actions
- [ ] Add docs recipe: sticky header/columns

### P0.11 `Form` (core DX baseline)

- [x] `Form` component is implemented
- [ ] Define official async submit pattern in API/docs
- [ ] Add zod adapter example
- [ ] Add yup adapter example
- [ ] Add tests for async validation and submit error handling
- [ ] Add docs recipes: async submit, API errors, reset flows

### P0.12 `FormField` (existing hardening)

- [x] `FormField` component is implemented
- [ ] Validate aria-describedby wiring in all states
- [ ] Ensure error/hint/required semantics are consistent
- [ ] Add tests for slot props and accessibility
- [ ] Add docs do/don't examples

### P0.13 Input family (existing hardening)

- [x] Input family baseline is implemented (`Input`, `Textarea`, `NumberInput`, `PasswordInput`, `SearchInput`, `MaskedInput`, `MentionInput`, `OtpInput`)
- [ ] Input family audit framework is defined (shared keyboard + ARIA checklist)
- [ ] `Input` keyboard/focus-visible/ARIA audit + tests
- [ ] `Textarea` keyboard/focus-visible/ARIA audit + tests
- [ ] `NumberInput` keyboard/focus-visible/ARIA audit + tests
- [ ] `PasswordInput` keyboard/focus-visible/ARIA audit + tests
- [ ] `SearchInput` keyboard/focus-visible/ARIA audit + tests
- [ ] `MaskedInput` keyboard/focus-visible/ARIA audit + tests
- [ ] `MentionInput` keyboard/focus-visible/ARIA audit + tests
- [ ] `OtpInput` keyboard/focus-visible/ARIA audit + tests
- [ ] Add consolidated docs matrix for shared input props (`size`, `variant`, `disabled`, `readonly`)

### P0.14 Selection family (existing hardening)

- [x] Selection family baseline is implemented (`Select`, `Autocomplete`, `Combobox`, `MultiSelect`, `TagInput`, `TreeSelect`)
- [ ] Selection family audit framework is defined (open/close, focus, keyboard, ARIA)
- [ ] `Select` audit + tests (keyboard, clearability, disabled states)
- [ ] `Autocomplete` audit + tests (search, navigation, selection)
- [ ] `Combobox` audit + tests (custom value flows, keyboard)
- [ ] `MultiSelect` audit + tests (multi selection, chip removal, clearability)
- [ ] `TagInput` audit + tests (token creation/removal, keyboard)
- [ ] `TreeSelect` audit + tests (hierarchy navigation, selection behavior)
- [ ] Standardize active/selected/disabled behavior across the family
- [ ] Add docs patterns for simple, large-list, and async options

### P0.15 Date/time family (existing hardening)

- [x] Date/time family baseline is implemented (`DatePicker`, `Calendar`, `DateRangePicker`, `TimePicker`, `DateTimePicker`)
- [ ] Date/time family audit framework is defined (keyboard + parsing + constraints)
- [ ] `DatePicker` audit + tests
- [ ] `Calendar` audit + tests
- [ ] `DateRangePicker` audit + tests
- [ ] `TimePicker` audit + tests
- [ ] `DateTimePicker` audit + tests
- [ ] Add docs for constraints and parsing/format behavior
- [ ] Add edge-case tests (empty/null/range boundaries)

### P0.16 `Modal` (overlay baseline)

- [x] `Modal` component is implemented
- [ ] Verify focus trap and focus restore contracts
- [ ] Verify escape and outside-click behavior contracts
- [ ] Verify scroll-lock behavior
- [ ] Align z-index policy
- [ ] Add regression tests
- [ ] Add docs interaction contract

### P0.17 `Drawer` (overlay baseline)

- [x] `Drawer` component is implemented
- [ ] Verify focus trap and focus restore contracts
- [ ] Verify escape and outside-click behavior contracts
- [ ] Verify scroll-lock behavior
- [ ] Align z-index policy
- [ ] Add regression tests
- [ ] Add docs interaction contract

### P0.18 `Dropdown` (overlay baseline)

- [x] `Dropdown` component is implemented
- [ ] Verify keyboard open/close/navigation/select behavior
- [ ] Verify positioning and viewport collision behavior
- [ ] Align z-index policy
- [ ] Add regression tests
- [ ] Add docs interaction contract

### P0.19 `Popover` (overlay baseline)

- [x] `Popover` component is implemented
- [ ] Verify trigger/focus behavior and dismiss rules
- [ ] Verify positioning and collision behavior
- [ ] Align z-index policy
- [ ] Add regression tests
- [ ] Add docs interaction contract

### P0.20 `Tooltip` (overlay baseline)

- [x] `Tooltip` component is implemented
- [ ] Verify keyboard/focus access and delays
- [ ] Verify non-hover accessibility behavior
- [ ] Align z-index policy
- [ ] Add regression tests
- [ ] Add docs usage constraints

### P0.21 `ContextMenu` (overlay baseline)

- [x] `ContextMenu` component is implemented
- [ ] Verify keyboard fallback and close behavior
- [ ] Verify positioning and collision behavior
- [ ] Align z-index policy
- [ ] Add regression tests
- [ ] Add docs interaction contract

### P0.22 Core accessibility QA gate

- [ ] Define shared a11y checklist template for interactive components
- [ ] Define a11y checklist template for non-interactive/display components
- [ ] Add accessibility test suite: form flows
- [ ] Add accessibility test suite: table flows
- [ ] Add accessibility test suite: modal/drawer flows
- [ ] Add accessibility test suite: navigation flows
- [ ] Enforce required a11y docs section in component docs template

### P0.23 Core documentation baseline

- [ ] Define standard docs template sections: Props, Events, Slots, A11y, Theming, Recipes
- [ ] Apply docs template to layout primitives (`Container`, `Section`, `Grid`, `Stack`, `Inline`)
- [ ] Apply docs template to navigation components (`Menu`, `Link`, `PageHeader`, `Breadcrumbs`)
- [ ] Apply docs template to overlays (`Modal`, `Drawer`, `Dropdown`, `Popover`, `Tooltip`, `ContextMenu`)
- [ ] Apply docs template to data components (`DataTable`, `Pagination`, `VirtualScroller`, `Card`, `Divider`)
- [ ] Apply docs template to forms and input families (`Form`, `FormField`, input/selection/date-time groups)
- [ ] Add "Build without Tailwind" guide
- [ ] Add starter recipe: auth page
- [ ] Add starter recipe: dashboard page
- [ ] Add starter recipe: settings page

### P0.24 API consistency baseline (cross-library)

- [ ] Define API conventions: prop naming and defaults
- [ ] Define API conventions: emitted event naming
- [ ] Define API conventions: slot naming and slot-prop patterns
- [ ] Define API conventions: `v-model` contracts and controlled/uncontrolled behavior
- [ ] Audit layout components against conventions
- [ ] Audit navigation components against conventions
- [ ] Audit data components against conventions
- [ ] Audit overlays against conventions
- [ ] Audit form/input/select/date-time families against conventions
- [ ] Normalize high-priority inconsistencies (breaking-safe changes first)
- [ ] Add migration notes for any normalized behavior
- [ ] Add tests/docs notes for normalized contracts

### P0.25 Browser support baseline

- [ ] Define official browser support matrix
- [ ] Add compatibility checks for critical components against matrix
- [ ] Document supported browsers and known limitations

### P0.26 Core theme system (existing hardening)

- [x] Theme runtime API is implemented (`setTheme`, `updateTheme`, `getTheme`)
- [x] Component token override system is implemented
- [ ] Add stricter token validation guidance in docs
- [ ] Add token usage examples for layout primitives

### P0.27 Core test baseline (existing hardening)

- [x] Unit-test baseline exists for many components
- [ ] Define minimum test coverage expectations for new/updated components
- [ ] Enforce test checklist in contribution/review process

## P1 (Advanced Competitiveness)

### P1.1 `DataTable` advanced

- [ ] Add column resize
- [ ] Add column reorder
- [ ] Add tests for resize/reorder
- [ ] Add docs for advanced usage

### P1.2 `Tree` and `TreeSelect` hardening

- [ ] Improve keyboard navigation edge cases
- [ ] Add tests for large tree behavior
- [ ] Add RTL behavior verification
- [ ] Add advanced docs recipes

### P1.3 `Tabs` / `Accordion` / `Stepper` / `Wizard` hardening

- [ ] Audit keyboard and ARIA behavior for all four components
- [ ] Add regression tests for navigation and state transitions
- [ ] Add docs recipes for common multi-step flows and disclosures
- [ ] Normalize shared API patterns where applicable

### P1.4 `NotificationCenter` / `Toast` / `Tour` / `CommandPalette` hardening

- [x] `NotificationCenter`, `Toast`, `Tour`, and `CommandPalette` are implemented
- [ ] Define interaction and accessibility contracts for each component
- [ ] Add keyboard and focus management regression tests
- [ ] Verify overlay/layering behavior against global policy
- [ ] Add docs recipes for real app usage patterns

### P1.5 Date/time locale maturity

- [ ] Add global locale configuration for date/time components
- [ ] Add locale-aware week/day behavior
- [ ] Add tests for locale-specific behavior
- [ ] Add docs for locale setup

### P1.6 Theme density and motion

- [ ] Add density presets (`comfortable`, `compact`)
- [ ] Add motion token guidance
- [ ] Add reduced-motion support
- [ ] Add tests/docs for density and motion behavior

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
- [ ] Add and enforce semver checklist
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
