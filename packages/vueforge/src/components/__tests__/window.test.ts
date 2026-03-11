import { mount } from '@vue/test-utils';
import Window from '../window.vue';

describe('Window', () => {
    const items = [
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two', disabled: true },
        { value: 'three', label: 'Three' },
    ];

    it('renders first enabled panel by default and provides scoped slot payload', () => {
        const wrapper = mount(Window, {
            props: { items },
            slots: {
                item: '<template #item="{ value, index }"><span class="panel">{{ value }}-{{ index }}</span></template>',
            },
        });

        expect(wrapper.find('.panel').text()).toBe('one-0');
    });

    it('moves to next enabled item and emits update/change events', async () => {
        const wrapper = mount(Window, {
            props: {
                items,
                modelValue: 'one',
            },
            slots: {
                item: '<template #item="{ value }"><span class="panel">{{ value }}</span></template>',
            },
        });

        await wrapper.findAll('.vf-window__control')[1].trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['three']);
        expect(wrapper.emitted('next')?.[0]?.[0]).toMatchObject({ value: 'three', index: 2 });
        expect(wrapper.emitted('change')?.[0]?.[0]).toMatchObject({
            value: 'three',
            index: 2,
            direction: 'forward',
        });
    });

    it('supports keyboard navigation with Home/End and no-loop bounds', async () => {
        const wrapper = mount(Window, {
            props: {
                items,
                modelValue: 'three',
                loop: false,
            },
        });

        await wrapper.trigger('keydown', { key: 'Home' });
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['one']);

        await wrapper.trigger('keydown', { key: 'End' });
        expect(wrapper.emitted('update:modelValue')?.[1]).toEqual(['three']);

        await wrapper.trigger('keydown', { key: 'ArrowRight' });
        expect(wrapper.emitted('update:modelValue')?.length).toBe(2);
    });

    it('applies disabled state and blocks navigation', async () => {
        const wrapper = mount(Window, {
            props: {
                items,
                modelValue: 'one',
                disabled: true,
            },
        });

        expect(wrapper.classes()).toContain('vf-window_disabled');

        await wrapper.findAll('.vf-window__control')[1].trigger('click');
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });
});
