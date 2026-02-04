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
                        <Link to="/">Router link</Link>
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
                    <h3>Textarea</h3>
                    <div class="vf-home__stack">
                        <Textarea v-model="bio" placeholder="Tell us about yourself" />
                        <Textarea v-model="notes" placeholder="Outlined note" variant="outlined" :rows="4" />
                        <Textarea v-model="feedback" placeholder="Small feedback" size="small" />
                    </div>
                </div>
                <div class="vf-home__card">
                    <h3>Select</h3>
                    <div class="vf-home__stack">
                        <Select v-model="role" :options="roles" placeholder="Role" />
                        <Select v-model="roleAlt" :options="roles" placeholder="Role (outlined)" variant="outlined" />
                    </div>
                </div>
                <div class="vf-home__card">
                    <h3>Autocomplete</h3>
                    <div class="vf-home__stack">
                        <Autocomplete v-model="country" :options="countries" placeholder="Find country" />
                        <Autocomplete
                            v-model="countryAlt"
                            :options="countries"
                            placeholder="Find country (outlined)"
                            variant="outlined"
                        />
                    </div>
                </div>
                <div class="vf-home__card">
                    <h3>Checkbox & Switch</h3>
                    <div class="vf-home__stack">
                        <Checkbox v-model="agreed">Agree to terms</Checkbox>
                        <Checkbox v-model="agreedAlt" variant="outlined">Agree (outlined)</Checkbox>
                        <Switch v-model="notifications">Notifications</Switch>
                    </div>
                </div>
                <div class="vf-home__card">
                    <h3>Radio</h3>
                    <div class="vf-home__stack">
                        <RadioGroup v-model="plan">
                            <RadioButton value="basic">Basic</RadioButton>
                            <RadioButton value="pro">Pro</RadioButton>
                            <RadioButton value="team" disabled>Team (disabled)</RadioButton>
                        </RadioGroup>
                        <RadioGroup v-model="layout" direction="horizontal" variant="outlined">
                            <RadioButton value="grid">Grid</RadioButton>
                            <RadioButton value="list">List</RadioButton>
                        </RadioGroup>
                    </div>
                </div>
                <div class="vf-home__card">
                    <h3>Tabs</h3>
                    <Tabs v-model="tab">
                        <template #tabs>
                            <Tab value="overview">Overview</Tab>
                            <Tab value="team">Team</Tab>
                            <Tab value="billing" disabled>Billing</Tab>
                        </template>
                        <template #panels>
                            <TabPanel value="overview">
                                <div class="vf-home__panel">Overview content</div>
                            </TabPanel>
                            <TabPanel value="team">
                                <div class="vf-home__panel">Team content</div>
                            </TabPanel>
                            <TabPanel value="billing">
                                <div class="vf-home__panel">Billing content</div>
                            </TabPanel>
                        </template>
                    </Tabs>
                </div>
                <div class="vf-home__card">
                    <h3>Toast</h3>
                    <div class="vf-home__stack">
                        <Button label="Show Toast" @click="toastOpen = true" />
                    </div>
                    <ToastContainer position="top-right">
                        <Toast
                            v-model="toastOpen"
                            title="Saved"
                            message="Changes are saved."
                            severity="success"
                            :duration="2500"
                        />
                    </ToastContainer>
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
                    <h3>Modal</h3>
                    <Button label="Open Modal" @click="modalOpen = true" />
                    <Modal v-model="modalOpen" title="Modal title">
                        <template #body>
                            <p class="vf-home__modal-text">Modal content with any layout.</p>
                        </template>
                        <template #footer>
                            <Button label="Cancel" severity="secondary" @click="modalOpen = false" />
                            <Button label="Confirm" @click="modalOpen = false" />
                        </template>
                    </Modal>
                </div>
                <div class="vf-home__card">
                    <h3>Menu</h3>
                    <Menu :items="menuItems" />
                </div>
                <div class="vf-home__card">
                    <h3>Tooltip</h3>
                    <Tooltip text="Helpful hint" arrow>
                        <Button label="Hover me" />
                    </Tooltip>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
    Button,
    Card,
    Checkbox,
    DefaultTheme,
    Input,
    Textarea,
    Link,
    Menu,
    Modal,
    Popover,
    RadioButton,
    RadioGroup,
    Tab,
    TabPanel,
    Tabs,
    Toast,
    ToastContainer,
    Select,
    Autocomplete,
    Switch,
    Tooltip,
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
const bio = ref('');
const notes = ref('');
const feedback = ref('');
const role = ref('');
const roleAlt = ref('');
const country = ref('');
const countryAlt = ref('');
const agreed = ref(false);
const agreedAlt = ref(false);
const notifications = ref(true);
const plan = ref('basic');
const layout = ref('grid');
const tab = ref('overview');
const toastOpen = ref(false);
const modalOpen = ref(false);
const isDark = ref(document.documentElement.getAttribute('data-theme') === 'dark');
const roles = [
    { label: 'Developer', value: 'dev' },
    { label: 'Designer', value: 'design' },
    { label: 'Product', value: 'product' },
];
const countries = [
    { label: 'United States', value: 'us' },
    { label: 'Germany', value: 'de' },
    { label: 'Japan', value: 'jp' },
];
const menuItems = [{ label: 'Home', to: '/' }, { separator: true }, { label: 'Docs', href: 'https://example.com' }];
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

.vf-home__modal-text {
    margin: 0;
}

.vf-home__panel {
    padding: 0.5rem 0;
}

.vf-home__text {
    margin: 0 0 0.5rem;
}

.vf-home__muted {
    margin: 0;
    color: var(--vf-secondary-text-color);
}
</style>
