import { mount } from '@vue/test-utils';
import BlockUI from '../block-ui.vue';

describe('BlockUI', () => {
    it('renders local overlay and keeps wrapped content', () => {
        const wrapper = mount(BlockUI, {
            props: {
                modelValue: true,
                label: 'Loading data',
            },
            slots: {
                default: '<div class="content">Body</div>',
            },
        });

        expect(wrapper.attributes('aria-busy')).toBe('true');
        expect(wrapper.find('.content').exists()).toBe(true);
        expect(wrapper.find('.vf-blockui__overlay').exists()).toBe(true);
        expect(wrapper.text()).toContain('Loading data');
    });

    it('emits block and unblock events on state changes', async () => {
        const wrapper = mount(BlockUI, {
            props: {
                modelValue: false,
            },
        });

        await wrapper.setProps({ modelValue: true });
        await wrapper.setProps({ modelValue: false });

        expect(wrapper.emitted('block')).toHaveLength(1);
        expect(wrapper.emitted('unblock')).toHaveLength(1);
    });

    it('renders fullscreen overlay via teleport', async () => {
        const wrapper = mount(BlockUI, {
            attachTo: document.body,
            props: {
                modelValue: true,
                fullScreen: true,
                label: 'Blocking page',
            },
        });

        await wrapper.vm.$nextTick();

        const teleported = document.body.querySelector('.vf-blockui__overlay_fullscreen');
        expect(teleported).not.toBeNull();
        expect(teleported?.textContent).toContain('Blocking page');

        wrapper.unmount();
    });

    it('renders custom overlay slot', () => {
        const wrapper = mount(BlockUI, {
            props: {
                modelValue: true,
            },
            slots: {
                overlay: '<div class="custom-overlay">Please wait</div>',
            },
        });

        expect(wrapper.find('.custom-overlay').exists()).toBe(true);
        expect(wrapper.find('.vf-spinner').exists()).toBe(false);
    });
});
