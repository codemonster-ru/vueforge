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
});
