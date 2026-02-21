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

    it('opens with keyboard fallback (Shift+F10)', async () => {
        const wrapper = mountContextMenu();

        await wrapper.find('.vf-context-menu').trigger('keydown', { key: 'F10', shiftKey: true });
        await nextTick();

        expect(wrapper.find('.vf-context-menu__panel').isVisible()).toBe(true);

        wrapper.unmount();
    });

    it('does not close on Escape when closeOnEsc is false', async () => {
        const wrapper = mountContextMenu({
            props: { closeOnEsc: false },
        });

        await wrapper.find('.vf-context-menu').trigger('contextmenu', { clientX: 120, clientY: 80 });
        await nextTick();

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        await nextTick();

        expect(wrapper.find('.vf-context-menu__panel').isVisible()).toBe(true);

        wrapper.unmount();
    });

    it('restores focus to trigger on Escape close', async () => {
        const wrapper = mountContextMenu();
        const trigger = wrapper.find('.vf-context-menu');

        (trigger.element as HTMLElement).focus();

        await trigger.trigger('contextmenu', { clientX: 120, clientY: 80 });
        await nextTick();

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        await nextTick();

        expect(document.activeElement).toBe(trigger.element);

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

    it('repositions inside viewport when opened near edge', async () => {
        const wrapper = mountContextMenu();

        await wrapper.find('.vf-context-menu').trigger('contextmenu', { clientX: 5000, clientY: 5000 });
        await nextTick();

        const panel = wrapper.find('.vf-context-menu__panel').element as HTMLElement;

        Object.defineProperty(panel, 'getBoundingClientRect', {
            configurable: true,
            value: () =>
                ({
                    width: 240,
                    height: 180,
                    top: 0,
                    left: 0,
                    right: 240,
                    bottom: 180,
                    x: 0,
                    y: 0,
                    toJSON: () => ({}),
                }) as DOMRect,
        });

        window.dispatchEvent(new Event('resize'));
        await nextTick();

        const left = Number.parseFloat(panel.style.left);
        const top = Number.parseFloat(panel.style.top);

        expect(Number.isNaN(left)).toBe(false);
        expect(Number.isNaN(top)).toBe(false);
        expect(left).toBeLessThanOrEqual(window.innerWidth);
        expect(top).toBeLessThanOrEqual(window.innerHeight);

        wrapper.unmount();
    });
});
