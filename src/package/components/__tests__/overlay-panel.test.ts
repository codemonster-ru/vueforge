import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import OverlayPanel from '../overlay-panel.vue';

describe('OverlayPanel', () => {
    const mountPanel = (props: Record<string, unknown> = {}) =>
        mount(OverlayPanel, {
            props,
            attachTo: document.body,
            global: {
                stubs: {
                    teleport: true,
                },
            },
            slots: {
                trigger: '<button class="trigger-btn" type="button">Open</button>',
                default: '<div class="overlay-content">Content</div>',
            },
        });

    it('opens and emits show/onShow', async () => {
        const wrapper = mountPanel();

        await wrapper.find('.vf-popover__button').trigger('click');
        await nextTick();

        expect(wrapper.find('.vf-popover__wrapper').isVisible()).toBe(true);
        expect(wrapper.emitted('show')?.length).toBe(1);
        expect(wrapper.emitted('onShow')?.length).toBe(1);
    });

    it('respects dismissable=false mapping', async () => {
        const wrapper = mountPanel({ dismissable: false });

        await wrapper.find('.vf-popover__button').trigger('click');
        await nextTick();
        document.body.click();
        await nextTick();

        expect(wrapper.find('.vf-popover__wrapper').isVisible()).toBe(true);
    });

    it('respects closeOnEscape=false mapping', async () => {
        const wrapper = mountPanel({ closeOnEscape: false });

        await wrapper.find('.vf-popover__button').trigger('click');
        await nextTick();
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        await nextTick();

        expect(wrapper.find('.vf-popover__wrapper').isVisible()).toBe(true);
    });

    it('renders close icon and closes when clicked', async () => {
        const wrapper = mountPanel({
            showCloseIcon: true,
            modelValue: true,
        });

        await nextTick();
        await wrapper.find('.vf-overlaypanel__close').trigger('click');

        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false]);
    });

    it('supports controlled mode pass-through', async () => {
        const wrapper = mountPanel({ modelValue: false });

        await wrapper.find('.vf-popover__button').trigger('click');
        await nextTick();

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);
    });
});
