export type ChartType = 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'polarArea' | 'bubble' | 'scatter';

export interface ChartData {
    labels?: Array<string | number>;
    datasets?: Array<Record<string, unknown>>;
}

export interface ChartConfig {
    type: ChartType;
    data: ChartData;
    options?: Record<string, unknown>;
}

export interface ChartAdapterInstance {
    [key: string]: unknown;
}

export interface ChartAdapter {
    mount: (container: HTMLCanvasElement, config: ChartConfig) => ChartAdapterInstance;
    update?: (instance: ChartAdapterInstance, config: ChartConfig) => void;
    resize?: (instance: ChartAdapterInstance) => void;
    destroy?: (instance: ChartAdapterInstance) => void;
    exportPng?: (instance: ChartAdapterInstance, config: ChartConfig) => string;
    exportSvg?: (instance: ChartAdapterInstance, config: ChartConfig) => string;
    exportCsv?: (instance: ChartAdapterInstance, config: ChartConfig) => string;
    setPrintMode?: (instance: ChartAdapterInstance, enabled: boolean) => void;
}

type ChartJsLikeConstructor = new (
    context: CanvasRenderingContext2D,
    config: {
        type: ChartType;
        data: ChartData;
        options?: Record<string, unknown>;
    },
) => {
    update: () => void;
    resize: () => void;
    destroy: () => void;
    config: {
        type: ChartType;
        data: ChartData;
        options?: Record<string, unknown>;
    };
    toBase64Image?: () => string;
};

export const createChartJsAdapter = (ChartCtor: ChartJsLikeConstructor): ChartAdapter => ({
    mount(canvas, config) {
        const context = canvas.getContext('2d');

        if (!context) {
            throw new Error('Chart mount failed: 2D canvas context is not available.');
        }

        return new ChartCtor(context, {
            type: config.type,
            data: config.data,
            options: config.options,
        });
    },
    update(instance, config) {
        const chart = instance as {
            update: () => void;
            config: {
                type: ChartType;
                data: ChartData;
                options?: Record<string, unknown>;
            };
        };

        chart.config.type = config.type;
        chart.config.data = config.data;
        chart.config.options = config.options;
        chart.update();
    },
    resize(instance) {
        const chart = instance as { resize: () => void };

        chart.resize();
    },
    destroy(instance) {
        const chart = instance as { destroy: () => void };

        chart.destroy();
    },
    exportPng(instance) {
        const chart = instance as {
            toBase64Image?: () => string;
        };

        return chart.toBase64Image?.() ?? '';
    },
});
