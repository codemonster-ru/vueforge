import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Drawer from '../drawer.vue';

const mountDrawer = (options: Parameters<typeof mount>[1] = {}) => {
    return mount(Drawer, {
        attachTo: document.body,
        global: {
            stubs: {
                teleport: true,
            },
        },
        ...options,
    });
};

describe('Drawer', () => {
    afterEach(() => {
        document.body.style.overflow = '';
    });

    it('emits update when overlay is clicked', async () => {
        const wrapper = mountDrawer({
            props: { modelValue: true },
        });

        await nextTick();
        await nextTick();
        await wrapper.find('.vf-drawer__overlay').trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
        expect(wrapper.emitted('close')?.[0]).toEqual([]);

        wrapper.unmount();
    });

    it('does not close on overlay when disabled', async () => {
        const wrapper = mountDrawer({
            props: { modelValue: true, closeOnOverlay: false },
        });

        await nextTick();
        await nextTick();
        await wrapper.find('.vf-drawer__overlay').trigger('click');

        expect(wrapper.emitted('update:modelValue')).toBeUndefined();

        wrapper.unmount();
    });

    it('emits update on Escape key', async () => {
        const wrapper = mountDrawer({
            props: { modelValue: true },
        });

        await nextTick();
        await nextTick();

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

        await nextTick();
        await nextTick();

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
        expect(wrapper.emitted('close')?.[0]).toEqual([]);

        wrapper.unmount();
    });

    it('does not close on Escape when disabled', async () => {
        const wrapper = mountDrawer({
            props: { modelValue: true, closeOnEsc: false },
        });

        await nextTick();
        await nextTick();

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

        await nextTick();
        await nextTick();

        expect(wrapper.emitted('update:modelValue')).toBeUndefined();

        wrapper.unmount();
    });

    it('adds size class for large drawer', async () => {
        const wrapper = mountDrawer({
            props: { modelValue: true, size: 'lg' },
        });

        await nextTick();

        expect(wrapper.find('.vf-drawer').classes()).toContain('vf-drawer_lg');

        wrapper.unmount();
    });

    it('adds position class for left drawer', async () => {
        const wrapper = mountDrawer({
            props: { modelValue: true, position: 'left' },
        });

        await nextTick();

        expect(wrapper.find('.vf-drawer').classes()).toContain('vf-drawer_left');

        wrapper.unmount();
    });

    it('traps focus within the panel', async () => {
        const wrapper = mountDrawer({
            props: { modelValue: true, showClose: false },
            slots: {
                body: `
                    <button class="first">First</button>
                    <button class="last">Last</button>
                `,
            },
        });

        await nextTick();

        const panel = wrapper.find('.vf-drawer__panel');
        const first = wrapper.find('.first').element as HTMLButtonElement;
        const last = wrapper.find('.last').element as HTMLButtonElement;

        expect(document.activeElement).toBe(first);

        last.focus();
        await panel.trigger('keydown', { key: 'Tab' });
        expect(document.activeElement).toBe(first);

        first.focus();
        await panel.trigger('keydown', { key: 'Tab', shiftKey: true });
        expect(document.activeElement).toBe(last);

        wrapper.unmount();
    });

    it('restores focus to previously active element on close', async () => {
        const trigger = document.createElement('button');
        trigger.textContent = 'open';
        document.body.appendChild(trigger);
        trigger.focus();

        const wrapper = mountDrawer({
            props: { modelValue: true, showClose: false },
            slots: {
                body: '<button class="inside">Inside</button>',
            },
        });

        await nextTick();
        await nextTick();

        expect(document.activeElement).not.toBe(trigger);

        await wrapper.setProps({ modelValue: false });
        await nextTick();
        await nextTick();

        expect(document.activeElement).toBe(trigger);

        wrapper.unmount();
        trigger.remove();
    });

    it('locks and unlocks body scroll with modelValue', async () => {
        const wrapper = mountDrawer({
            props: { modelValue: false, lockScroll: true },
        });

        expect(document.body.style.overflow).toBe('');

        await wrapper.setProps({ modelValue: true });
        await nextTick();
        await nextTick();

        expect(document.body.style.overflow).toBe('hidden');

        await wrapper.setProps({ modelValue: false });
        await nextTick();
        await nextTick();

        expect(document.body.style.overflow).toBe('');

        wrapper.unmount();
    });

    it('keeps scroll locked until all opened drawers are closed', async () => {
        const first = mountDrawer({ props: { modelValue: true, lockScroll: true } });
        const second = mountDrawer({ props: { modelValue: true, lockScroll: true } });

        await nextTick();
        await nextTick();

        expect(document.body.style.overflow).toBe('hidden');

        await first.setProps({ modelValue: false });
        await nextTick();
        await nextTick();

        expect(document.body.style.overflow).toBe('hidden');

        await second.setProps({ modelValue: false });
        await nextTick();
        await nextTick();

        expect(document.body.style.overflow).toBe('');

        first.unmount();
        second.unmount();
    });

    it('does not lock body scroll when lockScroll is false', async () => {
        const wrapper = mountDrawer({
            props: { modelValue: true, lockScroll: false },
        });

        await nextTick();
        await nextTick();

        expect(document.body.style.overflow).toBe('');

        wrapper.unmount();
    });
});
