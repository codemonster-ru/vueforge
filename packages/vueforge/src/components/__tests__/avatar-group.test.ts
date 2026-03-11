import { mount } from '@vue/test-utils';
import AvatarGroup from '../avatar-group.vue';

describe('AvatarGroup', () => {
    const items = [
        { key: 'u1', name: 'Ada Lovelace' },
        { key: 'u2', name: 'Grace Hopper', status: 'online' as const },
        { key: 'u3', name: 'Margaret Hamilton' },
        { key: 'u4', name: 'Katherine Johnson' },
    ];

    it('renders avatar items and overflow counter based on max', () => {
        const wrapper = mount(AvatarGroup, {
            props: {
                items,
                max: 3,
            },
        });

        expect(wrapper.findAll('.vf-avatar-group__item').length).toBe(4);
        expect(wrapper.find('.vf-avatar-group__avatar_overflow .vf-avatar__initials').text()).toBe('+1');
    });

    it('supports overlap and stack layout classes', async () => {
        const wrapper = mount(AvatarGroup, {
            props: {
                items,
                overlap: true,
            },
        });

        expect(wrapper.classes()).toContain('vf-avatar-group_overlap');
        expect(wrapper.classes()).not.toContain('vf-avatar-group_stack');

        await wrapper.setProps({ overlap: false });

        expect(wrapper.classes()).toContain('vf-avatar-group_stack');
    });

    it('passes default size and shape to child avatars', () => {
        const wrapper = mount(AvatarGroup, {
            props: {
                items: items.slice(0, 2),
                size: 'large',
                shape: 'rounded',
            },
        });

        const avatars = wrapper.findAll('.vf-avatar');

        expect(avatars[0].classes()).toContain('vf-avatar_size-large');
        expect(avatars[0].classes()).toContain('vf-avatar_shape-rounded');
        expect(avatars[1].classes()).toContain('vf-avatar_size-large');
    });

    it('renders custom item slot and disabled state', () => {
        const wrapper = mount(AvatarGroup, {
            props: {
                items: items.slice(0, 1),
                disabled: true,
            },
            slots: {
                item: '<template #item="{ item }"><span class="custom-item">{{ item.name }}</span></template>',
            },
        });

        expect(wrapper.classes()).toContain('vf-avatar-group_disabled');
        expect(wrapper.find('.custom-item').text()).toContain('Ada Lovelace');
    });
});
