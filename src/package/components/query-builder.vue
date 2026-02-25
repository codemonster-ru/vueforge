<template>
    <div class="vf-query-builder" role="group" :aria-label="ariaLabel">
        <QueryBuilderGroup
            :group="model"
            :fields="normalizedFields"
            :depth="0"
            :path="[]"
            :max-depth="maxDepth"
            :disabled="disabled"
            :and-label="andLabel"
            :or-label="orLabel"
            :add-rule-label="addRuleLabel"
            :add-group-label="addGroupLabel"
            :remove-rule-label="removeRuleLabel"
            :remove-group-label="removeGroupLabel"
            :combinator-label="combinatorLabel"
            :removable="false"
            @change-combinator="onChangeCombinator"
            @add-rule="onAddRule"
            @add-group="onAddGroup"
            @remove-group="onRemoveGroup"
            @remove-node="onRemoveNode"
            @rule-field="onRuleField"
            @rule-operator="onRuleOperator"
            @rule-value="onRuleValue"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import QueryBuilderGroup from './query-builder-group.vue';
import type {
    QueryBuilderCombinator,
    QueryBuilderField,
    QueryBuilderFieldType,
    QueryBuilderGroupNode,
    QueryBuilderNode,
    QueryBuilderOperator,
    QueryBuilderRuleNode,
} from './query-builder-types';

interface Props {
    modelValue?: QueryBuilderGroupNode | null;
    fields?: Array<QueryBuilderField>;
    maxDepth?: number;
    disabled?: boolean;
    ariaLabel?: string;
    andLabel?: string;
    orLabel?: string;
    addRuleLabel?: string;
    addGroupLabel?: string;
    removeRuleLabel?: string;
    removeGroupLabel?: string;
    combinatorLabel?: string;
}

type GroupPath = Array<number>;

interface NodePayload {
    path: GroupPath;
}

interface RulePayload extends NodePayload {
    index: number;
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: null,
    fields: () => [],
    maxDepth: 5,
    disabled: false,
    ariaLabel: 'Query builder',
    andLabel: 'AND',
    orLabel: 'OR',
    addRuleLabel: '+ Rule',
    addGroupLabel: '+ Group',
    removeRuleLabel: 'Remove',
    removeGroupLabel: 'Remove group',
    combinatorLabel: 'Match',
});

const emit = defineEmits(['update:modelValue', 'change']);

const idCounter = ref(0);

const defaultOperatorsByType: Record<QueryBuilderFieldType, Array<QueryBuilderOperator>> = {
    text: ['contains', 'equals', 'notEquals', 'startsWith', 'endsWith', 'isEmpty', 'isNotEmpty'],
    number: ['equals', 'notEquals', 'gt', 'gte', 'lt', 'lte', 'isEmpty', 'isNotEmpty'],
    date: ['equals', 'notEquals', 'gt', 'gte', 'lt', 'lte', 'isEmpty', 'isNotEmpty'],
    boolean: ['equals', 'notEquals'],
    select: ['equals', 'notEquals', 'isEmpty', 'isNotEmpty'],
};

const normalizedFields = computed<Array<QueryBuilderField>>(() => {
    if (!props.fields.length) {
        return [
            {
                key: 'value',
                label: 'Value',
                type: 'text',
            },
        ];
    }

    return props.fields.map(field => ({
        ...field,
        type: field.type || 'text',
    }));
});

const createId = () => {
    idCounter.value += 1;

    return `vf-qb-${idCounter.value}`;
};

const getFieldByKey = (key: string) => normalizedFields.value.find(field => field.key === key);

const getOperatorsForField = (key: string): Array<QueryBuilderOperator> => {
    const field = getFieldByKey(key);
    const fieldType = field?.type || 'text';

    if (field?.operators?.length) {
        return field.operators;
    }

    return defaultOperatorsByType[fieldType];
};

const getDefaultValueForField = (key: string) => {
    const field = getFieldByKey(key);

    if (field?.type === 'number') {
        return 0;
    }

    if (field?.type === 'boolean') {
        return true;
    }

    if (field?.type === 'select') {
        return field.options?.[0]?.value ?? '';
    }

    return '';
};

