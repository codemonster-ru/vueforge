import { mount } from '@vue/test-utils';
import KPIStatCard from '../kpi-stat-card.vue';

describe('KPIStatCard', () => {
    it('renders title and value', () => {
        const wrapper = mount(KPIStatCard, {
            props: {
                title: 'MRR',
                value: '$124,000',
            },
        });

        expect(wrapper.find('.vf-kpi-stat-card__title').text()).toBe('MRR');
        expect(wrapper.find('.vf-kpi-stat-card__value').text()).toBe('$124,000');
    });

    it('derives trend from delta in auto mode', () => {
        const wrapper = mount(KPIStatCard, {
            props: {
                title: 'Activation',
                value: '67%',
                delta: -4.2,
            },
        });

        expect(wrapper.attributes('data-trend')).toBe('down');
        expect(wrapper.find('.vf-kpi-stat-card__delta').text()).toContain('-4.2%');
    });

    it('supports sparkline slot', () => {
        const wrapper = mount(KPIStatCard, {
            props: {
                title: 'Requests',
                value: '1.2M',
            },
            slots: {
                sparkline: '<svg class="sparkline"></svg>',
            },
        });

        expect(wrapper.find('.sparkline').exists()).toBe(true);
    });

    it('uses explicit trend label and numeric delta format', () => {
        const wrapper = mount(KPIStatCard, {
            props: {
                title: 'Net retention',
                value: '111',
                trend: 'up',
                trendLabel: 'Improving',
                delta: 12,
                deltaFormat: 'number',
            },
        });

        expect(wrapper.find('.vf-kpi-stat-card__trend-label').text()).toBe('Improving');
        expect(wrapper.find('.vf-kpi-stat-card__delta').text()).toContain('+12');
    });

    it('renders caption slot content', () => {
        const wrapper = mount(KPIStatCard, {
            props: {
                title: 'Revenue',
                value: '$52k',
            },
            slots: {
                caption: '<span class="caption">Compared to last week</span>',
            },
        });

        expect(wrapper.find('.caption').text()).toContain('Compared to last week');
    });
});
