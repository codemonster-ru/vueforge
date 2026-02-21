import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { vi } from 'vitest';
import Menu from '../menu.vue';

vi.mock('@codemonster-ru/vueiconify', () => ({
    CmIcon: {
        template: '<span class="vf-icon-stub" />',
    },
}));

const mountMenu = (props: { items: Array<Record<string, unknown>>; orientation?: string }) =>
    mount(Menu, {
        props,
        global: {
            stubs: {
                Link: {
                    template: `
                        <button
                            type="button"
                            class="vf-menu__link"
                            role="menuitem"
                            @click="$emit('click', $event); $emit('active')"
                        >
                            <slot />
                        </button>
                    `,
                },
            },
        },
    });

describe('Menu', () => {
    it('sets menu roles and aria orientation', () => {
        const wrapper = mountMenu({
            orientation: 'horizontal',
            items: [{ label: 'Home', href: '/' }],
        });

        const list = wrapper.find('.vf-menu__list');

        expect(list.attributes('role')).toBe('menu');
        expect(list.attributes('aria-orientation')).toBe('horizontal');
    });

    it('opens submenu with ArrowRight and closes with Escape', async () => {
        const wrapper = mountMenu({
            items: [
                {
                    label: 'Products',
                    items: [{ label: 'Analytics', href: '/analytics' }],
                },
            ],
        });

        const parent = wrapper.find('.vf-menu__parent');
        expect(parent.attributes('aria-expanded')).toBe('false');

        await parent.trigger('keydown', { key: 'ArrowRight' });
        await nextTick();

        expect(parent.attributes('aria-expanded')).toBe('true');
        expect(wrapper.find('.vf-menu__submenu').classes()).toContain('vf-menu__submenu_visible');

        await parent.trigger('keydown', { key: 'Escape' });
        await nextTick();

        expect(parent.attributes('aria-expanded')).toBe('false');
    });

    it('marks parent active when nested item becomes active', async () => {
        const wrapper = mountMenu({
            items: [
                {
                    label: 'Docs',
                    items: [{ label: 'Getting Started', href: '/docs/start' }],
                },
            ],
        });

        await wrapper.find('.vf-menu__parent').trigger('click');
        await nextTick();

        const nestedLink = wrapper.find('.vf-menu__submenu .vf-menu__link');
        await nestedLink.trigger('click');
        await nextTick();

        expect(wrapper.find('.vf-menu__parent').classes()).toContain('vf-menu__parent_active');
        expect(wrapper.emitted('active')).toBeTruthy();
    });
});
