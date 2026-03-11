import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import Popover from '../popover.vue';

const mountedWrappers: Array<ReturnType<typeof mount>> = [];

const mountPopover = (props: Record<string, unknown> = {}) => {
    const wrapper = mount(Popover, {
        props,
        attachTo: document.body,
        global: {
            stubs: {
                teleport: true,
            },
        },
        slots: {
            button: '<button class="trigger-inner" type="button">Open</button>',
            default: '<div class="popover-content">Content</div>',
        },
    });

    mountedWrappers.push(wrapper);

    return wrapper;
};

afterEach(() => {
    for (const wrapper of mountedWrappers) {
        wrapper.unmount();
    }
    mountedWrappers.length = 0;
    document.body.innerHTML = '';
});

describe('Popover', () => {
    it('toggles on click and emits legacy click events', async () => {
        const wrapper = mountPopover();
        const trigger = wrapper.find('.vf-popover__button');

        await trigger.trigger('click');
        await nextTick();
        expect(wrapper.find('.vf-popover__wrapper').isVisible()).toBe(true);
        expect(wrapper.emitted('click')?.length).toBe(1);
        expect(wrapper.emitted('onClick')?.length).toBe(1);

        await trigger.trigger('click');
        await nextTick();
        expect(wrapper.find('.vf-popover__wrapper').isVisible()).toBe(false);
    });

    it('closes on outside click by default', async () => {
        const wrapper = mountPopover();

        await wrapper.find('.vf-popover__button').trigger('click');
        await nextTick();

        document.body.click();
        await nextTick();

        expect(wrapper.find('.vf-popover__wrapper').isVisible()).toBe(false);
    });

    it('does not close on outside click when closeOnOutside is false', async () => {
        const wrapper = mountPopover({ closeOnOutside: false });

        await wrapper.find('.vf-popover__button').trigger('click');
        await nextTick();

        document.body.click();
        await nextTick();

        expect(wrapper.find('.vf-popover__wrapper').isVisible()).toBe(true);
    });

    it('closes on Escape and restores focus', async () => {
        const external = document.createElement('button');
        external.textContent = 'external';
        document.body.appendChild(external);
        external.focus();

        const wrapper = mountPopover();
        await wrapper.find('.vf-popover__button').trigger('click');
        await nextTick();

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        await nextTick();

        expect(wrapper.find('.vf-popover__wrapper').isVisible()).toBe(false);
        expect(document.activeElement).toBe(external);
        external.remove();
    });

    it('does not close on Escape when closeOnEsc is false', async () => {
        const wrapper = mountPopover({ closeOnEsc: false });

        await wrapper.find('.vf-popover__button').trigger('click');
        await nextTick();

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        await nextTick();

        expect(wrapper.find('.vf-popover__wrapper').isVisible()).toBe(true);
    });

    it('supports controlled mode via modelValue', async () => {
        const wrapper = mountPopover({ modelValue: false });

        await wrapper.find('.vf-popover__button').trigger('click');
        await nextTick();

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);
        expect(wrapper.find('.vf-popover__wrapper').isVisible()).toBe(false);
    });

    it('applies placement data attribute when opened', async () => {
        const wrapper = mountPopover({ placement: 'top-end' });

        await wrapper.find('.vf-popover__button').trigger('click');
        await nextTick();
        await nextTick();

        expect(wrapper.find('.vf-popover__wrapper').attributes('data-placement')).toMatch(/(top|bottom)-end/);
    });

    it('exposes show/hide/toggle methods', async () => {
        const wrapper = mountPopover();

        wrapper.vm.show();
        await nextTick();
        expect(wrapper.find('.vf-popover__wrapper').isVisible()).toBe(true);

        wrapper.vm.hide();
        await nextTick();
        expect(wrapper.find('.vf-popover__wrapper').isVisible()).toBe(false);

        wrapper.vm.toggle();
        await nextTick();
        expect(wrapper.find('.vf-popover__wrapper').isVisible()).toBe(true);
    });
});
