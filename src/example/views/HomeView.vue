<template>
    <div class="vf-home">
        <h1>Examples</h1>
        <section class="vf-home__section">
            <h2>Theming</h2>
            <div class="vf-home__actions">
                <Button label="Apply Blue Theme" @click="applyBlueTheme" />
                <Button label="Reset Theme" severity="secondary" @click="resetTheme" />
                <Button label="Toggle Dark" severity="info" @click="toggleDark" />
            </div>
            <p class="vf-home__text">Toggle dark to see background and text change.</p>
            <p class="vf-home__muted">Components below reflect the active theme.</p>
        </section>
        <section class="vf-home__section">
            <h2>Components</h2>
            <div class="vf-home__grid">
                <div class="vf-home__card">
                    <h3>Button</h3>
                    <div class="vf-home__actions">
                        <Button label="Primary" />
                        <Button label="Outlined" variant="outlined" />
                        <Button label="Text" variant="text" />
                        <Button label="Icon" icon="check" />
                        <Button label="Loading" loading />
                    </div>
                </div>
                <div class="vf-home__card">
                    <h3>Link</h3>
                    <div class="vf-home__stack">
                        <Link href="https://example.com" target="_blank">External link</Link>
                        <Link to="/layouts/default">Router link</Link>
                        <Link href="https://example.com" disabled>Disabled link</Link>
                    </div>
                </div>
                <div class="vf-home__card">
                    <h3>Input</h3>
                    <div class="vf-home__stack">
                        <Input v-model="email" placeholder="Email" />
                        <Input v-model="search" placeholder="Search" variant="outlined">
                            <template #prefix>🔎</template>
                        </Input>
                    </div>
                </div>
                <div class="vf-home__card">
                    <h3>Select</h3>
                    <Select v-model="role" :options="roles" placeholder="Role" />
                </div>
                <div class="vf-home__card">
                    <h3>Checkbox & Switch</h3>
                    <div class="vf-home__stack">
                        <Checkbox v-model="agreed">Agree to terms</Checkbox>
                        <Switch v-model="notifications">Notifications</Switch>
                    </div>
                </div>
                <div class="vf-home__card">
                    <h3>Card</h3>
                    <Card>
                        <template #header>Card header</template>
                        <template #body>Card body text</template>
                        <template #footer>Card footer</template>
                    </Card>
                </div>
                <div class="vf-home__card">
                    <h3>Popover</h3>
                    <Popover>
                        <template #button>
                            <Button label="Toggle Popover" />
                        </template>
                        <template #default>
                            <div class="vf-home__popover-content">Popover content</div>
                        </template>
                    </Popover>
                </div>
                <div class="vf-home__card">
                    <h3>Menu</h3>
                    <Menu :items="menuItems" />
                </div>
                <div class="vf-home__card">
                    <h3>Logo</h3>
                    <Logo :src="[logoLight, logoDark]" :dark="isDark" width="120" height="32" />
                </div>
                <div class="vf-home__card">
                    <h3>Demo</h3>
                    <Demo>Demo block</Demo>
                </div>
                <div class="vf-home__card">
                    <h3>Container / Header / Content / Footer</h3>
                    <Container class="vf-home__container-demo">
                        <Header class="vf-home__header-demo">Header slot</Header>
                        <Content class="vf-home__content-demo">Content slot</Content>
                        <Footer class="vf-home__footer-demo">Footer slot</Footer>
                    </Container>
                </div>
                <div class="vf-home__card">
                    <h3>Layouts</h3>
                    <DefaultLayout class="vf-home__layout-demo">
                        <template #header>Layout header</template>
                        <template #content>Layout content</template>
                        <template #footer>Layout footer</template>
                    </DefaultLayout>
                    <LeftSidebarLayout class="vf-home__layout-demo vf-home__layout-demo_sidebar">
                        <template #leftSidebar>
                            <div class="vf-home__sidebar-demo">Sidebar slot</div>
                        </template>
                    </LeftSidebarLayout>
                </div>
            </div>
        </section>
        <h2>Layouts</h2>
        <ul>
            <li>
                <router-link to="/layouts/default">Default</router-link>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
    Button,
    Card,
    Checkbox,
    Container,
    Content,
    DefaultLayout,
    DefaultTheme,
    Demo,
    Footer,
    Header,
    Input,
    LeftSidebarLayout,
    Link,
    Logo,
    Menu,
    Popover,
    Select,
    Switch,
    setTheme,
    updateTheme,
} from '@/index';

const applyBlueTheme = () => {
    updateTheme({
        overrides: {
            colors: {
                blue: '#2b6cb0',
            },
        },
    });
};
const resetTheme = () => {
    setTheme({ preset: DefaultTheme });
};
const toggleDark = () => {
    const root = document.documentElement;
    const current = root.getAttribute('data-theme');
    root.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
    isDark.value = root.getAttribute('data-theme') === 'dark';
};

const email = ref('');
const search = ref('');
const role = ref('');
const agreed = ref(false);
const notifications = ref(true);
const isDark = ref(document.documentElement.getAttribute('data-theme') === 'dark');
const roles = [
    { label: 'Developer', value: 'dev' },
    { label: 'Designer', value: 'design' },
    { label: 'Product', value: 'product' },
];
const menuItems = [
    { label: 'Home', to: '/' },
    { label: 'Layouts', items: [{ label: 'Default', to: '/layouts/default' }] },
    { separator: true },
    { label: 'Docs', href: 'https://example.com' },
];
const encodeSvg = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
const logoLight = encodeSvg(
    '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="32"><rect width="120" height="32" rx="6" fill="#2563eb"/><text x="16" y="21" font-family="Arial" font-size="14" fill="#fff">VueForge</text></svg>',
);
const logoDark = encodeSvg(
    '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="32"><rect width="120" height="32" rx="6" fill="#0f172a"/><text x="16" y="21" font-family="Arial" font-size="14" fill="#e2e8f0">VueForge</text></svg>',
);
</script>

<style>
.vf-home {
    padding-right: 1rem;
    padding-left: 1rem;
    min-height: 100vh;
    background-color: var(--vf-bg-color);
    color: var(--vf-text-color);
}

body {
    background-color: var(--vf-bg-color);
    color: var(--vf-text-color);
}

.vf-home__section {
    margin-bottom: 1.5rem;
}

.vf-home__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
}

.vf-home__grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.vf-home__card {
    padding: 1rem;
    border: 1px solid var(--vf-border-color);
    border-radius: 10px;
    background-color: var(--vf-bg-color);
}

.vf-home__stack {
    display: grid;
    gap: 0.5rem;
}

.vf-home__popover-content {
    padding: 0.75rem;
}

.vf-home__container-demo {
    flex-direction: column;
    border: 1px dashed var(--vf-border-color);
}

.vf-home__header-demo,
.vf-home__footer-demo {
    padding-left: 1rem;
    padding-right: 1rem;
}

.vf-home__content-demo {
    padding: 1rem;
}

.vf-home__layout-demo {
    margin-top: 0.5rem;
}

.vf-home .vf-layout {
    height: auto;
    min-height: 160px;
}

.vf-home__layout-demo_sidebar {
    margin-top: 0.75rem;
}

.vf-home__sidebar-demo {
    padding: 0.75rem;
    border: 1px dashed var(--vf-border-color);
}

.vf-home__text {
    margin: 0 0 0.5rem;
}

.vf-home__muted {
    margin: 0;
    color: var(--vf-secondary-text-color);
}
</style>
