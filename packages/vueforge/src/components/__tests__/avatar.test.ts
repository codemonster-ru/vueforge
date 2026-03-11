import { mount } from '@vue/test-utils';
import Avatar from '../avatar.vue';

describe('Avatar', () => {
    it('renders initials from name and applies size/shape classes', () => {
        const wrapper = mount(Avatar, {
            props: {
                name: 'Ada Lovelace',
                size: 'large',
                shape: 'rounded',
            },
        });
        const avatar = wrapper.get('.vf-avatar');

        expect(avatar.classes()).toContain('vf-avatar_size-large');
        expect(avatar.classes()).toContain('vf-avatar_shape-rounded');
        expect(wrapper.find('.vf-avatar__initials').text()).toBe('AL');
        expect(avatar.attributes('aria-label')).toBe('Ada Lovelace');
    });

    it('renders image and falls back to initials on load error', async () => {
        const wrapper = mount(Avatar, {
            props: {
                src: '/avatar.png',
                alt: 'Profile image',
                name: 'Grace Hopper',
            },
        });

        expect(wrapper.find('.vf-avatar__image').exists()).toBe(true);

        await wrapper.get('.vf-avatar__image').trigger('error');

        expect(wrapper.find('.vf-avatar__image').exists()).toBe(false);
        expect(wrapper.find('.vf-avatar__initials').text()).toBe('GH');
    });

    it('renders status indicator when status is provided', () => {
        const wrapper = mount(Avatar, {
            props: {
                name: 'Jane Doe',
                status: 'online',
            },
        });
        const status = wrapper.get('.vf-avatar__status');

        expect(status.attributes('data-status')).toBe('online');
        expect(status.attributes('aria-hidden')).toBe('true');
    });
});
