import { mount } from '@vue/test-utils';
import { routeLocationKey, routerKey } from 'vue-router';
import { vi } from 'vitest';
import NavigationRail from '../navigation-rail.vue';

vi.mock('@codemonster-ru/vueiconify', () => ({
    CmIcon: {
        template: '<span class="vf-icon-stub" />',
    },
}));

describe('NavigationRail', () => {
    const items = [
        { key: 'home', label: 'Home', icon: 'house', to: '/home' },
        { key: 'search', label: 'Search', icon: 'magnifyingGlass', href: '/search' },
        { key: 'settings', label: 'Settings', icon: 'gear', disabled: true },
    ];

    const global = {
        stubs: {
            RouterLink: {
                template: '<a class="router-link-stub"><slot /></a>',
            },
        },
    };

    it('renders collapsed state and toggle button', async () => {
        const wrapper = mount(NavigationRail, {
            props: {
                items,
                collapsed: true,
            },
            global,
        });

        expect(wrapper.classes()).toContain('vf-navigation-rail_collapsed');

        await wrapper.find('.vf-navigation-rail__toggle').trigger('click');
        expect(wrapper.emitted('update:collapsed')?.[0]).toEqual([false]);
        expect(wrapper.emitted('toggle')?.[0]?.[0]).toEqual({ collapsed: false });
    });

    it('emits selection and model updates on click', async () => {
        const wrapper = mount(NavigationRail, {
            props: {
                items,
            },
            global,
        });

        await wrapper.findAll('.vf-navigation-rail__item')[0].trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['home']);
        expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({
            key: 'home',
            index: 0,
        });
    });

    it('supports keyboard focus navigation and activation', async () => {
        const wrapper = mount(NavigationRail, {
            props: {
                items,
            },
            attachTo: document.body,
            global,
        });

        const navItems = wrapper.findAll('.vf-navigation-rail__item');
        (navItems[0].element as HTMLElement).focus();

        await navItems[0].trigger('keydown', { key: 'ArrowDown' });
        expect(document.activeElement).toBe(navItems[1].element);

        await navItems[1].trigger('keydown', { key: 'Enter' });
        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['search']);

        wrapper.unmount();
    });

    it('syncs active state from current route when modelValue is unset', () => {
        const wrapper = mount(NavigationRail, {
            props: {
                items,
            },
            global: {
                ...global,
                provide: {
                    [routerKey as symbol]: {
                        push: vi.fn(),
                        resolve: (to: string) => ({ path: to, href: to }),
                    },
                    [routeLocationKey as symbol]: {
                        path: '/home',
                    },
                },
            },
        });

        expect(wrapper.findAll('.vf-navigation-rail__item')[0].classes()).toContain('vf-navigation-rail__item_active');
    });
});
