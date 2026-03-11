import { mount } from '@vue/test-utils';
import { routeLocationKey, routerKey } from 'vue-router';
import { vi } from 'vitest';
import MegaMenu from '../mega-menu.vue';

describe('MegaMenu', () => {
    const items = [
        {
            label: 'Products',
            sections: [
                {
                    label: 'Commerce',
                    items: [
                        { label: 'Catalog', href: '/catalog' },
                        { label: 'Pricing', href: '/pricing' },
                    ],
                },
                {
                    label: 'Operations',
                    items: [{ label: 'Orders', href: '/orders' }],
                },
            ],
        },
        {
            label: 'Docs',
            items: [{ label: 'Guides', href: '/guides' }],
        },
    ];

    it('opens and closes panel on trigger click', async () => {
        const wrapper = mount(MegaMenu, {
            props: { items },
        });

        const trigger = wrapper.find('.vf-megamenu__trigger');
        await trigger.trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([0]);
        expect(wrapper.find('.vf-megamenu__panel').exists()).toBe(true);

        await trigger.trigger('click');
        expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([null]);
    });

    it('renders multi-column sections for active item', async () => {
        const wrapper = mount(MegaMenu, {
            props: {
                items,
                modelValue: 0,
            },
        });

        expect(wrapper.findAll('.vf-megamenu__section')).toHaveLength(2);
        expect(wrapper.text()).toContain('Commerce');
        expect(wrapper.text()).toContain('Operations');
    });

    it('supports keyboard navigation between root items', async () => {
        const wrapper = mount(MegaMenu, {
            props: { items },
        });

        const firstTrigger = wrapper.findAll('.vf-megamenu__trigger')[0];
        await firstTrigger.trigger('keydown', { key: 'ArrowRight' });

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1]);
    });

    it('emits linkClick and closes panel on link action', async () => {
        const wrapper = mount(MegaMenu, {
            props: {
                items,
                modelValue: 0,
            },
        });

        const link = wrapper.find('.vf-megamenu__link');
        await link.trigger('click');

        expect(wrapper.emitted('linkClick')?.length).toBe(1);
        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([null]);
    });

    it('integrates with router navigation for `to` links', async () => {
        const push = vi.fn();
        const wrapper = mount(MegaMenu, {
            props: {
                items: [
                    {
                        label: 'Docs',
                        items: [{ label: 'Guides', to: '/guides' }],
                    },
                ],
                modelValue: 0,
            },
            global: {
                provide: {
                    [routerKey as symbol]: {
                        push,
                        resolve: (to: string) => ({ path: to, href: to }),
                    },
                    [routeLocationKey as symbol]: {
                        path: '/home',
                    },
                },
            },
        });

        await wrapper.find('.vf-megamenu__link').trigger('click');

        expect(push).toHaveBeenCalledWith('/guides');
        expect(wrapper.emitted('navigate')?.[0]?.[0]).toMatchObject({ to: '/guides' });
    });

    it('syncs active root item from current route', () => {
        const wrapper = mount(MegaMenu, {
            props: {
                items,
            },
            global: {
                provide: {
                    [routerKey as symbol]: {
                        push: vi.fn(),
                        resolve: (to: string) => ({ path: to, href: to }),
                    },
                    [routeLocationKey as symbol]: {
                        path: '/guides',
                    },
                },
            },
        });

        expect(wrapper.findAll('.vf-megamenu__trigger')[1].attributes('aria-expanded')).toBe('true');
        expect(wrapper.find('.vf-megamenu__link.is-active').exists()).toBe(true);
    });

    it('emits lazyLoad when opening lazy root without loaded sections', async () => {
        const wrapper = mount(MegaMenu, {
            props: {
                items: [{ label: 'Catalog', lazy: true }],
            },
        });

        await wrapper.find('.vf-megamenu__trigger').trigger('click');

        expect(wrapper.emitted('lazyLoad')?.[0]?.[0]).toMatchObject({
            index: 0,
        });
    });
});
