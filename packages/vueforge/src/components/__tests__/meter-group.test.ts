import { mount } from '@vue/test-utils';
import MeterGroup from '../meter-group.vue';

const items = [
    { id: 'cpu', label: 'CPU', value: 62, thresholds: { warn: 70, danger: 90 } },
    { id: 'memory', label: 'Memory', value: 82, thresholds: { warn: 75, danger: 90 } },
    { id: 'storage', label: 'Storage', value: 96, thresholds: { warn: 80, danger: 95 } },
];

describe('MeterGroup', () => {
    it('renders meter rows and values', () => {
        const wrapper = mount(MeterGroup, {
            props: {
                items,
            },
        });

        expect(wrapper.findAll('.vf-meter-group__item')).toHaveLength(3);
        expect(wrapper.text()).toContain('CPU');
        expect(wrapper.text()).toContain('62 / 100');
    });

    it('applies threshold states', () => {
        const wrapper = mount(MeterGroup, {
            props: {
                items,
            },
        });

        const rows = wrapper.findAll('.vf-meter-group__item');

        expect(rows[0].attributes('data-state')).toBe('normal');
        expect(rows[1].attributes('data-state')).toBe('warn');
        expect(rows[2].attributes('data-state')).toBe('danger');
    });

    it('supports global max override', () => {
        const wrapper = mount(MeterGroup, {
            props: {
                items: [{ label: 'Bandwidth', value: 40 }],
                max: 80,
            },
        });

        expect(wrapper.text()).toContain('40 / 80');
        expect(wrapper.find('.vf-meter-group__bar').attributes('style')).toContain('width: 50%');
    });

    it('renders custom item slot', () => {
        const wrapper = mount(MeterGroup, {
            props: {
                items: [{ label: 'Requests', value: 12 }],
            },
            slots: {
                item: '<div class="custom-item">Custom meter row</div>',
            },
        });

        expect(wrapper.find('.custom-item').text()).toContain('Custom meter row');
    });
});
