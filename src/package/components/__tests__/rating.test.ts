import { mount } from '@vue/test-utils';
import Rating from '../rating.vue';

describe('Rating', () => {
    it('emits update:modelValue on click', async () => {
        const wrapper = mount(Rating, { props: { modelValue: 0 } });
        const buttons = wrapper.findAll('button');

        await buttons[2].trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3]);
    });

    it('supports half values when allowHalf is enabled', async () => {
        const wrapper = mount(Rating, { props: { modelValue: 0, allowHalf: true } });
        const button = wrapper.findAll('button')[0];

        button.element.getBoundingClientRect = () =>
            ({
                left: 0,
                width: 20,
                right: 20,
                top: 0,
                bottom: 0,
                height: 20,
                x: 0,
                y: 0,
                toJSON: () => ({}),
            }) as DOMRect;

        await button.trigger('click', { clientX: 5 });

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([0.5]);
    });

    it('does not emit when disabled', async () => {
        const wrapper = mount(Rating, { props: { modelValue: 0, disabled: true } });
        const button = wrapper.findAll('button')[1];

        await button.trigger('click');

        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        expect(wrapper.classes()).toContain('vf-rating_disabled');
    });
});
