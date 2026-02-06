<template>
    <div class="vf-home">
        <h1>Examples</h1>
        <section id="components" class="vf-home__section">
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
                    <h3>Breadcrumbs</h3>
                    <Breadcrumbs :items="breadcrumbItems" />
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
                    <h3>NumberInput</h3>
                    <div class="vf-home__stack">
                        <NumberInput v-model="quantity" :min="0" :max="20" :step="1" />
                        <NumberInput v-model="price" :min="0" :max="999" :step="0.5" :precision="2" variant="outlined" />
                    </div>
                </div>
                <div class="vf-home__card">
                    <h3>FormField</h3>
                    <div class="vf-home__stack">
                        <FormField label="Email" hint="We never share it">
                            <template #default="{ id, describedBy }">
                                <Input
                                    :id="id"
                                    v-model="emailField"
                                    placeholder="name@example.com"
                                    :aria-describedby="describedBy"
                                />
                            </template>
                        </FormField>
                        <FormField label="Username" :error="usernameError" required>
                            <template #default="{ id, describedBy }">
                                <Input :id="id" v-model="username" placeholder="Username" :aria-describedby="describedBy" />
                            </template>
                        </FormField>
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
                    <h3>MultiSelect</h3>
                    <div class="vf-home__stack">
                        <MultiSelect v-model="countriesMulti" :options="countries" placeholder="Select countries" clearable />
                        <MultiSelect
                            v-model="countriesMulti"
                            :options="countries"
                            placeholder="Select countries (outlined)"
                            variant="outlined"
                            filter
                        />
                    </div>
                </div>
                <div class="vf-home__card">
                    <h3>DatePicker</h3>
                    <div class="vf-home__stack">
                        <DatePicker v-model="dueDate" placeholder="Pick a date" />
                        <DatePicker
                            v-model="dueDateAlt"
                            placeholder="Pick a date (outlined)"
                            variant="outlined"
                            min="2026-01-10"
                            max="2026-12-31"
                        />
                    </div>
                </div>
                <div class="vf-home__card">
                    <h3>Pagination</h3>
                    <div class="vf-home__stack">
                        <Pagination v-model="page" :total-items="240" :page-size="20" :sibling-count="0" size="small" />
                        <Pagination
                            v-model="page"
                            :total-pages="24"
                            :sibling-count="0"
                            variant="outlined"
                            size="small"
                        />
                    </div>
                </div>
                <div class="vf-home__card">
                    <h3>DataTable</h3>
                    <DataTable :columns="tableColumns" :rows="tableRows" row-key="id" sortable striped size="small" />
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
                    <h3>Accordion</h3>
                    <Accordion v-model="accordion">
                        <AccordionItem value="shipping" title="Shipping">
                            Free delivery within 3-5 business days.
                        </AccordionItem>
                        <AccordionItem value="returns" title="Returns">
                            Return items within 30 days of purchase.
                        </AccordionItem>
                    </Accordion>
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
                    <h3>Alert</h3>
                    <div class="vf-home__stack">
                        <Button label="Show Alert" size="small" @click="alertOpen = true" />
                        <Alert
                            v-model="alertOpen"
                            title="Unsaved changes"
                            severity="warn"
                            closable
                            message="You have unsaved form changes."
                        >
                            <template #actions>
                                <Button label="Save" size="small" />
                            </template>
                        </Alert>
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
                    <h3>Drawer</h3>
                    <Button label="Open Drawer" @click="drawerOpen = true" />
                    <Drawer v-model="drawerOpen" title="Quick filters" position="right">
                        <template #body>
                            <div class="vf-home__stack">
                                <Checkbox v-model="drawerNew">New only</Checkbox>
                                <Checkbox v-model="drawerPopular">Popular</Checkbox>
                                <Checkbox v-model="drawerFree">Free tier</Checkbox>
                            </div>
                        </template>
                        <template #footer>
                            <Button label="Reset" severity="secondary" size="small" @click="resetDrawer" />
                            <Button label="Apply" size="small" @click="drawerOpen = false" />
                        </template>
                    </Drawer>
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
                <div class="vf-home__card">
                    <h3>Skeleton</h3>
                    <div class="vf-home__stack">
                        <Skeleton width="180px" height="12px" />
                        <Skeleton width="140px" height="12px" />
                        <Skeleton variant="circle" width="40px" />
                    </div>
                </div>
                <div class="vf-home__card">
                    <h3>Badge</h3>
                    <div class="vf-home__stack-inline">
                        <Badge label="Beta" />
                        <Badge severity="info" variant="soft">Info</Badge>
                        <Badge severity="success" variant="outline">Active</Badge>
                        <Badge severity="danger" variant="solid">Blocked</Badge>
                    </div>
                </div>
                <div class="vf-home__card">
                    <h3>Chip</h3>
                    <div class="vf-home__stack-inline">
                        <Chip label="New" />
                        <Chip severity="info" variant="soft" closable>Info</Chip>
                        <Chip severity="success" variant="outline" closable>Active</Chip>
                        <Chip severity="danger" variant="solid" closable>Blocked</Chip>
                    </div>
                </div>
                <div class="vf-home__card">
                    <h3>Avatar</h3>
                    <div class="vf-home__stack-inline">
                        <Avatar name="Ada Lovelace" />
                        <Avatar name="Grace Hopper" status="online" />
                        <Avatar name="Alan Turing" size="large" status="away" />
                    </div>
                </div>
                <div class="vf-home__card">
                    <h3>Progress</h3>
                    <div class="vf-home__stack">
                        <Progress :value="42" />
                        <Progress :value="72" severity="success" show-value />
                        <Progress variant="circular" :value="64" size="small" />
                        <Progress variant="linear" />
                    </div>
                </div>
                <div class="vf-home__card">
                    <h3>Slider</h3>
                    <div class="vf-home__stack">
                        <Slider v-model="volume" :min="0" :max="100" :step="5" show-value />
                        <Slider v-model="priceRange" :min="0" :max="1000" :step="25" range />
                        <Slider v-model="rating" :min="1" :max="5" :step="1" :marks="ratingMarks" show-value />
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
    Alert,
    Accordion,
    AccordionItem,
    Button,
    Card,
    Checkbox,
    Breadcrumbs,
    DefaultTheme,
    FormField,
    Input,
    NumberInput,
    Textarea,
    Link,
    Menu,
    Modal,
    Drawer,
    Popover,
    DatePicker,
    Pagination,
    DataTable,
    MultiSelect,
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
    Skeleton,
    Badge,
    Chip,
    Avatar,
    Progress,
    Slider,
    setTheme,
    updateTheme,
} from '@/index';
import type { DataTableColumn } from '@/index';

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
const quantity = ref(2);
const price = ref<number | null>(49.99);
const emailField = ref('');
const username = ref('');
const usernameError = ref('Username is required');
const bio = ref('');
const notes = ref('');
const feedback = ref('');
const role = ref('');
const roleAlt = ref('');
const country = ref('');
const countryAlt = ref('');
const countriesMulti = ref<Array<string | number>>([]);
const dueDate = ref('');
const dueDateAlt = ref('');
const page = ref(6);
const agreed = ref(false);
const agreedAlt = ref(false);
const notifications = ref(true);
const plan = ref('basic');
const layout = ref('grid');
const tab = ref('overview');
const accordion = ref('shipping');
const toastOpen = ref(false);
const alertOpen = ref(true);
const modalOpen = ref(false);
const drawerOpen = ref(false);
const drawerNew = ref(true);
const drawerPopular = ref(false);
const drawerFree = ref(false);
const isDark = ref(document.documentElement.getAttribute('data-theme') === 'dark');
const volume = ref(40);
const priceRange = ref<[number, number]>([200, 700]);
const rating = ref(3);
const ratingMarks = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
];
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
const tableColumns: DataTableColumn[] = [
    { field: 'name', header: 'Name', sortable: true },
    { field: 'role', header: 'Role' },
    { field: 'age', header: 'Age', align: 'right', sortable: true },
];
const tableRows = [
    { id: 1, name: 'Alice', role: 'Developer', age: 29 },
    { id: 2, name: 'Bob', role: 'Designer', age: 34 },
    { id: 3, name: 'Chen', role: 'Product', age: 31 },
];
const menuItems = [{ label: 'Home', to: '/' }, { separator: true }, { label: 'Docs', href: 'https://example.com' }];
const breadcrumbItems = [
    { label: 'Home', to: '/' },
    { label: 'Components', href: '#components' },
    { label: 'Breadcrumbs', active: true },
];
const resetDrawer = () => {
    drawerNew.value = true;
    drawerPopular.value = false;
    drawerFree.value = false;
};
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

.vf-home__stack-inline {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
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
