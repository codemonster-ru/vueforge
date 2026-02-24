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

    it('sanitizes html paste in basic profile', async () => {
        const wrapper = mount(RichTextEditor, {
            props: {
                modelValue: '',
                format: 'html',
                sanitizeOnPaste: true,
                sanitizationProfile: 'basic',
            },
        });
        const control = wrapper.find('textarea');
        const element = control.element as HTMLTextAreaElement;
        element.setSelectionRange(0, 0);

        const preventDefault = vi.fn();
        await control.trigger('paste', {
            clipboardData: {
                getData: (type: string) =>
                    type === 'text/html'
                        ? '<p onclick="evil()">ok</p><script>alert(1)</script><a href="javascript:alert(1)">x</a>'
                        : 'ok',
            },
            preventDefault,
        });

        const emitted = wrapper.emitted('update:modelValue')?.[0]?.[0] as string;
        expect(emitted).toContain('<p>ok</p>');
        expect(emitted).not.toContain('<script>');
        expect(emitted).not.toContain('onclick=');
        expect(emitted).toContain('href="#"');
        expect(wrapper.emitted('pasteSanitized')?.[0]?.[0]).toEqual({
            profile: 'basic',
            changed: true,
            format: 'html',
        });
    });

    it('strips non-allowed tags in strict profile', async () => {
        const wrapper = mount(RichTextEditor, {
            props: {
                modelValue: '',
                format: 'html',
                sanitizationProfile: 'strict',
            },
        });
        const control = wrapper.find('textarea');
        const element = control.element as HTMLTextAreaElement;
        element.setSelectionRange(0, 0);

        await control.trigger('paste', {
            clipboardData: {
                getData: (type: string) =>
                    type === 'text/html' ? '<div>wrap</div><img src="x" /><p><strong>safe</strong></p>' : 'wrap safe',
            },
            preventDefault: vi.fn(),
        });

        const emitted = wrapper.emitted('update:modelValue')?.[0]?.[0] as string;
        expect(emitted).not.toContain('<div');
        expect(emitted).not.toContain('<img');
        expect(emitted).toContain('<p><strong>safe</strong></p>');
    });

    it('keeps pasted value unchanged when sanitization profile is none', async () => {
        const wrapper = mount(RichTextEditor, {
            props: {
                modelValue: '',
                format: 'html',
                sanitizeOnPaste: true,
                sanitizationProfile: 'none',
            },
        });
        const control = wrapper.find('textarea');
        const element = control.element as HTMLTextAreaElement;
        element.setSelectionRange(0, 0);

        const raw = '<p onclick="x()">raw</p>';
        await control.trigger('paste', {
            clipboardData: {
                getData: (type: string) => (type === 'text/html' ? raw : 'raw'),
            },
            preventDefault: vi.fn(),
        });

        expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe(raw);
    });
});
