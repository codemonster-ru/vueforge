# Must-have Parity Responsive Checks

Purpose: record responsive verification for `P1.11` must-have parity scope across mobile/tablet/desktop behavior, touch interactions, and overflow handling.

Regression suites:

- `src/package/components/__tests__/must-have-parity-responsive.test.ts`
- Component-specific regressions:
    - `src/package/components/__tests__/carousel.test.ts` (swipe)
    - `src/package/components/__tests__/speed-dial.test.ts` (touch-first action flow)
    - `src/package/components/__tests__/tree-table.test.ts` (table structure with overflow wrapper)
    - `src/package/components/__tests__/image.test.ts` (preview overlay surface)

Coverage summary:

| Component                      | Responsive / touch verification                                                                                            |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| TreeTable                      | Table wrapper structure supports overflow containment in narrow viewports.                                                 |
| DataView                       | Layout switch (`list`/`grid`) is verified for adaptive page composition.                                                   |
| Listbox                        | Scrollable list surface and grouped options behavior are covered in component regression tests.                            |
| MenuBar / MegaMenu / PanelMenu | Navigation structures and expansion interactions are covered with keyboard/interaction tests and responsive docs guidance. |
| Carousel                       | Swipe gestures and arrow controls are verified for touch flows.                                                            |
| SpeedDial                      | Floating action trigger/action visibility is covered for touch-first interactions.                                         |
| Chart                          | Responsive canvas container behavior is documented and covered by deterministic render tests.                              |
| Image                          | Preview/lightbox overlay and bounded dialog surface are verified.                                                          |
| OverlayPanel                   | Popover-backed overlay behavior is verified with dismiss/interaction tests and inherited collision handling.               |

Notes:

- Touch-target and overflow contracts are enforced at component level through tokenized sizing and structural wrappers.
- Responsive safety net is currently enforced through component-level regression tests and responsive docs guidance.
