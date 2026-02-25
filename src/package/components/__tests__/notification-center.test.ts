import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import NotificationCenter from '../notification-center.vue';
import { setLocaleText } from '@/package/config/locale-text';

const items = [
    { id: 1, title: 'Build completed', message: 'CI passed', read: false },
    { id: 2, title: 'New comment', message: 'Check PR #42', read: true },
];

const mountCenter = (options: Parameters<typeof mount>[1] = {}) =>
    mount(NotificationCenter, {
        props: {
            modelValue: true,
            items,
        },
        global: {
            stubs: {
                teleport: true,
            },
        },
        ...options,
    });

describe('NotificationCenter', () => {
    afterEach(() => {
        setLocaleText();
        document.documentElement.removeAttribute('dir');
    });

    it('renders notifications list', async () => {
        const wrapper = mountCenter();

        await nextTick();

        expect(wrapper.findAll('.vf-notification-center__item')).toHaveLength(2);
        expect(wrapper.find('.vf-notification-center__title').text()).toContain('Notifications');
    });

    it('toggles read state and emits updates', async () => {
        const wrapper = mountCenter();

        await nextTick();
        await wrapper.find('.vf-notification-center__toggle').trigger('click');

        expect(wrapper.emitted('update:items')).toBeTruthy();
        expect(wrapper.emitted('read')).toBeTruthy();
    });

    it('marks all as read and clears all', async () => {
        const wrapper = mountCenter();

        await nextTick();
        await wrapper.findAll('.vf-notification-center__action')[0].trigger('click');

        expect(wrapper.emitted('readAll')).toBeTruthy();

        await wrapper.findAll('.vf-notification-center__action')[1].trigger('click');

        expect(wrapper.emitted('clear')).toBeTruthy();
        expect(wrapper.find('.vf-notification-center__empty').exists()).toBe(true);
    });

    it('closes on Escape and restores trigger focus', async () => {
        const trigger = document.createElement('button');
        document.body.appendChild(trigger);
        trigger.focus();

        const wrapper = mountCenter({
            attachTo: document.body,
        });

        await nextTick();
        expect(document.activeElement).toBe(wrapper.find('.vf-notification-center__panel').element);

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        await nextTick();

        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false]);
        await wrapper.setProps({ modelValue: false });
        await nextTick();
        expect(document.activeElement).toBe(trigger);

        wrapper.unmount();
        trigger.remove();
    });

    it('does not close on overlay when closeOnOverlay is false', async () => {
        const wrapper = mountCenter({
            props: {
                modelValue: true,
                items,
                closeOnOverlay: false,
            },
        });

        await nextTick();
        await wrapper.find('.vf-notification-center__overlay').trigger('click');

        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    });

    it('uses global locale labels when props are not provided', async () => {
        setLocaleText({
            notificationCenter: {
                title: 'Benachrichtigungen',
                emptyText: 'Keine Benachrichtigungen',
                markAllLabel: 'Alle als gelesen markieren',
                clearLabel: 'Leeren',
                closeLabel: 'Benachrichtigungen schliessen',
                readLabel: 'Als gelesen markieren',
                unreadLabel: 'Als ungelesen markieren',
            },
        });

        const wrapper = mountCenter({
            props: {
                modelValue: true,
                items: [{ id: 1, title: 'Alert', message: 'Test', read: false }],
            },
        });

        await nextTick();
        expect(wrapper.find('.vf-notification-center__title').text()).toBe('Benachrichtigungen');
        expect(wrapper.findAll('.vf-notification-center__action')[0].text()).toContain('Alle als gelesen markieren');
        expect(wrapper.findAll('.vf-notification-center__action')[1].text()).toContain('Leeren');
        expect(wrapper.find('.vf-notification-center__close').attributes('aria-label')).toBe(
            'Benachrichtigungen schliessen',
        );
        expect(wrapper.find('.vf-notification-center__toggle').text()).toContain('Als gelesen markieren');
    });

    it('keeps close interaction in RTL document direction', async () => {
        document.documentElement.setAttribute('dir', 'rtl');
        const wrapper = mountCenter({
            props: {
                modelValue: true,
                items,
            },
        });

        await nextTick();
        await wrapper.find('.vf-notification-center__close').trigger('click');

        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false]);
    });

    it('supports read and unread filters', async () => {
        const wrapper = mountCenter({
            props: {
                modelValue: true,
                items,
                showFilters: true,
            },
        });

        await nextTick();
        const filters = wrapper.findAll('.vf-notification-center__filter');
        await filters[1].trigger('click');
        await nextTick();

        expect(wrapper.findAll('.vf-notification-center__item')).toHaveLength(1);
        expect(wrapper.find('.vf-notification-center__item-title').text()).toContain('Build completed');
        expect(wrapper.emitted('update:filter')?.at(-1)).toEqual(['unread']);
    });

    it('supports grouped rendering and item action links', async () => {
        const wrapper = mountCenter({
            props: {
                modelValue: true,
                groupBy: 'group',
                items: [
                    { id: 1, title: 'Deploy finished', read: false, group: 'Operations', actionLabel: 'Open runbook' },
                    { id: 2, title: 'Invoice failed', read: false, group: 'Billing', actionLabel: 'Open invoice' },
                ],
            },
        });

        await nextTick();
        const groupLabels = wrapper.findAll('.vf-notification-center__group-label').map(node => node.text());

        expect(groupLabels).toEqual(['Operations', 'Billing']);

        await wrapper.find('.vf-notification-center__action-link').trigger('click');
        expect(wrapper.emitted('action')?.length).toBe(1);
    });

    it('hydrates and persists read/filter state when persistence is enabled', async () => {
        window.localStorage.setItem(
            'vf-notification-center',
            JSON.stringify({
                filter: 'unread',
                readMap: { '1': true, '2': false },
                updatedAt: '2026-01-01T00:00:00.000Z',
            }),
        );

        const wrapper = mountCenter({
            props: {
                modelValue: true,
                items,
                showFilters: true,
                persistKey: 'vf-notification-center',
                persistReadState: true,
                persistFilterState: true,
            },
        });

        await nextTick();
        expect(wrapper.findAll('.vf-notification-center__item')).toHaveLength(1);
        expect(wrapper.find('.vf-notification-center__item-title').text()).toContain('New comment');

        await wrapper.find('.vf-notification-center__toggle').trigger('click');
        expect(wrapper.emitted('persist')?.length).toBeGreaterThan(1);

        const savedRaw = window.localStorage.getItem('vf-notification-center');
        const saved = savedRaw ? (JSON.parse(savedRaw) as { readMap: Record<string, boolean> }) : null;

        expect(saved?.readMap?.['2']).toBe(true);
    });
});
