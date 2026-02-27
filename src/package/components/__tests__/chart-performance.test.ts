import { describe, expect, it } from 'vitest';
import {
    createHighDensityChartOptions,
    estimateChartPointCount,
    shouldEnableChartDecimation,
} from '../chart-performance';

describe('chart high-density performance helpers', () => {
    const denseData = {
        labels: Array.from({ length: 1500 }, (_, index) => `T${index + 1}`),
        datasets: [{ label: 'Requests', data: Array.from({ length: 1500 }, (_, index) => index + 1) }],
    };

    it('estimates point count from datasets', () => {
        expect(estimateChartPointCount(denseData)).toBe(1500);
    });

    it('checks threshold for decimation enablement', () => {
        expect(shouldEnableChartDecimation(denseData, 1000)).toBe(true);
        expect(shouldEnableChartDecimation(denseData, 2000)).toBe(false);
    });

    it('creates chart options with decimation plugin only for dense data', () => {
        const denseOptions = createHighDensityChartOptions(denseData, {
            enabled: true,
            pointThreshold: 1000,
            decimationAlgorithm: 'min-max',
            samples: 300,
        });
        const sparseOptions = createHighDensityChartOptions(
            {
                labels: ['Q1', 'Q2'],
                datasets: [{ label: 'Revenue', data: [100, 120] }],
            },
            {
                enabled: true,
                pointThreshold: 1000,
            },
        );

        expect(denseOptions).toMatchObject({
            parsing: false,
            animation: false,
            plugins: {
                decimation: {
                    enabled: true,
                    algorithm: 'min-max',
                    samples: 300,
                    threshold: 1000,
                },
            },
        });
        expect(sparseOptions).toEqual({});
    });
});
