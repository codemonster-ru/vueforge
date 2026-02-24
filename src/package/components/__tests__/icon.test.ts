import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import Icon from '../icon.vue';

vi.mock('@codemonster-ru/vueiconify', () => ({
    CmIcon: defineComponent({
        name: 'CmIconStub',
        props: {
            icon: { type: String, default: '' },
            spin: { type: Boolean, default: false },
        },
        template: '<i class="vf-icon-stub" :data-icon="icon" :data-spin="String(spin)" />',
    }),
}));

describe('Icon', () => {
    it('renders icon glyph with semantic label by default', () => {
        const wrapper = mount(Icon, {
            props: {
                icon: 'check',
            },
        });

        expect(wrapper.attributes('role')).toBe('img');
        expect(wrapper.attributes('aria-label')).toBe('Icon');
        expect(wrapper.find('.vf-icon-stub').attributes('data-icon')).toBe('check');
    });

    it('renders decorative icon with aria-hidden', () => {
        const wrapper = mount(Icon, {
            props: {
                icon: 'xmark',
                decorative: true,
            },
        });

        expect(wrapper.attributes('role')).toBe('presentation');
        expect(wrapper.attributes('aria-hidden')).toBe('true');
        expect(wrapper.attributes('aria-label')).toBeUndefined();
    });

    it('applies size and color overrides', () => {
        const wrapper = mount(Icon, {
            props: {
                icon: 'star',
                size: 20,
                color: '#ff9900',
            },
        });

        const style = wrapper.attributes('style');
        expect(style).toContain('font-size: 20px;');
        expect(style).toContain('color: rgb(255, 153, 0);');
    });

    it('sets spin class and forwards spin prop', () => {
        const wrapper = mount(Icon, {
            props: {
                icon: 'spinner',
                spin: true,
            },
        });

        expect(wrapper.classes()).toContain('vf-icon_spin');
        expect(wrapper.find('.vf-icon-stub').attributes('data-spin')).toBe('true');
    });
});