const createRule = (fieldKey?: string): QueryBuilderRuleNode => {
    const baseField = fieldKey || normalizedFields.value[0]?.key || 'value';
    const operators = getOperatorsForField(baseField);

    return {
        id: createId(),
        kind: 'rule',
        field: baseField,
        operator: operators[0] || 'equals',
        value: getDefaultValueForField(baseField),
    };
};

const createGroup = (withRule = true): QueryBuilderGroupNode => ({
    id: createId(),
    kind: 'group',
    combinator: 'and',
    children: withRule ? [createRule()] : [],
});

const cloneGroup = (group: QueryBuilderGroupNode): QueryBuilderGroupNode => JSON.parse(JSON.stringify(group));

const normalizeNode = (node: QueryBuilderNode): QueryBuilderNode => {
    if (node.kind === 'group') {
        return {
            id: node.id || createId(),
            kind: 'group',
            combinator: node.combinator === 'or' ? 'or' : 'and',
            children: Array.isArray(node.children) ? node.children.map(child => normalizeNode(child)) : [createRule()],
        };
    }

    const fallbackRule = createRule(node.field);

    return {
        ...fallbackRule,
        ...node,
        id: node.id || fallbackRule.id,
        kind: 'rule',
        field: node.field || fallbackRule.field,
        operator: node.operator || fallbackRule.operator,
    };
};

const normalizeRootModel = (value: QueryBuilderGroupNode | null): QueryBuilderGroupNode => {
    if (!value) {
        return createGroup(true);
    }

    const normalized = normalizeNode(value);

    if (normalized.kind !== 'group') {
        return createGroup(true);
    }

    if (!normalized.children.length) {
        normalized.children = [createRule()];
    }

    return normalized;
};

const model = ref<QueryBuilderGroupNode>(normalizeRootModel(props.modelValue));

watch(
    () => props.modelValue,
    value => {
        model.value = normalizeRootModel(value);
    },
    { deep: true },
);

watch(
    () => normalizedFields.value,
    () => {
        model.value = normalizeRootModel(model.value);
    },
    { deep: true },
);

const getGroupAtPath = (root: QueryBuilderGroupNode, path: GroupPath): QueryBuilderGroupNode | null => {
    let cursor: QueryBuilderGroupNode = root;

    for (const index of path) {
        const next = cursor.children[index];

        if (!next || next.kind !== 'group') {
            return null;
        }

        cursor = next;
    }

    return cursor;
};

const commit = (next: QueryBuilderGroupNode) => {
    model.value = next;
    const payload = cloneGroup(next);

    emit('update:modelValue', payload);
    emit('change', payload);
};

const mutate = (mutator: (draft: QueryBuilderGroupNode) => void) => {
    const next = cloneGroup(model.value);
    mutator(next);
    commit(next);
};

const onChangeCombinator = ({ path, combinator }: NodePayload & { combinator: QueryBuilderCombinator }) => {
    mutate(next => {
        const group = getGroupAtPath(next, path);

        if (!group) {
            return;
        }

        group.combinator = combinator;
    });
};

const onAddRule = ({ path }: NodePayload) => {
    mutate(next => {
        const group = getGroupAtPath(next, path);

        if (!group) {
            return;
        }

        group.children.push(createRule());
    });
};

const onAddGroup = ({ path }: NodePayload) => {
    mutate(next => {
        const group = getGroupAtPath(next, path);

        if (!group) {
            return;
        }

        group.children.push(createGroup(true));
    });
};

const onRemoveGroup = ({ path }: NodePayload) => {
    if (!path.length) {
        return;
    }

    mutate(next => {
        const parentPath = path.slice(0, -1);
        const groupIndex = path[path.length - 1];
        const parentGroup = getGroupAtPath(next, parentPath);

        if (!parentGroup) {
            return;
        }

        parentGroup.children.splice(groupIndex, 1);

        if (!parentGroup.children.length) {
            parentGroup.children.push(createRule());
        }
    });
};

const onRemoveNode = ({ path, index }: RulePayload) => {
    mutate(next => {
        const group = getGroupAtPath(next, path);

        if (!group) {
            return;
        }

        group.children.splice(index, 1);

        if (!group.children.length) {
            group.children.push(createRule());
        }
    });
};

const onRuleField = ({ path, index, field }: RulePayload & { field: string }) => {
    mutate(next => {
        const group = getGroupAtPath(next, path);
        const node = group?.children[index];

        if (!group || !node || node.kind !== 'rule') {
            return;
        }

        const operators = getOperatorsForField(field);

        node.field = field;
        node.operator = operators[0] || 'equals';
        node.value = getDefaultValueForField(field);
    });
};

