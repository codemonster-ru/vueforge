import { mount } from '@vue/test-utils';
import Tree from '../tree.vue';

describe('Tree', () => {
    const items = [
        {
            key: 'docs',
            label: 'Docs',
            children: [
                { key: 'getting-started', label: 'Getting started' },
                { key: 'api', label: 'API' },
            ],
        },
        { key: 'blog', label: 'Blog' },
    ];

    it('updates modelValue in single mode', async () => {
        const wrapper = mount({
            components: { Tree },
            template: '<Tree v-model="value" :items="items" />',
            data() {
                return {
                    value: undefined,
                    items,
                };
            },
        });

        const rows = wrapper.findAll('[role="treeitem"]');

        await rows[1].trigger('click');

        expect(wrapper.vm.value).toBe('blog');
    });

    it('supports multi selection mode', async () => {
        const wrapper = mount({
            components: { Tree },
            template: '<Tree v-model="value" :items="items" multiple />',
            data() {
                return {
                    value: ['blog'],
                    items,
                };
            },
        });

        const rows = wrapper.findAll('[role="treeitem"]');

        await rows[0].trigger('click');

        expect(wrapper.vm.value).toEqual(['blog', 'docs']);

        await rows[1].trigger('click');

        expect(wrapper.vm.value).toEqual(['docs']);
    });

    it('updates expandedKeys when toggled', async () => {
        const wrapper = mount({
            components: { Tree },
            template: '<Tree v-model:expandedKeys="expanded" :items="items" />',
            data() {
                return {
                    expanded: [],
                    items,
                };
            },
        });

        const toggle = wrapper.find('.vf-tree__toggle');

        await toggle.trigger('click');

        expect(wrapper.vm.expanded).toEqual(['docs']);
    });

    it('does not update modelValue when disabled', async () => {
        const wrapper = mount({
            components: { Tree },
            template: '<Tree v-model="value" :items="items" disabled />',
            data() {
                return {
                    value: undefined,
                    items,
                };
            },
        });

        const row = wrapper.find('[role="treeitem"]');

        await row.trigger('click');

        expect(wrapper.vm.value).toBeUndefined();
        expect(wrapper.find('.vf-tree').classes()).toContain('vf-tree_disabled');
    });
});
