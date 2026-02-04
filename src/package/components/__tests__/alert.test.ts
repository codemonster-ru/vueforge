import { mount } from '@vue/test-utils';
import Alert from '../alert.vue';

describe('Alert', () => {
    it('emits update:modelValue when close is clicked in controlled mode', async () => {
        const wrapper = mount(Alert, {
            props: {
                modelValue: true,
                closable: true,
            },
        });

        await wrapper.find('button').trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
        expect(wrapper.emitted('close')?.length).toBe(1);
    });

    it('hides locally when close is clicked in uncontrolled mode', async () => {
        const wrapper = mount(Alert, {
            props: {
                closable: true,
                message: 'Hello',
            },
        });

        await wrapper.find('button').trigger('click');

        expect(wrapper.isVisible()).toBe(false);
    });
});
