import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import ColorPicker from '../color-picker.vue';

describe('ColorPicker', () => {
    it('emits update:modelValue when color changes', async () => {
        const wrapper = mount(ColorPicker, {
            props: {
                modelValue: '#112233',
            },
        });

        await wrapper.find('.vf-color-picker__control').trigger('click');
        await wrapper.find('.vf-color-picker__native').setValue('#445566');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['#445566']);
    });

    it('applies preset color on click', async () => {
        const wrapper = mount(ColorPicker, {
            props: {
                modelValue: '#112233',
                presets: ['#ff0000', '#00ff00'],
            },
        });

        await wrapper.find('.vf-color-picker__control').trigger('click');
        await wrapper.findAll('.vf-color-picker__preset')[1].trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['#00ff00']);
    });

    it('emits open and close', async () => {
        const wrapper = mount(ColorPicker, {
            props: {
                modelValue: '#112233',
            },
        });

        await wrapper.find('.vf-color-picker__control').trigger('click');
        await nextTick();

        document.body.click();

        await nextTick();

        expect(wrapper.emitted('open')).toBeTruthy();
        expect(wrapper.emitted('close')).toBeTruthy();
    });

    it('links control and panel via aria attributes', async () => {
        const wrapper = mount(ColorPicker, {
            props: {
                modelValue: '#112233',
            },
        });

        const control = wrapper.get('.vf-color-picker__control');

        expect(control.attributes('aria-expanded')).toBe('false');

        await control.trigger('click');

        const panel = wrapper.get('.vf-color-picker__panel');

        expect(control.attributes('aria-expanded')).toBe('true');
        expect(control.attributes('aria-controls')).toBe(panel.attributes('id'));
        expect(panel.attributes('role')).toBe('dialog');
    });

    it('does not open when readonly', async () => {
        const wrapper = mount(ColorPicker, {
            props: {
                modelValue: '#112233',
                readonly: true,
            },
        });

        const control = wrapper.get('.vf-color-picker__control');
        await control.trigger('click');

        expect(wrapper.find('.vf-color-picker__panel').exists()).toBe(false);
        expect(wrapper.emitted('open')).toBeFalsy();
        expect(control.attributes('aria-disabled')).toBe('true');
    });

    it('closes panel on escape key', async () => {
        const wrapper = mount(ColorPicker, {
            attachTo: document.body,
            props: {
                modelValue: '#112233',
            },
        });

        await wrapper.get('.vf-color-picker__control').trigger('click');
        expect(wrapper.find('.vf-color-picker__panel').exists()).toBe(true);

        await wrapper.get('.vf-color-picker__text').trigger('keydown', { key: 'Escape' });
        await nextTick();

        expect(wrapper.find('.vf-color-picker__panel').exists()).toBe(false);
        expect(wrapper.emitted('close')).toBeTruthy();

        wrapper.unmount();
    });
});
