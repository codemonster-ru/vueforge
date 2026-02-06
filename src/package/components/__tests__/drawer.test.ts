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
    it('emits update when overlay is clicked', async () => {
        const wrapper = mountDrawer({
            props: { modelValue: true },
        });

        await nextTick();
        await nextTick();
        await wrapper.find('.vf-drawer__overlay').trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);

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
});
