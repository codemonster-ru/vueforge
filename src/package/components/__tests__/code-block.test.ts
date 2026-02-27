import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import CodeBlock from '../code-block.vue';

describe('CodeBlock', () => {
    it('renders highlighted content and line numbers', () => {
        const wrapper = mount(CodeBlock, {
            props: {
                language: 'ts',
                code: 'const value = 42;\nreturn value;',
                showLineNumbers: true,
            },
        });

        expect(wrapper.findAll('.vf-code-block__line-number')).toHaveLength(2);
        expect(wrapper.html()).toContain('vf-code-block__token_keyword');
        expect(wrapper.html()).toContain('vf-code-block__token_number');
    });

    it('renders custom actions slot', () => {
        const wrapper = mount(CodeBlock, {
            props: {
                code: 'echo hi',
            },
            slots: {
                actions: '<button type="button" class="custom-action">Run</button>',
            },
        });

        expect(wrapper.find('.custom-action').exists()).toBe(true);
    });

    it('copies code and emits copy', async () => {
        const clipboardWrite = vi.fn().mockResolvedValue(undefined);
        Object.defineProperty(window.navigator, 'clipboard', {
            value: { writeText: clipboardWrite },
            configurable: true,
        });

        const wrapper = mount(CodeBlock, {
            props: {
                code: 'npm run build',
            },
        });

        await wrapper.find('.vf-code-block__copy').trigger('click');

        expect(clipboardWrite).toHaveBeenCalledWith('npm run build');
        expect(wrapper.emitted('copy')?.[0]).toEqual([{ text: 'npm run build' }]);
    });

    it('does not copy when disabled', async () => {
        const clipboardWrite = vi.fn().mockResolvedValue(undefined);
        Object.defineProperty(window.navigator, 'clipboard', {
            value: { writeText: clipboardWrite },
            configurable: true,
        });

        const wrapper = mount(CodeBlock, {
            props: {
                code: 'disabled',
                disabled: true,
            },
        });

        await wrapper.find('.vf-code-block__copy').trigger('click');

        expect(clipboardWrite).not.toHaveBeenCalled();
        expect(wrapper.emitted('copy')).toBeUndefined();
    });
});
