<template>
    <section class="vf-permission-matrix" :aria-label="ariaLabel">
        <table class="vf-permission-matrix__table" role="grid">
            <thead>
                <tr class="vf-permission-matrix__row vf-permission-matrix__row_head">
                    <th class="vf-permission-matrix__header vf-permission-matrix__header_role" scope="col">Role</th>
                    <th
                        v-for="capability in capabilities"
                        :key="String(capability.id)"
                        class="vf-permission-matrix__header"
                        scope="col"
                    >
                        <span class="vf-permission-matrix__capability-label">{{ capability.label }}</span>
                        <span v-if="capability.description" class="vf-permission-matrix__capability-description">
                            {{ capability.description }}
                        </span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="role in roles" :key="String(role.id)" class="vf-permission-matrix__row">
                    <th class="vf-permission-matrix__role" scope="row">
                        <span class="vf-permission-matrix__role-label">{{ role.label }}</span>
                        <span v-if="role.description" class="vf-permission-matrix__role-description">{{
                            role.description
                        }}</span>
                    </th>
                    <td
                        v-for="capability in capabilities"
                        :key="`${String(role.id)}_${String(capability.id)}`"
                        class="vf-permission-matrix__cell"
                    >
                        <button
                            type="button"
                            class="vf-permission-matrix__toggle"
                            :class="`is-${getState(role.id, capability.id)}`"
                            :disabled="disabled"
                            :aria-label="getCellAriaLabel(role, capability)"
                            :aria-pressed="getState(role.id, capability.id) === 'allow' ? 'true' : 'false'"
                            @click="toggleState(role, capability)"
                        >
                            {{ stateLabels[getState(role.id, capability.id)] }}
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type PermissionId = string | number;
export type PermissionMatrixState = 'inherit' | 'allow' | 'deny';

export interface PermissionMatrixRole {
    id: PermissionId;
    label: string;
    description?: string;
}

export interface PermissionMatrixCapability {
    id: PermissionId;
    label: string;
    description?: string;
}

export type PermissionMatrixValue = Record<string, Record<string, PermissionMatrixState>>;

interface Props {
    modelValue?: PermissionMatrixValue;
    roles?: Array<PermissionMatrixRole>;
    capabilities?: Array<PermissionMatrixCapability>;
    disabled?: boolean;
    ariaLabel?: string;
    stateLabels?: Record<PermissionMatrixState, string>;
}

const STATE_ORDER: Array<PermissionMatrixState> = ['inherit', 'allow', 'deny'];

const props = withDefaults(defineProps<Props>(), {
    modelValue: () => ({}),
    roles: () => [],
    capabilities: () => [],
    disabled: false,
    ariaLabel: 'Permission matrix',
    stateLabels: () => ({
        inherit: 'Inherit',
        allow: 'Allow',
        deny: 'Deny',
    }),
});

const emits = defineEmits<{
    (event: 'update:modelValue', value: PermissionMatrixValue): void;
    (
        event: 'cellChange',
        payload: {
            role: PermissionMatrixRole;
            capability: PermissionMatrixCapability;
            state: PermissionMatrixState;
            previousState: PermissionMatrixState;
        },
    ): void;
    (event: 'change', value: PermissionMatrixValue): void;
}>();

const roles = computed(() => props.roles ?? []);
const capabilities = computed(() => props.capabilities ?? []);

const toKey = (value: PermissionId) => String(value);

const getState = (roleId: PermissionId, capabilityId: PermissionId): PermissionMatrixState => {
    const row = props.modelValue?.[toKey(roleId)];
    const value = row?.[toKey(capabilityId)];

    if (value === 'allow' || value === 'deny' || value === 'inherit') {
        return value;
    }

    return 'inherit';
};

const nextState = (current: PermissionMatrixState): PermissionMatrixState => {
    const index = STATE_ORDER.indexOf(current);
    const nextIndex = (index + 1) % STATE_ORDER.length;

    return STATE_ORDER[nextIndex];
};

