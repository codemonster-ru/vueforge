import { mount } from '@vue/test-utils';
import Breadcrumbs from '../breadcrumbs.vue';

describe('Breadcrumbs', () => {
    it('renders links and current item by default', () => {
        const wrapper = mount(Breadcrumbs, {
            props: {
                items: [{ label: 'Home', href: '/' }, { label: 'Library', href: '/library' }, { label: 'Data' }],
            },
            global: {
                stubs: {
                    Link: { template: '<a><slot /></a>' },
                },
            },
        });

        expect(wrapper.findAll('.vf-breadcrumbs__link')).toHaveLength(2);
        expect(wrapper.findAll('.vf-breadcrumbs__separator')).toHaveLength(2);
        expect(wrapper.find('.vf-breadcrumbs__current').text()).toBe('Data');
        expect(wrapper.find('nav.vf-breadcrumbs').attributes('aria-label')).toBe('Breadcrumbs');
        expect(wrapper.find('.vf-breadcrumbs__current').attributes('aria-current')).toBe('page');
    });

    it('respects explicit active items', () => {
        const wrapper = mount(Breadcrumbs, {
            props: {
                items: [{ label: 'Home', href: '/' }, { label: 'Library', active: true }, { label: 'Data' }],
            },
            global: {
                stubs: {
                    Link: { template: '<a><slot /></a>' },
                },
            },
        });

        expect(wrapper.find('.vf-breadcrumbs__current').text()).toBe('Library');
        expect(wrapper.findAll('.vf-breadcrumbs__current')).toHaveLength(1);
        expect(wrapper.findAll('.vf-breadcrumbs__separator')).toHaveLength(2);
    });

    it('supports custom aria label and separator slot', () => {
        const wrapper = mount(Breadcrumbs, {
            props: {
                ariaLabel: 'Path',
                separator: '>',
                items: [{ label: 'Home', href: '/' }, { label: 'Docs', href: '/docs' }, { label: 'API' }],
            },
            slots: {
                separator: '<span class="custom-separator">›</span>',
            },
            global: {
                stubs: {
                    Link: { template: '<a><slot /></a>' },
                },
            },
        });

        expect(wrapper.find('nav.vf-breadcrumbs').attributes('aria-label')).toBe('Path');
        expect(wrapper.findAll('.custom-separator')).toHaveLength(2);
    });
});
