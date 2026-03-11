import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import JsonViewer from '../json-viewer.vue';

const sample = {
    user: {
        id: 42,
        active: true,
    },
    tags: ['ops', 'nightly'],
    note: null,
};

describe('JSONViewer', () => {
    it('renders rows and JSON syntax value classes', () => {
        const wrapper = mount(JsonViewer, {
            props: {
                value: sample,
                expandedDepth: 2,
            },
        });

        expect(wrapper.findAll('.vf-json-viewer__row').length).toBeGreaterThan(1);
        expect(wrapper.find('.vf-json-viewer__number').text()).toContain('42');
        expect(wrapper.find('.vf-json-viewer__boolean').text()).toContain('true');
        expect(wrapper.find('.vf-json-viewer__null').text()).toContain('null');
    });

    it('toggles nested rows and emits toggle event', async () => {
        const wrapper = mount(JsonViewer, {
            props: {
                value: sample,
                expandedDepth: 1,
            },
        });

        const toggles = wrapper.findAll('.vf-json-viewer__toggle');
        await toggles[1].trigger('click');

        expect(wrapper.emitted('toggle')?.[0]).toEqual([{ path: '$.tags', expanded: true }]);
    });

    it('copies path and JSON through clipboard integration', async () => {
        const clipboardWrite = vi.fn().mockResolvedValue(undefined);
        Object.defineProperty(window.navigator, 'clipboard', {
            value: { writeText: clipboardWrite },
            configurable: true,
        });

        const wrapper = mount(JsonViewer, {
            props: {
                value: sample,
                expandedDepth: 1,
            },
        });

        await wrapper.find('.vf-json-viewer__copy').trigger('click');
        await wrapper.findAll('.vf-json-viewer__toolbar-btn')[2].trigger('click');

        expect(clipboardWrite).toHaveBeenCalledTimes(2);
        expect(wrapper.emitted('copyPath')?.[0]).toEqual([{ path: '$' }]);
        expect(wrapper.emitted('copy')?.length).toBe(2);
    });

    it('supports empty state for undefined value', () => {
        const wrapper = mount(JsonViewer, {
            props: {
                value: undefined,
                emptyText: 'No payload',
            },
        });

        expect(wrapper.find('.vf-json-viewer__empty').text()).toContain('No payload');
    });
});
