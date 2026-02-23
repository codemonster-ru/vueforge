import { mount } from '@vue/test-utils';
import PanelMenu from '../panel-menu.vue';

describe('PanelMenu', () => {
    const items = [
        {
            key: 'products',
            label: 'Products',
            items: [
                { key: 'catalog', label: 'Catalog', href: '/catalog' },
                { key: 'pricing', label: 'Pricing', href: '/pricing' },
            ],
        },
        {
            key: 'docs',
            label: 'Docs',
            items: [{ key: 'guides', label: 'Guides', href: '/guides' }],
        },
    ];

    it('expands and collapses panel groups', async () => {
        const wrapper = mount(PanelMenu, {
            props: {
                items,
                expandedKeys: [],
            },
        });

        const trigger = wrapper.find('.vf-panelmenu-node__trigger');
        await trigger.trigger('click');
        expect(wrapper.emitted('update:expandedKeys')?.[0]).toEqual([['products']]);

        await wrapper.setProps({ expandedKeys: ['products'] });
        await trigger.trigger('click');
        expect(wrapper.emitted('update:expandedKeys')?.[1]).toEqual([[]]);
    });

    it('supports single-open mode when multiple=false', async () => {
        const wrapper = mount(PanelMenu, {
            props: {
                items,
                expandedKeys: ['products'],
                multiple: false,
            },
        });

        const triggers = wrapper.findAll('.vf-panelmenu-node__trigger');
        await triggers[1].trigger('click');

        expect(wrapper.emitted('update:expandedKeys')?.[0]).toEqual([['docs']]);
    });

    it('emits itemClick for leaf links', async () => {
        const wrapper = mount(PanelMenu, {
            props: {
                items,
                expandedKeys: ['products'],
            },
        });

        const leaf = wrapper.find('.vf-panelmenu-node__group .vf-panelmenu-node__link');
        await leaf.trigger('click');

        expect(wrapper.emitted('itemClick')?.[0]?.[0]).toMatchObject({ key: 'catalog' });
    });

    it('supports keyboard toggle via Enter', async () => {
        const wrapper = mount(PanelMenu, {
            props: { items },
        });

        const trigger = wrapper.find('.vf-panelmenu-node__trigger');
        await trigger.trigger('keydown', { key: 'Enter' });

        expect(wrapper.emitted('update:expandedKeys')?.[0]).toEqual([['products']]);
    });
});
