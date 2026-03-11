import { mount } from '@vue/test-utils';
import Skeleton from '../skeleton.vue';

describe('Skeleton', () => {
    it('renders with default classes', () => {
        const wrapper = mount(Skeleton);

        expect(wrapper.classes()).toContain('vf-skeleton');
        expect(wrapper.classes()).toContain('vf-skeleton_text');
        expect(wrapper.classes()).toContain('vf-skeleton_animated');
    });

    it('applies width and height styles', () => {
        const wrapper = mount(Skeleton, { props: { width: 120, height: 16, variant: 'rect' } });

        expect(wrapper.attributes('style')).toContain('width: 120px');
        expect(wrapper.attributes('style')).toContain('height: 16px');
        expect(wrapper.classes()).toContain('vf-skeleton_rect');
    });

    it('disables animation when animated is false', () => {
        const wrapper = mount(Skeleton, { props: { animated: false } });

        expect(wrapper.classes()).not.toContain('vf-skeleton_animated');
    });

    it('renders table preset with rows and columns', () => {
        const wrapper = mount(Skeleton, {
            props: {
                preset: 'table',
                tableRows: 3,
                tableColumns: 5,
            },
        });

        expect(wrapper.classes()).toContain('vf-skeleton-preset');
        expect(wrapper.classes()).toContain('vf-skeleton-preset_table');
        expect(wrapper.findAll('.vf-skeleton-preset__table-row')).toHaveLength(3);
        expect(wrapper.findAll('.vf-skeleton-preset__table-header .vf-skeleton__block')).toHaveLength(5);
    });

    it('renders list and form presets', () => {
        const list = mount(Skeleton, {
            props: {
                preset: 'list',
                listRows: 2,
            },
        });
        const form = mount(Skeleton, {
            props: {
                preset: 'form',
                formRows: 3,
            },
        });

        expect(list.findAll('.vf-skeleton-preset__list-row')).toHaveLength(2);
        expect(form.findAll('.vf-skeleton-preset__form-row')).toHaveLength(3);
    });
});
