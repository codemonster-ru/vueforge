import { mount } from '@vue/test-utils';
import Stepper from '../stepper.vue';

describe('Stepper', () => {
    it('marks the active step based on modelValue', () => {
        const wrapper = mount(Stepper, {
            props: {
                modelValue: 1,
                steps: [{ label: 'Account' }, { label: 'Plan' }, { label: 'Confirm' }],
            },
        });

        const items = wrapper.findAll('.vf-stepper__item');

        expect(items[1].classes()).toContain('is-active');
    });

    it('updates modelValue when a step is clicked', async () => {
        const wrapper = mount({
            components: { Stepper },
            template: '<Stepper v-model="step" :steps="steps" clickable />',
            data() {
                return {
                    step: 0,
                    steps: [{ label: 'Account' }, { label: 'Plan' }, { label: 'Confirm' }],
                };
            },
        });

        const buttons = wrapper.findAll('button.vf-stepper__button');

        await buttons[2].trigger('click');

        expect(wrapper.vm.step).toBe(2);
    });
});
