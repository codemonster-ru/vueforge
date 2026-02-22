<template>
    <main class="vf-playground" data-testid="playground-root">
        <Container size="lg">
            <Section bordered>
                <Stack gap="20px">
                    <header class="vf-playground__header">
                        <h1>VueForge Live Playground</h1>
                        <p>Interactive sandbox for core component props and states.</p>
                    </header>

                    <Inline gap="8px" wrap="wrap">
                        <Button
                            v-for="item in tabs"
                            :key="item.id"
                            :variant="activeTab === item.id ? undefined : 'outlined'"
                            severity="secondary"
                            size="small"
                            :data-testid="`playground-tab-${item.id}`"
                            @click="activeTab = item.id"
                        >
                            {{ item.label }}
                        </Button>
                    </Inline>

                    <div class="vf-playground__layout">
                        <aside class="vf-playground__panel" data-testid="playground-controls">
                            <template v-if="activeTab === 'button'">
                                <h2>Button controls</h2>
                                <label>
                                    Label
                                    <input v-model="buttonState.label" data-testid="control-button-label" />
                                </label>
                                <label>
                                    Severity
                                    <select v-model="buttonState.severity" data-testid="control-button-severity">
                                        <option value="primary">primary</option>
                                        <option value="secondary">secondary</option>
                                        <option value="success">success</option>
                                        <option value="info">info</option>
                                        <option value="warning">warning</option>
                                        <option value="danger">danger</option>
                                    </select>
                                </label>
                                <label>
                                    Variant
                                    <select v-model="buttonState.variant" data-testid="control-button-variant">
                                        <option value="">filled</option>
                                        <option value="outlined">outlined</option>
                                        <option value="text">text</option>
                                    </select>
                                </label>
                                <label class="vf-playground__check">
                                    <input
                                        v-model="buttonState.disabled"
                                        type="checkbox"
                                        data-testid="control-button-disabled"
                                    />
                                    Disabled
                                </label>
                                <label class="vf-playground__check">
                                    <input
                                        v-model="buttonState.loading"
                                        type="checkbox"
                                        data-testid="control-button-loading"
                                    />
                                    Loading
                                </label>
                            </template>

                            <template v-else-if="activeTab === 'input'">
                                <h2>Input controls</h2>
                                <label>
                                    Model
                                    <input v-model="inputState.value" data-testid="control-input-model" />
                                </label>
                                <label>
                                    Placeholder
                                    <input v-model="inputState.placeholder" data-testid="control-input-placeholder" />
                                </label>
                                <label>
                                    Variant
                                    <select v-model="inputState.variant" data-testid="control-input-variant">
                                        <option value="filled">filled</option>
                                        <option value="outlined">outlined</option>
                                    </select>
                                </label>
                                <label>
                                    Size
                                    <select v-model="inputState.size" data-testid="control-input-size">
                                        <option value="small">small</option>
                                        <option value="normal">normal</option>
                                        <option value="large">large</option>
                                    </select>
                                </label>
                                <label class="vf-playground__check">
                                    <input
                                        v-model="inputState.disabled"
                                        type="checkbox"
                                        data-testid="control-input-disabled"
                                    />
                                    Disabled
                                </label>
                                <label class="vf-playground__check">
                                    <input
                                        v-model="inputState.readonly"
                                        type="checkbox"
                                        data-testid="control-input-readonly"
                                    />
                                    Readonly
                                </label>
                            </template>

                            <template v-else-if="activeTab === 'card'">
                                <h2>Card controls</h2>
                                <label>
                                    Title
                                    <input v-model="cardState.title" data-testid="control-card-title" />
                                </label>
                                <label>
                                    Body
                                    <textarea
                                        v-model="cardState.body"
                                        rows="4"
                                        data-testid="control-card-body"
                                    ></textarea>
                                </label>
                            </template>

                            <template v-else>
                                <h2>Layout controls</h2>
                                <label>
                                    Gap
                                    <input v-model="layoutState.gap" data-testid="control-layout-gap" />
                                </label>
                                <label>
                                    Align
                                    <select v-model="layoutState.align" data-testid="control-layout-align">
                                        <option value="start">start</option>
                                        <option value="center">center</option>
                                        <option value="end">end</option>
                                        <option value="stretch">stretch</option>
                                    </select>
                                </label>
                            </template>
                        </aside>

                        <section class="vf-playground__preview" data-testid="playground-preview">
                            <h2>Live preview</h2>

                            <div v-if="activeTab === 'button'" data-testid="preview-button">
                                <Button
                                    :severity="buttonState.severity"
                                    :variant="buttonState.variant || undefined"
                                    :disabled="buttonState.disabled"
                                    :loading="buttonState.loading"
                                    data-testid="preview-button-control"
                                >
                                    {{ buttonState.label }}
                                </Button>
                            </div>

                            <div v-else-if="activeTab === 'input'" data-testid="preview-input">
                                <Input
                                    v-model="inputState.value"
                                    :placeholder="inputState.placeholder"
                                    :variant="inputState.variant"
                                    :size="inputState.size"
                                    :disabled="inputState.disabled"
                                    :readonly="inputState.readonly"
                                    aria-label="Playground input"
                                    data-testid="preview-input-control"
                                />
                            </div>

                            <div v-else-if="activeTab === 'card'" data-testid="preview-card">
                                <Card>
                                    <template #default>
                                        <Stack gap="8px">
                                            <h3 class="vf-playground__card-title">{{ cardState.title }}</h3>
                                            <p class="vf-playground__card-text">{{ cardState.body }}</p>
                                        </Stack>
                                    </template>
                                </Card>
                            </div>

                            <div v-else data-testid="preview-layout">
                                <Stack :gap="layoutState.gap" :align="layoutState.align">
                                    <Card><template #default>Panel A</template></Card>
                                    <Card><template #default>Panel B</template></Card>
                                    <Card><template #default>Panel C</template></Card>
                                </Stack>
                            </div>
                        </section>
                    </div>
                </Stack>
            </Section>
        </Container>
    </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Container from '@/package/components/container.vue';
