import { mount } from '@vue/test-utils';
import { routeLocationKey, routerKey } from 'vue-router';
import { vi } from 'vitest';
import PanelMenu from '../panel-menu.vue';

describe('PanelMenu', () => {
    const global = {
        stubs: {
            RouterLink: {
                template: '<a class="router-link-stub"><slot /></a>',
            },
        },
    };

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
            global,
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
            global,
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
            global,
        });

        const leaf = wrapper.find('.vf-panelmenu-node__group .vf-panelmenu-node__link');
        await leaf.trigger('click');

        expect(wrapper.emitted('itemClick')?.[0]?.[0]).toMatchObject({ key: 'catalog' });
    });

    it('supports keyboard toggle via Enter', async () => {
        const wrapper = mount(PanelMenu, {
            props: { items },
            global,
        });

        const trigger = wrapper.find('.vf-panelmenu-node__trigger');
        await trigger.trigger('keydown', { key: 'Enter' });

        expect(wrapper.emitted('update:expandedKeys')?.[0]).toEqual([['products']]);
    });

    it('emits lazyLoad for lazy nodes without children', async () => {
        const wrapper = mount(PanelMenu, {
            props: {
                items: [{ key: 'reports', label: 'Reports', lazy: true }],
                expandedKeys: [],
            },
            global,
        });

        await wrapper.find('.vf-panelmenu-node__trigger').trigger('click');

        expect(wrapper.emitted('lazyLoad')?.[0]?.[0]).toMatchObject({
            key: 'reports',
        });
    });

    it('syncs expanded route branch when syncActiveFromRoute is enabled', () => {
        const wrapper = mount(PanelMenu, {
            props: {
                items,
                expandedKeys: [],
            },
            global: {
                ...global,
                provide: {
                    [routerKey as symbol]: {
                        push: vi.fn(),
                        resolve: (to: string) => ({ path: to, href: to }),
                    },
                    [routeLocationKey as symbol]: {
                        path: '/catalog',
                    },
                },
            },
        });

        expect(wrapper.find('.vf-panelmenu-node__group').exists()).toBe(true);
        expect(wrapper.find('.vf-panelmenu-node__trigger').classes()).toContain('is-active');
    });
});
