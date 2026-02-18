import { mount } from '@vue/test-utils';
import EmptyState from '../empty-state.vue';

describe('EmptyState', () => {
    it('renders title, description, and icon from props', () => {
        const wrapper = mount(EmptyState, {
            props: {
                title: 'No data',
                description: 'Try adjusting your filters',
                icon: '📭',
            },
        });

        expect(wrapper.find('.vf-empty-state__title').text()).toBe('No data');
        expect(wrapper.find('.vf-empty-state__description').text()).toBe('Try adjusting your filters');
        expect(wrapper.find('.vf-empty-state__icon').text()).toBe('📭');
        expect(wrapper.attributes('role')).toBe('status');
    });

    it('supports slots for icon/title/content/actions', () => {
        const wrapper = mount(EmptyState, {
            slots: {
                icon: '<span data-test="icon">I</span>',
                title: '<span data-test="title">Custom title</span>',
                default: '<span data-test="content">Custom description</span>',
                actions: '<button type="button">Reset</button>',
            },
        });

        expect(wrapper.find('[data-test="icon"]').exists()).toBe(true);
        expect(wrapper.find('[data-test="title"]').exists()).toBe(true);
        expect(wrapper.find('[data-test="content"]').exists()).toBe(true);
        expect(wrapper.find('.vf-empty-state__actions button').text()).toBe('Reset');
    });

    it('applies variant and size classes', () => {
        const wrapper = mount(EmptyState, {
            props: {
                variant: 'outlined',
                size: 'large',
            },
        });

        expect(wrapper.classes()).toContain('vf-empty-state');
        expect(wrapper.classes()).toContain('vf-empty-state_outlined');
        expect(wrapper.classes()).toContain('vf-empty-state_large');
    });
});
