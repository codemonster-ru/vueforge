import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import PlaygroundView from '../PlaygroundView.vue';

vi.mock('@codemonster-ru/vueiconify', () => ({
    CmIcon: {
        template: '<span class="vf-icon-stub" />',
    },
}));

describe('PlaygroundView', () => {
    it('renders button playground by default', () => {
        const wrapper = mount(PlaygroundView);

        expect(wrapper.find('[data-testid="preview-button"]').exists()).toBe(true);
        expect(wrapper.find('[data-testid="preview-button-control"]').text()).toContain('Run action');
    });

    it('switches to input tab and updates preview value from controls', async () => {
        const wrapper = mount(PlaygroundView);

        await wrapper.find('[data-testid="playground-tab-input"]').trigger('click');
        expect(wrapper.find('[data-testid="preview-input"]').exists()).toBe(true);

        const modelControl = wrapper.find('[data-testid="control-input-model"]');
        await modelControl.setValue('updated@example.com');

        const input = wrapper.find('[data-testid="preview-input-control"] input');
        expect((input.element as HTMLInputElement).value).toBe('updated@example.com');
    });

    it('applies disabled state to button preview', async () => {
        const wrapper = mount(PlaygroundView);

        await wrapper.find('[data-testid="control-button-disabled"]').setValue(true);

        expect(wrapper.find('[data-testid="preview-button-control"]').classes()).toContain('vf-button_disabled');
    });
});
