import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Image from '../image.vue';

describe('Image', () => {
    it('renders base image and emits load/error events', async () => {
        const wrapper = mount(Image, {
            props: {
                src: '/photo.png',
                alt: 'Profile photo',
            },
        });

        const image = wrapper.find('.vf-image__img');
        await image.trigger('load');
        await image.trigger('error');

        expect(image.attributes('src')).toBe('/photo.png');
        expect(wrapper.emitted('load')?.length).toBe(1);
        expect(wrapper.emitted('error')?.length).toBe(1);
    });

    it('opens preview in lightbox mode and emits state updates', async () => {
        const wrapper = mount(Image, {
            props: {
                src: '/photo.png',
                preview: true,
            },
            attachTo: document.body,
            global: {
                stubs: {
                    teleport: true,
                },
            },
        });

        await wrapper.find('.vf-image__trigger').trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);
        expect(wrapper.find('.vf-image__overlay').exists()).toBe(true);
        expect(wrapper.find('.vf-image__dialog').attributes('role')).toBe('dialog');
    });

    it('closes on overlay click when enabled', async () => {
        const wrapper = mount(Image, {
            props: {
                src: '/photo.png',
                preview: true,
                modelValue: true,
            },
            global: {
                stubs: {
                    teleport: true,
                },
            },
        });

        await nextTick();
        await wrapper.find('.vf-image__overlay').trigger('click');

        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false]);
        expect(wrapper.emitted('close')?.at(-1)).toEqual(['overlay']);
    });

    it('closes on Escape key', async () => {
        const wrapper = mount(Image, {
            props: {
                src: '/photo.png',
                preview: true,
                modelValue: true,
            },
            attachTo: document.body,
            global: {
                stubs: {
                    teleport: true,
                },
            },
        });

        await nextTick();
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        await nextTick();

        expect(wrapper.emitted('close')?.at(-1)).toEqual(['esc']);
    });

    it('applies fallback source after error', async () => {
        const wrapper = mount(Image, {
            props: {
                src: '/broken.png',
                fallbackSrc: '/fallback.png',
            },
        });

        const image = wrapper.find('.vf-image__img');
        await image.trigger('error');

        expect(wrapper.find('.vf-image__img').attributes('src')).toBe('/fallback.png');
    });

    it('supports pass-through attrs and unstyled mode', async () => {
        const wrapper = mount(Image, {
            props: {
                src: '/photo.png',
                unstyled: true,
                pt: {
                    root: { class: 'custom-root', 'data-test': 'image-root' },
                    img: context => ({
                        class: (context as { error: boolean }).error ? 'custom-img-error' : 'custom-img',
                    }),
                },
            },
        });

        expect(wrapper.classes()).toContain('custom-root');
        expect(wrapper.attributes('data-test')).toBe('image-root');
        expect(wrapper.classes()).not.toContain('vf-image');
        expect(wrapper.find('img').classes()).toContain('custom-img');

        await wrapper.find('img').trigger('error');
        expect(wrapper.find('img').classes()).toContain('custom-img-error');
    });
});
