import { mount } from '@vue/test-utils';
import OverlayBadge from '../overlay-badge.vue';

describe('OverlayBadge', () => {
    it('renders slotted trigger with counter', () => {
        const wrapper = mount(OverlayBadge, {
            props: {
                value: 7,
            },
            slots: {
                default: '<button type="button">Inbox</button>',
            },
        });

        expect(wrapper.find('button').exists()).toBe(true);
        expect(wrapper.find('.vf-overlay-badge__badge').text()).toBe('7');
    });

    it('caps numeric values by max', () => {
        const wrapper = mount(OverlayBadge, {
            props: {
                value: 120,
                max: 99,
            },
        });

        expect(wrapper.find('.vf-overlay-badge__badge').text()).toBe('99+');
    });

    it('supports dot mode and hides text', () => {
        const wrapper = mount(OverlayBadge, {
            props: {
                dot: true,
                value: 12,
            },
        });

        const badge = wrapper.find('.vf-overlay-badge__badge');

        expect(badge.attributes('data-dot')).toBe('true');
        expect(badge.text()).toBe('');
    });

    it('hides zero by default and can show it', async () => {
        const wrapper = mount(OverlayBadge, {
            props: {
                value: 0,
            },
        });

        expect(wrapper.find('.vf-overlay-badge__badge').exists()).toBe(false);
        await wrapper.setProps({ showZero: true });
        expect(wrapper.find('.vf-overlay-badge__badge').text()).toBe('0');
    });
});
