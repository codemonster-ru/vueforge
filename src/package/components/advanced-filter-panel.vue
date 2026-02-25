<template>
    <section class="vf-advanced-filter-panel" role="region" :aria-label="ariaLabel">
        <header class="vf-advanced-filter-panel__header">
            <div class="vf-advanced-filter-panel__preset">
                <label class="vf-advanced-filter-panel__label" :for="presetInputId">{{ presetLabel }}</label>
                <select
                    :id="presetInputId"
                    class="vf-advanced-filter-panel__select"
                    :disabled="disabled"
                    :value="localState.presetId ?? ''"
                    @change="onPresetSelect"
                >
                    <option value="">{{ noPresetLabel }}</option>
                    <option v-for="preset in presets" :key="preset.id" :value="preset.id">{{ preset.label }}</option>
                </select>
            </div>

            <div class="vf-advanced-filter-panel__actions">
                <button type="button" class="vf-advanced-filter-panel__button" :disabled="disabled" @click="resetState">
                    {{ resetLabel }}
                </button>
                <button type="button" class="vf-advanced-filter-panel__button" :disabled="disabled" @click="applyState">
                    {{ applyLabel }}
                </button>
            </div>
        </header>

        <div v-if="fields.length" class="vf-advanced-filter-panel__fields">
            <label v-for="field in normalizedFields" :key="field.key" class="vf-advanced-filter-panel__field">
                <span class="vf-advanced-filter-panel__label">{{ field.label }}</span>
                <input
                    v-if="field.type === 'text' || field.type === 'number' || field.type === 'date'"
                    class="vf-advanced-filter-panel__input"
                    :type="resolveNativeType(field.type)"
                    :disabled="disabled"
                    :placeholder="field.placeholder || ''"
                    :value="serializeInputValue(localState.fieldValues[field.key])"
                    :data-testid="`field-${field.key}`"
                    @input="onInputField(field.key, field.type || 'text', $event)"
                />
                <select
                    v-else-if="field.type === 'select'"
                    class="vf-advanced-filter-panel__select"
                    :disabled="disabled"
                    :value="String(localState.fieldValues[field.key] ?? '')"
                    :data-testid="`field-${field.key}`"
                    @change="onSelectField(field.key, $event)"
                >
                    <option value=""></option>
                    <option
                        v-for="option in field.options || []"
                        :key="String(option.value)"
                        :value="String(option.value)"
                    >
                        {{ option.label }}
                    </option>
                </select>
                <select
                    v-else
                    class="vf-advanced-filter-panel__select"
                    :disabled="disabled"
                    :value="String(Boolean(localState.fieldValues[field.key]))"
                    :data-testid="`field-${field.key}`"
                    @change="onBooleanField(field.key, $event)"
                >
                    <option value="true">True</option>
                    <option value="false">False</option>
                </select>
            </label>
        </div>

        <QueryBuilder
            v-if="showQueryBuilder"
            :model-value="localState.query"
            :fields="queryBuilderFields"
            :disabled="disabled"
            @update:model-value="onQueryUpdate"
        />
    </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import QueryBuilder from './query-builder.vue';
import type { QueryBuilderGroupNode } from './query-builder-types';
import type {
    AdvancedFilterField,
    AdvancedFilterPanelQueryBuilderField,
    AdvancedFilterPanelQueryPayload,
    AdvancedFilterPanelState,
    AdvancedFilterPreset,
} from './advanced-filter-panel-types';

interface Props {
    modelValue?: AdvancedFilterPanelState | null;
    fields?: Array<AdvancedFilterField>;
    queryBuilderFields?: Array<AdvancedFilterPanelQueryBuilderField>;
    presets?: Array<AdvancedFilterPreset>;
    disabled?: boolean;
    showQueryBuilder?: boolean;
    ariaLabel?: string;
    presetLabel?: string;
    noPresetLabel?: string;
    applyLabel?: string;
    resetLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: null,
    fields: () => [],
    queryBuilderFields: () => [],
    presets: () => [],
    disabled: false,
    showQueryBuilder: true,
    ariaLabel: 'Advanced filter panel',
    presetLabel: 'Preset',
    noPresetLabel: 'Custom',
    applyLabel: 'Apply',
    resetLabel: 'Reset',
});

