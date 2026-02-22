import { mount, RouterLinkStub } from '@vue/test-utils';
import { vi } from 'vitest';
import Button from '../button.vue';

vi.mock('@codemonster-ru/vueiconify', () => ({
    CmIcon: {
        template: '<i class="mock-icon" />',
    },
}));

describe('Button', () => {
    it('renders native button by default', () => {
        const wrapper = mount(Button, {
            props: { label: 'Save' },
            global: {
                stubs: { RouterLink: RouterLinkStub },
            },
        });

        expect(wrapper.element.tagName).toBe('BUTTON');
        expect(wrapper.classes()).toContain('vf-button');
        expect(wrapper.text()).toContain('Save');
    });

    it('renders as anchor link when href is provided', () => {
        const wrapper = mount(Button, {
            props: { href: 'https://example.com', label: 'Settings' },
            global: {
                stubs: { RouterLink: RouterLinkStub },
            },
        });

        expect(wrapper.element.tagName).toBe('A');
        expect(wrapper.attributes('href')).toBe('https://example.com');
        expect(wrapper.text()).toContain('Settings');
    });

    it('applies loading and disabled state', () => {
        const wrapper = mount(Button, {
            props: { label: 'Submit', loading: true },
            global: {
                stubs: { RouterLink: RouterLinkStub },
            },
        });

        expect(wrapper.classes()).toContain('vf-button_disabled');
        expect(wrapper.attributes('disabled')).toBeDefined();
    });
});
