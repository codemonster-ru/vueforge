# API Conventions (Cross-Library)

Baseline conventions for VueForge public component API.

## Prop Naming and Defaults

- Use camelCase prop names in component API docs (`closeOnEsc`, `modelValue`, `ariaLabel`).
- Boolean props default to explicit values in `withDefaults` (`false`/`true`), avoid implicit undefined behavior.
- Size/variant props should follow shared enums where possible:
    - `size`: `'small' | 'normal' | 'large'` (or documented exception)
    - `variant`: `'filled' | 'outlined'` (or documented exception)
- Accessibility props use explicit names:
    - `ariaLabel`, `ariaLabelledby`, `ariaDescribedby`, `ariaInvalid`, `ariaRequired`.
- Overlay components should expose close behavior flags consistently:
    - `closeOnEsc`, `closeOnOverlay`/`closeOnOutside`.

## Emitted Event Naming

- `v-model` updates always emit `update:modelValue`.
- Secondary model channels use `update:<propName>` (`update:sortField`, `update:selection`).
- Keep canonical events terse and consistent:
    - `open`, `close`, `change`, `select`, `submit`, `reset`.
- Keep legacy aliases only for backward compatibility and document deprecation path (`onClick`, `onActive`).

## Slot Naming and Slot Props

- Prefer semantic slot names: `header`, `body`, `footer`, `actions`, `empty`, `loading`.
- Use `default` for main content.
- Document slot props explicitly in docs using object shape syntax.
- Keep slot-prop key naming consistent:
    - state-like props: `active`, `disabled`, `selected`, `invalid`
    - action callbacks: `close`, `reset`, `submit`, `clearSelection`.

## v-model and Controlled/Uncontrolled Behavior

- Controlled mode:
    - when `modelValue` is passed, component state is driven by parent input.
- Uncontrolled mode:
    - when `modelValue` is omitted and component supports it, internal state is allowed.
- In both modes, components should emit `update:modelValue` for state transitions.
- If uncontrolled mode is not supported, document it explicitly.
- For overlay components, close/open side-effects (focus restore, scroll lock) must work in both controlled and uncontrolled paths.

## Documentation Requirements

- Each component doc must include:
    - Props, Events, Slots, Examples, Theming, Tokens, Recipes, Accessibility.
- Interaction-heavy components should include:
    - Interaction contract
    - Positioning and z-index policy (where applicable).
