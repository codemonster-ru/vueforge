import { mount } from '@vue/test-utils';
import OrgChart from '../org-chart.vue';

describe('OrgChart', () => {
    const items = [
        {
            key: 'ceo',
            label: 'CEO',
            title: 'Executive',
            children: [
                { key: 'cto', label: 'CTO', title: 'Technology' },
                { key: 'cfo', label: 'CFO', title: 'Finance' },
            ],
        },
        { key: 'coo', label: 'COO', title: 'Operations' },
    ];

    it('renders root tree semantics and toggles expansion', async () => {
        const wrapper = mount(OrgChart, {
            props: {
                items,
                expandedKeys: [],
            },
        });

        expect(wrapper.attributes('role')).toBe('tree');

        await wrapper.find('.vf-org-chart__toggle').trigger('click');
        expect(wrapper.emitted('update:expandedKeys')?.[0]).toEqual([['ceo']]);
    });

    it('updates modelValue in single selection mode', async () => {
        const wrapper = mount({
            components: { OrgChart },
            template: '<OrgChart v-model="value" :items="items" :expanded-keys="[\'ceo\']" />',
            data() {
                return {
                    value: undefined,
                    items,
                };
            },
        });

        const nodes = wrapper.findAll('[role="treeitem"]');
        await nodes[1].trigger('click');

        expect(wrapper.vm.value).toBe('cto');
    });

    it('supports multi selection and keyboard navigation contracts', async () => {
        const wrapper = mount({
            components: { OrgChart },
            template: '<OrgChart v-model="value" :items="items" :expanded-keys="[\'ceo\']" multiple />',
            data() {
                return {
                    value: ['coo'],
                    items,
                };
            },
        });

        const nodes = wrapper.findAll('[role="treeitem"]');
        await nodes[0].trigger('keydown', { key: 'ArrowRight' });
        await nodes[1].trigger('keydown', { key: 'End' });
        await nodes[1].trigger('keydown', { key: 'Enter' });

        expect((wrapper.vm.value as Array<string>).includes('cto')).toBe(true);
    });

    it('does not toggle/select when disabled', async () => {
        const wrapper = mount(OrgChart, {
            props: {
                items,
                disabled: true,
            },
        });

        await wrapper.find('[role="treeitem"]').trigger('click');
        expect(wrapper.emitted('update:modelValue')).toBeFalsy();
        expect(wrapper.classes()).toContain('vf-org-chart_disabled');
    });
});
