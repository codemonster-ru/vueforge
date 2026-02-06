import { mount } from '@vue/test-utils';
import NumberInput from '../number-input.vue';

describe('NumberInput', () => {
    it('emits update:modelValue with a number on input', async () => {
        const wrapper = mount(NumberInput, { props: { modelValue: null } });
        const control = wrapper.find('input');

        await control.setValue('12');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([12]);
    });

    it('emits null on empty input', async () => {
        const wrapper = mount(NumberInput, { props: { modelValue: 5 } });
        const control = wrapper.find('input');

        await control.setValue('');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null]);
    });
});
