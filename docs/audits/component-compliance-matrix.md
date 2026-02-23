# Component Compliance Matrix

Last updated: 2026-02-23

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
| Accordion          | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| AccordionItem      | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Alert              | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| AppShell           | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Autocomplete       | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Avatar             | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Badge              | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Breadcrumbs        | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Button             | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| ButtonGroup        | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Calendar           | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Carousel           | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Chart              | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Card               | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Checkbox           | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Chip               | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| ColorPicker        | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Combobox           | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| CommandPalette     | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| ConfirmDialog      | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| ConfirmService     | Yes | Yes   | N/A  | Yes           | N/A        | N/A    | Yes  | Yes     |
| Container          | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| ContextMenu        | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| DataTable          | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| DataView           | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| DatePicker         | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| DateRangePicker    | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| DateTimePicker     | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| DialogService      | Yes | Yes   | N/A  | Yes           | N/A        | N/A    | Yes  | Yes     |
| Divider            | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Drawer             | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Dropdown           | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| EmptyState         | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| FileUpload         | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| FilterChips        | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Form               | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| FormField          | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Grid               | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| GridItem           | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Inline             | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| InlineEdit         | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Image              | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Input              | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| InputAddon         | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| InputGroup         | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| KanbanBoard        | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Link               | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Listbox            | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| MaskedInput        | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| MentionInput       | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Menu               | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| MenuBar            | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| MegaMenu           | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| PanelMenu          | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Modal              | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| MultiSelect        | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| NotificationCenter | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| NumberInput        | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| OtpInput           | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| OverlayPanel       | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| PageHeader         | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Pagination         | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| PasswordInput      | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Popover            | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Progress           | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| RadioButton        | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| RadioGroup         | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Rating             | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| RichTextEditor     | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| SearchInput        | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Section            | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| SegmentedControl   | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Select             | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Skeleton           | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Slider             | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Spinner            | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| SpeedDial          | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| SplitButton        | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Splitter           | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| SplitterPanel      | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Stack              | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Stepper            | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Switch             | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Tab                | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| TabPanel           | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Tabs               | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| TagInput           | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Textarea           | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Timeline           | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| TimePicker         | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Toast              | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| ToastContainer     | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Tooltip            | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Tour               | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Tree               | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| TreeTable          | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| TreeSelect         | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| VirtualScroller    | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| Wizard             | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |
| WizardStep         | Yes | Yes   | Yes  | Yes           | Yes        | Yes    | Yes  | Yes     |

Maintenance rules:

- Update the row for each touched component in every PR.
- Keep this file synchronized with release scope before versioned release.
- If a column is `N/A`, add a one-line justification in PR description.
