import { describe, expect, it } from 'vitest';
import { createChartDataSchema, validateChartDataSchema, type ChartDataSchema } from '../chart-schema';

describe('chart data schema contracts', () => {
    const createValidSchema = (): ChartDataSchema => ({
        series: [
            { id: 'revenue', label: 'Revenue', axis: 'y', dataKey: 'revenue' },
            { id: 'cost', label: 'Cost', axis: 'y', dataKey: 'cost' },
        ],
        axes: [
            { id: 'x', position: 'bottom', scale: 'time' },
            { id: 'y', position: 'left', scale: 'linear', format: 'currency' },
        ],
        legend: { visible: true, position: 'bottom', interactive: true },
        tooltip: { enabled: true, mode: 'index', shared: true },
        annotations: [{ id: 'target', type: 'line', axis: 'y', value: 1000, label: 'Target' }],
    });

    it('creates schema as typed pass-through object', () => {
        const schema = createValidSchema();

        expect(createChartDataSchema(schema)).toEqual(schema);
    });

    it('returns no errors for valid schema', () => {
        const errors = validateChartDataSchema(createValidSchema());

        expect(errors).toEqual([]);
    });

    it('validates duplicates, empty series and invalid axis references', () => {
        const errors = validateChartDataSchema({
            series: [
                { id: 'revenue', label: 'Revenue', axis: 'y' },
                { id: 'revenue', label: 'Revenue duplicate', axis: 'missing' },
            ],
            axes: [{ id: 'y', position: 'left' }],
            annotations: [
                { id: 'marker', type: 'line', axis: 'missing' },
                { id: 'marker', type: 'point', axis: 'y' },
            ],
        });

        expect(errors).toContain('Duplicate series id: "revenue".');
        expect(errors).toContain('Duplicate annotation id: "marker".');
        expect(errors).toContain('Series "revenue" references unknown axis "missing".');
        expect(errors).toContain('Annotation "marker" references unknown axis "missing".');
    });

    it('requires at least one series', () => {
        const errors = validateChartDataSchema({
            series: [],
            axes: [{ id: 'y', position: 'left' }],
        });

        expect(errors).toContain('Chart data schema must define at least one series.');
    });
});
