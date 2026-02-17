import { mount } from '@vue/test-utils';
import { vi } from 'vitest';

vi.mock('@codemonster-ru/vueiconify', () => ({
    CmIcon: {
        template: '<i class="vf-mock-icon" />',
    },
}));

import Timeline from '../timeline.vue';

describe('Timeline', () => {
    it('renders timeline items content', () => {
        const wrapper = mount(Timeline, {
            props: {
                items: [
                    { title: 'Created', description: 'Issue created', date: '2026-02-17' },
                    { title: 'Done', description: 'Issue closed', date: '2026-02-18' },
                ],
            },
        });

        expect(wrapper.findAll('.vf-timeline__item')).toHaveLength(2);
        expect(wrapper.text()).toContain('Created');
        expect(wrapper.text()).toContain('Issue closed');
        expect(wrapper.findAll('.vf-timeline__line')).toHaveLength(1);
    });

    it('applies orientation, size, and status attributes', () => {
        const wrapper = mount(Timeline, {
            props: {
                orientation: 'horizontal',
                size: 'large',
                items: [{ title: 'Published', status: 'success' }],
            },
        });

        expect(wrapper.classes()).toContain('vf-timeline_horizontal');
        expect(wrapper.classes()).toContain('vf-timeline_size-large');
        expect(wrapper.find('.vf-timeline__item').attributes('data-status')).toBe('success');
    });

    it('renders icon marker and fallback dot marker', () => {
        const wrapper = mount(Timeline, {
            props: {
                items: [{ title: 'With icon', icon: 'check' }, { title: 'Without icon' }],
            },
        });

        expect(wrapper.findAll('.vf-mock-icon')).toHaveLength(1);
        expect(wrapper.findAll('.vf-timeline__dot')).toHaveLength(1);
    });
});
