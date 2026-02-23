import { mount } from '@vue/test-utils';
import Alert from '../alert.vue';

describe('Alert', () => {
    it('emits update:modelValue when close is clicked in controlled mode', async () => {
        const wrapper = mount(Alert, {
            props: {
                modelValue: true,
                closable: true,
            },
        });

        await wrapper.find('button').trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
        expect(wrapper.emitted('close')?.length).toBe(1);
    });

    it('hides locally when close is clicked in uncontrolled mode', async () => {
        const wrapper = mount(Alert, {
            props: {
                closable: true,
                message: 'Hello',
            },
        });

        await wrapper.find('button').trigger('click');

        expect(wrapper.isVisible()).toBe(false);
    });

    it('exposes alert semantics and close control label', () => {
        const wrapper = mount(Alert, {
            props: {
                modelValue: true,
                closable: true,
                title: 'Attention',
                message: 'Check this setting',
                severity: 'warn',
            },
        });

        const root = wrapper.get('.vf-alert');
        const close = wrapper.get('.vf-alert__close');

        expect(root.attributes('role')).toBe('alert');
        expect(root.attributes('data-severity')).toBe('warn');
        expect(close.attributes('aria-label')).toBe('Close');
    });
});
