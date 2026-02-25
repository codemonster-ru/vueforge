import { mount } from '@vue/test-utils';
import ActivityFeed from '../activity-feed.vue';

const items = [
    {
        id: 1,
        title: 'Member role updated',
        description: 'Role changed to Admin',
        timestamp: '2026-02-24T10:00:00.000Z',
        type: 'info' as const,
        actor: {
            id: 'u_1',
            name: 'Alice Doe',
            meta: 'Workspace owner',
        },
        actionLabel: 'View',
        actionValue: 'view',
    },
    {
        id: 2,
        title: 'Billing invoice generated',
        timestamp: '2026-02-23T08:00:00.000Z',
        type: 'success' as const,
        actor: {
            id: 'sys',
            name: 'System',
        },
    },
];

describe('ActivityFeed', () => {
    it('renders grouped entries with actor metadata', () => {
        const wrapper = mount(ActivityFeed, {
            props: {
                items,
                groupBy: 'date',
                relativeTime: false,
                locale: 'en-US',
            },
        });

        expect(wrapper.findAll('.vf-activity-feed__group')).toHaveLength(2);
        expect(wrapper.text()).toContain('Alice Doe');
        expect(wrapper.text()).toContain('Workspace owner');
        expect(wrapper.find('.vf-activity-feed__item').attributes('data-type')).toBe('info');
    });

    it('formats relative time when enabled', () => {
        const wrapper = mount(ActivityFeed, {
            props: {
                items: [items[0]],
                now: '2026-02-24T12:00:00.000Z',
                relativeTime: true,
                locale: 'en',
            },
        });

        const meta = wrapper.find('.vf-activity-feed__time').text().toLowerCase();

        expect(meta).toContain('hour');
    });

    it('emits itemClick and actionClick payloads', async () => {
        const wrapper = mount(ActivityFeed, {
            props: {
                items: [items[0]],
                groupBy: 'none',
            },
        });

        await wrapper.find('.vf-activity-feed__item-main').trigger('click');
        await wrapper.find('.vf-activity-feed__action').trigger('click');

        expect(wrapper.emitted('itemClick')?.[0]?.[0]).toMatchObject({ id: 1, title: 'Member role updated' });
        expect(wrapper.emitted('actionClick')?.[0]?.[0]).toMatchObject({
            index: 0,
            action: 'view',
        });
    });

    it('renders empty state when items are missing', () => {
        const wrapper = mount(ActivityFeed, {
            props: {
                items: [],
                emptyText: 'No events yet',
            },
        });

        expect(wrapper.find('.vf-activity-feed__empty').text()).toContain('No events yet');
    });

    it('formats absolute timestamps with explicit timezone', () => {
        const wrapper = mount(ActivityFeed, {
            props: {
                items: [items[0]],
                groupBy: 'none',
                relativeTime: false,
                locale: 'en-US',
                timeZone: 'UTC',
            },
        });
        const expected = new Date('2026-02-24T10:00:00.000Z').toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
            timeZone: 'UTC',
        });

        expect(wrapper.find('.vf-activity-feed__time').text()).toBe(expected);
    });
});
