import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import AppBar from '../app-bar.vue';

const mountAppBar = (options: Parameters<typeof mount>[1] = {}) =>
    mount(AppBar, {
        props: {
            title: 'Workspace',
        },
        slots: {
            start: '<button type="button">Menu</button>',
            actions: '<button type="button">Invite</button>',
        },
        ...options,
    });

describe('AppBar', () => {
    it('renders title and action regions', async () => {
        const wrapper = mountAppBar();
        await nextTick();

        expect(wrapper.find('.vf-app-bar__title').text()).toContain('Workspace');
        expect(wrapper.find('.vf-app-bar__start').exists()).toBe(true);
        expect(wrapper.find('.vf-app-bar__actions').attributes('role')).toBe('group');
    });

    it('applies fixed and dense variants with style overrides', async () => {
        const wrapper = mountAppBar({
            props: {
                fixed: true,
                sticky: true,
                dense: true,
                height: '4rem',
                denseHeight: '3rem',
                zIndex: 300,
            },
        });
        await nextTick();

        expect(wrapper.classes()).toContain('vf-app-bar_fixed');
        expect(wrapper.classes()).not.toContain('vf-app-bar_sticky');
        expect(wrapper.classes()).toContain('vf-app-bar_dense');
        expect(wrapper.attributes('style')).toContain('--vf-app-bar-height-prop: 4rem');
        expect(wrapper.attributes('style')).toContain('--vf-app-bar-dense-height-prop: 3rem');
        expect(wrapper.attributes('style')).toContain('--vf-app-bar-z-index-prop: 300');
    });

    it('switches to mobile actions mode below breakpoint', async () => {
        const previousWidth = window.innerWidth;

        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            writable: true,
            value: 640,
        });
        window.dispatchEvent(new Event('resize'));

        const wrapper = mountAppBar({
            props: {
                mobileBreakpoint: 720,
                collapseActionsOnMobile: true,
            },
        });
        await nextTick();

        expect(wrapper.classes()).toContain('vf-app-bar_mobile');
        expect(wrapper.classes()).toContain('vf-app-bar_mobile-actions');

        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            writable: true,
            value: previousWidth,
        });
        window.dispatchEvent(new Event('resize'));
    });
});
