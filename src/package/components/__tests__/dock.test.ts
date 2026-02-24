import { mount } from '@vue/test-utils';
import { routeLocationKey, routerKey } from 'vue-router';
import { vi } from 'vitest';
import Dock from '../dock.vue';

vi.mock('@codemonster-ru/vueiconify', () => ({
    CmIcon: {
        template: '<span class="vf-icon-stub" />',
    },
}));

describe('Dock', () => {
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

    it('renders navigation landmark and orientation by position', () => {
        const wrapper = mount(Dock, {
            props: {
                items,
                position: 'left',
                ariaLabel: 'Launcher',
            },
            global,
        });

        expect(wrapper.attributes('aria-label')).toBe('Launcher');
        expect(wrapper.classes()).toContain('vf-dock_left');
        expect(wrapper.find('.vf-dock__list').attributes('aria-orientation')).toBe('vertical');
        expect(wrapper.findAll('.vf-dock__item')).toHaveLength(3);
    });

    it('emits selection and model updates on item click', async () => {
        const wrapper = mount(Dock, {
            props: {
                items,
            },
            global,
        });

        await wrapper.findAll('.vf-dock__item')[0].trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['home']);
        expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({
            key: 'home',
            index: 0,
        });
    });

    it('does not emit selection for disabled items', async () => {
        const wrapper = mount(Dock, {
            props: {
                items,
            },
            global,
        });

        await wrapper.findAll('.vf-dock__item')[2].trigger('click');
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });

    it('supports keyboard focus navigation and activation', async () => {
        const wrapper = mount(Dock, {
            props: {
                items,
                position: 'bottom',
            },
            attachTo: document.body,
            global,
        });

        const dockItems = wrapper.findAll('.vf-dock__item');
        (dockItems[0].element as HTMLElement).focus();
        await dockItems[0].trigger('keydown', { key: 'ArrowRight' });
        expect(document.activeElement).toBe(dockItems[1].element);

        await dockItems[1].trigger('keydown', { key: 'Enter' });
        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['search']);

        wrapper.unmount();
    });

    it('syncs active state from current route when modelValue is unset', () => {
        const wrapper = mount(Dock, {
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

        expect(wrapper.findAll('.vf-dock__item')[0].classes()).toContain('vf-dock__item_active');
    });
});
