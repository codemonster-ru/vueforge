import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import Hover from '../hover.vue';

describe('Hover', () => {
    it('exposes active state in slot on mouse enter/leave', async () => {
        const wrapper = mount(Hover, {
            slots: {
                default: '<template #default="{ active }"><span class="state">{{ active }}</span></template>',
            },
        });

        expect(wrapper.find('.state').text()).toBe('false');

        await wrapper.trigger('mouseenter');
        expect(wrapper.find('.state').text()).toBe('true');

        await wrapper.trigger('mouseleave');
        expect(wrapper.find('.state').text()).toBe('false');
    });

    it('supports keyboard parity via focusin/focusout', async () => {
        const wrapper = mount(Hover, {
            slots: {
                default: '<button type="button">Action</button>',
            },
        });

        await wrapper.trigger('focusin');
        expect(wrapper.classes()).toContain('vf-hover_active');

        await wrapper.trigger('focusout');
        expect(wrapper.classes()).not.toContain('vf-hover_active');
    });

    it('emits update:modelValue in controlled mode', async () => {
        const wrapper = mount(Hover, {
            props: {
                modelValue: false,
            },
            slots: {
                default: '<span>Content</span>',
            },
        });

        await wrapper.trigger('mouseenter');
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);
    });

    it('applies open/close delays', async () => {
        vi.useFakeTimers();

        const wrapper = mount(Hover, {
            props: {
                openDelay: 50,
                closeDelay: 50,
            },
            slots: {
                default: '<span>Delayed</span>',
            },
        });

        await wrapper.trigger('mouseenter');
        expect(wrapper.classes()).not.toContain('vf-hover_active');

        await vi.advanceTimersByTimeAsync(50);
        expect(wrapper.classes()).toContain('vf-hover_active');

        await wrapper.trigger('mouseleave');
        expect(wrapper.classes()).toContain('vf-hover_active');

        await vi.advanceTimersByTimeAsync(50);
        expect(wrapper.classes()).not.toContain('vf-hover_active');

        wrapper.unmount();
        vi.useRealTimers();
    });
});
