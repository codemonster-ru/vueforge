# Component Compliance Matrix

Last updated: 2026-02-22

Purpose: track execution of the global quality gate for every public component.

Gate columns:

- `DoD`: implementation/export + changelog relevance evaluated.
- `Tests`: unit/interaction tests for changed behavior.
- `A11y`: keyboard/ARIA/focus contracts verified for interactive behavior.
- `SSR/Hydration`: verified for components with dynamic rendering/interaction.
- `Responsive`: mobile/tablet/desktop behavior, overflow handling, and touch interaction verified.
- `Visual`: visual regression coverage for key variants/states.
- `Docs`: API + at least one production-style recipe.
- `Catalog`: row is synced with `docs/audits/component-catalog-mapping.md`.

Status values: `Yes` / `No` / `N/A`.

Completion policy:

- The matrix is considered complete only when every implemented component row is fully `Yes`, or has explicit justified `N/A`.
- Rows containing `No` must block component hardening completion and must not be marked done in roadmap checkpoints.

| Component          | DoD | Tests | A11y | SSR/Hydration | Responsive | Visual | Docs | Catalog |
| ------------------ | --- | ----- | ---- | ------------- | ---------- | ------ | ---- | ------- |
| Accordion          | No  | No    | No   | No            | No         | No     | No   | No      |
| AccordionItem      | No  | No    | No   | No            | No         | No     | No   | No      |
| Alert              | No  | No    | No   | No            | No         | No     | No   | No      |
| AppShell           | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Autocomplete       | No  | No    | No   | No            | No         | No     | No   | No      |
| Avatar             | No  | No    | No   | No            | No         | No     | No   | No      |
| Badge              | No  | No    | No   | No            | No         | No     | No   | No      |
| Breadcrumbs        | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Button             | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| ButtonGroup        | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Calendar           | No  | No    | No   | No            | No         | No     | No   | No      |
| Card               | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Checkbox           | No  | No    | No   | No            | No         | No     | No   | No      |
| Chip               | No  | No    | No   | No            | No         | No     | No   | No      |
| ColorPicker        | No  | No    | No   | No            | No         | No     | No   | No      |
| Combobox           | No  | No    | No   | No            | No         | No     | No   | No      |
| CommandPalette     | No  | No    | No   | No            | No         | No     | No   | No      |
| ConfirmDialog      | No  | No    | No   | No            | No         | No     | No   | No      |
| Container          | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| ContextMenu        | No  | No    | No   | No            | No         | No     | No   | No      |
| DataTable          | No  | No    | No   | No            | No         | No     | No   | No      |
| DatePicker         | No  | No    | No   | No            | No         | No     | No   | No      |
| DateRangePicker    | No  | No    | No   | No            | No         | No     | No   | No      |
| DateTimePicker     | No  | No    | No   | No            | No         | No     | No   | No      |
| Divider            | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Drawer             | No  | No    | No   | No            | No         | No     | No   | No      |
| Dropdown           | No  | No    | No   | No            | No         | No     | No   | No      |
| EmptyState         | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| FileUpload         | No  | No    | No   | No            | No         | No     | No   | No      |
| FilterChips        | No  | No    | No   | No            | No         | No     | No   | No      |
| Form               | No  | No    | No   | No            | No         | No     | No   | No      |
| FormField          | No  | No    | No   | No            | No         | No     | No   | No      |
| Grid               | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| GridItem           | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Inline             | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| InlineEdit         | No  | No    | No   | No            | No         | No     | No   | No      |
| Input              | No  | No    | No   | No            | No         | No     | No   | No      |
| InputAddon         | No  | No    | No   | No            | No         | No     | No   | No      |
| InputGroup         | No  | No    | No   | No            | No         | No     | No   | No      |
| KanbanBoard        | No  | No    | No   | No            | No         | No     | No   | No      |
| Link               | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| MaskedInput        | No  | No    | No   | No            | No         | No     | No   | No      |
| MentionInput       | No  | No    | No   | No            | No         | No     | No   | No      |
| Menu               | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Modal              | No  | No    | No   | No            | No         | No     | No   | No      |
| MultiSelect        | No  | No    | No   | No            | No         | No     | No   | No      |
| NotificationCenter | No  | No    | No   | No            | No         | No     | No   | No      |
| NumberInput        | No  | No    | No   | No            | No         | No     | No   | No      |
| OtpInput           | No  | No    | No   | No            | No         | No     | No   | No      |
| PageHeader         | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Pagination         | No  | No    | No   | No            | No         | No     | No   | No      |
| PasswordInput      | No  | No    | No   | No            | No         | No     | No   | No      |
| Popover            | No  | No    | No   | No            | No         | No     | No   | No      |
| Progress           | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| RadioButton        | No  | No    | No   | No            | No         | No     | No   | No      |
| RadioGroup         | No  | No    | No   | No            | No         | No     | No   | No      |
| Rating             | No  | No    | No   | No            | No         | No     | No   | No      |
| RichTextEditor     | No  | No    | No   | No            | No         | No     | No   | No      |
| SearchInput        | No  | No    | No   | No            | No         | No     | No   | No      |
| Section            | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| SegmentedControl   | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Select             | No  | No    | No   | No            | No         | No     | No   | No      |
| Skeleton           | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Slider             | No  | No    | No   | No            | No         | No     | No   | No      |
| Spinner            | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| SplitButton        | No  | No    | No   | No            | No         | No     | No   | No      |
| Splitter           | No  | No    | No   | No            | No         | No     | No   | No      |
| SplitterPanel      | No  | No    | No   | No            | No         | No     | No   | No      |
| Stack              | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Stepper            | No  | No    | No   | No            | No         | No     | No   | No      |
| Switch             | No  | No    | No   | No            | No         | No     | No   | No      |
| Tab                | No  | No    | No   | No            | No         | No     | No   | No      |
| TabPanel           | No  | No    | No   | No            | No         | No     | No   | No      |
| Tabs               | No  | No    | No   | No            | No         | No     | No   | No      |
| TagInput           | No  | No    | No   | No            | No         | No     | No   | No      |
| Textarea           | No  | No    | No   | No            | No         | No     | No   | No      |
| Timeline           | No  | No    | No   | No            | No         | No     | No   | No      |
| TimePicker         | No  | No    | No   | No            | No         | No     | No   | No      |
| Toast              | No  | No    | No   | No            | No         | No     | No   | No      |
| ToastContainer     | No  | No    | No   | No            | No         | No     | No   | No      |
| Tooltip            | No  | No    | No   | No            | No         | No     | No   | No      |
| Tour               | No  | No    | No   | No            | No         | No     | No   | No      |
| Tree               | No  | No    | No   | No            | No         | No     | No   | No      |
| TreeSelect         | No  | No    | No   | No            | No         | No     | No   | No      |
| VirtualScroller    | No  | No    | No   | No            | No         | No     | No   | No      |
| Wizard             | No  | No    | No   | No            | No         | No     | No   | No      |
| WizardStep         | No  | No    | No   | No            | No         | No     | No   | No      |

Maintenance rules:

- Update the row for each touched component in every PR.
- Keep this file synchronized with release scope before versioned release.
- If a column is `N/A`, add a one-line justification in PR description.
