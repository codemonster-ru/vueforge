# Headless Parity Matrix (Key Components)

Last updated: 2026-02-24

Purpose: track slot API and part-level pass-through (`pt`) coverage for the current key headless/unstyled-capable components in parity scope.

## Scope

- `Carousel`
- `Chart`
- `Image`
- `SpeedDial`
- `OverlayPanel`

## Matrix

| Component      | Slots (documented)                                                               | Parts (`pt`)                                                                                                | `unstyled` | Contract test                                              |
| -------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------- |
| `Carousel`     | `item`, `prevIcon`, `nextIcon`                                                   | `root`, `viewport`, `track`, `slide`, `prevArrow`, `nextArrow`, `indicators`, `indicator`                   | Yes        | `src/package/components/__tests__/headless-parity.test.ts` |
| `Chart`        | `loading`, `empty`                                                               | `root`, `state`, `canvasWrap`, `canvas`                                                                     | Yes        | `src/package/components/__tests__/headless-parity.test.ts` |
| `Image`        | none named                                                                       | `root`, `trigger`, `img`, `overlay`, `dialog`, `preview`, `close`, `toolbarButton`, `navButton`, `download` | Yes        | `src/package/components/__tests__/headless-parity.test.ts` |
| `SpeedDial`    | `trigger`, `action`                                                              | `root`, `trigger`, `actions`, `item`, `action`, `label`                                                     | Yes        | `src/package/components/__tests__/headless-parity.test.ts` |
| `OverlayPanel` | `trigger`, `header`, `default`, `body`, `footer` (+ `button`/`popover*` aliases) | `root`, `header`, `close`                                                                                   | Yes        | `src/package/components/__tests__/headless-parity.test.ts` |

## Notes

- Slot contracts and part names must stay in sync with component docs and tests in the same PR when changed.
- `unstyled` mode is considered parity-ready only when a test verifies built-in classes are removed and custom `pt` classes are applied.
