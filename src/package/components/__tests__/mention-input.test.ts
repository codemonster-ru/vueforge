import { mount } from '@vue/test-utils';
import MentionInput from '../mention-input.vue';

const suggestions = [
    { label: 'alice', value: 'alice', trigger: '@' },
    { label: 'alex', value: 'alex', trigger: '@' },
    { label: 'frontend', value: 'frontend', trigger: '#' },
];

describe('MentionInput', () => {
    it('emits search payload when mention query is active', async () => {
        const wrapper = mount(MentionInput, {
            props: {
                modelValue: '',
                suggestions,
            },
        });

        const input = wrapper.find('input');

        await input.setValue('@al');

        (input.element as HTMLInputElement).setSelectionRange(3, 3);

        await input.trigger('input');

        expect(wrapper.emitted('search')?.[0]).toEqual([{ trigger: '@', query: 'al' }]);
    });

    it('inserts selected mention on Enter', async () => {
        const wrapper = mount(MentionInput, {
            props: {
                modelValue: '@al',
                suggestions,
            },
        });
        const input = wrapper.find('input');

        (input.element as HTMLInputElement).value = '@al';
        (input.element as HTMLInputElement).setSelectionRange(3, 3);

        await input.trigger('input');
        await input.trigger('keydown', { key: 'ArrowDown' });
        await input.trigger('keydown', { key: 'Enter' });

        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['@alex ']);
        expect(wrapper.emitted('insert')?.length).toBe(1);
    });

    it('filters suggestions by trigger', async () => {
        const wrapper = mount(MentionInput, {
            props: {
                modelValue: '#fr',
                suggestions,
            },
        });
        const input = wrapper.find('input');

        (input.element as HTMLInputElement).value = '#fr';
        (input.element as HTMLInputElement).setSelectionRange(3, 3);

        await input.trigger('input');

        const options = wrapper.findAll('.vf-mention-input__option');

        expect(options).toHaveLength(1);
        expect(options[0].text()).toContain('frontend');
    });

    it('closes panel on escape', async () => {
        const wrapper = mount(MentionInput, {
            props: {
                modelValue: '@al',
                suggestions,
            },
        });
        const input = wrapper.find('input');

        (input.element as HTMLInputElement).value = '@al';
        (input.element as HTMLInputElement).setSelectionRange(3, 3);

        await input.trigger('input');

        expect(wrapper.find('.vf-mention-input__panel').isVisible()).toBe(true);

        await input.trigger('keydown', { key: 'Escape' });

        expect(wrapper.find('.vf-mention-input').classes()).not.toContain('vf-mention-input_open');
    });
});