import Section from '@/package/components/section.vue';
import Stack from '@/package/components/stack.vue';
import Inline from '@/package/components/inline.vue';
import Button from '@/package/components/button.vue';
import Input from '@/package/components/input.vue';
import Card from '@/package/components/card.vue';

type PlaygroundTab = 'button' | 'input' | 'card' | 'layout';
type ButtonSeverity = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger';
type ButtonVariant = '' | 'outlined' | 'text';
type InputVariant = 'filled' | 'outlined';
type InputSize = 'small' | 'normal' | 'large';
type LayoutAlign = 'start' | 'center' | 'end' | 'stretch';

const tabs: Array<{ id: PlaygroundTab; label: string }> = [
    { id: 'button', label: 'Button' },
    { id: 'input', label: 'Input' },
    { id: 'card', label: 'Card' },
    { id: 'layout', label: 'Layout' },
];

const activeTab = ref<PlaygroundTab>('button');

const buttonState = ref<{
    label: string;
    severity: ButtonSeverity;
    variant: ButtonVariant;
    disabled: boolean;
    loading: boolean;
}>({
    label: 'Run action',
    severity: 'primary',
    variant: '',
    disabled: false,
    loading: false,
});

const inputState = ref<{
    value: string;
    placeholder: string;
    variant: InputVariant;
    size: InputSize;
    disabled: boolean;
    readonly: boolean;
}>({
    value: 'hello@vueforge.dev',
    placeholder: 'Type value',
    variant: 'filled',
    size: 'normal',
    disabled: false,
    readonly: false,
});

const cardState = ref({
    title: 'Project summary',
    body: 'Use this panel to test spacing and typography updates in real time.',
});

const layoutState = ref<{ gap: string; align: LayoutAlign }>({
    gap: '12px',
    align: 'stretch',
});
</script>

<style scoped lang="scss">
.vf-playground {
    padding: 28px 0;
}

.vf-playground__header h1 {
    margin: 0;
    font-size: 28px;
}

.vf-playground__header p {
    margin: 6px 0 0;
    opacity: 0.8;
}

.vf-playground__layout {
    display: grid;
    grid-template-columns: minmax(260px, 320px) 1fr;
    gap: 16px;
}

.vf-playground__panel,
.vf-playground__preview {
    border: 1px solid var(--vf-card-border-color);
    border-radius: 12px;
    padding: 16px;
}

.vf-playground__panel h2,
.vf-playground__preview h2 {
    margin-top: 0;
    margin-bottom: 12px;
    font-size: 16px;
}

.vf-playground__panel label {
    display: block;
    margin-bottom: 10px;
    font-size: 13px;
}

.vf-playground__panel input,
.vf-playground__panel select,
.vf-playground__panel textarea {
    margin-top: 4px;
    width: 100%;
    padding: 6px 8px;
    border: 1px solid var(--vf-input-border-color);
    border-radius: 8px;
    font: inherit;
}

.vf-playground__check {
    display: flex !important;
    align-items: center;
    gap: 8px;
}

.vf-playground__check input {
    width: auto;
    margin: 0;
}

.vf-playground__card-title {
    margin: 0;
}

.vf-playground__card-text {
    margin: 0;
}

@media (max-width: 900px) {
    .vf-playground__layout {
        grid-template-columns: 1fr;
    }
}
</style>
