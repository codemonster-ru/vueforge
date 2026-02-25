import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import BottomSheet from '../bottom-sheet.vue';

const mountSheet = (options: Parameters<typeof mount>[1] = {}) =>
    mount(BottomSheet, {
        attachTo: document.body,
        global: {
            stubs: {
                teleport: true,
            },
        },
        ...options,
    });

describe('BottomSheet', () => {
    afterEach(() => {
        document.body.style.overflow = '';
    });

    it('emits update:modelValue on overlay click', async () => {
        const wrapper = mountSheet({
            props: { modelValue: true },
        });

        await nextTick();
        await wrapper.find('.vf-bottom-sheet__overlay').trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
        expect(wrapper.emitted('close')?.[0]).toEqual([]);
    });

    it('emits update:modelValue on escape', async () => {
        const wrapper = mountSheet({
            props: { modelValue: true },
        });

        await nextTick();
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        await nextTick();

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
        expect(wrapper.emitted('close')?.[0]).toEqual([]);
    });

    it('traps focus and restores previous focus', async () => {
        const trigger = document.createElement('button');
        trigger.textContent = 'open';
        document.body.appendChild(trigger);
        trigger.focus();

        const wrapper = mountSheet({
            props: { modelValue: true, showClose: false },
            slots: {
                body: '<button class="first">First</button><button class="last">Last</button>',
            },
        });

        await nextTick();

        const panel = wrapper.find('.vf-bottom-sheet__panel');
        const first = wrapper.find('.first').element as HTMLButtonElement;
        const last = wrapper.find('.last').element as HTMLButtonElement;

        expect(document.activeElement).toBe(first);

        last.focus();
        await panel.trigger('keydown', { key: 'Tab' });
        expect(document.activeElement).toBe(first);

        first.focus();
        await panel.trigger('keydown', { key: 'Tab', shiftKey: true });
        expect(document.activeElement).toBe(last);

        await wrapper.setProps({ modelValue: false });
        await nextTick();
        expect(document.activeElement).toBe(trigger);

        wrapper.unmount();
        trigger.remove();
    });

    it('locks and unlocks body scroll', async () => {
        const wrapper = mountSheet({
            props: { modelValue: false, lockScroll: true },
        });

        expect(document.body.style.overflow).toBe('');
        await wrapper.setProps({ modelValue: true });
        await nextTick();
        expect(document.body.style.overflow).toBe('hidden');

        await wrapper.setProps({ modelValue: false });
        await nextTick();
        expect(document.body.style.overflow).toBe('');
    });
});
