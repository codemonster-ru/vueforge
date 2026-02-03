import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import Toast from '../toast.vue';

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
});
