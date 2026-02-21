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

    it('applies native and aria attributes for combobox semantics', async () => {
        const wrapper = mount(MentionInput, {
            props: {
                modelValue: '@al',
                suggestions,
                id: 'mention',
                name: 'mention',
                required: true,
                autocomplete: 'off',
                inputmode: 'text',
                ariaLabel: 'Mention users',
                ariaDescribedby: 'mention-hint',
                ariaInvalid: true,
            },
        });
        const input = wrapper.find('input');

        (input.element as HTMLInputElement).value = '@al';
        (input.element as HTMLInputElement).setSelectionRange(3, 3);
        await input.trigger('input');

        expect(input.attributes('id')).toBe('mention');
        expect(input.attributes('name')).toBe('mention');
        expect(input.attributes('required')).toBeDefined();
        expect(input.attributes('role')).toBe('combobox');
        expect(input.attributes('aria-autocomplete')).toBe('list');
        expect(input.attributes('aria-controls')).toBeTruthy();
        expect(input.attributes('aria-expanded')).toBe('true');
        expect(input.attributes('aria-activedescendant')).toBeTruthy();
        expect(input.attributes('aria-label')).toBe('Mention users');
        expect(input.attributes('aria-describedby')).toBe('mention-hint');
        expect(input.attributes('aria-invalid')).toBe('true');
        expect(input.attributes('aria-required')).toBe('true');
    });

    it('does not open suggestion panel when disabled or readonly', async () => {
        const disabled = mount(MentionInput, {
            props: { modelValue: '@al', suggestions, disabled: true },
        });
        const readonly = mount(MentionInput, {
            props: { modelValue: '@al', suggestions, readonly: true },
        });

        const disabledInput = disabled.find('input');
        (disabledInput.element as HTMLInputElement).value = '@al';
        (disabledInput.element as HTMLInputElement).setSelectionRange(3, 3);
        await disabledInput.trigger('input');

        const readonlyInput = readonly.find('input');
        (readonlyInput.element as HTMLInputElement).value = '@al';
        (readonlyInput.element as HTMLInputElement).setSelectionRange(3, 3);
        await readonlyInput.trigger('input');

        expect(disabled.find('.vf-mention-input').classes()).not.toContain('vf-mention-input_open');
        expect(readonly.find('.vf-mention-input').classes()).not.toContain('vf-mention-input_open');
    });
});
