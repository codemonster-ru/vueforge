export type ChartAxisScale = 'linear' | 'logarithmic' | 'category' | 'time' | 'percentage';

export interface ChartSeriesSchema {
    id: string;
    label: string;
    axis?: string;
    stack?: string;
    colorToken?: string;
    dataKey?: string;
    hidden?: boolean;
}

export interface ChartAxisSchema {
    id: string;
    position: 'left' | 'right' | 'top' | 'bottom';
    label?: string;
    scale?: ChartAxisScale;
    min?: number;
    max?: number;
    format?: 'number' | 'currency' | 'percent' | 'date' | 'duration' | 'custom';
}

export interface ChartLegendSchema {
    visible?: boolean;
    position?: 'top' | 'right' | 'bottom' | 'left';
    interactive?: boolean;
}

export interface ChartTooltipSchema {
    enabled?: boolean;
    mode?: 'nearest' | 'index' | 'dataset';
    shared?: boolean;
    showColorIndicator?: boolean;
}

export interface ChartAnnotationSchema {
    id: string;
    type: 'line' | 'band' | 'point' | 'label';
    axis?: string;
    value?: number | string | Date;
    from?: number | string | Date;
    to?: number | string | Date;
    label?: string;
}

export interface ChartDataSchema {
    series: ChartSeriesSchema[];
    axes?: ChartAxisSchema[];
    legend?: ChartLegendSchema;
    tooltip?: ChartTooltipSchema;
    annotations?: ChartAnnotationSchema[];
}

const findDuplicates = (items: string[]) => {
    const duplicates = new Set<string>();
    const seen = new Set<string>();

    for (const item of items) {
        if (seen.has(item)) {
            duplicates.add(item);
            continue;
        }

        seen.add(item);
    }

    return Array.from(duplicates);
};

export const validateChartDataSchema = (schema: ChartDataSchema): string[] => {
    const errors: string[] = [];
    const axes = schema.axes ?? [];
    const axisIds = new Set(axes.map(axis => axis.id));
    const seriesIds = schema.series.map(series => series.id);
    const annotationIds = (schema.annotations ?? []).map(annotation => annotation.id);
    const duplicatedSeries = findDuplicates(seriesIds);
    const duplicatedAxes = findDuplicates(axes.map(axis => axis.id));
    const duplicatedAnnotations = findDuplicates(annotationIds);

    if (schema.series.length === 0) {
        errors.push('Chart data schema must define at least one series.');
    }

    for (const id of duplicatedSeries) {
        errors.push(`Duplicate series id: "${id}".`);
    }

    for (const id of duplicatedAxes) {
        errors.push(`Duplicate axis id: "${id}".`);
    }

    for (const id of duplicatedAnnotations) {
        errors.push(`Duplicate annotation id: "${id}".`);
    }

    for (const series of schema.series) {
        if (series.axis && !axisIds.has(series.axis)) {
            errors.push(`Series "${series.id}" references unknown axis "${series.axis}".`);
        }
    }

    for (const annotation of schema.annotations ?? []) {
        if (annotation.axis && !axisIds.has(annotation.axis)) {
            errors.push(`Annotation "${annotation.id}" references unknown axis "${annotation.axis}".`);
        }
    }

    return errors;
};

export const createChartDataSchema = <T extends ChartDataSchema>(schema: T): T => schema;
