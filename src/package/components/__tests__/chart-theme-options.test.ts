import { describe, expect, it } from 'vitest';
import { createChartSeriesPalette, createChartThemeOptions } from '../chart-theme-options';

describe('createChartThemeOptions', () => {
    it('maps chart token contract to engine options', () => {
        const options = createChartThemeOptions({
            gridColor: '#d1d5db',
            axisColor: '#6b7280',
            axisLabelColor: '#111827',
            legendTextColor: '#111827',
            tooltipBackgroundColor: '#0f172a',
            tooltipTitleColor: '#f8fafc',
            tooltipBodyColor: '#e2e8f0',
            tooltipBorderColor: '#334155',
            titleFontFamily: 'Inter',
            titleFontSize: '14px',
            labelFontFamily: 'Inter',
            labelFontSize: '13px',
            valueFontFamily: 'Inter',
            valueFontSize: '12px',
        });

        expect(options).toMatchObject({
            plugins: {
                legend: {
                    labels: {
                        color: '#111827',
                        font: {
                            family: 'Inter',
                            size: 13,
                        },
                    },
                },
                tooltip: {
                    backgroundColor: '#0f172a',
                    titleColor: '#f8fafc',
                    bodyColor: '#e2e8f0',
                    borderColor: '#334155',
                    borderWidth: 1,
                    titleFont: {
                        family: 'Inter',
                        size: 14,
                    },
                    bodyFont: {
                        family: 'Inter',
                        size: 12,
                    },
                },
            },
            scales: {
                x: {
                    grid: { color: '#d1d5db' },
                    ticks: {
                        color: '#6b7280',
                        font: {
                            family: 'Inter',
                            size: 12,
                        },
                    },
                    title: {
                        color: '#111827',
                        font: {
                            family: 'Inter',
                            size: 13,
                        },
                    },
                },
            },
        });
    });

    it('ignores non-px font size tokens', () => {
        const options = createChartThemeOptions({
            labelFontFamily: 'Inter',
            labelFontSize: '0.875rem',
        });

        const legend = (options.plugins as { legend?: { labels?: { font?: Record<string, unknown> } } }).legend;
        expect(legend?.labels?.font).toEqual({ family: 'Inter' });
    });

    it('builds series palette from tokenized color slots', () => {
        const palette = createChartSeriesPalette({
            seriesPrimaryColor: '#2563eb',
            seriesSecondaryColor: '#7c3aed',
            seriesWarningColor: '#f59e0b',
        });

        expect(palette).toEqual(['#2563eb', '#7c3aed', '#f59e0b']);
    });
});
