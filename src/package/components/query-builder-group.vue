<template>
    <section class="vf-query-builder__group" :data-depth="depth">
        <header class="vf-query-builder__group-header">
            <label class="vf-query-builder__group-label">
                {{ combinatorLabel }}
                <select
                    class="vf-query-builder__select"
                    :disabled="disabled"
                    :value="group.combinator"
                    :data-testid="`group-combinator-${pathLabel}`"
                    @change="onCombinatorChange"
                >
                    <option value="and">{{ andLabel }}</option>
                    <option value="or">{{ orLabel }}</option>
                </select>
            </label>
            <div class="vf-query-builder__group-actions">
                <button
                    type="button"
                    class="vf-query-builder__button"
                    :disabled="disabled"
                    :data-testid="`add-rule-${pathLabel}`"
                    @click="$emit('add-rule', { path })"
                >
                    {{ addRuleLabel }}
                </button>
                <button
                    type="button"
                    class="vf-query-builder__button"
                    :disabled="disabled || depth >= maxDepth"
                    :data-testid="`add-group-${pathLabel}`"
                    @click="$emit('add-group', { path })"
                >
                    {{ addGroupLabel }}
                </button>
                <button
                    v-if="removable"
                    type="button"
                    class="vf-query-builder__button vf-query-builder__button_danger"
                    :disabled="disabled"
                    :data-testid="`remove-group-${pathLabel}`"
                    @click="$emit('remove-group', { path })"
                >
                    {{ removeGroupLabel }}
                </button>
            </div>
        </header>

        <div class="vf-query-builder__children">
            <div
                v-for="(node, index) in group.children"
                :key="node.id"
                class="vf-query-builder__node"
                :class="{ 'vf-query-builder__node_group': node.kind === 'group' }"
            >
                <div v-if="node.kind === 'rule'" class="vf-query-builder__rule">
                    <select
                        class="vf-query-builder__select"
                        :disabled="disabled"
                        :value="node.field"
                        :data-testid="`rule-field-${pathLabel}-${index}`"
                        @change="onRuleFieldChange(index, $event)"
                    >
                        <option v-for="field in fields" :key="field.key" :value="field.key">{{ field.label }}</option>
                    </select>
                    <select
                        class="vf-query-builder__select"
                        :disabled="disabled"
                        :value="node.operator"
                        :data-testid="`rule-operator-${pathLabel}-${index}`"
                        @change="onRuleOperatorChange(index, $event)"
                    >
                        <option v-for="operator in getFieldOperators(node.field)" :key="operator" :value="operator">
                            {{ getOperatorLabel(operator) }}
                        </option>
                    </select>

                    <template v-if="isBooleanField(node.field)">
                        <select
                            class="vf-query-builder__input"
                            :disabled="disabled || isUnaryOperator(node.operator)"
                            :value="String(Boolean(node.value))"
                            :data-testid="`rule-value-${pathLabel}-${index}`"
                            @change="onRuleValueChange(index, ($event.target as HTMLSelectElement).value === 'true')"
                        >
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </select>
                    </template>
                    <template v-else-if="isSelectField(node.field)">
                        <select
                            class="vf-query-builder__input"
                            :disabled="disabled || isUnaryOperator(node.operator)"
                            :value="String(node.value ?? '')"
                            :data-testid="`rule-value-${pathLabel}-${index}`"
                            @change="onRuleValueChange(index, ($event.target as HTMLSelectElement).value)"
                        >
                            <option value=""></option>
                            <option
                                v-for="option in getFieldOptions(node.field)"
                                :key="String(option.value)"
                                :value="String(option.value)"
                            >
                                {{ option.label }}
                            </option>
                        </select>
                    </template>
                    <template v-else>
                        <input
                            class="vf-query-builder__input"
                            :disabled="disabled || isUnaryOperator(node.operator)"
                            :type="getInputType(node.field)"
                            :value="serializeInputValue(node.value)"
                            :data-testid="`rule-value-${pathLabel}-${index}`"
                            @input="onRuleValueInput(index, $event)"
                        />
                    </template>

                    <button
                        type="button"
                        class="vf-query-builder__button vf-query-builder__button_danger"
                        :disabled="disabled"
                        :data-testid="`remove-node-${pathLabel}-${index}`"
                        @click="$emit('remove-node', { path, index })"
                    >
                        {{ removeRuleLabel }}
                    </button>
                </div>

                <QueryBuilderGroup
                    v-else
                    :group="node"
                    :fields="fields"
                    :depth="depth + 1"
                    :path="[...path, index]"
                    :max-depth="maxDepth"
                    :disabled="disabled"
                    :and-label="andLabel"
                    :or-label="orLabel"
                    :add-rule-label="addRuleLabel"
                    :add-group-label="addGroupLabel"
                    :remove-rule-label="removeRuleLabel"
                    :remove-group-label="removeGroupLabel"
                    :combinator-label="combinatorLabel"
                    :removable="true"
                    @change-combinator="$emit('change-combinator', $event)"
                    @add-rule="$emit('add-rule', $event)"
                    @add-group="$emit('add-group', $event)"
                    @remove-group="$emit('remove-group', $event)"
                    @remove-node="$emit('remove-node', $event)"
                    @rule-field="$emit('rule-field', $event)"
                    @rule-operator="$emit('rule-operator', $event)"
                    @rule-value="$emit('rule-value', $event)"
                />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type {
    QueryBuilderCombinator,
    QueryBuilderField,
    QueryBuilderFieldOption,
    QueryBuilderGroupNode,
} from './query-builder-types';

