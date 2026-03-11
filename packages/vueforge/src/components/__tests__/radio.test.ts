import { mount } from '@vue/test-utils';
import RadioGroup from '../radio-group.vue';
import RadioButton from '../radio-button.vue';

describe('RadioGroup', () => {
    it('updates modelValue when a radio is selected', async () => {
        const wrapper = mount({
            components: { RadioGroup, RadioButton },
            template: `
                <RadioGroup v-model="value">
                    <RadioButton value="a" label="A" />
                    <RadioButton value="b" label="B" />
                </RadioGroup>
            `,
            data() {
                return { value: 'a' };
            },
        });

        const inputs = wrapper.findAll('input[type="radio"]');

        await inputs[1].setValue(true);

        expect(wrapper.vm.value).toBe('b');
    });

    it('applies disabled state to radios', () => {
        const wrapper = mount({
            components: { RadioGroup, RadioButton },
            template: `
                <RadioGroup v-model="value" disabled>
                    <RadioButton value="a" label="A" />
                </RadioGroup>
            `,
            data() {
                return { value: 'a' };
            },
        });

        const input = wrapper.find('input[type="radio"]');

        expect(input.attributes('disabled')).toBeDefined();
    });

    it('applies group aria metadata and horizontal class', () => {
        const wrapper = mount(RadioGroup, {
            props: {
                modelValue: 'a',
                direction: 'horizontal',
                ariaLabel: 'Plan selector',
            },
            slots: {
                default: '<RadioButton value="a" label="A" />',
            },
            global: {
                components: { RadioButton },
            },
        });

        expect(wrapper.attributes('role')).toBe('radiogroup');
        expect(wrapper.attributes('aria-label')).toBe('Plan selector');
        expect(wrapper.classes()).toContain('vf-radio-group_horizontal');
    });

    it('passes name to child radios in group mode', () => {
        const wrapper = mount({
            components: { RadioGroup, RadioButton },
            template: `
                <RadioGroup v-model="value" name="billingCycle">
                    <RadioButton value="monthly" label="Monthly" />
                    <RadioButton value="yearly" label="Yearly" />
                </RadioGroup>
            `,
            data() {
                return { value: 'monthly' };
            },
        });

        const inputs = wrapper.findAll('input[type="radio"]');

        expect(inputs[0].attributes('name')).toBe('billingCycle');
        expect(inputs[1].attributes('name')).toBe('billingCycle');
    });
});

describe('RadioButton', () => {
    it('emits update:modelValue and change in standalone mode', async () => {
        const wrapper = mount(RadioButton, {
            props: {
                modelValue: 'a',
                value: 'b',
                label: 'B',
                name: 'standalone',
            },
        });

        await wrapper.find('input[type="radio"]').setValue(true);

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['b']);
        expect(wrapper.emitted('change')?.[0]?.[0]).toBe('b');
    });

    it('does not emit when standalone button is disabled', async () => {
        const wrapper = mount(RadioButton, {
            props: {
                modelValue: 'a',
                value: 'b',
                disabled: true,
            },
        });

        await wrapper.find('input[type="radio"]').trigger('change');

        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        expect(wrapper.emitted('change')).toBeUndefined();
    });
});
