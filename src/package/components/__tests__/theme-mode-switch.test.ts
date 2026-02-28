import { mount } from '@vue/test-utils';
import ThemeModeSwitch from '../theme-mode-switch.vue';
import ThemeProvider from '../theme-provider.vue';

describe('ThemeModeSwitch', () => {
    it('renders three theme options and emits update on selection', async () => {
        const wrapper = mount(ThemeModeSwitch, {
            props: {
                modelValue: 'system',
            },
        });

        const options = wrapper.findAll('.vf-segmented-control__item');
        expect(options).toHaveLength(3);

        await options[1].trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['light']);
        expect(wrapper.emitted('change')?.[0]?.[0]).toBe('light');
    });

    it('supports custom labels and size', () => {
        const wrapper = mount(ThemeModeSwitch, {
            props: {
                modelValue: 'dark',
                size: 'large',
                systemLabel: 'Auto',
                lightLabel: 'Day',
                darkLabel: 'Night',
            },
        });

        expect(wrapper.text()).toContain('Auto');
        expect(wrapper.text()).toContain('Day');
        expect(wrapper.text()).toContain('Night');
        expect(wrapper.find('.vf-segmented-control').classes()).toContain('vf-segmented-control_large');
    });

    it('supports component theme token overrides', () => {
        const wrapper = mount(ThemeProvider, {
            props: {
                overrides: {
                    components: {
                        themeModeSwitch: {
                            borderColor: '#123456',
                            activeBackgroundColor: '#abcdef',
                        },
                    },
                },
            },
            slots: {
                default: '<ThemeModeSwitch model-value="system" />',
            },
            global: {
                components: {
                    ThemeModeSwitch,
                },
            },
        });

        const provider = wrapper.get('.vf-theme-provider');
        expect(provider.attributes('style')).toContain('--vf-theme-mode-switch-border-color: #123456');
        expect(provider.attributes('style')).toContain('--vf-theme-mode-switch-active-background-color: #abcdef');
    });
});
