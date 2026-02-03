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
});
