import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import SpeedDial, { type SpeedDialAction } from '../speed-dial.vue';

const actions: Array<SpeedDialAction> = [
    { label: 'Create', value: 'create' },
    { label: 'Edit', value: 'edit' },
    { label: 'Delete', value: 'delete', disabled: true },
];

describe('SpeedDial', () => {
    it('toggles open state from trigger click', async () => {
        const wrapper = mount(SpeedDial, {
            props: {
                actions,
            },
        });

        await wrapper.find('.vf-speed-dial__trigger').trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);
        expect(wrapper.findAll('.vf-speed-dial__action')).toHaveLength(3);
    });

    it('emits action payload and closes by default', async () => {
        const wrapper = mount(SpeedDial, {
            props: {
                modelValue: true,
                actions,
            },
        });

        await wrapper.findAll('.vf-speed-dial__action')[0].trigger('click');

        expect(wrapper.emitted('action')?.[0]?.[0]).toMatchObject({
            index: 0,
            value: 'create',
        });
        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false]);
    });

    it('supports keyboard navigation across menu items', async () => {
        const wrapper = mount(SpeedDial, {
            props: {
                modelValue: true,
                actions,
            },
            attachTo: document.body,
        });

        await nextTick();
        const buttons = wrapper.findAll('.vf-speed-dial__action');
        expect(document.activeElement).toBe(buttons[0].element);

        await buttons[0].trigger('keydown', { key: 'ArrowDown' });
        expect(document.activeElement).toBe(buttons[1].element);

        await buttons[1].trigger('keydown', { key: 'Home' });
        expect(document.activeElement).toBe(buttons[0].element);

        wrapper.unmount();
    });

    it('closes on outside click', async () => {
        const wrapper = mount(SpeedDial, {
            props: {
                modelValue: true,
                actions,
            },
            attachTo: document.body,
        });

        document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        await nextTick();

        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false]);

        wrapper.unmount();
    });

    it('supports trigger keyboard interactions', async () => {
        const wrapper = mount(SpeedDial, {
            props: {
                actions,
            },
        });

        const trigger = wrapper.find('.vf-speed-dial__trigger');
        await trigger.trigger('keydown', { key: 'Enter' });
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);

        await wrapper.setProps({ modelValue: true });
        await trigger.trigger('keydown', { key: 'Escape' });
        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false]);
    });

    it('does not interact when disabled', async () => {
        const wrapper = mount(SpeedDial, {
            props: {
                actions,
                disabled: true,
            },
        });

        await wrapper.find('.vf-speed-dial__trigger').trigger('click');

        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        expect(wrapper.classes()).toContain('vf-speed-dial_disabled');
    });

    it('exposes menu semantics', async () => {
        const wrapper = mount(SpeedDial, {
            props: {
                modelValue: true,
                actions,
                ariaLabel: 'Quick actions',
            },
        });

        await nextTick();
        expect(wrapper.find('.vf-speed-dial__actions').attributes('role')).toBe('menu');
        expect(wrapper.find('.vf-speed-dial__actions').attributes('aria-label')).toBe('Quick actions');
        expect(wrapper.find('.vf-speed-dial__trigger').attributes('aria-haspopup')).toBe('menu');
    });
});
