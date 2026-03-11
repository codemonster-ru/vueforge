import { mount } from '@vue/test-utils';
import CommentThread from '../comment-thread.vue';

const items = [
    {
        id: 'c1',
        author: { id: 'u1', name: 'Alice', meta: 'Owner' },
        body: 'Please review this change.',
        createdAt: '2026-02-24T09:00:00.000Z',
        resolved: false,
    },
    {
        id: 'c2',
        parentId: 'c1',
        author: { id: 'u2', name: 'Bob' },
        body: 'Looks good to me.',
        createdAt: '2026-02-24T09:30:00.000Z',
        resolved: true,
    },
];

describe('CommentThread', () => {
    it('renders nested comments and metadata', () => {
        const wrapper = mount(CommentThread, {
            props: {
                items,
                locale: 'en-US',
            },
        });

        expect(wrapper.findAll('.vf-comment-thread__item')).toHaveLength(2);
        expect(wrapper.text()).toContain('Alice');
        expect(wrapper.text()).toContain('Owner');
        expect(wrapper.findAll('.is-resolved')).toHaveLength(1);
    });

    it('opens reply editor and emits reply payload with mentions', async () => {
        const wrapper = mount(CommentThread, {
            props: { items },
        });

        await wrapper.find('.vf-comment-thread__action').trigger('click');
        await wrapper.find('.vf-comment-thread__reply-input').setValue('Thanks @bob, please verify with @qa-team.');
        await wrapper.find('.vf-comment-thread__reply-form').trigger('submit');

        expect(wrapper.emitted('reply')?.[0]?.[0]).toMatchObject({
            index: 0,
            text: 'Thanks @bob, please verify with @qa-team.',
            mentions: ['bob', 'qa-team'],
        });
    });

    it('emits resolve for unresolved comments', async () => {
        const wrapper = mount(CommentThread, {
            props: { items },
        });

        const actions = wrapper.findAll('.vf-comment-thread__actions');
        await actions[0].findAll('.vf-comment-thread__action')[1].trigger('click');

        expect(wrapper.emitted('resolve')?.[0]?.[0]).toMatchObject({ index: 0 });
    });

    it('emits reopen for resolved comments', async () => {
        const wrapper = mount(CommentThread, {
            props: { items },
        });

        const actions = wrapper.findAll('.vf-comment-thread__actions');
        await actions[1].findAll('.vf-comment-thread__action')[1].trigger('click');

        expect(wrapper.emitted('reopen')?.[0]?.[0]).toMatchObject({ index: 1 });
    });

    it('renders empty state', () => {
        const wrapper = mount(CommentThread, {
            props: {
                items: [],
                emptyText: 'No thread yet',
            },
        });

        expect(wrapper.find('.vf-comment-thread__empty').text()).toContain('No thread yet');
    });

    it('formats timestamps with explicit timezone', () => {
        const wrapper = mount(CommentThread, {
            props: {
                items: [items[0]],
                locale: 'en-US',
                timeZone: 'UTC',
            },
        });
        const expected = new Date('2026-02-24T09:00:00.000Z').toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
            timeZone: 'UTC',
        });

        expect(wrapper.find('.vf-comment-thread__time').text()).toBe(expected);
    });
});
