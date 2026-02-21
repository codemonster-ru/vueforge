# Disclosure and Multi-Step Accessibility Audit

Components covered:

- `Tabs`
- `Accordion`
- `Stepper`
- `Wizard`

## Shared Keyboard Checklist

- Arrow navigation across interactive headers/steps is supported where applicable.
- `Home`/`End` navigation to first/last interactive item is supported.
- `Enter`/`Space` activation works on interactive controls.
- Disabled items are not focusable/activatable.

## Shared ARIA Checklist

- `Tabs`: `tablist` + `tab` + `tabpanel` relationship (`aria-controls`, `aria-labelledby`, selected state).
- `Accordion`: header button controls panel (`aria-expanded`, `aria-controls`) and panel labeling (`aria-labelledby`).
- `Stepper`: active step marked with `aria-current="step"` and interactive mode uses button semantics.
- `Wizard`: step list uses `tablist` with `tab` controls, and panels expose `tabpanel` with label relationship.

## Audit Summary

- Keyboard behavior verified with regression tests for:
    - `Tabs` horizontal and vertical keyboard navigation.
    - `Accordion` header focus traversal via arrow/home keys.
    - `Stepper` keyboard navigation and state transitions in clickable mode.
    - `Wizard` keyboard navigation across step tabs and state transitions.
- ARIA contracts verified in component templates and covered in tests/docs.

Status: baseline audit completed for `P1.3` hardening.
