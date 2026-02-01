import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Tooltip from '../tooltip.vue';

const mountTooltip = (options: Parameters<typeof mount>[1] = {}) => {
    return mount(Tooltip, {
        global: {
            stubs: {
                teleport: true,
            },
        },
        ...options,
    });
};

describe('Tooltip', () => {
    it('shows and hides on hover', async () => {
        const wrapper = mountTooltip({
            props: { text: 'Hello' },
            slots: { default: '<button class="trigger">Trigger</button>' },
        });

        await nextTick();
        await wrapper.find('.vf-tooltip__trigger').trigger('mouseenter');
        await nextTick();

        expect(wrapper.find('.vf-tooltip').isVisible()).toBe(true);

        await wrapper.find('.vf-tooltip__trigger').trigger('mouseleave');
        await nextTick();

        expect(wrapper.find('.vf-tooltip').isVisible()).toBe(false);

        wrapper.unmount();
    });

    it('does not open when disabled', async () => {
        const wrapper = mountTooltip({
            props: { text: 'Hello', disabled: true },
            slots: { default: '<button class="trigger">Trigger</button>' },
        });

        await nextTick();
        await wrapper.find('.vf-tooltip__trigger').trigger('mouseenter');
        await nextTick();

        expect(wrapper.find('.vf-tooltip').isVisible()).toBe(false);

        wrapper.unmount();
    });

    it('renders slot content when provided', async () => {
        const wrapper = mountTooltip({
            slots: {
                default: '<button>Trigger</button>',
                content: '<span class="tip-content">Custom</span>',
            },
        });

        await nextTick();
        await wrapper.find('.vf-tooltip__trigger').trigger('mouseenter');
        await nextTick();

        expect(wrapper.find('.tip-content').exists()).toBe(true);

        wrapper.unmount();
    });

    it('renders arrow when enabled', async () => {
        const wrapper = mountTooltip({
            props: { text: 'Hello', arrow: true },
            slots: { default: '<button>Trigger</button>' },
        });

        await nextTick();
        await wrapper.find('.vf-tooltip__trigger').trigger('mouseenter');
        await nextTick();

        expect(wrapper.find('.vf-tooltip__arrow').exists()).toBe(true);

        wrapper.unmount();
    });
});
