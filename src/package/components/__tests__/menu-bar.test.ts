import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { vi } from 'vitest';
import MenuBar from '../menu-bar.vue';

vi.mock('@codemonster-ru/vueiconify', () => ({
    CmIcon: {
        template: '<span class="vf-icon-stub" />',
    },
}));

describe('MenuBar', () => {
    const items = [
        { label: 'Dashboard', href: '/dashboard' },
        {
            label: 'Products',
            items: [{ label: 'Catalog', href: '/products/catalog' }],
        },
    ];

    it('renders navigation landmark and horizontal menu', () => {
        const wrapper = mount(MenuBar, {
            props: {
                items,
                ariaLabel: 'Top navigation',
            },
            global: {
                stubs: {
                    Link: {
                        template: '<button class="vf-menu__link" role="menuitem"><slot /></button>',
                    },
                },
            },
        });

        expect(wrapper.find('nav.vf-menubar').attributes('aria-label')).toBe('Top navigation');
        expect(wrapper.find('.vf-menu').classes()).toContain('vf-menu_horizontal');
    });

    it('forwards active event from inner Menu', async () => {
        const wrapper = mount(MenuBar, {
            props: { items },
            global: {
                stubs: {
                    Link: {
                        template:
                            '<button class="vf-menu__link" role="menuitem" @click="$emit(\'active\')"><slot /></button>',
                    },
                },
            },
        });

        await wrapper.find('.vf-menu__parent').trigger('click');
        await nextTick();
        await wrapper.find('.vf-menu__submenu .vf-menu__link').trigger('click');

        expect(wrapper.emitted('active')).toBeTruthy();
    });
});
