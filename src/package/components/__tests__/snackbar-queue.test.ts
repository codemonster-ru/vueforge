import { mount } from '@vue/test-utils';
import SnackbarQueue from '../snackbar-queue.vue';

describe('SnackbarQueue', () => {
    const global = {
        stubs: {
            teleport: true,
        },
    };

    it('renders only maxVisible items and advances queue on close', async () => {
        const wrapper = mount(SnackbarQueue, {
            props: {
                items: [
                    { id: 'a', message: 'A' },
                    { id: 'b', message: 'B' },
                ],
                maxVisible: 1,
            },
            global,
        });

        expect(wrapper.findAll('.vf-toast').length).toBe(1);
        expect(wrapper.text()).toContain('A');

        await wrapper.find('.vf-toast__close').trigger('click');
        await wrapper.vm.$nextTick();

        expect(wrapper.text()).toContain('B');
        expect(wrapper.emitted('dequeue')?.[0]?.[0]).toMatchObject({ id: 'a' });
    });

    it('supports imperative enqueue via exposed API', async () => {
        const wrapper = mount(SnackbarQueue, {
            props: {
                maxVisible: 1,
            },
            global,
        });

        (wrapper.vm as { enqueue: (item: { id: string; message: string }) => void }).enqueue({
            id: 'job',
            message: 'Job finished',
        });
        await wrapper.vm.$nextTick();

        expect(wrapper.text()).toContain('Job finished');
        expect(wrapper.emitted('enqueue')?.[0]?.[0]).toMatchObject({ id: 'job' });
    });

    it('emits action and dequeues by default when action button clicked', async () => {
        const wrapper = mount(SnackbarQueue, {
            props: {
                items: [{ id: 'retry', message: 'Failed', actionLabel: 'Retry' }],
            },
            global,
        });

        await wrapper.find('.vf-snackbar-queue__action').trigger('click');

        expect(wrapper.emitted('action')?.[0]?.[0]).toMatchObject({ id: 'retry' });
        expect(wrapper.emitted('dequeue')?.[0]?.[0]).toMatchObject({ id: 'retry' });
    });

    it('dedupes incoming items by id when dedupe=true', async () => {
        const wrapper = mount(SnackbarQueue, {
            props: {
                dedupe: true,
                items: [{ id: 'x', message: 'One' }],
            },
            global,
        });

        await wrapper.setProps({
            items: [
                { id: 'x', message: 'One' },
                { id: 'x', message: 'One duplicate' },
            ],
        });

        expect(wrapper.findAll('.vf-toast').length).toBe(1);
    });
});
