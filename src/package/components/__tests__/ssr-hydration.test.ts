import { afterEach, describe, expect, it, vi } from 'vitest';
import { createSSRApp, h } from 'vue';
import { renderToString } from '@vue/server-renderer';
import Container from '@/package/components/container.vue';
import Stack from '@/package/components/stack.vue';
import Inline from '@/package/components/inline.vue';
import Input from '@/package/components/input.vue';
import DataTable from '@/package/components/data-table.vue';

const createSsrFixtureApp = () =>
    createSSRApp({
        render() {
            return h(Container, { size: 'md' }, () =>
                h(Stack, { gap: '16px' }, () => [
                    h('h1', { class: 'ssr-title' }, 'SSR Hydration Baseline'),
                    h(Inline, { gap: '8px' }, () => [
                        h('span', { class: 'ssr-chip ssr-chip_primary' }, 'Save'),
                        h('span', { class: 'ssr-chip ssr-chip_secondary' }, 'Cancel'),
                    ]),
                    h(Input, { modelValue: 'hello@vueforge.dev', ariaLabel: 'Email address' }),
                    h(DataTable, {
                        ariaLabel: 'SSR table',
                        rows: [
                            { id: 1, name: 'Ada Lovelace', role: 'Maintainer' },
                            { id: 2, name: 'Grace Hopper', role: 'Contributor' },
                        ],
                        columns: [
                            { field: 'name', header: 'Name' },
                            { field: 'role', header: 'Role' },
                        ],
                        rowKey: 'id',
                        showHeader: true,
                    }),
                ]),
            );
        },
    });

describe('SSR hydration checks', () => {
    afterEach(() => {
        document.body.innerHTML = '';
        vi.restoreAllMocks();
    });

    it('renders deterministic SSR markup for core baseline components', async () => {
        const html = await renderToString(createSsrFixtureApp());

        expect(html).toContain('SSR Hydration Baseline');
        expect(html).toContain('class="vf-container');
        expect(html).toContain('class="vf-stack');
        expect(html).toContain('class="vf-input');
        expect(html).toContain('class="vf-datatable');
    });

    it('hydrates without vue mismatch warnings', async () => {
        const html = await renderToString(createSsrFixtureApp());
        const container = document.createElement('div');
        container.id = 'app';
        container.innerHTML = html;
        document.body.appendChild(container);

        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

        createSsrFixtureApp().mount(container, true);

        const logs = [...warnSpy.mock.calls, ...errorSpy.mock.calls].flat().map(entry => String(entry).toLowerCase());

        expect(logs.some(line => line.includes('hydration'))).toBe(false);
        expect(container.textContent).toContain('SSR Hydration Baseline');
        expect(container.querySelectorAll('.vf-datatable__row').length).toBeGreaterThan(1);
    });
});
