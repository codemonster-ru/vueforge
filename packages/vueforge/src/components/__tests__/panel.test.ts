import { mount } from '@vue/test-utils';
import Panel from '../panel.vue';

describe('Panel', () => {
    it('renders title, subtitle, body and actions group', () => {
        const wrapper = mount(Panel, {
            props: {
                title: 'Project',
                subtitle: 'Overview',
            },
            slots: {
                actions: '<button type="button" class="panel-action">Edit</button>',
                default: '<div class="panel-content">Content</div>',
            },
        });

        expect(wrapper.find('.vf-panel__title').text()).toBe('Project');
        expect(wrapper.find('.vf-panel__subtitle').text()).toBe('Overview');
        expect(wrapper.find('.panel-content').exists()).toBe(true);
        expect(wrapper.find('.vf-panel__actions').attributes('role')).toBe('group');
    });

    it('toggles collapsed state when collapsible', async () => {
        const wrapper = mount(Panel, {
            props: {
                modelValue: true,
                collapsible: true,
            },
            slots: {
                default: '<div class="panel-content">Body</div>',
            },
        });

        expect(wrapper.find('.panel-content').exists()).toBe(true);

        await wrapper.find('.vf-panel__toggle').trigger('click');
        await wrapper.vm.$nextTick();

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
        expect(wrapper.emitted('toggle')?.[0]?.[0]).toBe(false);
        expect(wrapper.find('.panel-content').exists()).toBe(false);
    });
});
