import { mount } from '@vue/test-utils';
import Textarea from '../textarea.vue';

describe('Textarea', () => {
    it('emits update:modelValue on input', async () => {
        const wrapper = mount(Textarea, { props: { modelValue: 'Start' } });
        const control = wrapper.find('textarea');

        await control.setValue('Next');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Next']);
    });

    it('applies disabled state', () => {
        const wrapper = mount(Textarea, { props: { disabled: true } });

        expect(wrapper.classes()).toContain('vf-textarea_disabled');
        expect(wrapper.find('textarea').attributes('disabled')).toBeDefined();
    });
});
