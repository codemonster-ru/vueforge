import { mount } from '@vue/test-utils';
import Knob from '../knob.vue';

describe('Knob', () => {
    it('renders slider semantics with current value', () => {
        const wrapper = mount(Knob, {
            props: {
                modelValue: 25,
                min: 0,
                max: 100,
                ariaLabel: 'Volume',
            },
        });

        const control = wrapper.find('.vf-knob__control');
        expect(control.attributes('role')).toBe('slider');
        expect(control.attributes('aria-label')).toBe('Volume');
        expect(control.attributes('aria-valuenow')).toBe('25');
    });

    it('updates value with keyboard controls', async () => {
        const wrapper = mount(Knob, {
            props: {
                modelValue: 10,
                min: 0,
                max: 50,
                step: 5,
            },
        });

        const control = wrapper.find('.vf-knob__control');
        await control.trigger('keydown', { key: 'ArrowRight' });
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([15]);

        await wrapper.setProps({ modelValue: 15 });
        await control.trigger('keydown', { key: 'End' });
        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([50]);
    });

    it('updates value by pointer drag', async () => {
        const wrapper = mount(Knob, {
            props: {
                modelValue: 0,
                min: 0,
                max: 100,
                step: 1,
                size: 120,
            },
            attachTo: document.body,
        });

        const control = wrapper.find('.vf-knob__control');
        Object.defineProperty(control.element, 'getBoundingClientRect', {
            value: () =>
                ({
                    left: 0,
                    top: 0,
                    width: 120,
                    height: 120,
                    right: 120,
                    bottom: 120,
                }) as DOMRect,
        });

        await control.trigger('mousedown', { clientX: 60, clientY: 20 });
        document.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 60 }));
        document.dispatchEvent(new MouseEvent('mouseup', { clientX: 100, clientY: 60 }));

        const updates = wrapper.emitted('update:modelValue');
        expect(updates?.length).toBeGreaterThan(0);
        expect(wrapper.emitted('change')?.length).toBeGreaterThan(0);
    });

    it('does not change when disabled or readonly', async () => {
        const disabled = mount(Knob, {
            props: { modelValue: 10, disabled: true },
        });
        await disabled.find('.vf-knob__control').trigger('keydown', { key: 'ArrowRight' });
        expect(disabled.emitted('update:modelValue')).toBeUndefined();

        const readonly = mount(Knob, {
            props: { modelValue: 10, readonly: true },
        });
        await readonly.find('.vf-knob__control').trigger('keydown', { key: 'ArrowRight' });
        expect(readonly.emitted('update:modelValue')).toBeUndefined();
    });
});
