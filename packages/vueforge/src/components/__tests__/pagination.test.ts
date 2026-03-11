import { mount } from '@vue/test-utils';
import Pagination from '../pagination.vue';

describe('Pagination', () => {
    it('emits update:modelValue and change when page button is clicked', async () => {
        const wrapper = mount(Pagination, {
            props: {
                modelValue: 1,
                totalItems: 100,
                pageSize: 10,
            },
        });

        const thirdPageButton = wrapper.findAll('.vf-pagination__item').find(button => button.text() === '3');

        expect(thirdPageButton).toBeDefined();

        await thirdPageButton?.trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3]);
        expect(wrapper.emitted('change')?.[0]?.[0]).toBe(3);
    });

    it('disables previous button on first page and next button on last page', () => {
        const firstPage = mount(Pagination, {
            props: {
                modelValue: 1,
                totalPages: 3,
            },
        });
        const firstButtons = firstPage.findAll('.vf-pagination__item');

        expect(firstButtons[0].attributes('disabled')).toBeDefined();

        const lastPage = mount(Pagination, {
            props: {
                modelValue: 3,
                totalPages: 3,
            },
        });
        const lastButtons = lastPage.findAll('.vf-pagination__item');

        expect(lastButtons[lastButtons.length - 1].attributes('disabled')).toBeDefined();
    });

    it('renders ellipsis for large ranges', () => {
        const wrapper = mount(Pagination, {
            props: {
                modelValue: 10,
                totalPages: 20,
                siblingCount: 1,
                boundaryCount: 1,
            },
        });

        const ellipsis = wrapper.findAll('.vf-pagination__item.is-ellipsis');

        expect(ellipsis.length).toBeGreaterThan(0);
    });
});
