import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { vi } from 'vitest';
import TieredMenu from '../tiered-menu.vue';

vi.mock('@codemonster-ru/vueiconify', () => ({
    CmIcon: {
        template: '<span class="vf-icon-stub" />',
    },
}));

const mountTiered = (props: { items: Array<Record<string, unknown>>; mode?: 'sidebar-nav' | 'top-nav' }) =>
    mount(TieredMenu, {
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

describe('TieredMenu', () => {
    it('uses vertical orientation in sidebar-nav mode by default', () => {
        const wrapper = mountTiered({
            items: [{ label: 'Overview', href: '/overview' }],
            mode: 'sidebar-nav',
        });

        expect(wrapper.find('.vf-menu__list').attributes('aria-orientation')).toBe('vertical');
    });

    it('uses horizontal orientation in top-nav mode', () => {
        const wrapper = mountTiered({
            items: [{ label: 'Overview', href: '/overview' }],
            mode: 'top-nav',
        });

        expect(wrapper.find('.vf-menu__list').attributes('aria-orientation')).toBe('horizontal');
    });

    it('keeps nested keyboard behavior and forwards active/itemSelect events', async () => {
        const wrapper = mountTiered({
            items: [
                {
                    label: 'Products',
                    items: [{ label: 'Analytics', href: '/analytics' }],
                },
            ],
        });

        const parent = wrapper.find('.vf-menu__parent');
        await parent.trigger('keydown', { key: 'ArrowRight' });
        await nextTick();

        expect(parent.attributes('aria-expanded')).toBe('true');

        await wrapper.find('.vf-menu__submenu .vf-menu__link').trigger('click');
        await nextTick();

        expect(wrapper.emitted('active')).toBeTruthy();
        expect(wrapper.emitted('itemSelect')).toBeTruthy();
    });
});
