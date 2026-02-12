import { mount } from '@vue/test-utils';
import SegmentedControl from '../segmented-control.vue';

const options = [
    { label: 'List', value: 'list' },
    { label: 'Grid', value: 'grid' },
    { label: 'Board', value: 'board' },
];

const mountSegmentedControl = (props: Record<string, unknown> = {}) => {
    return mount(SegmentedControl, {
        props: {
            options,
            ...props,
        },
    });
};

describe('SegmentedControl', () => {
    it('emits selected value on click', async () => {
        const wrapper = mountSegmentedControl({ modelValue: 'list' });
        const buttons = wrapper.findAll('.vf-segmented-control__item');

        await buttons[1].trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['grid']);
        expect(wrapper.emitted('change')?.[0]?.[0]).toBe('grid');
    });

    it('moves selection with arrow keys', async () => {
        const wrapper = mountSegmentedControl({ modelValue: 'list' });
        const buttons = wrapper.findAll('.vf-segmented-control__item');

        await buttons[0].trigger('keydown', { key: 'ArrowRight' });

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['grid']);
    });

    it('respects disabled option', async () => {
        const wrapper = mount(SegmentedControl, {
            props: {
                modelValue: 'list',
                options: [
                    { label: 'List', value: 'list' },
                    { label: 'Grid', value: 'grid', disabled: true },
                ],
            },
        });
        const buttons = wrapper.findAll('.vf-segmented-control__item');

        await buttons[1].trigger('click');

        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });
});
