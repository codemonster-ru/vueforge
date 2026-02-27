export interface ChartThemeOptionsTokens {
    gridColor?: string;
    axisColor?: string;
    axisLabelColor?: string;
    legendTextColor?: string;
    tooltipBackgroundColor?: string;
    tooltipTitleColor?: string;
    tooltipBodyColor?: string;
    tooltipBorderColor?: string;
    seriesPrimaryColor?: string;
    seriesSecondaryColor?: string;
    seriesTertiaryColor?: string;
    seriesQuaternaryColor?: string;
    seriesPositiveColor?: string;
    seriesWarningColor?: string;
    seriesNegativeColor?: string;
    titleFontFamily?: string;
    titleFontSize?: string;
    labelFontFamily?: string;
    labelFontSize?: string;
    valueFontFamily?: string;
    valueFontSize?: string;
}

const toPxNumber = (value?: string): number | undefined => {
    if (!value || !value.endsWith('px')) {
        return undefined;
    }

    const parsed = Number.parseFloat(value);

    return Number.isFinite(parsed) ? parsed : undefined;
};

const withFont = (family?: string, size?: string) => {
    const normalizedSize = toPxNumber(size);
    const font: { family?: string; size?: number } = {};

    if (family) {
        font.family = family;
    }

    if (normalizedSize !== undefined) {
        font.size = normalizedSize;
    }

    return Object.keys(font).length > 0 ? font : undefined;
};

export const createChartThemeOptions = (tokens: ChartThemeOptionsTokens): Record<string, unknown> => {
    const xTickFont = withFont(tokens.valueFontFamily, tokens.valueFontSize);
    const yTickFont = withFont(tokens.valueFontFamily, tokens.valueFontSize);
    const axisTitleFont = withFont(tokens.labelFontFamily, tokens.labelFontSize);
    const legendLabelFont = withFont(tokens.labelFontFamily, tokens.labelFontSize);
    const tooltipTitleFont = withFont(tokens.titleFontFamily, tokens.titleFontSize);
    const tooltipBodyFont = withFont(tokens.valueFontFamily, tokens.valueFontSize);

    return {
        plugins: {
            legend: {
                labels: {
                    color: tokens.legendTextColor ?? tokens.axisLabelColor ?? tokens.axisColor,
                    font: legendLabelFont,
                },
            },
            tooltip: {
                backgroundColor: tokens.tooltipBackgroundColor,
                titleColor: tokens.tooltipTitleColor,
                bodyColor: tokens.tooltipBodyColor,
                borderColor: tokens.tooltipBorderColor,
                borderWidth: tokens.tooltipBorderColor ? 1 : undefined,
                titleFont: tooltipTitleFont,
                bodyFont: tooltipBodyFont,
            },
        },
        scales: {
            x: {
                grid: {
                    color: tokens.gridColor,
                },
                ticks: {
                    color: tokens.axisColor,
                    font: xTickFont,
                },
                title: {
                    color: tokens.axisLabelColor ?? tokens.axisColor,
                    font: axisTitleFont,
                },
            },
            y: {
                grid: {
                    color: tokens.gridColor,
                },
                ticks: {
                    color: tokens.axisColor,
                    font: yTickFont,
                },
                title: {
                    color: tokens.axisLabelColor ?? tokens.axisColor,
                    font: axisTitleFont,
                },
            },
        },
    };
};

export const createChartSeriesPalette = (tokens: ChartThemeOptionsTokens): string[] =>
    [
        tokens.seriesPrimaryColor,
        tokens.seriesSecondaryColor,
        tokens.seriesTertiaryColor,
        tokens.seriesQuaternaryColor,
        tokens.seriesPositiveColor,
        tokens.seriesWarningColor,
        tokens.seriesNegativeColor,
    ].filter((value): value is string => Boolean(value));
