import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import AppShell from '../app-shell.vue';

const mountShell = (options: Parameters<typeof mount>[1] = {}) =>
    mount(AppShell, {
        props: {
            modelValue: false,
        },
        slots: {
            header: 'Header',
            sidebar: 'Sidebar',
            default: 'Main',
            footer: 'Footer',
        },
        ...options,
    });

describe('AppShell', () => {
    it('renders all named regions', async () => {
        const wrapper = mountShell();

        await nextTick();

        expect(wrapper.find('.vf-app-shell__header').text()).toContain('Header');
        expect(wrapper.find('.vf-app-shell__sidebar').text()).toContain('Sidebar');
        expect(wrapper.find('.vf-app-shell__main').text()).toContain('Main');
        expect(wrapper.find('.vf-app-shell__footer').text()).toContain('Footer');
    });

    it('uses semantic landmarks and main aria label', async () => {
        const wrapper = mountShell({
            props: {
                mainAriaLabel: 'Workspace content',
            },
        });

        await nextTick();

        expect(wrapper.find('aside.vf-app-shell__sidebar').exists()).toBe(true);
        expect(wrapper.find('header.vf-app-shell__header').exists()).toBe(true);
        expect(wrapper.find('main.vf-app-shell__main').attributes('aria-label')).toBe('Workspace content');
        expect(wrapper.find('footer.vf-app-shell__footer').exists()).toBe(true);
    });

    it('toggles collapsed state on desktop and emits v-model update', async () => {
        const wrapper = mountShell();

        await nextTick();
        await wrapper.find('.vf-app-shell__toggle').trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe(true);
        expect(wrapper.emitted('sidebar-toggle')).toBeTruthy();
    });

    it('opens mobile sidebar without changing model value', async () => {
        const previousWidth = window.innerWidth;

        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            writable: true,
            value: 600,
        });
        window.dispatchEvent(new Event('resize'));

        const wrapper = mountShell({
            props: {
                modelValue: true,
                mobileBreakpoint: 900,
            },
        });
        await nextTick();
        await wrapper.find('.vf-app-shell__toggle').trigger('click');

        expect(wrapper.classes()).toContain('vf-app-shell_mobile-open');
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        expect(wrapper.emitted('sidebar-toggle')).toBeTruthy();

        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            writable: true,
            value: previousWidth,
        });
        window.dispatchEvent(new Event('resize'));
    });

    it('closes mobile sidebar on Escape when closeOnEsc is enabled', async () => {
        const previousWidth = window.innerWidth;

        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            writable: true,
            value: 600,
        });
        window.dispatchEvent(new Event('resize'));

        const wrapper = mountShell({
            props: {
                mobileBreakpoint: 900,
                closeOnEsc: true,
            },
        });

        await nextTick();
        await wrapper.find('.vf-app-shell__toggle').trigger('click');
        expect(wrapper.classes()).toContain('vf-app-shell_mobile-open');
        expect(wrapper.find('.vf-app-shell__sidebar').attributes('aria-hidden')).toBe('false');

        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        await nextTick();

        expect(wrapper.classes()).not.toContain('vf-app-shell_mobile-open');
        expect(wrapper.find('.vf-app-shell__sidebar').attributes('aria-hidden')).toBe('true');

        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            writable: true,
            value: previousWidth,
        });
        window.dispatchEvent(new Event('resize'));
    });
});
