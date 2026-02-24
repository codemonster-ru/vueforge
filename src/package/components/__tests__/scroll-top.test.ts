import { mount } from '@vue/test-utils';
import ScrollTop from '../scroll-top.vue';

describe('ScrollTop', () => {
    afterEach(() => {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    });

    it('becomes visible after threshold and scrolls window to top on click', async () => {
        const scrollToSpy = vi.fn();
        Object.defineProperty(window, 'scrollTo', {
            value: scrollToSpy,
            configurable: true,
        });
        Object.defineProperty(window, 'scrollY', {
            value: 320,
            configurable: true,
        });

        const wrapper = mount(ScrollTop, {
            attachTo: document.body,
            props: {
                threshold: 200,
            },
        });

        window.dispatchEvent(new Event('scroll'));
        await wrapper.vm.$nextTick();

        expect((wrapper.element as HTMLElement).style.display).not.toBe('none');

        await wrapper.trigger('click');

        expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
        expect(wrapper.emitted('click')).toHaveLength(1);

        wrapper.unmount();
    });

    it('works with custom scroll container target', async () => {
        const target = document.createElement('div');
        const targetScrollTo = vi.fn();
        target.scrollTo = targetScrollTo as unknown as typeof target.scrollTo;
        target.scrollTop = 180;

        const wrapper = mount(ScrollTop, {
            props: {
                threshold: 100,
                target,
                behavior: 'auto',
            },
        });

        target.dispatchEvent(new Event('scroll'));
        await wrapper.vm.$nextTick();

        expect((wrapper.element as HTMLElement).style.display).not.toBe('none');

        await wrapper.trigger('click');
        expect(targetScrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });
    });

    it('stays hidden below threshold unless alwaysVisible', async () => {
        Object.defineProperty(window, 'scrollY', {
            value: 0,
            configurable: true,
        });

        const wrapper = mount(ScrollTop, {
            props: {
                threshold: 10,
                alwaysVisible: false,
            },
        });

        window.dispatchEvent(new Event('scroll'));
        await wrapper.vm.$nextTick();
        expect((wrapper.element as HTMLElement).style.display).toBe('none');

        await wrapper.setProps({ alwaysVisible: true });
        await wrapper.vm.$nextTick();
        expect((wrapper.element as HTMLElement).style.display).not.toBe('none');
    });
});
