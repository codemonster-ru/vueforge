import { mount } from '@vue/test-utils';
import QueryBuilder from '../query-builder.vue';
import type { QueryBuilderGroupNode } from '../query-builder-types';

const fields = [
    { key: 'status', label: 'Status', type: 'select' as const, options: [{ label: 'Open', value: 'open' }] },
    { key: 'priority', label: 'Priority', type: 'number' as const },
    { key: 'assignee', label: 'Assignee', type: 'text' as const },
];

const getLastPayload = (wrapper: ReturnType<typeof mount>) => {
    const emitted = wrapper.emitted('update:modelValue');

    return emitted?.at(-1)?.[0] as QueryBuilderGroupNode;
};

describe('QueryBuilder', () => {
    it('renders initial rule and emits changes when rule value is edited', async () => {
        const wrapper = mount(QueryBuilder, {
            props: {
                fields,
            },
        });

        await wrapper.find('[data-testid="rule-field-root-0"]').setValue('assignee');
        await wrapper.find('[data-testid="rule-value-root-0"]').setValue('owner-42');

        const payload = getLastPayload(wrapper);

        expect(payload.children).toHaveLength(1);
        expect(payload.children[0]).toMatchObject({
            kind: 'rule',
            value: 'owner-42',
        });
    });

    it('adds nested group and supports OR combinator updates', async () => {
        const wrapper = mount(QueryBuilder, {
            props: {
                fields,
            },
        });

        await wrapper.find('[data-testid="add-group-root"]').trigger('click');
        await wrapper.find('[data-testid="group-combinator-1"]').setValue('or');

        const payload = getLastPayload(wrapper);
        const nestedGroup = payload.children[1];

        expect(nestedGroup).toMatchObject({
            kind: 'group',
            combinator: 'or',
        });
    });

    it('removes a rule and keeps at least one rule in the root group', async () => {
        const wrapper = mount(QueryBuilder, {
            props: {
                fields,
            },
        });

        await wrapper.find('[data-testid="remove-node-root-0"]').trigger('click');

        const payload = getLastPayload(wrapper);

        expect(payload.children).toHaveLength(1);
        expect(payload.children[0]).toMatchObject({
            kind: 'rule',
        });
    });

    it('exposes serialize and deserialize methods', async () => {
        const wrapper = mount(QueryBuilder, {
            props: {
                fields,
            },
        });

        const exposed = wrapper.vm as unknown as {
            serialize: () => string;
            deserialize: (value: string) => boolean;
        };

        const serialized = exposed.serialize();
        const parsed = JSON.parse(serialized) as QueryBuilderGroupNode;

        expect(parsed.kind).toBe('group');
        expect(Array.isArray(parsed.children)).toBe(true);

        const ok = exposed.deserialize(
            JSON.stringify({
                id: 'root',
                kind: 'group',
                combinator: 'or',
                children: [
                    {
                        id: 'r-1',
                        kind: 'rule',
                        field: 'priority',
                        operator: 'gt',
                        value: 3,
                    },
                ],
            }),
        );

        expect(ok).toBe(true);
        expect(getLastPayload(wrapper)).toMatchObject({
            combinator: 'or',
        });
    });
});
