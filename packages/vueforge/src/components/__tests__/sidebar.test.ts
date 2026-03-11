import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Sidebar from '../sidebar.vue';

const mountSidebar = (props: Record<string, unknown> = {}) =>
    mount(Sidebar, {
        props,
        attachTo: document.body,
        global: {
            stubs: {
                teleport: true,
            },
        },
    });

describe('Sidebar', () => {
    afterEach(() => {
        document.body.style.overflow = '';
    });

    it('maps visible prop to drawer model and emits update:visible', async () => {
        const wrapper = mountSidebar({
            visible: true,
            dismissable: true,
        });

        await nextTick();
        await wrapper.find('.vf-drawer__overlay').trigger('click');

        expect(wrapper.emitted('update:visible')?.[0]).toEqual([false]);
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
        wrapper.unmount();
    });

    it('maps legacy closeOnEscape/showCloseIcon props', async () => {
        const wrapper = mountSidebar({
            visible: true,
            closeOnEscape: false,
            showCloseIcon: false,
        });

        await nextTick();
        expect(wrapper.find('.vf-drawer__close').exists()).toBe(false);

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        await nextTick();

        expect(wrapper.emitted('update:visible')).toBeUndefined();
        wrapper.unmount();
    });

    it('forwards open/close aliases (show/hide + onShow/onHide)', async () => {
        const wrapper = mountSidebar({
            visible: true,
        });

        await nextTick();
        expect(wrapper.emitted('show')?.length).toBe(1);
        expect(wrapper.emitted('onShow')?.length).toBe(1);

        await wrapper.find('.vf-drawer__overlay').trigger('click');
        expect(wrapper.emitted('hide')?.length).toBe(1);
        expect(wrapper.emitted('onHide')?.length).toBe(1);
        wrapper.unmount();
    });

    it('uses blockScroll alias to lock body scroll', async () => {
        const wrapper = mountSidebar({
            visible: true,
            blockScroll: true,
        });

        await nextTick();
        await nextTick();
        expect(document.body.style.overflow).toBe('hidden');

        await wrapper.setProps({ visible: false });
        await nextTick();
        await nextTick();
        expect(document.body.style.overflow).toBe('');
        wrapper.unmount();
    });
});
