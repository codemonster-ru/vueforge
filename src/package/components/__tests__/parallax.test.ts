import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Parallax from '../parallax.vue';

describe('Parallax', () => {
    const originalRaf = window.requestAnimationFrame;
    const originalCancelRaf = window.cancelAnimationFrame;
    const originalMatchMedia = window.matchMedia;

    beforeEach(() => {
        window.requestAnimationFrame = callback => {
            callback(0);
            return 1;
        };
        window.cancelAnimationFrame = () => undefined;
        Object.defineProperty(window, 'matchMedia', {
            value: () => ({
                matches: false,
                media: '(prefers-reduced-motion: reduce)',
                onchange: null,
                addListener: () => undefined,
                removeListener: () => undefined,
                addEventListener: () => undefined,
                removeEventListener: () => undefined,
                dispatchEvent: () => false,
            }),
            configurable: true,
        });
    });

    afterEach(() => {
        window.requestAnimationFrame = originalRaf;
        window.cancelAnimationFrame = originalCancelRaf;
        Object.defineProperty(window, 'matchMedia', { value: originalMatchMedia, configurable: true });
        document.documentElement.removeAttribute('data-vf-reduced-motion');
        Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
    });

    it('renders slot content', () => {
        const wrapper = mount(Parallax, {
            slots: {
                default: '<div class="payload">Layer</div>',
            },
        });

        expect(wrapper.find('.payload').exists()).toBe(true);
    });

    it('updates transform on scroll', async () => {
        const wrapper = mount(Parallax, {
            props: {
                speed: 0.5,
                maxOffset: 200,
            },
            slots: {
                default: '<div>Motion</div>',
            },
        });

        Object.defineProperty(window, 'scrollY', { value: 120, configurable: true });
        window.dispatchEvent(new Event('scroll'));
        await nextTick();

        const style = (wrapper.find('.vf-parallax__inner').element as HTMLElement).style.transform;
        expect(style).toContain('60px');
    });

    it('respects reduced motion root flag', async () => {
        document.documentElement.setAttribute('data-vf-reduced-motion', 'true');

        const wrapper = mount(Parallax, {
            props: {
                speed: 1,
            },
            slots: {
                default: '<div>Static</div>',
            },
        });

        Object.defineProperty(window, 'scrollY', { value: 180, configurable: true });
        window.dispatchEvent(new Event('scroll'));
        await nextTick();

        const style = (wrapper.find('.vf-parallax__inner').element as HTMLElement).style.transform;
        expect(wrapper.classes()).toContain('vf-parallax_disabled');
        expect(style).toContain('0px, 0px');
    });

    it('supports horizontal axis and reverse direction', async () => {
        const wrapper = mount(Parallax, {
            props: {
                axis: 'x',
                reverse: true,
                speed: 0.25,
            },
            slots: {
                default: '<div>Horizontal</div>',
            },
        });

        Object.defineProperty(window, 'scrollY', { value: 80, configurable: true });
        window.dispatchEvent(new Event('scroll'));
        await nextTick();

        const style = (wrapper.find('.vf-parallax__inner').element as HTMLElement).style.transform;
        expect(style).toContain('-20px, 0px');
    });
});
