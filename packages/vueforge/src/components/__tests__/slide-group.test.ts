import { mount } from '@vue/test-utils';
import SlideGroup from '../slide-group.vue';

describe('SlideGroup', () => {
    const items = [
        { value: 'all', label: 'All' },
        { value: 'active', label: 'Active' },
        { value: 'archived', label: 'Archived', disabled: true },
        { value: 'pending', label: 'Pending' },
    ];

    it('emits model update and change on click', async () => {
        const wrapper = mount(SlideGroup, {
            props: {
                items,
                modelValue: 'all',
            },
        });

        await wrapper.findAll('.vf-slide-group__item')[1].trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['active']);
        expect(wrapper.emitted('change')?.[0]?.[0]).toBe('active');
    });

    it('skips disabled item during keyboard navigation', async () => {
        const wrapper = mount(SlideGroup, {
            props: {
                items,
                modelValue: 'active',
            },
        });

        const buttons = wrapper.findAll('.vf-slide-group__item');
        await buttons[1].trigger('keydown', { key: 'ArrowRight' });

        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['pending']);
    });

    it('applies disabled class and blocks control clicks', async () => {
        const wrapper = mount(SlideGroup, {
            props: {
                items,
                disabled: true,
            },
        });

        expect(wrapper.classes()).toContain('vf-slide-group_disabled');

        await wrapper.find('.vf-slide-group__control_next').trigger('click');
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });

    it('supports custom item slot rendering', () => {
        const wrapper = mount(SlideGroup, {
            props: {
                items: items.slice(0, 1),
            },
            slots: {
                item: '<template #item="{ item }"><span class="slot-item">{{ item.label }}</span></template>',
            },
        });

        expect(wrapper.find('.slot-item').text()).toBe('All');
    });
});
