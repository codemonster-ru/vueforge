import { mount, RouterLinkStub } from '@vue/test-utils';
import { vi } from 'vitest';
import Link from '../link.vue';

vi.mock('vue-router', () => ({
    useRoute: () => ({
        path: '/dashboard',
        fullPath: '/dashboard',
        matched: [{ name: 'dashboard' }],
    }),
    useRouter: () => ({
        resolve: (to: unknown) => ({
            name: typeof to === 'string' ? undefined : (to as { name?: string })?.name,
            path: typeof to === 'string' ? to : '/resolved',
            fullPath: typeof to === 'string' ? to : '/resolved',
        }),
    }),
}));

describe('Link', () => {
    const globalStubs = {
        stubs: {
            RouterLink: RouterLinkStub,
        },
    };

    it('applies disabled aria semantics for anchor mode', async () => {
        const wrapper = mount(Link, {
            props: {
                href: 'https://example.com',
                disabled: true,
            },
            global: globalStubs,
        });

        const anchor = wrapper.get('a.vf-link');

        expect(anchor.attributes('aria-disabled')).toBe('true');
        expect(anchor.attributes('tabindex')).toBe('-1');
        expect(anchor.attributes('href')).toBeUndefined();

        await anchor.trigger('click');
        expect(wrapper.emitted('click')).toBeUndefined();
    });

    it('applies disabled aria semantics for router-link mode', async () => {
        const wrapper = mount(Link, {
            props: {
                to: '/dashboard',
                disabled: true,
            },
            global: globalStubs,
        });

        const routerLink = wrapper.getComponent(RouterLinkStub);

        expect(routerLink.attributes('aria-disabled')).toBe('true');
        expect(routerLink.attributes('tabindex')).toBe('-1');

        await routerLink.trigger('click');
        expect(wrapper.emitted('click')).toBeUndefined();
    });

    it('emits click in enabled router-link mode', async () => {
        const wrapper = mount(Link, {
            props: {
                to: '/dashboard',
            },
            global: globalStubs,
        });

        await wrapper.getComponent(RouterLinkStub).trigger('click');
        expect(wrapper.emitted('click')).toBeTruthy();
    });

    it('blocks Enter key activation when disabled', async () => {
        const wrapper = mount(Link, {
            props: {
                href: 'https://example.com',
                disabled: true,
            },
            global: globalStubs,
        });

        await wrapper.get('a.vf-link').trigger('keydown', { key: 'Enter' });
        expect(wrapper.emitted('click')).toBeUndefined();
    });
});
