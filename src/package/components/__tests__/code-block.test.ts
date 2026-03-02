import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import CodeBlock from '../code-block.vue';

describe('CodeBlock', () => {
    it('renders highlighted content and line numbers', () => {
        const wrapper = mount(CodeBlock, {
            props: {
                language: 'ts',
                code: 'const value = 42;\nreturn value;',
                showLineNumbers: true,
            },
        });

        expect(wrapper.findAll('.vcb__line-number')).toHaveLength(2);
        expect(wrapper.html()).toContain('vcb__token_keyword');
        expect(wrapper.html()).toContain('vcb__token_number');
    });

    it('highlights css selectors, properties, numbers, and comments', () => {
        const wrapper = mount(CodeBlock, {
            props: {
                language: 'css',
                code: `/* app.css */\n:root {\n    --app-page-padding: 1rem;\n}\n\nbody {\n    margin: 0;\n    font-family:\n        ui-sans-serif,\n        system-ui,\n        sans-serif;\n}`,
                showHeader: false,
                copyable: false,
            },
        });

        expect(wrapper.html()).toContain('vcb__token_comment');
        expect(wrapper.html()).toContain('vcb__token_selector');
        expect(wrapper.html()).toContain('vcb__token_property');
        expect(wrapper.html()).toContain('vcb__token_number');
        expect(wrapper.html()).toContain('vcb__token_variable');
    });

    it('highlights basic bash install commands', () => {
        const wrapper = mount(CodeBlock, {
            props: {
                language: 'bash',
                code: 'npm i @codemonster-ru/vueforge',
                showHeader: false,
                copyable: false,
            },
        });

        expect(wrapper.html()).toContain('vcb__token_keyword');
        expect(wrapper.html()).toContain('vcb__token_string');
    });

    it('highlights npm run subcommand and script names', () => {
        const wrapper = mount(CodeBlock, {
            props: {
                language: 'bash',
                code: 'npm run verify:bundle-size',
                showHeader: false,
                copyable: false,
            },
        });

        expect(wrapper.html()).toContain('vcb__token_keyword');
        expect(wrapper.html()).toContain('vcb__token_function');
        expect(wrapper.html()).toContain('vcb__token_variable');
    });

    it('renders vue markup without leaking token classes into text content', () => {
        const wrapper = mount(CodeBlock, {
            props: {
                language: 'vue',
                code: '<Accordion :model-value="[\'shipping\']"><AccordionItem #title title="Shipping" /></Accordion>',
                showHeader: false,
                copyable: false,
            },
        });

        expect(wrapper.html()).toContain('vcb__token_component');
        expect(wrapper.html()).toContain('vcb__token_directive');
        expect(wrapper.html()).toContain('vcb__token_attribute');
        expect(wrapper.html()).toContain('vcb__token_string');
        expect(wrapper.text()).not.toContain('vcb__token');
    });

    it('highlights multiline vue opening tag attributes', () => {
        const wrapper = mount(CodeBlock, {
            props: {
                language: 'vue',
                code: `<Accordion
    :model-value="['policy']"
    grouped
    dense
    group-title="Access controls"
>`,
                showHeader: false,
                copyable: false,
            },
        });

        expect(wrapper.html()).toContain('vcb__token_directive');
        expect(wrapper.html()).toContain('vcb__token_attribute');
        expect(wrapper.html()).toContain('vcb__token_component');
        expect(wrapper.html()).toContain('vcb__token_string');
    });

    it('highlights vue v-model, slot props, and interpolations', () => {
        const wrapper = mount(CodeBlock, {
            props: {
                language: 'vue',
                code: `<Carousel v-model="activeSlide" :items="slides">
    <template #item="{ item }">
        <article class="promo-slide">
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
        </article>
    </template>
</Carousel>`,
                showHeader: false,
                copyable: false,
            },
        });

        expect(wrapper.html()).toContain('vcb__token_directive');
        expect(wrapper.html()).toContain('vcb__token_variable');
        expect(wrapper.html()).toContain('vcb__token_component');
        expect(wrapper.html()).toContain('vcb__token_attribute');
    });

    it('highlights vue directives with arguments', () => {
        const wrapper = mount(CodeBlock, {
            props: {
                language: 'vue',
                code: `<CascadeSelect v-model="selectedNode" v-model:expandedKeys="expanded" :items="rootNodes" :load-children="loadChildren" :chunk-size="4_000_000" />`,
                showHeader: false,
                copyable: false,
            },
        });

        expect(wrapper.html()).toContain('vcb__token_directive');
        expect(wrapper.html()).toContain('v-model:expandedKeys');
        expect(wrapper.html()).toContain('vcb__token_variable');
        expect(wrapper.html()).toContain('vcb__token_number');
    });

    it('highlights vue directive expressions inside attribute values', () => {
        const wrapper = mount(CodeBlock, {
            props: {
                language: 'vue',
                code: `<BubbleChart
    :series="[
        {
            label: 'Accounts',
            data: [{ x: 1, y: 12, size: 10 }],
        },
    ]"
    :tooltip-formatter="ctx => \`${'${ctx.label}'}\`"
/>`,
                showHeader: false,
                copyable: false,
            },
        });

        expect(wrapper.html()).toContain('vcb__token_directive');
        expect(wrapper.html()).toContain('vcb__token_string');
        expect(wrapper.html()).toContain('vcb__token_property');
        expect(wrapper.html()).toContain('vcb__token_number');
    });

    it('highlights script setup section inside vue sfc blocks', () => {
        const wrapper = mount(CodeBlock, {
            props: {
                language: 'vue',
                code: `<script setup lang="ts">
import { AreaChart } from '@codemonster-ru/vueforge';
const adapter = true;
const config = { label: 'Revenue' };
createChartJsAdapter(config);
</script>`,
                showHeader: false,
                copyable: false,
            },
        });

        expect(wrapper.html()).toContain('vcb__token_keyword');
        expect(wrapper.html()).toContain('vcb__token_string');
        expect(wrapper.html()).toContain('vcb__token_identifier');
        expect(wrapper.html()).toContain('vcb__token_function');
        expect(wrapper.html()).toContain('vcb__token_property');
    });

    it('highlights operators inside vue directive expressions', () => {
        const wrapper = mount(CodeBlock, {
            props: {
                language: 'vue',
                code: `<FormField :error="touched.email ? errors.email : ''">
    <Input
        :model-value="String(values.email ?? '')"
        @update:model-value="value => setFieldValue('email', value)"
        @blur="() => setFieldTouched('email', true)"
    />
</FormField>`,
                showHeader: false,
                copyable: false,
            },
        });

        expect(wrapper.html()).toContain('vcb__token_operator');
        expect(wrapper.html()).toContain('vcb__token_function');
        expect(wrapper.html()).toContain('vcb__token_property');
        expect(wrapper.text()).not.toContain('&gt;');
    });

    it('highlights update:model-value callback expressions in recipe-like vue snippets', () => {
        const wrapper = mount(CodeBlock, {
            props: {
                language: 'vue',
                code: `<Form
    v-model="values"
    :validate="validateForm"
    :submit="submitForm"
    :map-submit-error="mapSubmitError"
    validate-on="submit"
    @submit-success="onSubmitSuccess"
>
    <template #default="{ values, errors, isSubmitting, setFieldValue }">
        <Input :model-value="String(values.email ?? '')" @update:model-value="v => setFieldValue('email', v)" />
        <p>{{ errors._form }}</p>
        <Button type="submit" :loading="isSubmitting" label="Save" />
    </template>
</Form>`,
                showHeader: false,
                copyable: false,
            },
        });

        expect(wrapper.html()).toContain('@update:model-value');
        expect(wrapper.html()).toContain('vcb__token_operator');
        expect(wrapper.html()).toContain('vcb__token_function');
        expect(wrapper.html()).toContain('vcb__token_variable');
        expect(wrapper.html()).toContain('vcb__token_property');
    });

    it('highlights slot destructuring punctuation inside vue template directives', () => {
        const wrapper = mount(CodeBlock, {
            props: {
                language: 'vue',
                code: `<Form>
    <template #default="{ values, errors, touched, setFieldValue }">
        <Input :model-value="String(values.email ?? '')" />
    </template>
</Form>`,
                showHeader: false,
                copyable: false,
            },
        });

        expect(wrapper.html()).toContain('vcb__token_directive');
        expect(wrapper.html()).toContain('vcb__token_operator');
        expect(wrapper.html()).toContain('vcb__token_variable');
        expect(wrapper.html()).toContain('vcb__token_property');
    });

    it('highlights chained properties with underscore names', () => {
        const wrapper = mount(CodeBlock, {
            props: {
                language: 'vue',
                code: `<p>{{ errors._form }}</p>`,
                showHeader: false,
                copyable: false,
            },
        });

        expect(wrapper.html()).toContain('vcb__token_variable');
        expect(wrapper.html()).toContain('vcb__token_operator');
        expect(wrapper.html()).toContain('vcb__token_property');
    });

    it('renders custom actions slot', () => {
        const wrapper = mount(CodeBlock, {
            props: {
                code: 'echo hi',
            },
            slots: {
                actions: '<button type="button" class="custom-action">Run</button>',
            },
        });

        expect(wrapper.find('.custom-action').exists()).toBe(true);
    });

    it('copies code and emits copy', async () => {
        const clipboardWrite = vi.fn().mockResolvedValue(undefined);
        Object.defineProperty(window.navigator, 'clipboard', {
            value: { writeText: clipboardWrite },
            configurable: true,
        });

        const wrapper = mount(CodeBlock, {
            props: {
                code: 'npm run build',
            },
        });

        await wrapper.find('.vcb__copy').trigger('click');

        expect(clipboardWrite).toHaveBeenCalledWith('npm run build');
        expect(wrapper.emitted('copy')?.[0]).toEqual([{ text: 'npm run build' }]);
    });

    it('does not copy when disabled', async () => {
        const clipboardWrite = vi.fn().mockResolvedValue(undefined);
        Object.defineProperty(window.navigator, 'clipboard', {
            value: { writeText: clipboardWrite },
            configurable: true,
        });

        const wrapper = mount(CodeBlock, {
            props: {
                code: 'disabled',
                disabled: true,
            },
        });

        await wrapper.find('.vcb__copy').trigger('click');

        expect(clipboardWrite).not.toHaveBeenCalled();
        expect(wrapper.emitted('copy')).toBeUndefined();
    });
});
