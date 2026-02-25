<template>
    <section class="vf-data-table-toolbar" role="region" :aria-label="ariaLabel">
        <div class="vf-data-table-toolbar__left">
            <label class="vf-data-table-toolbar__search">
                <span class="vf-data-table-toolbar__label">{{ searchLabel }}</span>
                <input
                    class="vf-data-table-toolbar__input"
                    type="search"
                    :value="search"
                    :placeholder="searchPlaceholder"
                    :disabled="disabled"
                    @input="onSearchInput"
                />
            </label>

            <button type="button" class="vf-data-table-toolbar__button" :disabled="disabled" @click="openFilters">
                {{ filtersLabel }}
                <span v-if="filterCount > 0" class="vf-data-table-toolbar__badge">{{ filterCount }}</span>
            </button>
        </div>

        <div class="vf-data-table-toolbar__right">
            <label class="vf-data-table-toolbar__field">
                <span class="vf-data-table-toolbar__label">{{ columnsLabel }}</span>
                <select
                    class="vf-data-table-toolbar__select"
                    :value="columnPreset ?? ''"
                    :disabled="disabled"
                    @change="onPresetChange"
                >
                    <option value="">{{ noPresetLabel }}</option>
                    <option
                        v-for="option in columnPresets"
                        :key="option.id"
                        :value="option.id"
                        :disabled="option.disabled"
                    >
                        {{ option.label }}
                    </option>
                </select>
            </label>

            <label class="vf-data-table-toolbar__field">
                <span class="vf-data-table-toolbar__label">{{ densityLabel }}</span>
                <select
                    class="vf-data-table-toolbar__select"
                    :value="density"
                    :disabled="disabled"
                    @change="onDensityChange"
                >
                    <option value="comfortable">{{ comfortableLabel }}</option>
                    <option value="compact">{{ compactLabel }}</option>
                    <option value="spacious">{{ spaciousLabel }}</option>
                </select>
            </label>

            <label class="vf-data-table-toolbar__field">
                <span class="vf-data-table-toolbar__label">{{ exportLabel }}</span>
                <select
                    class="vf-data-table-toolbar__select"
                    :disabled="disabled || !exportOptions.length"
                    @change="onExportChange"
                >
                    <option value="">{{ exportActionLabel }}</option>
                    <option
                        v-for="option in exportOptions"
                        :key="option.id"
                        :value="option.id"
                        :disabled="option.disabled"
                    >
                        {{ option.label }}
                    </option>
                </select>
            </label>
        </div>
    </section>
</template>

<script setup lang="ts">
import type { DataTableToolbarDensity, DataTableToolbarOption } from './data-table-toolbar-types';

interface Props {
    search?: string;
    filterCount?: number;
    columnPreset?: string | null;
    columnPresets?: Array<DataTableToolbarOption>;
    density?: DataTableToolbarDensity;
    exportOptions?: Array<DataTableToolbarOption>;
    disabled?: boolean;
    ariaLabel?: string;
    searchLabel?: string;
    searchPlaceholder?: string;
    filtersLabel?: string;
    columnsLabel?: string;
    noPresetLabel?: string;
    densityLabel?: string;
    comfortableLabel?: string;
    compactLabel?: string;
    spaciousLabel?: string;
    exportLabel?: string;
    exportActionLabel?: string;
}

withDefaults(defineProps<Props>(), {
    search: '',
    filterCount: 0,
    columnPreset: null,
    columnPresets: () => [],
    density: 'comfortable',
    exportOptions: () => [],
    disabled: false,
    ariaLabel: 'Data table toolbar',
    searchLabel: 'Search',
    searchPlaceholder: 'Search rows',
    filtersLabel: 'Filters',
    columnsLabel: 'Columns',
    noPresetLabel: 'Default',
    densityLabel: 'Density',
    comfortableLabel: 'Comfortable',
    compactLabel: 'Compact',
    spaciousLabel: 'Spacious',
    exportLabel: 'Export',
    exportActionLabel: 'Export as',
});

const emit = defineEmits([
    'update:search',
    'search',
    'filtersClick',
    'update:columnPreset',
    'columnPresetChange',
    'update:density',
    'densityChange',
    'export',
]);

const onSearchInput = (event: Event) => {
    const target = event.target as HTMLInputElement;

    emit('update:search', target.value);
    emit('search', target.value);
};

const openFilters = () => {
    emit('filtersClick');
};

const onPresetChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    const value = target.value || null;

    emit('update:columnPreset', value);
    emit('columnPresetChange', value);
};

const onDensityChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    const value = target.value as DataTableToolbarDensity;

    emit('update:density', value);
    emit('densityChange', value);
};

const onExportChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;

    if (!target.value) {
        return;
    }

    emit('export', target.value);
    target.value = '';
};
</script>

<style lang="scss">
.vf-data-table-toolbar {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: var(--vf-data-table-toolbar-gap);
    padding: var(--vf-data-table-toolbar-padding);
    border: var(--vf-border-width) solid var(--vf-data-table-toolbar-border-color);
    border-radius: var(--vf-data-table-toolbar-border-radius);
    background-color: var(--vf-data-table-toolbar-background-color);
    color: var(--vf-data-table-toolbar-text-color);
}

.vf-data-table-toolbar__left,
.vf-data-table-toolbar__right {
    display: flex;
    align-items: end;
    flex-wrap: wrap;
    gap: var(--vf-data-table-toolbar-row-gap);
}

.vf-data-table-toolbar__field,
.vf-data-table-toolbar__search {
    display: grid;
    gap: 0.35rem;
}

.vf-data-table-toolbar__label {
    font-size: var(--vf-data-table-toolbar-label-font-size);
    color: var(--vf-data-table-toolbar-secondary-text-color);
}

.vf-data-table-toolbar__input,
.vf-data-table-toolbar__select,
.vf-data-table-toolbar__button {
    min-height: var(--vf-data-table-toolbar-control-height);
    border: var(--vf-border-width) solid var(--vf-data-table-toolbar-control-border-color);
    border-radius: var(--vf-data-table-toolbar-control-border-radius);
    background-color: var(--vf-data-table-toolbar-control-background-color);
    color: inherit;
    font: inherit;
}

.vf-data-table-toolbar__input,
.vf-data-table-toolbar__select {
    padding: 0.35rem 0.55rem;
}

.vf-data-table-toolbar__button {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.35rem 0.7rem;
    cursor: pointer;
}

.vf-data-table-toolbar__badge {
    min-width: 1.2rem;
    padding: 0 0.35rem;
    border-radius: 999px;
    background-color: var(--vf-data-table-toolbar-badge-background-color);
    color: var(--vf-data-table-toolbar-badge-text-color);
    font-size: 0.75rem;
    text-align: center;
}

.vf-data-table-toolbar__input:focus-visible,
.vf-data-table-toolbar__select:focus-visible,
.vf-data-table-toolbar__button:focus-visible,
.vf-data-table-toolbar__button:hover:not(:disabled) {
    outline: none;
    border-color: var(--vf-data-table-toolbar-focus-border-color);
    box-shadow: var(--vf-data-table-toolbar-focus-ring);
}

.vf-data-table-toolbar__input:disabled,
.vf-data-table-toolbar__select:disabled,
.vf-data-table-toolbar__button:disabled {
    opacity: var(--vf-data-table-toolbar-disabled-opacity);
    cursor: not-allowed;
}
</style>
