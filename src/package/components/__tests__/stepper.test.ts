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

    it('supports keyboard navigation in clickable mode', async () => {
        const wrapper = mount(
            {
                components: { Stepper },
                template: '<Stepper v-model="step" :steps="steps" clickable />',
                data() {
                    return {
                        step: 0,
                        steps: [{ label: 'Account' }, { label: 'Plan' }, { label: 'Confirm' }],
                    };
                },
            },
            { attachTo: document.body },
        );

        const buttons = wrapper.findAll('button.vf-stepper__button');
        const first = buttons[0].element as HTMLButtonElement;

        first.focus();
        await buttons[0].trigger('keydown', { key: 'ArrowRight' });
        expect(wrapper.vm.step).toBe(1);

        await buttons[1].trigger('keydown', { key: 'End' });
        expect(wrapper.vm.step).toBe(2);

        wrapper.unmount();
    });

    it('does not change step when globally disabled', async () => {
        const wrapper = mount({
            components: { Stepper },
            template: '<Stepper v-model="step" :steps="steps" clickable disabled />',
            data() {
                return {
                    step: 0,
                    steps: [{ label: 'Account' }, { label: 'Plan' }, { label: 'Confirm' }],
                };
            },
        });

        const buttons = wrapper.findAll('button.vf-stepper__button');
        const pseudoButtons = wrapper.findAll('.vf-stepper__button');
        expect(wrapper.find('.vf-stepper').classes()).toContain('vf-stepper_disabled');
        expect(buttons).toHaveLength(0);
        expect(pseudoButtons).toHaveLength(3);

        await pseudoButtons[2].trigger('click');
        expect(wrapper.vm.step).toBe(0);
    });
});
