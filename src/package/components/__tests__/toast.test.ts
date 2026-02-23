import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import Toast from '../toast.vue';
import ToastContainer from '../toast-container.vue';

describe('Toast', () => {
    it('emits update:modelValue when close is clicked', async () => {
        const wrapper = mount(Toast, { props: { modelValue: true, title: 'Saved' } });

        await wrapper.find('button').trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
    });

    it('auto-closes after duration', async () => {
        vi.useFakeTimers();

        const wrapper = mount(Toast, { props: { modelValue: true, duration: 1000 } });

        await vi.advanceTimersByTimeAsync(1000);

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);

        wrapper.unmount();
        vi.useRealTimers();
    });

    it('exposes status semantics and close button label', () => {
        const wrapper = mount(Toast, {
            props: { modelValue: true, title: 'Saved', closable: true },
        });

        expect(wrapper.find('.vf-toast').attributes('role')).toBe('status');
        expect(wrapper.find('.vf-toast').attributes('aria-live')).toBe('polite');
        expect(wrapper.find('.vf-toast__close').attributes('aria-label')).toBe('Close toast');
    });
});

describe('ToastContainer', () => {
    it('renders slot content with position and live-region semantics', () => {
        const wrapper = mount(ToastContainer, {
            props: {
                position: 'bottom-left',
                ariaLabel: 'System notifications',
            },
            slots: {
                default: '<div class="toast-item">Item</div>',
            },
            global: {
                stubs: {
                    teleport: true,
                },
            },
        });

        const container = wrapper.get('.vf-toast-container');

        expect(container.classes()).toContain('vf-toast-container_bottom-left');
        expect(container.attributes('role')).toBe('region');
        expect(container.attributes('aria-live')).toBe('polite');
        expect(container.attributes('aria-label')).toBe('System notifications');
        expect(wrapper.find('.toast-item').exists()).toBe(true);
    });
});
