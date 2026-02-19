import { mount } from '@vue/test-utils';
import PageHeader from '../page-header.vue';

describe('PageHeader', () => {
    it('renders title and subtitle from props', () => {
        const wrapper = mount(PageHeader, {
            props: {
                title: 'Projects',
                subtitle: 'Manage active projects.',
            },
        });

        expect(wrapper.find('.vf-page-header__title').text()).toBe('Projects');
        expect(wrapper.find('.vf-page-header__subtitle').text()).toBe('Manage active projects.');
    });

    it('renders slots for breadcrumbs, meta and actions', () => {
        const wrapper = mount(PageHeader, {
            slots: {
                breadcrumbs: '<div class="breadcrumbs-slot">Breadcrumbs</div>',
                meta: '<div class="meta-slot">Meta</div>',
                actions: '<button class="action-slot">Action</button>',
            },
        });

        expect(wrapper.find('.breadcrumbs-slot').exists()).toBe(true);
        expect(wrapper.find('.meta-slot').exists()).toBe(true);
        expect(wrapper.find('.action-slot').exists()).toBe(true);
    });

    it('applies size and divider classes', () => {
        const wrapper = mount(PageHeader, {
            props: {
                size: 'large',
                divider: true,
            },
        });

        expect(wrapper.classes()).toContain('vf-page-header_large');
        expect(wrapper.classes()).toContain('vf-page-header_divider');
    });
});