const emit = defineEmits(['update:modelValue', 'change', 'apply', 'reset', 'presetChange']);

const idCounter = ref(0);
const presetInputId = `vf-advanced-filter-preset-${++idCounter.value}`;

const cloneState = (value: AdvancedFilterPanelState): AdvancedFilterPanelState => JSON.parse(JSON.stringify(value));

const createDefaultQuery = (): QueryBuilderGroupNode => ({
    id: 'vf-afp-root',
    kind: 'group',
    combinator: 'and',
    children: [
        {
            id: 'vf-afp-rule-1',
            kind: 'rule',
            field: props.queryBuilderFields[0]?.key || 'value',
            operator: props.queryBuilderFields[0]?.operators?.[0] || 'contains',
            value: '',
        },
    ],
});

const createFieldValues = () => {
    const values: Record<string, unknown> = {};

    for (const field of props.fields) {
        if (field.defaultValue !== undefined) {
            values[field.key] = field.defaultValue;
            continue;
        }

        if (field.type === 'number') {
            values[field.key] = null;
            continue;
        }

        if (field.type === 'boolean') {
            values[field.key] = false;
            continue;
        }

        values[field.key] = '';
    }

    return values;
};

const createDefaultState = (): AdvancedFilterPanelState => ({
    query: createDefaultQuery(),
    fieldValues: createFieldValues(),
    presetId: null,
});

const normalizeState = (value: AdvancedFilterPanelState | null | undefined): AdvancedFilterPanelState => {
    if (!value) {
        return createDefaultState();
    }

    return {
        query: value.query || createDefaultQuery(),
        fieldValues: {
            ...createFieldValues(),
            ...(value.fieldValues || {}),
        },
        presetId: value.presetId || null,
    };
};

const localState = ref<AdvancedFilterPanelState>(normalizeState(props.modelValue));

const normalizedFields = computed(() =>
    props.fields.map(field => ({
        ...field,
        type: field.type || 'text',
    })),
);

watch(
    () => props.modelValue,
    value => {
        localState.value = normalizeState(value);
    },
    { deep: true },
);

watch(
    () => props.fields,
    () => {
        localState.value = normalizeState(localState.value);
    },
    { deep: true },
);

const commit = () => {
    const payload = cloneState(localState.value);

    emit('update:modelValue', payload);
    emit('change', payload);
};

const applyState = () => {
    const payload = cloneState(localState.value);

    emit('apply', payload);
};

const resetState = () => {
    localState.value = createDefaultState();
    commit();
    emit('reset', cloneState(localState.value));
};

const onPresetSelect = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    const id = target.value || null;
    const preset = props.presets.find(item => item.id === id);

    if (!preset) {
        localState.value.presetId = null;
        commit();
        emit('presetChange', null, cloneState(localState.value));
        return;
    }

    localState.value = normalizeState({
        ...localState.value,
        ...preset.state,
        presetId: preset.id,
    });
    commit();
    emit('presetChange', preset.id, cloneState(localState.value));
};

const resolveNativeType = (type: string) => {
    if (type === 'number') {
        return 'number';
    }

    if (type === 'date') {
        return 'date';
    }

    return 'text';
};

const serializeInputValue = (value: unknown) => {
    if (value === null || value === undefined) {
        return '';
    }

    return String(value);
};

const onInputField = (key: string, type: string, event: Event) => {
    const target = event.target as HTMLInputElement;
    let value: unknown = target.value;

    if (type === 'number') {
        value = target.value.length ? Number(target.value) : null;
    }

    localState.value.fieldValues[key] = value;
    localState.value.presetId = null;
    commit();
};

const onSelectField = (key: string, event: Event) => {
    const target = event.target as HTMLSelectElement;

    localState.value.fieldValues[key] = target.value;
    localState.value.presetId = null;
    commit();
};

const onBooleanField = (key: string, event: Event) => {
    const target = event.target as HTMLSelectElement;

    localState.value.fieldValues[key] = target.value === 'true';
    localState.value.presetId = null;
    commit();
};

