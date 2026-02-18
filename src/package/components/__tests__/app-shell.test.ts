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
});