const cloneValue = (): PermissionMatrixValue => {
    const result: PermissionMatrixValue = {};

    Object.entries(props.modelValue ?? {}).forEach(([roleKey, roleMap]) => {
        result[roleKey] = { ...roleMap };
    });

    return result;
};

const getCellAriaLabel = (role: PermissionMatrixRole, capability: PermissionMatrixCapability) => {
    const state = getState(role.id, capability.id);
    return `${role.label} ${capability.label}: ${props.stateLabels[state]}`;
};

const toggleState = (role: PermissionMatrixRole, capability: PermissionMatrixCapability) => {
    if (props.disabled) {
        return;
    }

    const roleKey = toKey(role.id);
    const capabilityKey = toKey(capability.id);
    const previousState = getState(role.id, capability.id);
    const state = nextState(previousState);
    const nextValue = cloneValue();

    if (!nextValue[roleKey]) {
        nextValue[roleKey] = {};
    }

    nextValue[roleKey][capabilityKey] = state;

    emits('update:modelValue', nextValue);
    emits('cellChange', {
        role,
        capability,
        state,
        previousState,
    });
    emits('change', nextValue);
};
</script>

<style lang="scss">
.vf-permission-matrix {
    border: var(--vf-border-width) solid var(--vf-permission-matrix-border-color);
    border-radius: var(--vf-permission-matrix-border-radius);
    background-color: var(--vf-permission-matrix-background-color);
    color: var(--vf-permission-matrix-text-color);
    overflow: auto;
}

.vf-permission-matrix__table {
    width: 100%;
    border-collapse: collapse;
    min-width: 36rem;
}

.vf-permission-matrix__header,
.vf-permission-matrix__role,
.vf-permission-matrix__cell {
    border-bottom: var(--vf-border-width) solid var(--vf-permission-matrix-divider-color);
    padding: var(--vf-permission-matrix-cell-padding);
    text-align: left;
    vertical-align: top;
}

.vf-permission-matrix__row_head {
    background-color: var(--vf-permission-matrix-header-background-color);
}

.vf-permission-matrix__header_role,
.vf-permission-matrix__role {
    position: sticky;
    left: 0;
    z-index: 1;
    background-color: var(--vf-permission-matrix-sticky-background-color);
}

.vf-permission-matrix__capability-label,
.vf-permission-matrix__role-label {
    display: block;
    font-size: var(--vf-permission-matrix-label-font-size);
    font-weight: var(--vf-permission-matrix-label-font-weight);
}

.vf-permission-matrix__capability-description,
.vf-permission-matrix__role-description {
    display: block;
    margin-top: 0.15rem;
    font-size: var(--vf-permission-matrix-description-font-size);
    color: var(--vf-permission-matrix-description-color);
}

.vf-permission-matrix__toggle {
    min-width: var(--vf-permission-matrix-toggle-min-width);
    border: var(--vf-border-width) solid var(--vf-permission-matrix-toggle-border-color);
    border-radius: var(--vf-permission-matrix-toggle-border-radius);
    padding: var(--vf-permission-matrix-toggle-padding);
    background-color: var(--vf-permission-matrix-toggle-background-color);
    color: var(--vf-permission-matrix-toggle-text-color);
    cursor: pointer;
    font-size: var(--vf-permission-matrix-toggle-font-size);
}

.vf-permission-matrix__toggle.is-allow {
    border-color: var(--vf-permission-matrix-allow-border-color);
    background-color: var(--vf-permission-matrix-allow-background-color);
    color: var(--vf-permission-matrix-allow-text-color);
}

.vf-permission-matrix__toggle.is-deny {
    border-color: var(--vf-permission-matrix-deny-border-color);
    background-color: var(--vf-permission-matrix-deny-background-color);
    color: var(--vf-permission-matrix-deny-text-color);
}

.vf-permission-matrix__toggle:disabled {
    opacity: var(--vf-permission-matrix-disabled-opacity);
    cursor: not-allowed;
}
</style>
