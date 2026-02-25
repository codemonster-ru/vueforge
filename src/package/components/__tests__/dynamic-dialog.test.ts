import { mount } from '@vue/test-utils';
import { defineComponent, nextTick } from 'vue';
import DynamicDialog from '../dynamic-dialog.vue';
import { createDynamicDialogService } from '@/package/services/dynamic-dialog-service';

const DemoDialogContent = defineComponent({
    props: {
        label: {
            type: String,
            default: 'Submit',
        },
        dialog: {
            type: Object,
            required: true,
        },
    },
    emits: ['submit'],
    template: `
        <div>
            <button type="button" class="demo-submit" @click="$emit('submit', { ok: true, payload: dialog.payload })">
                {{ label }}
            </button>
            <button type="button" class="demo-close" @click="dialog.close({ accepted: true })">Close</button>
        </div>
    `,
});

const mountDynamicDialog = (service = createDynamicDialogService()) =>
    mount(DynamicDialog, {
        props: {
            service,
        },
        attachTo: document.body,
        global: {
            stubs: {
                teleport: true,
            },
        },
    });

describe('DynamicDialog', () => {
    it('renders dynamic component and resolves via forwarded listeners', async () => {
        const service = createDynamicDialogService();
        const handle = service.open<{ ok: boolean; payload: unknown }>({
            title: 'Edit role',
            component: DemoDialogContent,
            componentProps: {
                label: 'Save changes',
            },
            payload: {
                memberId: 42,
            },
            listeners: {
                submit: payload => {
                    service.closeCurrent(payload);
                },
            },
        });

        const wrapper = mountDynamicDialog(service);

        await nextTick();
        await wrapper.find('.demo-submit').trigger('click');

        await expect(handle.promise).resolves.toEqual({
            ok: true,
            payload: {
                memberId: 42,
            },
        });

        wrapper.unmount();
    });

    it('dismisses current dialog on modal overlay close', async () => {
        const service = createDynamicDialogService();
        const handle = service.open({
            title: 'Dismiss me',
            message: 'Body',
        });
        const wrapper = mountDynamicDialog(service);

        await nextTick();
        await nextTick();
        await wrapper.find('.vf-modal__overlay').trigger('click');

        await expect(handle.promise).resolves.toBeUndefined();

        wrapper.unmount();
    });

    it('applies per-dialog modal options', async () => {
        const service = createDynamicDialogService();

        service.open({
            title: 'Large dialog',
            message: 'Body',
            modal: {
                size: 'lg',
                closeOnOverlay: false,
            },
        });

        const wrapper = mountDynamicDialog(service);

        await nextTick();
        await nextTick();

        expect(wrapper.find('.vf-modal').classes()).toContain('vf-modal_lg');

        await wrapper.find('.vf-modal__overlay').trigger('click');
        expect(service.dialogs).toHaveLength(1);

        service.dismissCurrent();
        await nextTick();

        wrapper.unmount();
    });
});