interface Props {
    group: QueryBuilderGroupNode;
    fields: Array<QueryBuilderField>;
    depth: number;
    path: Array<number>;
    maxDepth: number;
    disabled: boolean;
    andLabel: string;
    orLabel: string;
    addRuleLabel: string;
    addGroupLabel: string;
    removeRuleLabel: string;
    removeGroupLabel: string;
    combinatorLabel: string;
    removable: boolean;
}

defineOptions({
    name: 'QueryBuilderGroup',
});

const emit = defineEmits([
    'change-combinator',
    'add-rule',
    'add-group',
    'remove-group',
    'remove-node',
    'rule-field',
    'rule-operator',
    'rule-value',
]);

const props = defineProps<Props>();

const pathLabel = computed(() => (props.path.length ? props.path.join('-') : 'root'));

const defaultOperatorsByType: Record<string, Array<string>> = {
    text: ['contains', 'equals', 'notEquals', 'startsWith', 'endsWith', 'isEmpty', 'isNotEmpty'],
    number: ['equals', 'notEquals', 'gt', 'gte', 'lt', 'lte', 'isEmpty', 'isNotEmpty'],
    date: ['equals', 'notEquals', 'gt', 'gte', 'lt', 'lte', 'isEmpty', 'isNotEmpty'],
    boolean: ['equals', 'notEquals'],
    select: ['equals', 'notEquals', 'isEmpty', 'isNotEmpty'],
};

const getFieldByKey = (key: string) => props.fields.find(field => field.key === key);

const getFieldOperators = (key: string) => {
    const field = getFieldByKey(key);
    const fallback = defaultOperatorsByType[field?.type || 'text'] || defaultOperatorsByType.text;

    return field?.operators?.length ? field.operators : fallback;
};

const getFieldOptions = (key: string): Array<QueryBuilderFieldOption> => {
    const field = getFieldByKey(key);

    return field?.options || [];
};

const isBooleanField = (key: string) => getFieldByKey(key)?.type === 'boolean';
const isSelectField = (key: string) => getFieldByKey(key)?.type === 'select';
const isUnaryOperator = (operator: string) => operator === 'isEmpty' || operator === 'isNotEmpty';

const getInputType = (key: string) => {
    const field = getFieldByKey(key);

    if (field?.type === 'number') {
        return 'number';
    }

    if (field?.type === 'date') {
        return 'date';
    }

    return 'text';
};

const parseInputValue = (key: string, value: string) => {
    const field = getFieldByKey(key);

    if (field?.type === 'number') {
        if (!value.length) {
            return null;
        }

        const numberValue = Number(value);

        return Number.isFinite(numberValue) ? numberValue : null;
    }

    return value;
};

const serializeInputValue = (value: unknown) => {
    if (value === null || value === undefined) {
        return '';
    }

    return String(value);
};

const getOperatorLabel = (operator: string) =>
    operator.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, letter => letter.toUpperCase());

const onCombinatorChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    const combinator = target.value as QueryBuilderCombinator;

    emit('change-combinator', { path: props.path, combinator });
};

const onRuleFieldChange = (index: number, event: Event) => {
    const target = event.target as HTMLSelectElement;

    emit('rule-field', { path: props.path, index, field: target.value });
};

const onRuleOperatorChange = (index: number, event: Event) => {
    const target = event.target as HTMLSelectElement;

    emit('rule-operator', { path: props.path, index, operator: target.value });
};

const onRuleValueChange = (index: number, value: unknown) => {
    emit('rule-value', { path: props.path, index, value });
};

const onRuleValueInput = (index: number, event: Event) => {
    const target = event.target as HTMLInputElement;
    const fieldKey = props.group.children[index]?.kind === 'rule' ? props.group.children[index].field : '';

    emit('rule-value', { path: props.path, index, value: parseInputValue(fieldKey, target.value) });
};
</script>
