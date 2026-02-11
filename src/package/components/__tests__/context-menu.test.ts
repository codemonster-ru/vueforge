import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { vi } from 'vitest';
import ContextMenu from '../context-menu.vue';

vi.mock('@codemonster-ru/vueiconify', () => ({
    CmIcon: {
        template: '<span class="vf-icon-stub" />',
    },
}));

const mountContextMenu = (options: Parameters<typeof mount>[1] = {}) => {
    return mount(ContextMenu, {
        attachTo: document.body,
        slots: {
            default: '<div class="target">Target</div>',
        },
        global: {
            stubs: {
                teleport: true,
            },
        },
        ...options,
    });
};

describe('ContextMenu', () => {
    it('opens on contextmenu event', async () => {
        const wrapper = mountContextMenu();

        await wrapper.find('.vf-context-menu').trigger('contextmenu', { clientX: 120, clientY: 80 });
        await nextTick();

        expect(wrapper.emitted('contextmenu')).toBeTruthy();
        expect(wrapper.find('.vf-context-menu__panel').isVisible()).toBe(true);

        wrapper.unmount();
    });

    it('closes on outside click', async () => {
        const wrapper = mountContextMenu();

        await wrapper.find('.vf-context-menu').trigger('contextmenu', { clientX: 120, clientY: 80 });
        await nextTick();

        document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        await nextTick();

        expect(wrapper.find('.vf-context-menu__panel').isVisible()).toBe(false);

        wrapper.unmount();
    });

    it('closes on Escape key', async () => {
        const wrapper = mountContextMenu();

        await wrapper.find('.vf-context-menu').trigger('contextmenu', { clientX: 120, clientY: 80 });
        await nextTick();

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

        await nextTick();

        expect(wrapper.find('.vf-context-menu__panel').isVisible()).toBe(false);

        wrapper.unmount();
    });

    it('closes when selecting custom close target', async () => {
        const wrapper = mountContextMenu({
            slots: {
                default: '<div class="target">Target</div>',
                menu: '<button class="close-item" data-context-menu-close>Close</button>',
            },
        });

        await wrapper.find('.vf-context-menu').trigger('contextmenu', { clientX: 120, clientY: 80 });
        await nextTick();
        await wrapper.find('.close-item').trigger('click');
        await nextTick();

        expect(wrapper.find('.vf-context-menu__panel').isVisible()).toBe(false);

        wrapper.unmount();
    });
});
