<template>
    <div class="vf-docs__markdown" data-testid="vf-docs-markdown" :data-active-tab="active ? 'true' : 'false'">
        <template v-for="(block, index) in rendered.blocks" :key="index">
            <!-- eslint-disable vue/no-v-html -->
            <div v-if="block.kind === 'markdown'" v-html="block.html" />
            <!-- eslint-enable vue/no-v-html -->
            <section v-else class="vf-docs-examples">
                <h2 :id="block.id">Examples</h2>
                <!-- eslint-disable vue/no-v-html -->
                <div v-if="block.leadHtml" v-html="block.leadHtml" />
                <!-- eslint-enable vue/no-v-html -->
                <DocsExamplePreview
                    v-for="example in block.items"
                    :id="example.id"
                    :key="example.id"
                    :title="example.title"
                    :description-html="example.descriptionHtml"
                    :code="example.code"
                    :language="example.language"
                />
            </section>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import DocsExamplePreview from './DocsExamplePreview.vue';
import { renderDocsFeaturesMarkdown } from './docs-features';

const props = defineProps<{
    markdown: string;
    sourcePath: string;
    active: boolean;
}>();

const rendered = computed(() => renderDocsFeaturesMarkdown(props.markdown, props.sourcePath));
</script>
