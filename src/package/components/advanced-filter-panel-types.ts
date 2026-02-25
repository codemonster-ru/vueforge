import type { QueryBuilderField, QueryBuilderGroupNode } from './query-builder-types';

export type AdvancedFilterFieldType = 'text' | 'number' | 'boolean' | 'select' | 'date';

export interface AdvancedFilterFieldOption {
    label: string;
    value: string | number | boolean;
}

export interface AdvancedFilterField {
    key: string;
    label: string;
    type?: AdvancedFilterFieldType;
    placeholder?: string;
    options?: Array<AdvancedFilterFieldOption>;
    defaultValue?: unknown;
}

export interface AdvancedFilterPreset {
    id: string;
    label: string;
    state: Partial<AdvancedFilterPanelState>;
}

export interface AdvancedFilterPanelState {
    query: QueryBuilderGroupNode;
    fieldValues: Record<string, unknown>;
    presetId: string | null;
}

export interface AdvancedFilterPanelQueryPayload {
    presetId?: string;
    fieldValues?: string;
    query?: string;
}

export type AdvancedFilterPanelQueryBuilderField = QueryBuilderField;
