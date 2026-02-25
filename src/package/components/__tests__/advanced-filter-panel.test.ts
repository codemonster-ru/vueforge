import { mount } from '@vue/test-utils';
import AdvancedFilterPanel from '../advanced-filter-panel.vue';
import type { AdvancedFilterPanelState } from '../advanced-filter-panel-types';

const fields = [
    { key: 'status', label: 'Status', type: 'select' as const, options: [{ label: 'Open', value: 'open' }] },
    { key: 'priority', label: 'Priority', type: 'number' as const },
];

const queryBuilderFields = [
    { key: 'assignee', label: 'Assignee', type: 'text' as const },
    { key: 'severity', label: 'Severity', type: 'number' as const },
];

describe('AdvancedFilterPanel', () => {
    it('updates field filters and emits model updates', async () => {
        const wrapper = mount(AdvancedFilterPanel, {
            props: {
                fields,
                queryBuilderFields,
            },
        });

        await wrapper.find('[data-testid="field-status"]').setValue('open');
        await wrapper.find('[data-testid="field-priority"]').setValue('5');

        const payload = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as AdvancedFilterPanelState;

        expect(payload.fieldValues.status).toBe('open');
        expect(payload.fieldValues.priority).toBe(5);
    });

    it('applies preset state and emits presetChange', async () => {
        const wrapper = mount(AdvancedFilterPanel, {
            props: {
                fields,
                queryBuilderFields,
                presets: [
                    {
                        id: 'ops-open',
                        label: 'Ops Open',
                        state: {
                            fieldValues: {
                                status: 'open',
                                priority: 2,
                            },
                        },
                    },
                ],
            },
        });

        await wrapper.find('.vf-advanced-filter-panel__preset .vf-advanced-filter-panel__select').setValue('ops-open');

        expect(wrapper.emitted('presetChange')?.at(-1)?.[0]).toBe('ops-open');
        const payload = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as AdvancedFilterPanelState;
        expect(payload.fieldValues.status).toBe('open');
        expect(payload.presetId).toBe('ops-open');
    });

    it('serializes and deserializes URL query state', () => {
        const wrapper = mount(AdvancedFilterPanel, {
            props: {
                fields,
                queryBuilderFields,
                modelValue: {
                    presetId: 'ops-open',
                    fieldValues: { status: 'open', priority: 3 },
                    query: {
                        id: 'root',
                        kind: 'group',
                        combinator: 'and',
                        children: [{ id: 'r1', kind: 'rule', field: 'assignee', operator: 'contains', value: 'alex' }],
                    },
                },
            },
        });

        const exposed = wrapper.vm as unknown as {
            serializeToQueryParams: () => string;
            deserializeFromQueryParams: (query: string) => boolean;
        };
        const queryString = exposed.serializeToQueryParams();

        const ok = exposed.deserializeFromQueryParams(queryString);
        expect(ok).toBe(true);

        const payload = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as AdvancedFilterPanelState;
        expect(payload.presetId).toBe('ops-open');
        expect(payload.fieldValues.priority).toBe(3);
        expect(payload.query.kind).toBe('group');
    });
});
