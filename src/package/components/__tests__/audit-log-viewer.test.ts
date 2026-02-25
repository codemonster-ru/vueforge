import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import AuditLogViewer from '../audit-log-viewer.vue';

const entries = [
    {
        id: 'evt-1',
        event: 'member.role.updated',
        summary: 'Updated role to admin',
        actor: {
            id: 'u-1',
            name: 'Alice Doe',
            meta: 'Owner',
        },
        entity: 'member:u-1',
        timestamp: '2026-02-24T10:00:00.000Z',
        previousPayload: {
            role: 'editor',
            active: true,
        },
        payload: {
            role: 'admin',
            active: true,
        },
    },
];

const mountViewer = (props: Record<string, unknown> = {}) =>
    mount(AuditLogViewer, {
        props: {
            entries,
            ...props,
        },
        attachTo: document.body,
        global: {
            stubs: {
                teleport: true,
                transition: false,
            },
        },
    });

describe('AuditLogViewer', () => {
    it('renders event rows and actor metadata', () => {
        const wrapper = mountViewer();

        expect(wrapper.findAll('.vf-audit-log-viewer__row').length).toBeGreaterThan(1);
        expect(wrapper.text()).toContain('member.role.updated');
        expect(wrapper.text()).toContain('Alice Doe');
        expect(wrapper.text()).toContain('Owner');
    });

    it('shows empty state when no entries provided', () => {
        const wrapper = mountViewer({ entries: [] });

        expect(wrapper.find('.vf-audit-log-viewer__cell_state').text()).toContain('No audit records.');
    });

    it('opens details drawer and emits select/openDetails', async () => {
        const wrapper = mountViewer();

        await wrapper.find('.vf-audit-log-viewer__open').trigger('click');
        await nextTick();

        expect(wrapper.emitted('select')?.[0]?.[0]).toMatchObject({ index: 0 });
        expect(wrapper.emitted('openDetails')?.[0]?.[0]).toMatchObject({ index: 0 });
        expect(wrapper.find('.vf-drawer__panel').exists()).toBe(true);
    });

    it('renders payload diff rows in drawer', async () => {
        const wrapper = mountViewer();

        await wrapper.find('.vf-audit-log-viewer__open').trigger('click');
        await nextTick();

        const diffRows = wrapper.findAll('.vf-audit-log-viewer__diff-table tbody tr');

        expect(diffRows.length).toBeGreaterThan(0);
        expect(wrapper.text()).toContain('Payload diff');
        expect(wrapper.text()).toContain('editor');
        expect(wrapper.text()).toContain('admin');
    });

    it('emits closeDetails when drawer closes', async () => {
        const wrapper = mountViewer();

        await wrapper.find('.vf-audit-log-viewer__open').trigger('click');
        await nextTick();
        await wrapper.find('.vf-drawer__close').trigger('click');
        await nextTick();

        expect(wrapper.emitted('closeDetails')?.length).toBe(1);
    });
});
