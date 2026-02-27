# Chart Secure Data Rendering Guidance

Goal: define safe defaults for untrusted labels, tooltip content, and formatter callbacks.

## Trust Boundaries

- Treat chart `labels`, dataset `label`, and formatter inputs as untrusted when data originates from users, external feeds, or imported files.
- Keep adapter options data-only by default; avoid passing raw HTML through tooltip/legend/title callbacks.
- If engine supports custom HTML tooltips, sanitize all interpolated text before injection.

## Recommended Defaults

- Prefer plain-text tooltip/title/legend rendering over HTML mode.
- Escape dynamic text with:
    - `sanitizeChartText(value)`
    - `escapeChartHtml(value)`
- Reject or normalize excessively long labels before rendering in dense charts.

## Example

```ts
import { sanitizeChartText } from '@codemonster-ru/vueforge';

const safeOptions = {
    plugins: {
        tooltip: {
            callbacks: {
                title: items => sanitizeChartText(items?.[0]?.label ?? ''),
                label: item => sanitizeChartText(`${item.dataset.label}: ${item.formattedValue}`),
            },
        },
    },
};
```

## What Not to Do

- Do not concatenate untrusted values into HTML template strings for external tooltip containers.
- Do not rely on chart-engine internals to sanitize HTML automatically.
