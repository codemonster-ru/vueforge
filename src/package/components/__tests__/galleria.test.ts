import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import Galleria from '../galleria.vue';

const items = [
    { key: '1', src: '/photo-1.png', thumbnailSrc: '/thumb-1.png', alt: 'One', caption: 'First' },
    { key: '2', src: '/photo-2.png', thumbnailSrc: '/thumb-2.png', alt: 'Two', caption: 'Second' },
    { key: '3', src: '/photo-3.png', thumbnailSrc: '/thumb-3.png', alt: 'Three', caption: 'Third', disabled: true },
];

describe('Galleria', () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it('renders active image and thumbnail strip', () => {
        const wrapper = mount(Galleria, {
            props: {
                items,
                modelValue: 1,
            },
        });

        expect(wrapper.find('.vf-galleria__image').attributes('src')).toBe('/photo-2.png');
        expect(wrapper.find('.vf-galleria__caption').text()).toContain('Second');
        expect(wrapper.findAll('.vf-galleria__thumbnail')).toHaveLength(3);
        expect(wrapper.findAll('.vf-galleria__thumbnail')[1].classes()).toContain('vf-galleria__thumbnail_active');
    });

    it('navigates with prev/next buttons and emits change payload', async () => {
        const wrapper = mount(Galleria, {
            props: {
                items,
                modelValue: 0,
                circular: false,
            },
        });

        await wrapper.find('.vf-galleria__nav_next').trigger('click');
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1]);
        expect(wrapper.emitted('change')?.[0]?.[0]).toMatchObject({ index: 1, previousIndex: 0, source: 'button' });

        await wrapper.setProps({ modelValue: 1 });
        await wrapper.find('.vf-galleria__nav_prev').trigger('click');
        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([0]);
    });

    it('supports keyboard navigation', async () => {
        const wrapper = mount(Galleria, {
            props: {
                items,
                modelValue: 0,
            },
        });

        await wrapper.trigger('keydown', { key: 'ArrowRight' });
        expect(wrapper.emitted('change')?.at(-1)?.[0]).toMatchObject({ index: 1, source: 'keyboard' });

        await wrapper.setProps({ modelValue: 1 });
        await wrapper.trigger('keydown', { key: 'End' });
        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([2]);
    });

    it('ignores disabled thumbnail items', async () => {
        const wrapper = mount(Galleria, {
            props: {
                items,
                modelValue: 0,
            },
        });

        await wrapper.findAll('.vf-galleria__thumbnail')[2].trigger('click');
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });

    it('autoplays when enabled and emits itemClick on media click', async () => {
        vi.useFakeTimers();
        const wrapper = mount(Galleria, {
            props: {
                items,
                modelValue: 0,
                autoPlay: true,
                autoPlayInterval: 600,
            },
        });

        vi.advanceTimersByTime(700);
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted('change')?.at(-1)?.[0]).toMatchObject({ source: 'autoplay', index: 1 });

        await wrapper.find('.vf-galleria__image').trigger('click');
        expect(wrapper.emitted('itemClick')?.[0]?.[0]).toMatchObject({ index: 1 });
    });
});
