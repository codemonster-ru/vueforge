import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Combobox from '../combobox.vue';

const options = [
    { label: 'United States', value: 'us' },
    { label: 'Germany', value: 'de' },
    { label: 'Japan', value: 'jp' },
];

const mountCombobox = (props: Record<string, unknown> = {}) => {
    return mount(Combobox, {
        props: { options, ...props },
        global: {
            stubs: {
                teleport: true,
            },
        },
    });
};

describe('Combobox', () => {
    it('filters options and emits search', async () => {
        const wrapper = mountCombobox();
        const input = wrapper.find('input');

        await input.setValue('ger');
        await nextTick();

        expect(wrapper.emitted('search')?.[0]).toEqual(['ger']);
        expect(wrapper.findAll('.vf-combobox__option')).toHaveLength(1);
        expect(wrapper.find('.vf-combobox__option').text()).toBe('Germany');
    });

    it('resets free text on blur in strict mode', async () => {
        const wrapper = mountCombobox({ modelValue: 'us' });
        const input = wrapper.find('input');

        await input.setValue('unknown');
        await input.trigger('blur');
        await nextTick();

        expect((input.element as HTMLInputElement).value).toBe('United States');
    });

    it('commits custom value with allowCreate', async () => {
        const wrapper = mountCombobox({ allowCreate: true });
        const input = wrapper.find('input');

        await input.setValue('Portugal');
        await input.trigger('keydown', { key: 'Enter' });

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Portugal']);
        expect(wrapper.emitted('create')?.[0]).toEqual(['Portugal']);
    });

    it('clears value when clear button is clicked', async () => {
        const wrapper = mountCombobox({ modelValue: 'de', clearable: true });
        const clear = wrapper.find('.vf-combobox__clear');

        expect(clear.exists()).toBe(true);

        await clear.trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([undefined]);
    });
});
