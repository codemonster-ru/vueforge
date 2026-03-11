import { mount } from '@vue/test-utils';
import Textarea from '../textarea.vue';

describe('Textarea', () => {
    it('emits update:modelValue on input', async () => {
        const wrapper = mount(Textarea, { props: { modelValue: 'Start' } });
        const control = wrapper.find('textarea');

        await control.setValue('Next');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Next']);
    });

    it('applies native and aria attributes to textarea control', () => {
        const wrapper = mount(Textarea, {
            props: {
                modelValue: '',
                id: 'bio',
                name: 'bio',
                required: true,
                autocomplete: 'on',
                inputmode: 'text',
                ariaLabel: 'Biography',
                ariaDescribedby: 'bio-hint',
                ariaInvalid: true,
            },
        });
        const control = wrapper.find('textarea');

        expect(control.attributes('id')).toBe('bio');
        expect(control.attributes('name')).toBe('bio');
        expect(control.attributes('required')).toBeDefined();
        expect(control.attributes('autocomplete')).toBe('on');
        expect(control.attributes('inputmode')).toBe('text');
        expect(control.attributes('aria-label')).toBe('Biography');
        expect(control.attributes('aria-describedby')).toBe('bio-hint');
        expect(control.attributes('aria-invalid')).toBe('true');
        expect(control.attributes('aria-required')).toBe('true');
    });

    it('applies disabled and readonly semantics', () => {
        const wrapper = mount(Textarea, { props: { disabled: true, readonly: true } });
        const control = wrapper.find('textarea');

        expect(wrapper.classes()).toContain('vf-textarea_disabled');
        expect(control.attributes('disabled')).toBeDefined();
        expect(control.attributes('readonly')).toBeDefined();
    });

    it('emits focus and blur events', async () => {
        const wrapper = mount(Textarea, { props: { modelValue: '' } });
        const control = wrapper.find('textarea');

        await control.trigger('focus');
        await control.trigger('blur');

        expect(wrapper.emitted('focus')).toBeTruthy();
        expect(wrapper.emitted('blur')).toBeTruthy();
    });
});
