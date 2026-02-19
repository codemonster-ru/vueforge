import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import Button from '../button.vue';
import ButtonGroup from '../button-group.vue';
import SplitButton from '../split-button.vue';

vi.mock('@codemonster-ru/vueiconify', () => ({
    CmIcon: {
        template: '<span class="vf-icon-stub" />',
    },
}));

describe('ButtonGroup', () => {
    it('renders group container', () => {
        const wrapper = mount(ButtonGroup, {
            slots: {
                default: '<button>Test</button>',
            },
        });

        expect(wrapper.attributes('role')).toBe('group');
        expect(wrapper.classes()).toContain('vf-button-group_horizontal');
    });

    it('inherits size, variant, and severity for nested Button', () => {
        const wrapper = mount(ButtonGroup, {
            props: {
                size: 'small',
                variant: 'outlined',
                severity: 'success',
                attached: true,
            },
            slots: {
                default: '<Button label="One" /><Button label="Two" />',
            },
            global: {
                components: {
                    Button,
                },
            },
        });

        const buttons = wrapper.findAll('.vf-button');

        expect(wrapper.classes()).toContain('vf-button-group_attached');
        expect(buttons).toHaveLength(2);
        expect(buttons[0].classes()).toContain('vf-button_small');
        expect(buttons[0].classes()).toContain('vf-button_outlined');
        expect(buttons[0].classes()).toContain('vf-button_success');
    });

    it('inherits size and severity for nested SplitButton', () => {
        const wrapper = mount(ButtonGroup, {
            props: {
                size: 'large',
                severity: 'danger',
            },
            slots: {
                default: '<SplitButton label="Save" :items="[{ label: \'Save draft\' }]" />',
            },
            global: {
                components: {
                    SplitButton,
                },
                stubs: {
                    teleport: true,
                    Link: {
                        template: '<a class="vf-menu__link"><slot /></a>',
                    },
                },
            },
        });

        expect(wrapper.find('.vf-splitbutton').classes()).toContain('vf-splitbutton_large');

        const mainButton = wrapper.find('.vf-splitbutton__main');

        expect(mainButton.classes()).toContain('vf-button_danger');
    });
});
