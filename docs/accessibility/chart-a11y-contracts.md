# Chart Accessibility Contracts

Goal: define shared accessibility contracts for chart components based on `Chart`.

## Contract Surface

- `ariaLabel`: short chart name announced for canvas role `img`.
- `a11ySummary`: optional screen-reader summary for trend/context.
- `a11yKeyboardHint`: optional keyboard guidance text for assistive users.
- `a11yTableFallback`: enable keyboard-accessible tabular fallback for chart values.
- `tableCaption`, `tableLabelHeader`, `showTableText`, `hideTableText`: data-table fallback localization/customization.

## Keyboard Contract

- Chart canvas is focusable (`tabindex="0"`).
- Data-table fallback toggle is a native button and must remain keyboard operable with `Enter`/`Space`.
- Toggle must expose `aria-expanded` and `aria-controls`.

## Screen Reader Contract

- Canvas keeps `role="img"` and is labeled via `ariaLabel`.
- Summary and keyboard hint are exposed through `aria-describedby`.
- Summary text should include business context and timeframe (not only visual styling info).

## Data Table Fallback Contract

- Fallback is opt-in (`a11yTableFallback`).
- Fallback table includes:
    - `<caption>` for chart context.
    - Row header column for labels/categories/time points.
    - One column per dataset/series.
- Missing values are rendered with a stable placeholder (`-`).

## Usage Notes

- For KPI-critical charts, provide both `a11ySummary` and `a11yTableFallback`.
- Keep chart interactivity instructions in `a11yKeyboardHint` when custom interactions are added via adapter options.
