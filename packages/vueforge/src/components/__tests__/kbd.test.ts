import { mount } from '@vue/test-utils';
import Kbd from '../kbd.vue';

describe('Kbd', () => {
    it('renders single key from default slot when keys are not provided', () => {
        const wrapper = mount(Kbd, {
            slots: {
                default: 'Esc',
            },
        });

        expect(wrapper.find('.vf-kbd__key').text()).toBe('Esc');
        expect(wrapper.findAll('.vf-kbd__separator')).toHaveLength(0);
    });

    it('renders combo keys from string and separator', () => {
        const wrapper = mount(Kbd, {
            props: {
                keys: 'Ctrl+Shift+K',
            },
        });

        const keyLabels = wrapper.findAll('.vf-kbd__key').map(node => node.text());
        expect(keyLabels).toEqual(['Ctrl', 'Shift', 'K']);
        expect(wrapper.findAll('.vf-kbd__separator')).toHaveLength(2);
    });

    it('supports keys array and custom separator', () => {
        const wrapper = mount(Kbd, {
            props: {
                keys: ['Cmd', 'P'],
                separator: '/',
            },
        });

        const keyLabels = wrapper.findAll('.vf-kbd__key').map(node => node.text());
        expect(keyLabels).toEqual(['Cmd', 'P']);
        expect(wrapper.find('.vf-kbd__separator').text()).toBe('/');
    });

    it('applies size and disabled classes', () => {
        const wrapper = mount(Kbd, {
            props: {
                keys: 'Enter',
                size: 'large',
                disabled: true,
            },
        });

        expect(wrapper.classes()).toContain('vf-kbd_size-large');
        expect(wrapper.classes()).toContain('vf-kbd_disabled');
        expect(wrapper.attributes('aria-disabled')).toBe('true');
    });
});
