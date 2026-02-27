import { mount } from '@vue/test-utils';
import ThemeProvider from '../theme-provider.vue';

describe('ThemeProvider', () => {
    it('applies scoped css variables from overrides', () => {
        const wrapper = mount(ThemeProvider, {
            props: {
                overrides: {
                    colors: {
                        primary: '#123456',
                    },
                    components: {
                        panel: {
                            borderColor: '#abcdef',
                        },
                    },
                },
            },
            slots: {
                default: '<div class="content">Scoped content</div>',
            },
        });

        const root = wrapper.get('.vf-theme-provider');
        expect(root.attributes('style')).toContain('--vf-primary: #123456');
        expect(root.attributes('style')).toContain('--vf-panel-border-color: #abcdef');
        expect(wrapper.get('.content').text()).toBe('Scoped content');
    }, 10000);

    it('supports dark variable scope mode', () => {
        const wrapper = mount(ThemeProvider, {
            props: {
                dark: true,
            },
        });

        const root = wrapper.get('.vf-theme-provider');
        expect(root.attributes('data-theme')).toBe('dark');
        expect(root.attributes('style')).toContain('--vf-bg-color');
    });
});
