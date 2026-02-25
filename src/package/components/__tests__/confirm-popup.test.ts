import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { vi } from 'vitest';
import ConfirmPopup from '../confirm-popup.vue';

vi.mock('@codemonster-ru/vueiconify', () => ({
    CmIcon: {
        template: '<span class="vf-icon-stub" />',
    },
}));

const mountPopup = (props: Record<string, unknown> = {}) =>
    mount(ConfirmPopup, {
        props,
        attachTo: document.body,
        global: {
            stubs: {
                teleport: true,
            },
        },
        slots: {
            trigger: '<button type="button" class="trigger-btn">Open</button>',
        },
    });

describe('ConfirmPopup', () => {
    it('opens from trigger and emits show aliases', async () => {
        const wrapper = mountPopup();

        await wrapper.find('.vf-popover__button').trigger('click');
        await nextTick();

        expect(wrapper.find('.vf-popover__wrapper').isVisible()).toBe(true);
        expect(wrapper.emitted('show')?.length).toBe(1);
        expect(wrapper.emitted('onShow')?.length).toBe(1);
    });

    it('emits confirm/accept and closes by default', async () => {
        const wrapper = mountPopup({
            modelValue: true,
        });

        await nextTick();
        await wrapper.find('.vf-confirm-popup__confirm').trigger('click');
        await nextTick();

        expect(wrapper.emitted('confirm')?.length).toBe(1);
        expect(wrapper.emitted('accept')?.length).toBe(1);
        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false]);
    });

    it('emits cancel/reject and respects closeOnCancel=false', async () => {
        const wrapper = mountPopup({
            modelValue: true,
            closeOnCancel: false,
        });

        await nextTick();
        await wrapper.find('.vf-confirm-popup__cancel').trigger('click');
        await nextTick();

        expect(wrapper.emitted('cancel')?.length).toBe(1);
        expect(wrapper.emitted('reject')?.length).toBe(1);
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });

    it('closes on Escape when closeOnEsc is enabled', async () => {
        const wrapper = mountPopup({
            modelValue: true,
            closeOnEsc: true,
        });

        await nextTick();
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        await nextTick();

        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false]);
    });
});
