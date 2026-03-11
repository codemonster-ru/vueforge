import { mount, VueWrapper } from '@vue/test-utils';
import { nextTick } from 'vue';
import { vi } from 'vitest';
import CascadeSelect from '../cascade-select.vue';

const mountCascadeSelect = (props: Record<string, unknown> = {}) =>
    mount(CascadeSelect, {
        props: {
            items: [{ key: 'org', label: 'Organization', hasChildren: true }],
            expandedKeys: [],
            ...props,
        },
        global: {
            stubs: {
                teleport: true,
            },
        },
    });

const flush = async () => {
    await Promise.resolve();
    await nextTick();
};

describe('CascadeSelect', () => {
    it('loads branch children on first expand when loadChildren is provided', async () => {
        const loadChildren = vi.fn(async () => [{ key: 'team-a', label: 'Team A' }]);
        const wrapper = mountCascadeSelect({ loadChildren });

        await wrapper.find('.vf-treeselect__control').trigger('click');
        await nextTick();
        await wrapper.find('.vf-tree__toggle').trigger('click');
        await flush();

        expect(loadChildren).toHaveBeenCalledTimes(1);
        expect(wrapper.emitted('branchLoadStart')).toBeTruthy();
        expect(wrapper.emitted('branchLoad')).toBeTruthy();
    });

    it('renders loaded branch and allows selecting loaded child', async () => {
        const loadChildren = vi.fn(async () => [{ key: 'team-a', label: 'Team A' }]);
        const wrapper = mountCascadeSelect({ loadChildren });

        await wrapper.find('.vf-treeselect__control').trigger('click');
        await nextTick();
        await wrapper.find('.vf-tree__toggle').trigger('click');
        await flush();

        await (wrapper as VueWrapper).setProps({ expandedKeys: ['org'] });
        await nextTick();

        const rows = wrapper.findAll('[role="treeitem"]');
        const loadedRow = rows.find(row => row.text().includes('Team A'));

        expect(loadedRow).toBeDefined();
        await loadedRow?.trigger('click');

        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['team-a']);
    });
});
