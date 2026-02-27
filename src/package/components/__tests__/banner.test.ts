import { mount } from '@vue/test-utils';
import Banner from '../banner.vue';

describe('Banner', () => {
    it('emits update:modelValue when closed in controlled mode', async () => {
        const wrapper = mount(Banner, {
            props: {
                modelValue: true,
                closable: true,
            },
        });

        await wrapper.get('.vf-banner__close').trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
        expect(wrapper.emitted('close')?.length).toBe(1);
    });

    it('hides locally when closed in uncontrolled mode', async () => {
        const wrapper = mount(Banner, {
            props: {
                closable: true,
                message: 'Update available',
            },
        });

        await wrapper.get('.vf-banner__close').trigger('click');

        expect(wrapper.isVisible()).toBe(false);
    });

    it('resolves role and aria-live defaults from severity', () => {
        const wrapper = mount(Banner, {
            props: {
                severity: 'warn',
            },
        });

        const root = wrapper.get('.vf-banner');

        expect(root.attributes('role')).toBe('alert');
        expect(root.attributes('aria-live')).toBe('assertive');
    });

    it('supports sticky mode and actions slot', () => {
        const wrapper = mount(Banner, {
            props: {
                sticky: true,
            },
            slots: {
                actions: '<button type="button">Retry</button>',
            },
        });

        expect(wrapper.classes()).toContain('vf-banner_sticky');
        expect(wrapper.find('.vf-banner__actions button').exists()).toBe(true);
    });
});
