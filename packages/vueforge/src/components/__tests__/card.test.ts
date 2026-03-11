import { mount } from '@vue/test-utils';
import Card from '../card.vue';

describe('Card', () => {
    it('renders base class', () => {
        const wrapper = mount(Card);

        expect(wrapper.classes()).toContain('vf-card');
    });

    it('renders default slot container when default slot is provided', () => {
        const wrapper = mount(Card, {
            slots: {
                default: '<p class="default-content">Content</p>',
            },
        });

        expect(wrapper.find('.vf-card__default').exists()).toBe(true);
        expect(wrapper.find('.default-content').text()).toBe('Content');
    });

    it('renders header/body/footer slot containers', () => {
        const wrapper = mount(Card, {
            slots: {
                header: '<h3 class="header-content">Header</h3>',
                body: '<div class="body-content">Body</div>',
                footer: '<div class="footer-content">Footer</div>',
            },
        });

        expect(wrapper.find('.vf-card__header .header-content').exists()).toBe(true);
        expect(wrapper.find('.vf-card__body .body-content').exists()).toBe(true);
        expect(wrapper.find('.vf-card__footer .footer-content').exists()).toBe(true);
    });
});
