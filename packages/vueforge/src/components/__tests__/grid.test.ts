import { mount } from '@vue/test-utils';
import Grid from '../grid.vue';
import GridItem from '../grid-item.vue';

describe('Grid', () => {
    it('renders with default tag and class', () => {
        const wrapper = mount(Grid, {
            slots: {
                default: 'Content',
            },
        });

        expect(wrapper.element.tagName).toBe('DIV');
        expect(wrapper.classes()).toContain('vf-grid');
        expect(wrapper.text()).toContain('Content');
    });

    it('applies columns, gaps, and alignment overrides', () => {
        const wrapper = mount(Grid, {
            props: {
                columns: 3,
                gap: '1rem',
                columnGap: '2rem',
                rowGap: '0.5rem',
                align: 'center',
                justify: 'start',
            },
        });

        const style = wrapper.attributes('style');

        expect(style).toContain('--vf-grid-columns-override: repeat(3, minmax(0, 1fr));');
        expect(style).toContain('--vf-grid-gap-override: 1rem;');
        expect(style).toContain('--vf-grid-column-gap-override: 2rem;');
        expect(style).toContain('--vf-grid-row-gap-override: 0.5rem;');
        expect(style).toContain('--vf-grid-align-items-override: center;');
        expect(style).toContain('--vf-grid-justify-items-override: start;');
    });

    it('applies responsive overrides from breakpoints prop', () => {
        const wrapper = mount(Grid, {
            props: {
                breakpoints: {
                    sm: { columns: 2, gap: '0.75rem' },
                    lg: { columns: 6, columnGap: '1.5rem', rowGap: '2rem', align: 'end', justify: 'center' },
                },
            },
        });

        const style = wrapper.attributes('style');

        expect(style).toContain('--vf-grid-columns-sm-override: repeat(2, minmax(0, 1fr));');
        expect(style).toContain('--vf-grid-gap-sm-override: 0.75rem;');
        expect(style).toContain('--vf-grid-columns-lg-override: repeat(6, minmax(0, 1fr));');
        expect(style).toContain('--vf-grid-column-gap-lg-override: 1.5rem;');
        expect(style).toContain('--vf-grid-row-gap-lg-override: 2rem;');
        expect(style).toContain('--vf-grid-align-items-lg-override: end;');
        expect(style).toContain('--vf-grid-justify-items-lg-override: center;');
    });
});

describe('GridItem', () => {
    it('renders with span-based column configuration', () => {
        const wrapper = mount(GridItem, {
            props: {
                span: 4,
            },
            slots: {
                default: 'Cell',
            },
        });

        expect(wrapper.classes()).toContain('vf-grid-item');
        expect(wrapper.text()).toContain('Cell');
        expect(wrapper.attributes('style')).toContain('--vf-grid-item-column-override: span 4 / span 4;');
    });

    it('supports start/end positioning and responsive span', () => {
        const wrapper = mount(GridItem, {
            props: {
                start: 2,
                end: 5,
                breakpoints: {
                    md: { span: 3 },
                    xl: { start: 4, span: 6 },
                },
            },
        });

        const style = wrapper.attributes('style');

        expect(style).toContain('--vf-grid-item-column-override: 2 / 5;');
        expect(style).toContain('--vf-grid-item-column-md-override: span 3 / span 3;');
        expect(style).toContain('--vf-grid-item-column-xl-override: 4 / span 6;');
    });
});
