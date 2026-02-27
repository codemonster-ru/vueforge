import type { ChartData } from './chart-adapter';

const escapeCsvCell = (value: unknown) => {
    const text = String(value ?? '');
    if (!text.includes(',') && !text.includes('"') && !text.includes('\n')) {
        return text;
    }

    return `"${text.replaceAll('"', '""')}"`;
};

export const createChartCsv = (data: ChartData): string => {
    const labels = data.labels ?? [];
    const datasets = data.datasets ?? [];
    const maxDataLength = Math.max(
        labels.length,
        ...datasets.map(dataset => (Array.isArray(dataset.data) ? dataset.data.length : 0)),
    );

    const header = [
        'Label',
        ...datasets.map((dataset, index) => {
            const label = dataset.label;

            return typeof label === 'string' && label.length > 0 ? label : `Series ${index + 1}`;
        }),
    ];

    const rows = Array.from({ length: maxDataLength }, (_, rowIndex) => {
        const rowLabel = labels[rowIndex] ?? rowIndex + 1;
        const values = datasets.map(dataset => {
            const source = Array.isArray(dataset.data) ? dataset.data : [];

            return source[rowIndex] ?? '';
        });

        return [rowLabel, ...values];
    });

    return [header, ...rows].map(row => row.map(cell => escapeCsvCell(cell)).join(',')).join('\n');
};