const onRuleOperator = ({ path, index, operator }: RulePayload & { operator: QueryBuilderOperator }) => {
    mutate(next => {
        const group = getGroupAtPath(next, path);
        const node = group?.children[index];

        if (!node || node.kind !== 'rule') {
            return;
        }

        node.operator = operator;
    });
};

const onRuleValue = ({ path, index, value }: RulePayload & { value: unknown }) => {
    mutate(next => {
        const group = getGroupAtPath(next, path);
        const node = group?.children[index];

        if (!node || node.kind !== 'rule') {
            return;
        }

        node.value = value;
    });
};

const serialize = () => JSON.stringify(model.value);

const deserialize = (payload: string) => {
    try {
        const parsed = JSON.parse(payload) as QueryBuilderGroupNode;
        const normalized = normalizeRootModel(parsed);

        commit(normalized);
    } catch {
        return false;
    }

    return true;
};

const getModel = () => cloneGroup(model.value);

defineExpose({
    serialize,
    deserialize,
    getModel,
});
</script>

<style lang="scss">
.vf-query-builder {
    border: var(--vf-border-width) solid var(--vf-query-builder-border-color);
    border-radius: var(--vf-query-builder-border-radius);
    background-color: var(--vf-query-builder-background-color);
    color: var(--vf-query-builder-text-color);
    padding: var(--vf-query-builder-padding);
    font-size: var(--vf-query-builder-font-size);
}

.vf-query-builder__group {
    display: grid;
    gap: var(--vf-query-builder-group-gap);
    border: var(--vf-border-width) solid var(--vf-query-builder-group-border-color);
    border-radius: var(--vf-query-builder-group-border-radius);
    background-color: var(--vf-query-builder-group-background-color);
    padding: var(--vf-query-builder-group-padding);
}

.vf-query-builder__group[data-depth='0'] {
    border-color: transparent;
    padding: 0;
    background-color: transparent;
}

.vf-query-builder__group-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--vf-query-builder-row-gap);
}

.vf-query-builder__group-label {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    color: var(--vf-query-builder-secondary-text-color);
}

.vf-query-builder__group-actions {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    flex-wrap: wrap;
}

.vf-query-builder__children {
    display: grid;
    gap: var(--vf-query-builder-row-gap);
}

.vf-query-builder__node_group {
    padding-inline-start: var(--vf-query-builder-nested-offset);
}

.vf-query-builder__rule {
    display: grid;
    grid-template-columns: minmax(8rem, 1fr) minmax(8rem, 1fr) minmax(10rem, 1fr) auto;
    gap: var(--vf-query-builder-row-gap);
    align-items: center;
}

.vf-query-builder__select,
.vf-query-builder__input,
.vf-query-builder__button {
    border: var(--vf-border-width) solid var(--vf-query-builder-control-border-color);
    border-radius: var(--vf-query-builder-control-border-radius);
    background-color: var(--vf-query-builder-control-background-color);
    color: inherit;
    font: inherit;
    min-height: var(--vf-query-builder-control-height);
}

.vf-query-builder__select,
.vf-query-builder__input {
    padding: 0.35rem 0.55rem;
}

.vf-query-builder__button {
    padding: 0.35rem 0.7rem;
    cursor: pointer;
}

.vf-query-builder__button:hover:not(:disabled),
.vf-query-builder__button:focus-visible:not(:disabled),
.vf-query-builder__select:focus-visible,
.vf-query-builder__input:focus-visible {
    outline: none;
    border-color: var(--vf-query-builder-control-focus-border-color);
    box-shadow: var(--vf-query-builder-control-focus-ring);
}

.vf-query-builder__button_danger {
    color: var(--vf-query-builder-danger-text-color);
    border-color: var(--vf-query-builder-danger-border-color);
}

.vf-query-builder__button:disabled,
.vf-query-builder__select:disabled,
.vf-query-builder__input:disabled {
    opacity: var(--vf-query-builder-disabled-opacity);
    cursor: not-allowed;
}

@media (max-width: 640px) {
    .vf-query-builder__rule {
        grid-template-columns: 1fr;
    }
}
</style>
