import { mount } from '@vue/test-utils';
import Fieldset from '../fieldset.vue';

describe('Fieldset', () => {
    it('renders semantic fieldset and legend', () => {
        const wrapper = mount(Fieldset, {
            props: {
                legend: 'Billing',
            },
            slots: {
                default: '<div class="fieldset-content">Content</div>',
            },
        });

        expect(wrapper.find('fieldset').exists()).toBe(true);
        expect(wrapper.find('.vf-fieldset__legend').text()).toContain('Billing');
        expect(wrapper.find('.fieldset-content').exists()).toBe(true);
    });

    it('supports collapsible behavior and emits updates', async () => {
        const wrapper = mount(Fieldset, {
            props: {
                legend: 'Details',
                modelValue: true,
                collapsible: true,
            },
            slots: {
                default: '<div class="fieldset-content">Body</div>',
            },
        });

        await wrapper.find('.vf-fieldset__toggle').trigger('click');
        await wrapper.vm.$nextTick();

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false]);
        expect(wrapper.emitted('toggle')?.[0]?.[0]).toBe(false);
        expect(wrapper.find('.fieldset-content').exists()).toBe(false);
    });
});
