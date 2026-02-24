import { mount } from '@vue/test-utils';
import Select from '../select.vue';

const options = [
    { label: 'United States', value: 'us' },
    { label: 'Germany', value: 'de' },
    { label: 'Japan', value: 'jp', disabled: true },
];

const mountSelect = (props: Record<string, unknown> = {}) => {
    return mount(Select, {
        props: { options, ...props },
        global: {
            stubs: {
                teleport: true,
            },
        },
    });
};

describe('Select', () => {
    it('supports keyboard navigation and selection', async () => {
        const wrapper = mountSelect();
        const trigger = wrapper.find('.vf-select__control');

        await trigger.trigger('keydown', { key: 'ArrowDown' });
        await trigger.trigger('keydown', { key: 'ArrowDown' });
        await trigger.trigger('keydown', { key: 'Enter' });

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['de']);
        expect(wrapper.emitted('change')?.[0]).toEqual(['de']);
    });

    it('clears selected value when clear button is clicked', async () => {
        const wrapper = mountSelect({ modelValue: 'de', clearable: true });
        const clear = wrapper.find('.vf-select__clear');

        expect(clear.exists()).toBe(true);

        await clear.trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([undefined]);
        expect(wrapper.emitted('change')?.[0]).toEqual([undefined]);
    });

    it('does not open when disabled', async () => {
        const wrapper = mountSelect({ disabled: true });
        const trigger = wrapper.find('.vf-select__control');

        await trigger.trigger('click');
        await trigger.trigger('keydown', { key: 'ArrowDown' });

        expect(wrapper.find('.vf-select').classes()).not.toContain('vf-select_open');
        expect(wrapper.find('.vf-select__clear').exists()).toBe(false);
    });

    it('does not open or clear in readonly mode', async () => {
        const wrapper = mountSelect({ modelValue: 'de', clearable: true, readonly: true });
        const trigger = wrapper.find('.vf-select__control');

        await trigger.trigger('click');
        await trigger.trigger('keydown', { key: 'ArrowDown' });

        expect(wrapper.find('.vf-select').classes()).not.toContain('vf-select_open');
        expect(wrapper.find('.vf-select__clear').exists()).toBe(false);
        expect(trigger.attributes('aria-readonly')).toBe('true');
    });

    it('renders virtualized option window and emits loadMore near list end', async () => {
        const longOptions = Array.from({ length: 140 }).map((_, index) => ({
            label: `Option ${index}`,
            value: index,
        }));

        const wrapper = mount(Select, {
            props: {
                options: longOptions,
                virtual: true,
                virtualThreshold: 100,
                virtualItemHeight: 20,
                loadMoreOffset: 1,
            },
            global: {
                stubs: {
                    teleport: true,
                },
            },
        });

        const trigger = wrapper.find('.vf-select__control');
        await trigger.trigger('click');

        const rendered = wrapper.findAll('.vf-select__option');
        expect(rendered.length).toBeLessThan(140);

        const panel = wrapper.find('.vf-select__panel');
        Object.defineProperty(panel.element, 'clientHeight', { value: 120, configurable: true });
        (panel.element as HTMLElement).scrollTop = 2700;
        await panel.trigger('scroll');

        const loadMore = wrapper.emitted('loadMore');
        const payload = loadMore?.[0]?.[0] as { total: number; visibleEndIndex: number } | undefined;
        expect(loadMore).toBeTruthy();
        expect(payload).toMatchObject({
            total: 140,
        });
        expect(payload?.visibleEndIndex ?? 0).toBeGreaterThan(0);

        (panel.element as HTMLElement).scrollTop = 2720;
        await panel.trigger('scroll');

        expect(wrapper.emitted('loadMore')).toHaveLength(1);
    });
});
