import { createSSRApp, nextTick } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { mount } from '@vue/test-utils';
import NoSsr from '../no-ssr.vue';

describe('NoSsr', () => {
    it('renders fallback markup during SSR', async () => {
        const html = await renderToString(
            createSSRApp({
                components: { NoSsr },
                template: `
                    <NoSsr>
                        <div class="client-only">Client content</div>
                        <template #fallback>
                            <div class="fallback-content">Fallback content</div>
                        </template>
                    </NoSsr>
                `,
            }),
        );

        expect(html).toContain('fallback-content');
        expect(html).not.toContain('client-only');
    });

    it('renders client content after mount', async () => {
        const wrapper = mount(NoSsr, {
            slots: {
                default: '<div class="client-only">Client content</div>',
                fallback: '<div class="fallback-content">Fallback content</div>',
            },
        });

        await nextTick();
        expect(wrapper.find('.client-only').exists()).toBe(true);
        expect(wrapper.find('.fallback-content').exists()).toBe(false);
    });

    it('uses placeholder tag when fallback slot is not provided', async () => {
        const html = await renderToString(
            createSSRApp({
                components: { NoSsr },
                template: '<NoSsr fallback-tag="div" />',
            }),
        );

        expect(html).toContain('vf-no-ssr__placeholder');
    });
});
