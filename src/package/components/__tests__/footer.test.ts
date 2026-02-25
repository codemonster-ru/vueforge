import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Footer from '../footer.vue';

describe('Footer', () => {
    it('renders semantic footer with left/center/right groups', () => {
        const wrapper = mount(Footer, {
            slots: {
                left: '<span>Left</span>',
                center: '<span>Center</span>',
                right: '<span>Right</span>',
            },
        });

        expect(wrapper.element.tagName).toBe('FOOTER');
        expect(wrapper.find('.vf-footer__section_left').text()).toContain('Left');
        expect(wrapper.find('.vf-footer__section_center').text()).toContain('Center');
        expect(wrapper.find('.vf-footer__section_right').text()).toContain('Right');
    });

    it('applies contentinfo role for non-footer element', () => {
        const wrapper = mount(Footer, {
            props: {
                as: 'div',
            },
            slots: {
                default: '<span>Content</span>',
            },
        });

        expect(wrapper.attributes('role')).toBe('contentinfo');
        expect(wrapper.find('.vf-footer__section_default').exists()).toBe(true);
    });

    it('applies bordered/dense/wrap variant classes', () => {
        const wrapper = mount(Footer, {
            props: {
                bordered: true,
                dense: true,
                wrap: false,
            },
        });

        expect(wrapper.classes()).toContain('vf-footer_bordered');
        expect(wrapper.classes()).toContain('vf-footer_dense');
        expect(wrapper.classes()).not.toContain('vf-footer_wrap');
    });

    it('switches to mobile layout below breakpoint', async () => {
        const previousWidth = window.innerWidth;

        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            writable: true,
            value: 640,
        });
        window.dispatchEvent(new Event('resize'));

        const wrapper = mount(Footer, {
            props: {
                mobileBreakpoint: 720,
                stackOnMobile: true,
            },
            slots: {
                left: '<span>Left</span>',
                right: '<span>Right</span>',
            },
        });
        await nextTick();

        expect(wrapper.classes()).toContain('vf-footer_mobile');

        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            writable: true,
            value: previousWidth,
        });
        window.dispatchEvent(new Event('resize'));
    });
});
