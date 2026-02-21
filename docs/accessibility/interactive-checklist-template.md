# Interactive Components Accessibility Checklist Template

Use this checklist for components with user interaction (`button`, `input`, `menu`, `dialog`, pickers, etc.).

## Semantics and Naming

- [ ] Interactive element uses correct semantic role/element (`button`, `a`, `input`, `tab`, `menuitem`, `dialog`, ...).
- [ ] Component exposes accessible name (`label`, `aria-label`, `aria-labelledby`) when required.
- [ ] State is announced with ARIA attributes where applicable (`aria-expanded`, `aria-selected`, `aria-checked`, `aria-invalid`, ...).

## Keyboard

- [ ] Full keyboard path exists for open, navigate, select/submit, and close/dismiss.
- [ ] `Tab`/`Shift+Tab` order is logical and predictable.
- [ ] `Escape` behavior is defined for dismissible overlays.
- [ ] Arrow/Home/End/Page navigation is defined where relevant.

## Focus Management

- [ ] Focus moves to the expected target on open/activation.
- [ ] Focus is trapped when required (modal/drawer/dialog patterns).
- [ ] Focus is restored on close/dismiss.
- [ ] Visible focus style is present.

## Validation and Errors

- [ ] Invalid state is communicated (`aria-invalid`, error text linkage via `aria-describedby`).
- [ ] Required state is communicated (`required`/`aria-required`).
- [ ] Error/help text is announced in the right context.

## Disabled/Readonly States

- [ ] Disabled and readonly contracts are explicit and test-covered.
- [ ] Disabled controls are non-interactive via mouse and keyboard.

## Overlay/Popup Rules (if applicable)

- [ ] Outside click behavior is defined and tested.
- [ ] Positioning/collision behavior is defined and tested.
- [ ] Layering policy (`z-index`) is documented.

## Test Matrix

- [ ] Keyboard flow tests
- [ ] ARIA/state assertions
- [ ] Focus/open/close assertions
- [ ] Disabled/readonly assertions
- [ ] Edge-case assertions (empty, invalid, boundary)
