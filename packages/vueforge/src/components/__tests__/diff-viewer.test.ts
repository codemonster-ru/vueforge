import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import DiffViewer from '../diff-viewer.vue';

describe('DiffViewer', () => {
    it('renders inline rows by default', () => {
        const wrapper = mount(DiffViewer, {
            props: {
                before: 'alpha\nbeta',
                after: 'alpha\ngamma',
            },
        });

        expect(wrapper.find('.vf-diff-viewer__inline').exists()).toBe(true);
        expect(wrapper.findAll('.vf-diff-viewer__row').length).toBe(2);
        expect(wrapper.findAll('.vf-diff-viewer__row')[1].attributes('data-state')).toBe('changed');
    });

    it('switches to split mode and emits update:mode', async () => {
        const wrapper = mount(DiffViewer, {
            props: {
                before: 'a',
                after: 'b',
            },
        });

        await wrapper.findAll('.vf-diff-viewer__toolbar-btn')[1].trigger('click');

        expect(wrapper.emitted('update:mode')?.[0]).toEqual(['split']);
    });

    it('formats object input as JSON in auto mode', () => {
        const wrapper = mount(DiffViewer, {
            props: {
                before: { value: 1, active: false },
                after: { value: 2, active: true },
            },
        });

        expect(wrapper.text()).toContain('"value"');
        expect(wrapper.text()).toContain('true');
    });

    it('copies diff text', async () => {
        const clipboardWrite = vi.fn().mockResolvedValue(undefined);
        Object.defineProperty(window.navigator, 'clipboard', {
            value: { writeText: clipboardWrite },
            configurable: true,
        });

        const wrapper = mount(DiffViewer, {
            props: {
                before: 'foo',
                after: 'bar',
            },
        });

        await wrapper.findAll('.vf-diff-viewer__toolbar-btn')[2].trigger('click');

        expect(clipboardWrite).toHaveBeenCalledTimes(1);
        expect(wrapper.emitted('copy')?.length).toBe(1);
    });
});
