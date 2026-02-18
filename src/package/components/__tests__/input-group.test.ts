import { mount } from '@vue/test-utils';
import InputAddon from '../input-addon.vue';
import InputGroup from '../input-group.vue';

describe('InputGroup', () => {
    it('applies variant/size/disabled classes', () => {
        const wrapper = mount(InputGroup, {
            props: {
                variant: 'outlined',
                size: 'small',
                disabled: true,
            },
        });

        expect(wrapper.classes()).toContain('vf-input-group');
        expect(wrapper.classes()).toContain('vf-input-group_outlined');
        expect(wrapper.classes()).toContain('vf-input-group_small');
        expect(wrapper.classes()).toContain('vf-input-group_disabled');
        expect(wrapper.attributes('aria-disabled')).toBe('true');
    });

    it('renders slotted addon and controls in order', () => {
        const wrapper = mount(InputGroup, {
            slots: {
                default: `
                    <span class="vf-input-group__addon">$</span>
                    <input class="vf-input" />
                    <button class="vf-button">Go</button>
                `,
            },
        });

        const children = wrapper.element.children;

        expect(children).toHaveLength(3);
        expect(children[0].className).toContain('vf-input-group__addon');
        expect(children[1].className).toContain('vf-input');
        expect(children[2].className).toContain('vf-button');
    });
});

describe('InputAddon', () => {
    it('renders as span by default and supports custom tag', () => {
        const defaultWrapper = mount(InputAddon, {
            slots: {
                default: 'USD',
            },
        });
        const asDivWrapper = mount(InputAddon, {
            props: {
                as: 'div',
            },
            slots: {
                default: 'kg',
            },
        });

        expect(defaultWrapper.element.tagName).toBe('SPAN');
        expect(defaultWrapper.classes()).toContain('vf-input-group__addon');
        expect(asDivWrapper.element.tagName).toBe('DIV');
    });
});
