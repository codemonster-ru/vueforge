import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Modal from '../modal.vue';

const mountModal = (options: Parameters<typeof mount>[1] = {}) => {
    return mount(Modal, {
        attachTo: document.body,
        global: {
            stubs: {
                teleport: true,
            },
        },
        ...options,
    });
};

describe('Modal', () => {
    it('emits update when overlay is clicked', async () => {
        const wrapper = mountModal({
            props: { modelValue: true },
        });

        await nextTick();
        await nextTick();
        await wrapper.find('.vf-modal__overlay').trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);

        wrapper.unmount();
    });

    it('does not close on overlay when disabled', async () => {
        const wrapper = mountModal({
            props: { modelValue: true, closeOnOverlay: false },
        });

        await nextTick();
        await nextTick();
        await wrapper.find('.vf-modal__overlay').trigger('click');

        expect(wrapper.emitted('update:modelValue')).toBeUndefined();

        wrapper.unmount();
    });

    it('emits update on Escape key', async () => {
        const wrapper = mountModal({
            props: { modelValue: true },
        });

        await nextTick();
        await nextTick();

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

        await nextTick();
        await nextTick();

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);

        wrapper.unmount();
    });

    it('does not close on Escape when disabled', async () => {
        const wrapper = mountModal({
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

    it('uses custom close slot when provided', async () => {
        const wrapper = mountModal({
            props: { modelValue: true },
            slots: {
                close: '<button class="custom-close">Close</button>',
            },
        });

        await nextTick();

        expect(wrapper.find('.vf-modal__close').exists()).toBe(false);
        expect(wrapper.find('.custom-close').exists()).toBe(true);

        wrapper.unmount();
    });

    it('adds size class for large modal', async () => {
        const wrapper = mountModal({
            props: { modelValue: true, size: 'lg' },
        });

        await nextTick();

        expect(wrapper.find('.vf-modal').classes()).toContain('vf-modal_lg');

        wrapper.unmount();
    });

    it('traps focus within the panel', async () => {
        const wrapper = mountModal({
            props: { modelValue: true, showClose: false },
            slots: {
                body: `
                    <button class="first">First</button>
                    <button class="last">Last</button>
                `,
            },
        });

        await nextTick();

        const panel = wrapper.find('.vf-modal__panel');
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
});
