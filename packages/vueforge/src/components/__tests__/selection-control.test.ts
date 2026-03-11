import { mount } from '@vue/test-utils';
import SelectionControl from '../selection-control.vue';
import SelectionControlGroup from '../selection-control-group.vue';

describe('SelectionControl', () => {
    it('emits boolean update in standalone checkbox mode', async () => {
        const wrapper = mount(SelectionControl, {
            props: {
                modelValue: false,
                type: 'checkbox',
            },
        });

        await wrapper.find('input[type="checkbox"]').setValue(true);

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);
        expect(wrapper.emitted('change')?.[0]?.[0]).toBe(true);
    });

    it('emits selected value in standalone radio mode', async () => {
        const wrapper = mount(SelectionControl, {
            props: {
                modelValue: 'a',
                value: 'b',
                type: 'radio',
            },
        });

        await wrapper.find('input[type="radio"]').setValue(true);

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['b']);
        expect(wrapper.emitted('change')?.[0]?.[0]).toBe('b');
    });
});

describe('SelectionControlGroup', () => {
    it('updates array model for checkbox group', async () => {
        const wrapper = mount({
            components: { SelectionControl, SelectionControlGroup },
            template: `
                <SelectionControlGroup v-model="value" type="checkbox">
                    <SelectionControl value="alpha" label="Alpha" />
                    <SelectionControl value="beta" label="Beta" />
                </SelectionControlGroup>
            `,
            data() {
                return {
                    value: ['alpha'],
                };
            },
        });

        const inputs = wrapper.findAll('input[type="checkbox"]');
        await inputs[1].setValue(true);

        expect((wrapper.vm as unknown as { value: Array<string> }).value).toEqual(['alpha', 'beta']);
    });

    it('updates scalar model for radio group', async () => {
        const wrapper = mount({
            components: { SelectionControl, SelectionControlGroup },
            template: `
                <SelectionControlGroup v-model="value" type="radio" name="plan">
                    <SelectionControl value="free" label="Free" />
                    <SelectionControl value="pro" label="Pro" />
                </SelectionControlGroup>
            `,
            data() {
                return {
                    value: 'free',
                };
            },
        });

        const inputs = wrapper.findAll('input[type="radio"]');
        await inputs[1].setValue(true);

        expect((wrapper.vm as unknown as { value: string }).value).toBe('pro');
        expect(inputs[0].attributes('name')).toBe('plan');
        expect(inputs[1].attributes('name')).toBe('plan');
    });

    it('applies radiogroup semantics and horizontal class', () => {
        const wrapper = mount(SelectionControlGroup, {
            props: {
                type: 'radio',
                direction: 'horizontal',
                ariaLabel: 'Mode selector',
            },
            slots: {
                default: '<div />',
            },
        });

        expect(wrapper.attributes('role')).toBe('radiogroup');
        expect(wrapper.attributes('aria-label')).toBe('Mode selector');
        expect(wrapper.classes()).toContain('vf-selection-control-group_horizontal');
    });
});
