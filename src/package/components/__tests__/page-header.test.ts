import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
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
        expect(wrapper.find('.vf-page-header__meta').attributes('role')).toBe('group');
        expect(wrapper.find('.vf-page-header__actions').attributes('role')).toBe('group');
        expect(wrapper.find('.vf-page-header__meta').attributes('aria-label')).toBe('Page metadata');
        expect(wrapper.find('.vf-page-header__actions').attributes('aria-label')).toBe('Page actions');
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

    it('applies mobile class based on viewport and breakpoint', async () => {
        const previousWidth = window.innerWidth;

        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            writable: true,
            value: 640,
        });
        window.dispatchEvent(new Event('resize'));

        const wrapper = mount(PageHeader, {
            props: {
                title: 'Responsive',
                mobileBreakpoint: 700,
            },
            slots: {
                actions: '<button>Action</button>',
            },
        });

        await nextTick();

        expect(wrapper.classes()).toContain('vf-page-header_mobile');

        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            writable: true,
            value: previousWidth,
        });
        window.dispatchEvent(new Event('resize'));
    });
});
