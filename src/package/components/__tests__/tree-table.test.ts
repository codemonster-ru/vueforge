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

    it('emits lazy-load and request payloads for server handoff on expand', async () => {
        const lazyItems = [{ key: 'users', data: { name: 'Users', type: 'Group' }, hasChildren: true }];
        const wrapper = mount(TreeTable, {
            props: {
                columns,
                items: lazyItems,
                lazy: true,
                server: true,
                expandedKeys: [],
            },
        });

        await wrapper.find('.vf-treetable__toggle').trigger('click');

        expect(wrapper.emitted('update:expandedKeys')?.[0]).toEqual([['users']]);
        expect(wrapper.emitted('lazyLoad')?.[0]?.[0]).toEqual({
            key: 'users',
            node: lazyItems[0],
        });
        expect(wrapper.emitted('request')?.[0]?.[0]).toEqual({
            reason: 'lazy-load',
            key: 'users',
            node: lazyItems[0],
            expandedKeys: ['users'],
        });
    });

    it('resizes column width and emits resize payload', async () => {
        const wrapper = mount(TreeTable, {
            props: {
                items,
                columnResize: true,
                columns: [
                    { field: 'name', header: 'Name', width: '140px' },
                    { field: 'type', header: 'Type' },
                ],
            },
        });

        const firstHandle = wrapper.findAll('.vf-treetable__resize-handle')[0];
        await firstHandle.trigger('mousedown', { button: 0, clientX: 100 });
        window.dispatchEvent(new MouseEvent('mousemove', { clientX: 130 }));
        window.dispatchEvent(new MouseEvent('mouseup', { clientX: 130 }));
        await wrapper.vm.$nextTick();

        const firstHeader = wrapper.findAll('.vf-treetable__header')[0];
        expect(firstHeader.attributes('style')).toContain('width: 170px;');
        expect(wrapper.emitted('columnResize')?.[0]?.[0]).toEqual({
            field: 'name',
            width: '170px',
            widthPx: 170,
        });
    });

    it('reorders columns with drag and drop and emits order payload', async () => {
        const wrapper = mount(TreeTable, {
            props: {
                items,
                columnReorder: true,
                columns: [
                    { field: 'name', header: 'Name' },
                    { field: 'type', header: 'Type' },
                    { field: 'size', header: 'Size' },
                ],
            },
        });

        const reorderHandles = wrapper.findAll('.vf-treetable__reorder-handle');
        const headers = wrapper.findAll('.vf-treetable__header');

        await reorderHandles[2].trigger('dragstart');
        await headers[0].trigger('drop');
        await wrapper.vm.$nextTick();

        const firstRowCells = wrapper.findAll('tbody .vf-treetable__row')[0].findAll('td');
        expect(firstRowCells[0].text()).toContain('+');
        expect(firstRowCells[1].text()).toBe('Docs');
        expect(firstRowCells[2].text()).toBe('Folder');

        expect(wrapper.emitted('update:columnOrder')?.[0]).toEqual([['size', 'name', 'type']]);
        expect(wrapper.emitted('columnReorder')?.[0]?.[0]).toEqual({
            fromField: 'size',
            toField: 'name',
            order: ['size', 'name', 'type'],
        });
    });
});
