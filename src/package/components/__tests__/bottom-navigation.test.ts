import { mount } from '@vue/test-utils';
import { routeLocationKey, routerKey } from 'vue-router';
import { vi } from 'vitest';
import BottomNavigation from '../bottom-navigation.vue';

vi.mock('@codemonster-ru/vueiconify', () => ({
    CmIcon: {
        template: '<span class="vf-icon-stub" />',
    },
}));

describe('BottomNavigation', () => {
    const items = [
        { key: 'home', label: 'Home', icon: 'house', to: '/home' },
        { key: 'search', label: 'Search', icon: 'magnifyingGlass', to: '/search', badge: 3 },
        { key: 'settings', label: 'Settings', icon: 'gear', disabled: true },
    ];

    const global = {
        stubs: {
            RouterLink: {
                template: '<a class="router-link-stub"><slot /></a>',
            },
        },
    };

    it('renders fixed/mobile-only/no-label states from props', () => {
        const wrapper = mount(BottomNavigation, {
            props: {
                items,
                fixed: true,
                mobileOnly: true,
                showLabels: false,
            },
            global,
        });

        expect(wrapper.classes()).toContain('vf-bottom-navigation_fixed');
        expect(wrapper.classes()).toContain('vf-bottom-navigation_mobile-only');
        expect(wrapper.classes()).toContain('vf-bottom-navigation_no-labels');
    });

    it('emits model update and select payload on item click', async () => {
        const wrapper = mount(BottomNavigation, {
            props: { items },
            global,
        });

        await wrapper.findAll('.vf-bottom-navigation__action')[1].trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['search']);
        expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({
            key: 'search',
            index: 1,
        });
    });

    it('supports keyboard horizontal navigation and activation', async () => {
        const wrapper = mount(BottomNavigation, {
            props: { items },
            attachTo: document.body,
            global,
        });

        const navItems = wrapper.findAll('.vf-bottom-navigation__action');
        (navItems[0].element as HTMLElement).focus();

        await navItems[0].trigger('keydown', { key: 'ArrowRight' });
        expect(document.activeElement).toBe(navItems[1].element);

        await navItems[1].trigger('keydown', { key: 'Enter' });
        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['search']);

        wrapper.unmount();
    });

    it('syncs active state from current route when modelValue is unset', () => {
        const wrapper = mount(BottomNavigation, {
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

        expect(wrapper.findAll('.vf-bottom-navigation__action')[0].classes()).toContain(
            'vf-bottom-navigation__action_active',
        );
    });
});
