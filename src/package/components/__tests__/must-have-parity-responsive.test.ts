import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Carousel from '../carousel.vue';
import DataView from '../data-view.vue';
import Image from '../image.vue';
import SpeedDial from '../speed-dial.vue';
import TreeTable from '../tree-table.vue';

describe('Must-have parity responsive regression', () => {
    it('Carousel supports touch swipe interaction on compact surfaces', async () => {
        const wrapper = mount(Carousel, {
            props: {
                items: [{ id: 1 }, { id: 2 }],
            },
        });

        const viewport = wrapper.find('.vf-carousel__viewport');
        await viewport.trigger('touchstart', { changedTouches: [{ clientX: 180 }] });
        await viewport.trigger('touchend', { changedTouches: [{ clientX: 80 }] });

        expect(wrapper.emitted('change')?.at(-1)?.[0]).toMatchObject({ source: 'swipe', index: 1 });
    });

    it('TreeTable keeps overflow-enabled root container for narrow viewports', () => {
        const wrapper = mount(TreeTable, {
            props: {
                columns: [{ field: 'name', header: 'Name' }],
                items: [{ key: '1', data: { name: 'Row' } }],
            },
        });

        expect(wrapper.classes()).toContain('vf-treetable');
        expect(wrapper.find('.vf-treetable__table').exists()).toBe(true);
    });

    it('DataView switches list/grid layout classes for responsive composition', async () => {
        const wrapper = mount(DataView, {
            props: {
                items: [{ id: 1, name: 'One' }],
                layout: 'list',
            },
        });

        expect(wrapper.find('.vf-dataview__content').classes()).toContain('vf-dataview__content_list');
        await wrapper.findAll('.vf-dataview__layout-btn')[1].trigger('click');
        expect(wrapper.emitted('update:layout')?.[0]).toEqual(['grid']);
    });

    it('Image preview opens bounded overlay surface for mobile/tablet/desktop', async () => {
        const wrapper = mount(Image, {
            props: {
                src: '/cover.png',
                preview: true,
            },
            global: {
                stubs: {
                    teleport: true,
                },
            },
        });

        await wrapper.find('.vf-image__trigger').trigger('click');
        await nextTick();

        expect(wrapper.find('.vf-image__overlay').exists()).toBe(true);
        expect(wrapper.find('.vf-image__dialog').exists()).toBe(true);
    });

    it('SpeedDial keeps trigger and action surfaces available for touch-first flows', async () => {
        const wrapper = mount(SpeedDial, {
            props: {
                actions: [{ label: 'Create', value: 'create' }],
            },
            attachTo: document.body,
        });

        await wrapper.find('.vf-speed-dial__trigger').trigger('click');
        await nextTick();
        expect(wrapper.find('.vf-speed-dial__action').exists()).toBe(true);

        wrapper.unmount();
    });
});
