import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Modal from '../modal.vue';
import Drawer from '../drawer.vue';

const sharedGlobal = {
    stubs: {
        teleport: true,
    },
};

describe('A11y Modal/Drawer Flows', () => {
    afterEach(() => {
        document.body.style.overflow = '';
    });

    it('modal exposes dialog semantics and closes on Escape', async () => {
        const wrapper = mount(Modal, {
            attachTo: document.body,
            props: { modelValue: true, showClose: false },
            slots: {
                body: '<button class="inside">Confirm</button>',
            },
            global: sharedGlobal,
        });

        await nextTick();
        await nextTick();

        const panel = wrapper.find('.vf-modal__panel');

        expect(panel.attributes('role')).toBe('dialog');
        expect(panel.attributes('aria-modal')).toBe('true');
        expect(document.activeElement).toBe(wrapper.find('.inside').element);

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        await nextTick();

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
        wrapper.unmount();
    });

    it('drawer exposes dialog semantics and closes on Escape', async () => {
        const wrapper = mount(Drawer, {
            attachTo: document.body,
            props: { modelValue: true, showClose: false },
            slots: {
                body: '<button class="inside">Action</button>',
            },
            global: sharedGlobal,
        });

        await nextTick();
        await nextTick();

        const panel = wrapper.find('.vf-drawer__panel');

        expect(panel.attributes('role')).toBe('dialog');
        expect(panel.attributes('aria-modal')).toBe('true');
        expect(document.activeElement).toBe(wrapper.find('.inside').element);

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        await nextTick();

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
        wrapper.unmount();
    });
});
