import { mount } from '@vue/test-utils';
import TreeTable from '../tree-table.vue';

describe('TreeTable', () => {
    const columns = [
        { field: 'name', header: 'Name' },
        { field: 'type', header: 'Type' },
    ];
    const items = [
        {
            key: 'docs',
            data: { name: 'Docs', type: 'Folder' },
            children: [
                { key: 'api', data: { name: 'API', type: 'File' } },
                { key: 'guide', data: { name: 'Guide', type: 'File' } },
            ],
        },
        { key: 'changelog', data: { name: 'Changelog', type: 'File' } },
    ];

    it('renders hierarchical rows and expand/collapse behavior', async () => {
        const wrapper = mount(TreeTable, {
            props: {
                columns,
                items,
                expandedKeys: [],
            },
        });

        expect(wrapper.findAll('.vf-treetable__body .vf-treetable__row')).toHaveLength(2);

        await wrapper.find('.vf-treetable__toggle').trigger('click');
        expect(wrapper.emitted('update:expandedKeys')?.[0]).toEqual([['docs']]);
    });

    it('renders children for expanded node', () => {
        const wrapper = mount(TreeTable, {
            props: {
                columns,
                items,
                expandedKeys: ['docs'],
            },
        });

        const rows = wrapper.findAll('.vf-treetable__body .vf-treetable__row');
        expect(rows).toHaveLength(4);
        expect(rows[1].text()).toContain('API');
        expect(rows[2].text()).toContain('Guide');
    });

    it('updates modelValue in single mode on row click', async () => {
        const wrapper = mount({
            components: { TreeTable },
            template: '<TreeTable v-model="value" :columns="columns" :items="items" />',
            data() {
                return {
                    value: undefined,
                    columns,
                    items,
                };
            },
        });

        const rows = wrapper.findAll('.vf-treetable__body .vf-treetable__row');
        await rows[1].trigger('click');

        expect(wrapper.vm.value).toBe('changelog');
    });

    it('supports multi selection mode', async () => {
        const wrapper = mount({
            components: { TreeTable },
            template: '<TreeTable v-model="value" :columns="columns" :items="items" multiple />',
            data() {
                return {
                    value: ['changelog'],
                    columns,
                    items,
                };
            },
        });

        const firstRow = wrapper.findAll('.vf-treetable__body .vf-treetable__row')[0];
        await firstRow.trigger('click');

        expect(wrapper.vm.value).toEqual(['changelog', 'docs']);
    });

    it('supports keyboard expand/select navigation contracts', async () => {
        const wrapper = mount(TreeTable, {
            props: {
                columns,
                items,
                expandedKeys: [],
            },
        });

        const firstRow = wrapper.findAll('.vf-treetable__body .vf-treetable__row')[0];
        await firstRow.trigger('keydown', { key: 'ArrowRight' });

        expect(wrapper.emitted('update:expandedKeys')?.[0]).toEqual([['docs']]);

        await firstRow.trigger('keydown', { key: 'Enter' });
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['docs']);
    });

    it('exposes treegrid and row ARIA attributes', () => {
        const wrapper = mount(TreeTable, {
            props: {
                columns,
                items,
                expandedKeys: ['docs'],
            },
        });

        expect(wrapper.find('[role="treegrid"]').exists()).toBe(true);

        const rows = wrapper.findAll('.vf-treetable__body .vf-treetable__row');
        expect(rows[0].attributes('aria-level')).toBe('1');
        expect(rows[0].attributes('aria-expanded')).toBe('true');
        expect(rows[1].attributes('aria-level')).toBe('2');
    });
});
