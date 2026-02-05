import { mount } from '@vue/test-utils';
import Slider from '../slider.vue';

describe('Slider', () => {
    it('emits update:modelValue on input', async () => {
        const wrapper = mount(Slider, { props: { modelValue: 10 } });
        const input = wrapper.find('input');

        await input.setValue('42');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([42]);
    });

    it('supports range updates', async () => {
        const wrapper = mount(Slider, { props: { modelValue: [20, 80], range: true } });
        const inputs = wrapper.findAll('input');

        await inputs[0].setValue('30');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[30, 80]]);

        await wrapper.setProps({ modelValue: [30, 80] });

        await inputs[1].setValue('60');

        const last = wrapper.emitted('update:modelValue')?.slice(-1)?.[0];

        expect(last).toEqual([[30, 60]]);
    });

    it('applies disabled state', () => {
        const wrapper = mount(Slider, { props: { disabled: true } });

        expect(wrapper.classes()).toContain('vf-slider_disabled');
        expect(wrapper.find('input').attributes('disabled')).toBeDefined();
    });
});
