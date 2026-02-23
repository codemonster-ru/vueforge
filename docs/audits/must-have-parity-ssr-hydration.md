# Must-have Parity SSR/Hydration Verification

Purpose: track SSR rendering and hydration verification for interactive components from `P1.11` must-have parity scope.

Verification suites:

- `src/package/components/__tests__/ssr-hydration.test.ts`
- Core baseline check: deterministic SSR + zero hydration mismatch warnings.
- Must-have fixture check: deterministic SSR + successful hydration mount for interactive parity subset.

Coverage notes:

- `TreeTable`, `DataView`, `Carousel`, and `SpeedDial` are included in the must-have hydration fixture.
- `Chart`, `Image`, `OverlayPanel`, and `Listbox` are verified for deterministic SSR markup in the must-have SSR fixture.
- Components with runtime/browser-only behavior are validated through deterministic server output and existing interaction regression tests.
