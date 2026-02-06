import { mount } from '@vue/test-utils';
import Breadcrumbs from '../breadcrumbs.vue';

describe('Breadcrumbs', () => {
    it('renders links and current item by default', () => {
        const wrapper = mount(Breadcrumbs, {
            props: {
                items: [
                    { label: 'Home', href: '/' },
                    { label: 'Library', href: '/library' },
                    { label: 'Data' },
                ],
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
    });

    it('respects explicit active items', () => {
        const wrapper = mount(Breadcrumbs, {
            props: {
                items: [
                    { label: 'Home', href: '/' },
                    { label: 'Library', active: true },
                    { label: 'Data' },
                ],
            },
            global: {
                stubs: {
                    Link: { template: '<a><slot /></a>' },
                },
            },
        });

        expect(wrapper.find('.vf-breadcrumbs__current').text()).toBe('Library');
        expect(wrapper.findAll('.vf-breadcrumbs__current')).toHaveLength(1);
    });
});
