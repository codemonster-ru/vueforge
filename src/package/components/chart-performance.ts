import type { ChartData } from './chart-adapter';

export interface ChartHighDensitySettings {
    enabled?: boolean;
    pointThreshold?: number;
    decimationAlgorithm?: 'lttb' | 'min-max';
    samples?: number;
}

const DEFAULT_POINT_THRESHOLD = 2000;

export const estimateChartPointCount = (data: ChartData): number =>
    (data.datasets ?? []).reduce((total, dataset) => {
        const points = Array.isArray(dataset.data) ? dataset.data.length : 0;

        return total + points;
    }, 0);

export const shouldEnableChartDecimation = (data: ChartData, threshold: number): boolean =>
    estimateChartPointCount(data) >= threshold;

export const createHighDensityChartOptions = (
    data: ChartData,
    settings: ChartHighDensitySettings = {},
): Record<string, unknown> => {
    const enabled = settings.enabled ?? false;
    if (!enabled) {
        return {};
    }

    const pointThreshold = settings.pointThreshold ?? DEFAULT_POINT_THRESHOLD;
    if (!shouldEnableChartDecimation(data, pointThreshold)) {
        return {};
    }

    return {
        parsing: false,
        animation: false,
        plugins: {
            decimation: {
                enabled: true,
                algorithm: settings.decimationAlgorithm ?? 'lttb',
                samples: settings.samples,
                threshold: pointThreshold,
            },
        },
    };
};
