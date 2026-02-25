import { mount } from '@vue/test-utils';
import Scheduler from '../scheduler.vue';

const resources = [
    { id: 'r1', label: 'Room A', meta: 'Floor 1' },
    { id: 'r2', label: 'Room B' },
];

const events = [
    { id: 'e1', resourceId: 'r1', title: 'Standup', start: '09:00', end: '10:00' },
    { id: 'e2', resourceId: 'r1', title: 'Planning', start: '09:30', end: '11:00' },
    { id: 'e3', resourceId: 'r2', title: 'Review', start: '12:00', end: '13:00' },
];

describe('Scheduler', () => {
    it('renders resources, slots, and events', () => {
        const wrapper = mount(Scheduler, {
            props: {
                resources,
                events,
                startHour: 8,
                endHour: 14,
                slotMinutes: 60,
            },
        });

        expect(wrapper.findAll('.vf-scheduler__resource-cell')).toHaveLength(2);
        expect(wrapper.findAll('.vf-scheduler__slot-label')).toHaveLength(6);
        expect(wrapper.findAll('.vf-scheduler__event')).toHaveLength(3);
        expect(wrapper.text()).toContain('Room A');
        expect(wrapper.text()).toContain('Standup');
    });

    it('emits slotClick payload', async () => {
        const wrapper = mount(Scheduler, {
            props: {
                resources,
                events: [],
                startHour: 8,
                endHour: 10,
                slotMinutes: 30,
            },
        });

        await wrapper.find('.vf-scheduler__slot').trigger('click');

        expect(wrapper.emitted('slotClick')?.[0]?.[0]).toEqual({
            resourceId: 'r1',
            start: '08:00',
            end: '08:30',
        });
    });

    it('emits eventClick and model update', async () => {
        const wrapper = mount(Scheduler, {
            props: {
                resources,
                events,
            },
        });

        await wrapper.find('.vf-scheduler__event').trigger('click');

        expect(wrapper.emitted('eventClick')?.[0]?.[0]).toMatchObject({ id: 'e1' });
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['e1']);
    });

    it('places overlapping events on different lanes', () => {
        const wrapper = mount(Scheduler, {
            props: {
                resources,
                events: events.slice(0, 2),
            },
        });

        const rendered = wrapper.findAll('.vf-scheduler__event');
        const topA = rendered[0].attributes('style');
        const topB = rendered[1].attributes('style');

        expect(topA).not.toEqual(topB);
    });
});
