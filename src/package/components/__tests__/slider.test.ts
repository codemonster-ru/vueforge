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

    it('applies aria labels for single and range modes', () => {
        const single = mount(Slider, {
            props: {
                modelValue: 25,
                ariaLabel: 'Volume slider',
            },
        });
        const range = mount(Slider, {
            props: {
                modelValue: [10, 50],
                range: true,
                ariaLabelStart: 'Minimum price',
                ariaLabelEnd: 'Maximum price',
            },
        });

        expect(single.find('input').attributes('aria-label')).toBe('Volume slider');

        const rangeInputs = range.findAll('input');
        expect(rangeInputs[0].attributes('aria-label')).toBe('Minimum price');
        expect(rangeInputs[1].attributes('aria-label')).toBe('Maximum price');
    });

    it('renders marks and value label when enabled', () => {
        const wrapper = mount(Slider, {
            props: {
                modelValue: [20, 60],
                range: true,
                showValue: true,
                marks: [
                    { value: 0, label: '0' },
                    { value: 50, label: '50' },
                    { value: 100, label: '100' },
                ],
            },
        });

        expect(wrapper.findAll('.vf-slider__mark')).toHaveLength(3);
        expect(wrapper.find('.vf-slider__value').text()).toBe('20 - 60');
    });

    it('emits focus, blur, and change events', async () => {
        const wrapper = mount(Slider, { props: { modelValue: 10 } });
        const input = wrapper.find('input');

        await input.trigger('focus');
        await input.trigger('blur');
        await input.trigger('change');

        expect(wrapper.emitted('focus')?.length).toBe(1);
        expect(wrapper.emitted('blur')?.length).toBe(1);
        expect(wrapper.emitted('change')?.length).toBe(1);
    });
});
