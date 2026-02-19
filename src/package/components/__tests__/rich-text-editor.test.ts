import { mount } from '@vue/test-utils';
import RichTextEditor from '../rich-text-editor.vue';

describe('RichTextEditor', () => {
    it('emits update:modelValue on input', async () => {
        const wrapper = mount(RichTextEditor, { props: { modelValue: '' } });
        const control = wrapper.find('textarea');

        await control.setValue('Hello world');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Hello world']);
    });

    it('applies markdown formatting action to selected value', async () => {
        const wrapper = mount(RichTextEditor, {
            props: {
                modelValue: 'hello',
                format: 'markdown',
            },
        });
        const control = wrapper.find('textarea').element as HTMLTextAreaElement;

        control.focus();
        control.setSelectionRange(0, 5);

        await wrapper.find('[data-action="bold"]').trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['**hello**']);
        expect(wrapper.emitted('action')?.[0]).toEqual(['bold', '**hello**']);
    });

    it('limits entered text by maxLength', async () => {
        const wrapper = mount(RichTextEditor, {
            props: {
                modelValue: '',
                maxLength: 5,
            },
        });
        const control = wrapper.find('textarea');

        await control.setValue('123456789');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['12345']);
        expect(wrapper.text()).toContain('0 / 5');
    });
});
