import { mount } from '@vue/test-utils';
import Select from '../select.vue';

const options = [
    { label: 'United States', value: 'us' },
    { label: 'Germany', value: 'de' },
    { label: 'Japan', value: 'jp', disabled: true },
];

const mountSelect = (props: Record<string, unknown> = {}) => {
    return mount(Select, {
        props: { options, ...props },
        global: {
            stubs: {
                teleport: true,
            },
        },
    });
};

describe('Select', () => {
    it('supports keyboard navigation and selection', async () => {
        const wrapper = mountSelect();
        const trigger = wrapper.find('.vf-select__control');

        await trigger.trigger('keydown', { key: 'ArrowDown' });
        const renderedOptions = wrapper.findAll('.vf-select__option');

        await renderedOptions[0].trigger('keydown', { key: 'ArrowDown' });
        await renderedOptions[1].trigger('keydown', { key: 'Enter' });

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['de']);
        expect(wrapper.emitted('change')?.[0]).toEqual(['de']);
    });

    it('clears selected value when clear button is clicked', async () => {
        const wrapper = mountSelect({ modelValue: 'de', clearable: true });
        const clear = wrapper.find('.vf-select__clear');

        expect(clear.exists()).toBe(true);

        await clear.trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([undefined]);
        expect(wrapper.emitted('change')?.[0]).toEqual([undefined]);
    });

    it('does not open when disabled', async () => {
        const wrapper = mountSelect({ disabled: true });
        const trigger = wrapper.find('.vf-select__control');

        await trigger.trigger('click');
        await trigger.trigger('keydown', { key: 'ArrowDown' });

        expect(wrapper.find('.vf-select').classes()).not.toContain('vf-select_open');
        expect(wrapper.find('.vf-select__clear').exists()).toBe(false);
    });

    it('does not open or clear in readonly mode', async () => {
        const wrapper = mountSelect({ modelValue: 'de', clearable: true, readonly: true });
        const trigger = wrapper.find('.vf-select__control');

        await trigger.trigger('click');
        await trigger.trigger('keydown', { key: 'ArrowDown' });

        expect(wrapper.find('.vf-select').classes()).not.toContain('vf-select_open');
        expect(wrapper.find('.vf-select__clear').exists()).toBe(false);
        expect(trigger.attributes('aria-readonly')).toBe('true');
    });
});
