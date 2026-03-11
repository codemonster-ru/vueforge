import { mount } from '@vue/test-utils';
import Badge from '../badge.vue';

describe('Badge', () => {
    it('renders label and slot content', () => {
        const byProp = mount(Badge, {
            props: {
                label: 'Beta',
            },
        });
        const bySlot = mount(Badge, {
            slots: {
                default: 'From slot',
            },
        });

        expect(byProp.text()).toContain('Beta');
        expect(bySlot.text()).toContain('From slot');
    });

    it('applies size, variant, severity and accessibility attrs', () => {
        const wrapper = mount(Badge, {
            props: {
                size: 'large',
                variant: 'outline',
                severity: 'success',
                ariaLabel: 'Deployment status',
            },
        });
        const badge = wrapper.get('.vf-badge');

        expect(badge.classes()).toContain('vf-badge_size-large');
        expect(badge.attributes('data-variant')).toBe('outline');
        expect(badge.attributes('data-severity')).toBe('success');
        expect(badge.attributes('role')).toBe('status');
        expect(badge.attributes('aria-label')).toBe('Deployment status');
    });
});
