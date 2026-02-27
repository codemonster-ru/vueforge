# Chart Theming Token Contracts

Goal: define chart theming contracts for colors, grids, typography, and component states.

## Token Groups

Core surface:

- `borderColor`, `borderRadius`, `backgroundColor`, `textColor`, `padding`, `minHeight`

Chart visuals (engine-oriented):

- `gridColor`
- `axisColor`
- `axisLabelColor`
- `legendTextColor`
- `tooltipBackgroundColor`
- `tooltipTitleColor`
- `tooltipBodyColor`
- `tooltipBorderColor`
- `seriesPrimaryColor`, `seriesSecondaryColor`, `seriesTertiaryColor`, `seriesQuaternaryColor`
- `seriesPositiveColor`, `seriesWarningColor`, `seriesNegativeColor`
- `titleFontFamily`, `titleFontSize`
- `labelFontFamily`, `labelFontSize`
- `valueFontFamily`, `valueFontSize`

State and interaction surface:

- `stateMinHeight`, `stateTextColor`, `stateFontSize`
- `stateBackgroundColor`, `stateBorderColor`, `stateBorderStyle`
- `controlBackgroundColor`, `controlTextColor`, `controlBorderColor`, `controlHoverBackgroundColor`
- `tableHeaderBackgroundColor`, `tableHeaderTextColor`, `tableRowHoverBackgroundColor`, `tableBorderColor`
- `focusOutlineColor`, `focusOutlineOffset`

## Engine Option Mapping

Use `createChartThemeOptions(tokens)` to map token values into chart-engine options:

- `scales.*.grid.color`, `scales.*.ticks.color`, `scales.*.title.color`
- `plugins.legend.labels.color`
- `plugins.tooltip.*` colors and borders
- typography mapping for legend/axis/tooltip fonts when size tokens are pixel-based (`px`)

Use `createChartSeriesPalette(tokens)` to build a deterministic token-based color palette for dataset defaults.

## Example

```ts
import { createChartSeriesPalette, createChartThemeOptions } from '@codemonster-ru/vueforge';

const tokens = {
    gridColor: 'var(--vf-chart-grid-color)',
    axisColor: 'var(--vf-chart-axis-color)',
    legendTextColor: 'var(--vf-chart-legend-text-color)',
    tooltipBackgroundColor: 'var(--vf-chart-tooltip-background-color)',
    labelFontFamily: 'var(--vf-chart-label-font-family)',
    labelFontSize: '13px',
    seriesPrimaryColor: 'var(--vf-chart-series-primary-color)',
    seriesSecondaryColor: 'var(--vf-chart-series-secondary-color)',
};

const themedOptions = createChartThemeOptions(tokens);
const palette = createChartSeriesPalette(tokens);
```

Merge the result into chart component `options` so adapter-level rendering follows the same token contract.
