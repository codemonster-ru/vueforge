import { mount, RouterLinkStub } from '@vue/test-utils';
import { routeLocationKey, routerKey } from 'vue-router';
import TabMenu from '../tab-menu.vue';

const globalStubs = {
    stubs: {
        RouterLink: RouterLinkStub,
    },
};

describe('TabMenu', () => {
    it('updates modelValue on item click', async () => {
        const wrapper = mount(TabMenu, {
            props: {
                modelValue: 'overview',
                items: [
                    { label: 'Overview', value: 'overview', to: '/overview' },
                    { label: 'Billing', value: 'billing', to: '/billing' },
                ],
            },
            global: {
                ...globalStubs,
                provide: {
                    [routerKey as symbol]: {
                        resolve: (to: unknown) => ({ path: String(to), fullPath: String(to) }),
                    },
                },
            },
        });

        const tabs = wrapper.findAll('[role="tab"]');
        await tabs[1].trigger('click');

        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['billing']);
        expect(wrapper.emitted('change')).toBeTruthy();
    });

    it('marks route-matched tab as active when syncActiveFromRoute is enabled', () => {
        const wrapper = mount(TabMenu, {
            props: {
                items: [
                    { label: 'Overview', to: '/overview' },
                    { label: 'Reports', to: '/reports' },
                ],
            },
            global: {
                ...globalStubs,
                provide: {
                    [routerKey as symbol]: {
                        resolve: (to: unknown) => ({ path: String(to), fullPath: String(to) }),
                    },
                    [routeLocationKey as symbol]: {
                        path: '/reports',
                        fullPath: '/reports',
                        matched: [],
                    },
                },
            },
        });

        const tabs = wrapper.findAll('[role="tab"]');
        expect(tabs[1].attributes('aria-selected')).toBe('true');
    });

    it('supports keyboard navigation and emits active selection', async () => {
        const wrapper = mount(TabMenu, {
            props: {
                modelValue: 'overview',
                items: [
                    { label: 'Overview', value: 'overview', to: '/overview' },
                    { label: 'Reports', value: 'reports', to: '/reports' },
                    { label: 'Billing', value: 'billing', to: '/billing' },
                ],
            },
            global: {
                ...globalStubs,
                provide: {
                    [routerKey as symbol]: {
                        resolve: (to: unknown) => ({ path: String(to), fullPath: String(to) }),
                    },
                },
            },
            attachTo: document.body,
        });

        const tabs = wrapper.findAll('[role="tab"]');
        await tabs[0].trigger('focus');
        await wrapper.find('[role="tablist"]').trigger('keydown', { key: 'ArrowRight' });

        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['reports']);
        expect(wrapper.emitted('active')).toBeTruthy();
    });
});
