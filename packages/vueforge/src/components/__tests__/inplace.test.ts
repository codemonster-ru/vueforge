import { mount } from '@vue/test-utils';
import Inplace from '../inplace.vue';

describe('Inplace', () => {
    it('opens from display mode and emits lifecycle events', async () => {
        const wrapper = mount(Inplace, {
            props: {
                modelValue: false,
                'onUpdate:modelValue': (value: boolean) => wrapper.setProps({ modelValue: value }),
            },
        });

        await wrapper.find('.vf-inplace__trigger').trigger('click');

        expect(wrapper.find('.vf-inplace__content').exists()).toBe(true);
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);
        expect(wrapper.emitted('open')?.length).toBe(1);
        expect(wrapper.emitted('toggle')?.[0]).toEqual([true]);
    });

    it('closes by action button and emits close events', async () => {
        const wrapper = mount(Inplace, {
            props: {
                modelValue: true,
                'onUpdate:modelValue': (value: boolean) => wrapper.setProps({ modelValue: value }),
            },
        });

        await wrapper.find('.vf-inplace__action').trigger('click');

        expect(wrapper.find('.vf-inplace__trigger').exists()).toBe(true);
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
        expect(wrapper.emitted('close')?.length).toBe(1);
        expect(wrapper.emitted('toggle')?.[0]).toEqual([false]);
    });

    it('closes with Escape when closeOnEscape is enabled', async () => {
        const wrapper = mount(Inplace, {
            props: {
                modelValue: true,
                closeOnEscape: true,
            },
        });

        await wrapper.find('.vf-inplace__content').trigger('keydown', { key: 'Escape' });
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
    });

    it('closes on outside click when enabled', async () => {
        const wrapper = mount(Inplace, {
            props: {
                modelValue: true,
                closeOnOutsideClick: true,
            },
            attachTo: document.body,
        });

        document.body.click();
        await wrapper.vm.$nextTick();

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
        wrapper.unmount();
    });

    it('does not open when disabled', async () => {
        const wrapper = mount(Inplace, {
            props: {
                modelValue: false,
                disabled: true,
            },
        });

        await wrapper.find('.vf-inplace__trigger').trigger('click');
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });
});
