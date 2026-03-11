import { mount } from '@vue/test-utils';
import DataView from '../data-view.vue';

describe('DataView', () => {
    const items = [
        { id: 1, name: 'Gamma', type: 'File' },
        { id: 2, name: 'Alpha', type: 'Folder' },
        { id: 3, name: 'Beta', type: 'File' },
    ];

    it('switches between list and grid layouts', async () => {
        const wrapper = mount(DataView, {
            props: {
                items,
                layout: 'list',
            },
        });

        expect(wrapper.find('.vf-dataview__content').classes()).toContain('vf-dataview__content_list');

        const gridButton = wrapper.findAll('.vf-dataview__layout-btn')[1];
        await gridButton.trigger('click');

        expect(wrapper.emitted('update:layout')?.[0]).toEqual(['grid']);
    });

    it('paginates locally when server mode is disabled', () => {
        const wrapper = mount(DataView, {
            props: {
                items,
                page: 2,
                pageSize: 2,
            },
            slots: {
                item: '<template #item="{ item }">{{ item.name }}</template>',
            },
        });

        const rendered = wrapper.findAll('.vf-dataview__item');
        expect(rendered).toHaveLength(1);
        expect(rendered[0].text()).toContain('Beta');
    });

    it('emits request payload for page and sort handoff', async () => {
        const wrapper = mount(DataView, {
            props: {
                items,
                sortable: true,
                defaultSortField: 'name',
                server: true,
                pageSize: 1,
                total: 3,
            },
        });

        await wrapper.find('.vf-dataview__sort-btn').trigger('click');
        await wrapper.find('.vf-dataview__page-btn:last-child').trigger('click');

        expect(wrapper.emitted('update:sortField')?.[0]).toEqual(['name']);
        expect(wrapper.emitted('update:sortOrder')?.[0]).toEqual(['asc']);
        expect(wrapper.emitted('update:page')?.[0]).toEqual([2]);

        const requests = wrapper.emitted('request');
        expect(requests?.[0]?.[0]).toEqual({
            sortField: 'name',
            sortOrder: 'asc',
            page: 1,
            pageSize: 1,
            layout: 'list',
        });
        expect(requests?.[1]?.[0]).toEqual({
            sortField: 'name',
            sortOrder: 'asc',
            page: 2,
            pageSize: 1,
            layout: 'list',
        });
    });

    it('renders empty and loading states', async () => {
        const wrapper = mount(DataView, {
            props: {
                items: [],
                emptyText: 'Nothing here',
            },
        });

        expect(wrapper.text()).toContain('Nothing here');

        await wrapper.setProps({ loading: true, loadingText: 'Loading items' });
        expect(wrapper.text()).toContain('Loading items');
    });
});
