# Browser Support Matrix

Last updated: 2026-02-21

## Officially Supported Browsers

- Chrome (latest 2 stable versions)
- Edge (latest 2 stable versions)
- Firefox (latest 2 stable versions)
- Safari (latest 2 major versions, macOS/iOS)

## Baseline Requirements

- CSS custom properties support
- `ResizeObserver`
- `IntersectionObserver` (for components using viewport/virtualization patterns)
- Modern ES module runtime (Vite-compatible targets)

## Known Limitations

- Older Safari versions may have minor differences in focus-visible rendering.
- Legacy browsers without CSS variables are not supported without polyfill strategy.
- Fine-grained overlay positioning may differ by sub-pixel rounding across engines.

## Guidance

- Keep mission-critical accessibility flows validated on at least one Chromium browser and Safari.
- For enterprise environments, pin and document the exact tested browser versions per release.