const onQueryUpdate = (query: QueryBuilderGroupNode) => {
    localState.value.query = query;
    localState.value.presetId = null;
    commit();
};

const serializeToQueryParams = () => {
    const payload: AdvancedFilterPanelQueryPayload = {};

    if (localState.value.presetId) {
        payload.presetId = localState.value.presetId;
    }

    payload.fieldValues = JSON.stringify(localState.value.fieldValues);
    payload.query = JSON.stringify(localState.value.query);

    const params = new URLSearchParams();

    Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            params.set(key, value);
        }
    });

    return params.toString();
};

const deserializeFromQueryParams = (queryString: string) => {
    try {
        const params = new URLSearchParams(queryString.startsWith('?') ? queryString.slice(1) : queryString);
        const next = normalizeState(localState.value);

        const presetId = params.get('presetId');
        const fieldValues = params.get('fieldValues');
        const query = params.get('query');

        next.presetId = presetId || null;

        if (fieldValues) {
            next.fieldValues = {
                ...createFieldValues(),
                ...(JSON.parse(fieldValues) as Record<string, unknown>),
            };
        }

        if (query) {
            next.query = JSON.parse(query) as QueryBuilderGroupNode;
        }

        localState.value = normalizeState(next);
        commit();
    } catch {
        return false;
    }

    return true;
};

defineExpose({
    serializeToQueryParams,
    deserializeFromQueryParams,
    applyState,
    resetState,
});
</script>

<style lang="scss">
.vf-advanced-filter-panel {
    display: grid;
    gap: var(--vf-advanced-filter-panel-gap);
    padding: var(--vf-advanced-filter-panel-padding);
    border: var(--vf-border-width) solid var(--vf-advanced-filter-panel-border-color);
    border-radius: var(--vf-advanced-filter-panel-border-radius);
    background-color: var(--vf-advanced-filter-panel-background-color);
    color: var(--vf-advanced-filter-panel-text-color);
}

.vf-advanced-filter-panel__header {
    display: flex;
    justify-content: space-between;
    gap: var(--vf-advanced-filter-panel-row-gap);
    flex-wrap: wrap;
}

.vf-advanced-filter-panel__preset,
.vf-advanced-filter-panel__actions {
    display: inline-flex;
    align-items: end;
    gap: var(--vf-advanced-filter-panel-row-gap);
}

.vf-advanced-filter-panel__fields {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
    gap: var(--vf-advanced-filter-panel-row-gap);
}

.vf-advanced-filter-panel__field {
    display: grid;
    gap: 0.35rem;
}

.vf-advanced-filter-panel__label {
    font-size: var(--vf-advanced-filter-panel-label-font-size);
    color: var(--vf-advanced-filter-panel-secondary-text-color);
}

.vf-advanced-filter-panel__input,
.vf-advanced-filter-panel__select,
.vf-advanced-filter-panel__button {
    min-height: var(--vf-advanced-filter-panel-control-height);
    border: var(--vf-border-width) solid var(--vf-advanced-filter-panel-control-border-color);
    border-radius: var(--vf-advanced-filter-panel-control-border-radius);
    background-color: var(--vf-advanced-filter-panel-control-background-color);
    color: inherit;
    font: inherit;
}

.vf-advanced-filter-panel__input,
.vf-advanced-filter-panel__select {
    padding: 0.35rem 0.55rem;
}

.vf-advanced-filter-panel__button {
    padding: 0.35rem 0.7rem;
    cursor: pointer;
}

.vf-advanced-filter-panel__input:focus-visible,
.vf-advanced-filter-panel__select:focus-visible,
.vf-advanced-filter-panel__button:focus-visible,
.vf-advanced-filter-panel__button:hover:not(:disabled) {
    outline: none;
    border-color: var(--vf-advanced-filter-panel-focus-border-color);
    box-shadow: var(--vf-advanced-filter-panel-focus-ring);
}

.vf-advanced-filter-panel__input:disabled,
.vf-advanced-filter-panel__select:disabled,
.vf-advanced-filter-panel__button:disabled {
    opacity: var(--vf-advanced-filter-panel-disabled-opacity);
    cursor: not-allowed;
}
</style>
