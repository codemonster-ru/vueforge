import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import { vi } from 'vitest';
import ConfirmDialog from '../confirm-dialog.vue';

vi.mock('@codemonster-ru/vueiconify', () => ({
    CmIcon: defineComponent({
        name: 'CmIconStub',
        setup() {
            return () => h('span');
        },
    }),
}));

const mountConfirmDialog = (options: Parameters<typeof mount>[1] = {}) => {
    return mount(ConfirmDialog, {
        attachTo: document.body,
        global: {
            stubs: {
                teleport: true,
            },
        },
        ...options,
    });
};

describe('ConfirmDialog', () => {
    it('emits confirm and closes by default', async () => {
        const wrapper = mountConfirmDialog({
            props: {
                modelValue: true,
                message: 'Delete record?',
            },
        });

        await nextTick();
        await nextTick();
        await wrapper.find('.vf-confirm-dialog__confirm').trigger('click');

        expect(wrapper.emitted('confirm')?.length).toBe(1);
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);

        wrapper.unmount();
    });

    it('does not close on confirm when closeOnConfirm is disabled', async () => {
        const wrapper = mountConfirmDialog({
            props: {
                modelValue: true,
                closeOnConfirm: false,
            },
        });

        await nextTick();
        await wrapper.find('.vf-confirm-dialog__confirm').trigger('click');

        expect(wrapper.emitted('confirm')?.length).toBe(1);
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();

        wrapper.unmount();
    });

    it('emits cancel when cancel button is clicked', async () => {
        const wrapper = mountConfirmDialog({
            props: {
                modelValue: true,
            },
        });

        await nextTick();
        await nextTick();
        await wrapper.find('.vf-confirm-dialog__cancel').trigger('click');

        expect(wrapper.emitted('cancel')?.length).toBe(1);
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);

        wrapper.unmount();
    });

    it('emits cancel on overlay click', async () => {
        const wrapper = mountConfirmDialog({
            props: {
                modelValue: true,
            },
        });

        await nextTick();
        await nextTick();
        await wrapper.find('.vf-modal__overlay').trigger('click');

        expect(wrapper.emitted('cancel')?.length).toBe(1);
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);

        wrapper.unmount();
    });

    it('renders custom actions slot', async () => {
        const wrapper = mountConfirmDialog({
            props: {
                modelValue: true,
            },
            slots: {
                actions: '<button class="custom-action">Custom</button>',
            },
        });

        await nextTick();

        expect(wrapper.find('.custom-action').exists()).toBe(true);
        expect(wrapper.find('.vf-confirm-dialog__confirm').exists()).toBe(false);
        expect(wrapper.find('.vf-confirm-dialog__cancel').exists()).toBe(false);

        wrapper.unmount();
    });
});
