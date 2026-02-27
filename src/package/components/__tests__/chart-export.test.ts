import { describe, expect, it } from 'vitest';
import { createChartCsv } from '../chart-export';

describe('createChartCsv', () => {
    it('builds csv header and rows from chart data', () => {
        const csv = createChartCsv({
            labels: ['Q1', 'Q2'],
            datasets: [
                { label: 'Revenue', data: [120, 180] },
                { label: 'Cost', data: [70, 90] },
            ],
        });

        expect(csv).toBe('Label,Revenue,Cost\nQ1,120,70\nQ2,180,90');
    });

    it('escapes commas and quotes in labels', () => {
        const csv = createChartCsv({
            labels: ['Region, West', 'He said "Go"'],
            datasets: [{ label: 'Revenue', data: [120, 130] }],
        });

        expect(csv).toBe('Label,Revenue\n"Region, West",120\n"He said ""Go""",130');
    });
});
