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
                        <Input v-model="searchText" placeholder="Search" variant="outlined">
                            <template #prefix>🔎</template>
                        </Input>
                    </div>
                </div>
                <div class="vf-home__card">
                    <h3>InputGroup</h3>
                    <div class="vf-home__stack">
                        <InputGroup>
                            <InputAddon>$</InputAddon>
                            <NumberInput v-model="priceGroup" :min="0" :step="0.5" />
                            <InputAddon>.00</InputAddon>
                        </InputGroup>
                        <InputGroup variant="outlined">
                            <InputAddon>https://</InputAddon>
                            <Input v-model="website" placeholder="your-domain" variant="outlined" />
                            <InputAddon>.com</InputAddon>
                        </InputGroup>
                    </div>
                </div>
                <div class="vf-home__card">
                    <h3>InlineEdit</h3>
                    <div class="vf-home__stack">
                        <InlineEdit v-model="inlineName" placeholder="No name" />
                        <InlineEdit v-model="inlineBudget" type="number" variant="outlined" />
                        <p class="vf-home__muted">Name: {{ inlineName || 'empty' }}</p>
                        <p class="vf-home__muted">Budget: {{ inlineBudget ?? 'empty' }}</p>
                    </div>
                </div>
                <div class="vf-home__card">
                    <h3>SearchInput</h3>
                    <div class="vf-home__stack">
                        <SearchInput
                            v-model="searchQuery"
                            placeholder="Search components"
                            clearable
                            :debounce="250"
                            @search="onSearchInputSearch"
                            @clear="onSearchInputClear"
                        />
                        <p class="vf-home__muted">Local filter query: {{ localSearchQuery || 'empty' }}</p>
                        <ul v-if="localFilteredComponents.length" class="vf-home__search-list">
                            <li v-for="item in localFilteredComponents" :key="item">{{ item }}</li>
                        </ul>
                        <p v-else class="vf-home__muted">No local matches</p>
                        <SearchInput
                            v-model="searchQueryAlt"
                            placeholder="Server search (outlined)"
                            variant="outlined"
                            clearable
                            :debounce="250"
                            :loading="serverSearchLoading"
                            @search="onSearchInputAltSearch"
                            @clear="onSearchInputAltClear"
                        />
                        <p class="vf-home__muted">
                            {{
                                serverSearchLoading
                                    ? 'Searching on server...'
                                    : `Server returned ${serverResults.length} items`
                            }}
                        </p>
                        <ul v-if="serverResults.length" class="vf-home__search-list">
                            <li v-for="item in serverResults" :key="item">{{ item }}</li>
                        </ul>
                        <p v-else class="vf-home__muted">No server matches</p>
                    </div>
                </div>
                <div class="vf-home__card">
                    <h3>MentionInput</h3>
                    <div class="vf-home__stack">
                        <p class="vf-home__muted">Use in comments: mention teammates with @ and topics with #.</p>
                        <p class="vf-home__muted">Try typing: @al, @ki, #fr, #re</p>
                        <MentionInput
                            v-model="mentionText"
                            placeholder="Write a comment..."
                            :suggestions="mentionSuggestions"
                            :loading="mentionLoading"
                            @search="onMentionSearch"
                            @insert="onMentionInsert"
                        />
                        <MentionInput
                            v-model="mentionTextAlt"
                            placeholder="Second field (outlined)"
                            variant="outlined"
                            size="small"
                            :suggestions="mentionSuggestions"
                            :loading="mentionLoading"
                            @search="onMentionSearch"
                        />
                        <p class="vf-home__muted">Text: {{ mentionText || 'empty' }}</p>
                        <p class="vf-home__muted">Mentions: {{ extractedMentions.join(', ') || 'none' }}</p>
                        <p class="vf-home__muted">Tags: {{ extractedTags.join(', ') || 'none' }}</p>
                        <p class="vf-home__muted">Last insert: {{ lastMentionInsert || 'none' }}</p>
                    </div>
                </div>
                <div class="vf-home__card">
                    <h3>PasswordInput</h3>
                    <div class="vf-home__stack">
                        <PasswordInput v-model="password" placeholder="Password" show-strength />
                        <PasswordInput
                            v-model="passwordOutlined"
                            placeholder="Password (outlined)"
                            variant="outlined"
                            show-caps-lock-hint
                        />
                    </div>
                </div>
                <div class="vf-home__card">
                    <h3>OtpInput</h3>
                    <div class="vf-home__stack">
                        <OtpInput v-model="otpCode" :length="6" />
                        <OtpInput v-model="otpAlphanumeric" :length="6" alphanumeric variant="outlined" />
                    </div>
                </div>
                <div class="vf-home__card">
                    <h3>ColorPicker</h3>
                    <div class="vf-home__stack">
                        <ColorPicker v-model="brandColor" :presets="brandPresets" />
                        <ColorPicker v-model="brandColorAlpha" alpha format="rgb" variant="outlined" />
                    </div>
                </div>
                <div class="vf-home__card">
                    <h3>MaskedInput</h3>
                    <div class="vf-home__stack">
                        <MaskedInput v-model="phoneMasked" mask="+7 (###) ###-##-##" placeholder="+7 (___) ___-__-__" />
                        <MaskedInput
                            v-model="licenseRaw"
                            mask="AA-####"
                            unmask
                            placeholder="AA-0000"
                            variant="outlined"
                        />
                    </div>
                </div>
                <div class="vf-home__card">
                    <h3>NumberInput</h3>
                    <div class="vf-home__stack">
                        <NumberInput v-model="quantity" :min="0" :max="20" :step="1" />
                        <NumberInput
                            v-model="price"
                            :min="0"
                            :max="999"
                            :step="0.5"
                            :precision="2"
                            variant="outlined"
                        />
                    </div>
                </div>
                <div class="vf-home__card">
                    <h3>Form</h3>
                    <Form
                        v-model="demoFormValues"
                        :validate="validateDemoForm"
                        validate-on="blur"
                        @submit="onDemoFormSubmit"
                    >
                        <template #default="{ values, errors, touched, isSubmitting, setFieldValue, setFieldTouched }">
                            <div class="vf-home__stack">
                                <FormField
                                    label="Email"
                                    :error="touched.email ? errors.email : ''"
                                    hint="Required. Example: name@example.com"
                                >
                                    <template #default>
                                        <Input
                                            :model-value="String(values.email ?? '')"
                                            placeholder="name@example.com"
                                            @update:model-value="
                                                value => {
                                                    setFieldValue('email', value, { emitChange: false });
                                                }
                                            "
                                            @blur="
                                                () => {
                                                    setFieldTouched('email', true);
                                                }
                                            "
                                        />
                                    </template>
                                </FormField>
                                <FormField
                                    label="Password"
                                    :error="touched.password ? errors.password : ''"
                                    hint="At least 8 characters"
                                >
                                    <template #default>
                                        <PasswordInput
                                            :model-value="String(values.password ?? '')"
                                            show-strength
                                            @update:model-value="
                                                value => {
                                                    setFieldValue('password', value, { emitChange: false });
                                                }
                                            "
                                            @blur="
                                                () => {
                                                    setFieldTouched('password', true);
                                                }
                                            "
                                        />
                                    </template>
                                </FormField>
                                <Button type="submit" label="Submit form" :loading="isSubmitting" />
                                <p class="vf-home__muted">Last submit: {{ demoFormSubmitState }}</p>
                            </div>
                        </template>
                    </Form>
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
                                <Input
                                    :id="id"
                                    v-model="username"
                                    placeholder="Username"
                                    :aria-describedby="describedBy"
                                />
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
                    <h3>FileUpload</h3>
                    <div class="vf-home__stack">
                        <FileUpload v-model="resume" accept=".pdf,.doc,.docx" />
                        <FileUpload v-model="attachments" multiple :max-files="3" :max-size="5_000_000" />
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
                        <p class="vf-home__muted">Free text is allowed: input can differ from selected value.</p>
                        <Autocomplete
                            v-model="country"
                            :options="countries"
                            placeholder="Find country"
                            @search="onAutocompleteSearch"
                        />
                        <Autocomplete
                            v-model="countryAlt"
                            :options="countries"
                            placeholder="Find country (outlined)"
                            variant="outlined"
                            @search="onAutocompleteAltSearch"
                        />
                        <p class="vf-home__muted">Selected #1: {{ country || 'none' }}</p>
                        <p class="vf-home__muted">Typed #1: {{ autocompleteQuery || 'empty' }}</p>
                        <p class="vf-home__muted">Selected #2: {{ countryAlt || 'none' }}</p>
                        <p class="vf-home__muted">Typed #2: {{ autocompleteAltQuery || 'empty' }}</p>
                    </div>
                </div>
                <div class="vf-home__card">
                    <h3>Combobox</h3>
                    <div class="vf-home__stack">
                        <p class="vf-home__muted">
                            Strict mode: type random text and blur, query resets to selected option label.
                        </p>
                        <Combobox
                            v-model="countryCombo"
                            v-model:input-value="countryComboQuery"
                            :options="countries"
                            placeholder="Pick country"
                            clearable
                        />
                        <Combobox
                            v-model="countryComboCustom"
                            v-model:input-value="countryComboCustomQuery"
                            :options="countries"
                            placeholder="Allow custom value"
                            variant="outlined"
                            :strict="false"
                            allow-create
                            @create="onComboboxCreate"
                        />
                        <p class="vf-home__muted">Selected: {{ countryCombo || 'none' }}</p>
                        <p class="vf-home__muted">Query: {{ countryComboQuery || 'empty' }}</p>
                        <p class="vf-home__muted">Custom selected: {{ countryComboCustom || 'none' }}</p>
                        <p class="vf-home__muted">Custom query: {{ countryComboCustomQuery || 'empty' }}</p>
                        <p class="vf-home__muted">Last created: {{ comboLastCreated || 'none' }}</p>
                    </div>
                </div>
                <div class="vf-home__card">
                    <h3>MultiSelect</h3>
                    <div class="vf-home__stack">
                        <MultiSelect
                            v-model="countriesMulti"
                            :options="countries"
                            placeholder="Select countries"
                            clearable
                        />
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
                    <h3>TagInput</h3>
                    <div class="vf-home__stack">
                        <TagInput v-model="skills" :options="skillOptions" placeholder="Add skills" clearable />
                        <TagInput
                            v-model="skillsOutlined"
                            :options="skillOptions"
                            placeholder="Add skills (outlined)"
                            variant="outlined"
                            :max-tags="5"
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
                    <h3>Calendar</h3>
                    <div class="vf-home__stack">
                        <Calendar v-model="calendarDate" min="2026-01-10" max="2026-12-31" />
                        <Calendar
                            v-model="calendarDateAlt"
                            variant="outlined"
                            size="small"
                            :first-day-of-week="1"
                            min="2026-01-10"
                            max="2026-12-31"
                        />
                        <p class="vf-home__muted">Selected: {{ calendarDate || 'none' }}</p>
                    </div>
                </div>
                <div class="vf-home__card">
                    <h3>DateRangePicker</h3>
                    <div class="vf-home__stack">
                        <DateRangePicker v-model="dateRange" placeholder="Pick a range" />
                        <DateRangePicker
                            v-model="dateRangeAlt"
                            placeholder="Pick a range (outlined)"
                            variant="outlined"
                            min="2026-01-10"
                            max="2026-12-31"
                        />
                    </div>
                </div>
                <div class="vf-home__card">
                    <h3>TimePicker</h3>
                    <div class="vf-home__stack">
                        <TimePicker v-model="meetingTime" placeholder="Pick time" />
                        <TimePicker
                            v-model="meetingTimeAlt"
                            placeholder="Pick time (outlined)"
                            variant="outlined"
                            min="09:00"
                            max="18:00"
                            :step="15"
                            format="12h"
                        />
                    </div>
                </div>
                <div class="vf-home__card">
                    <h3>DateTimePicker</h3>
                    <div class="vf-home__stack">
                        <DateTimePicker v-model="meetingDateTime" placeholder="Pick date and time" />
                        <DateTimePicker
                            v-model="meetingDateTimeAlt"
                            placeholder="Pick date and time (outlined)"
                            variant="outlined"
                            min="2026-01-10T09:00"
                            max="2026-12-31T18:00"
                            :minute-step="15"
                            format="12h"
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
                    <h3>SegmentedControl</h3>
                    <div class="vf-home__stack">
                        <SegmentedControl v-model="segmentView" :options="segmentOptions" />
                        <SegmentedControl
                            v-model="segmentViewAlt"
                            :options="segmentOptions"
                            variant="outlined"
                            size="small"
                        />
                        <p class="vf-home__muted">Selected: {{ segmentView }}</p>
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
                    <h3>Stepper</h3>
                    <div class="vf-home__stack">
                        <Stepper v-model="step" :steps="stepperSteps" clickable />
                        <Stepper v-model="step" :steps="stepperSteps" orientation="vertical" size="small" clickable />
                    </div>
                </div>
                <div class="vf-home__card">
                    <h3>Timeline</h3>
                    <div class="vf-home__stack">
                        <Timeline :items="timelineEvents" />
                        <Timeline :items="timelineEvents" orientation="horizontal" size="small" />
                    </div>
                </div>
                <div class="vf-home__card">
                    <h3>Rating</h3>
                    <div class="vf-home__stack">
                        <Rating v-model="ratingValue" />
                        <Rating v-model="ratingHalf" allow-half size="large" />
                    </div>
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
                    <h3>Tree</h3>
                    <Tree v-model="treeSelected" v-model:expanded-keys="treeExpanded" :items="treeItems" size="small" />
                </div>
                <div class="vf-home__card">
                    <h3>TreeSelect</h3>
                    <div class="vf-home__stack">
                        <TreeSelect
                            v-model="treeSelectValue"
                            v-model:expanded-keys="treeSelectExpanded"
                            :items="treeItems"
                            placeholder="Select docs section"
                            clearable
                            size="small"
                        />
                        <TreeSelect
                            v-model="treeSelectMany"
                            :items="treeItems"
                            multiple
                            placeholder="Select multiple nodes"
                            variant="outlined"
                            clearable
                            size="small"
                        />
                    </div>
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
                    <h3>EmptyState</h3>
                    <div class="vf-home__stack">
                        <EmptyState
                            title="No projects yet"
                            description="Create your first project or import existing data."
                            icon="📂"
                        >
                            <template #actions>
                                <Button label="Create project" size="small" />
                                <Button label="Import" size="small" severity="secondary" />
                            </template>
                        </EmptyState>
                        <EmptyState
                            variant="outlined"
                            size="small"
                            title="No search results"
                            description="Try another query."
                            icon="🔎"
                        />
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
                    <h3>ConfirmDialog</h3>
                    <Button label="Delete item" severity="danger" @click="confirmDialogOpen = true" />
                    <ConfirmDialog
                        v-model="confirmDialogOpen"
                        title="Delete item?"
                        message="This action cannot be undone."
                        confirm-label="Delete"
                        @confirm="confirmDialogAccepted = true"
                    />
                    <p v-if="confirmDialogAccepted" class="vf-home__muted">Last action: confirmed</p>
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
                    <h3>Dropdown</h3>
                    <Dropdown :items="menuItems">
                        <template #trigger>
                            <Button label="Actions" />
                        </template>
                    </Dropdown>
                </div>
                <div class="vf-home__card">
                    <h3>SplitButton</h3>
                    <div class="vf-home__stack">
                        <SplitButton label="Save" :items="splitButtonItems" @click="splitButtonAction = 'save'" />
                        <p class="vf-home__muted">Last action: {{ splitButtonAction || 'none' }}</p>
                    </div>
                </div>
                <div class="vf-home__card">
                    <h3>ContextMenu</h3>
                    <ContextMenu :items="contextMenuItems">
                        <div class="vf-home__context-target">Right-click here</div>
                    </ContextMenu>
                    <p class="vf-home__muted">Last action: {{ contextMenuAction || 'none' }}</p>
                </div>
                <div class="vf-home__card">
                    <h3>CommandPalette</h3>
                    <div class="vf-home__stack">
                        <Button label="Open Command Palette" @click="commandPaletteOpen = true" />
                        <p class="vf-home__muted">Shortcut: Ctrl/Cmd + K</p>
                        <p class="vf-home__muted">Last action: {{ commandPaletteAction || 'none' }}</p>
                    </div>
                    <CommandPalette
                        v-model="commandPaletteOpen"
                        :items="commandPaletteItems"
                        @select="onCommandPaletteSelect"
                    />
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
                    <h3>FilterChips</h3>
                    <div class="vf-home__stack">
                        <FilterChips v-model="activeFilters" :options="filterOptions" clearable />
                        <FilterChips
                            v-model="activeStatus"
                            :options="statusOptions"
                            :multiple="false"
                            variant="outline"
                            size="small"
                            clearable
                        />
                        <p class="vf-home__muted">Multi: {{ activeFilters.join(', ') || 'none' }}</p>
                        <p class="vf-home__muted">Single: {{ activeStatus || 'none' }}</p>
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
                <div class="vf-home__card">
                    <h3>VirtualScroller</h3>
                    <VirtualScroller :items="virtualItems" :item-height="40" height="220px" :overscan="5">
                        <template #default="{ item, index }">
                            <span>{{ index + 1 }}. {{ String(item) }}</span>
                        </template>
                    </VirtualScroller>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import {
    Alert,
    Accordion,
    AccordionItem,
    Button,
    Card,
    Checkbox,
    SegmentedControl,
    Breadcrumbs,
    DefaultTheme,
    Form,
    FormField,
    Input,
    InputAddon,
    InputGroup,
    InlineEdit,
    SearchInput,
    MentionInput,
    PasswordInput,
    OtpInput,
    ColorPicker,
    MaskedInput,
    NumberInput,
    Textarea,
    FileUpload,
    Link,
    Menu,
    Modal,
    ConfirmDialog,
    Drawer,
    Popover,
    Dropdown,
    SplitButton,
    ContextMenu,
    CommandPalette,
    DatePicker,
    Calendar,
    DateRangePicker,
    TimePicker,
    DateTimePicker,
    Pagination,
    DataTable,
    EmptyState,
    MultiSelect,
    TagInput,
    RadioButton,
    RadioGroup,
    Tab,
    TabPanel,
    Tabs,
    Toast,
    ToastContainer,
    Select,
    Autocomplete,
    Combobox,
    Switch,
    Tooltip,
    Skeleton,
    Badge,
    Chip,
    FilterChips,
    Avatar,
    Progress,
    Slider,
    Stepper,
    Timeline,
    Rating,
    Tree,
    TreeSelect,
    VirtualScroller,
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
const website = ref('vueforge');
const priceGroup = ref<number | null>(49.9);
const inlineName = ref('Project Apollo');
const inlineBudget = ref<number | null>(2500);
const searchText = ref('');
const searchQuery = ref('');
const searchQueryAlt = ref('');
const mentionText = ref('Please ask @alice to sync this with #frontend team.');
const mentionTextAlt = ref('');
const lastMentionInsert = ref('');
const mentionLoading = ref(false);
const localSearchQuery = ref('');
const serverSearchLoading = ref(false);
const serverResults = ref<Array<string>>([]);
const password = ref('Secret123!');
const passwordOutlined = ref('');
const otpCode = ref('');
const otpAlphanumeric = ref('');
const brandColor = ref('#2b6cb0');
const brandColorAlpha = ref('rgba(43, 108, 176, 0.85)');
const phoneMasked = ref('');
const licenseRaw = ref('');
const quantity = ref(2);
const price = ref<number | null>(49.99);
const demoFormValues = ref<{ email: string; password: string }>({
    email: '',
    password: '',
});
const demoFormSubmitState = ref('none');
const emailField = ref('');
const username = ref('');
const usernameError = ref('Username is required');
const bio = ref('');
const notes = ref('');
const feedback = ref('');
const resume = ref<File | null>(null);
const attachments = ref<File[]>([]);
const role = ref('');
const roleAlt = ref('');
const country = ref('');
const countryAlt = ref('');
const autocompleteQuery = ref('');
const autocompleteAltQuery = ref('');
const countryCombo = ref<string | number | undefined>('de');
const countryComboQuery = ref('Germany');
const countryComboCustom = ref<string | number | undefined>(undefined);
const countryComboCustomQuery = ref('');
const comboLastCreated = ref('');
const countriesMulti = ref<Array<string | number>>([]);
const skills = ref<Array<string | number>>(['vue', 'ts']);
const skillsOutlined = ref<Array<string | number>>([]);
const dueDate = ref('');
const dueDateAlt = ref('');
const calendarDate = ref('2026-02-12');
const calendarDateAlt = ref('2026-02-20');
const dateRange = ref<[string | null, string | null] | null>([null, null]);
const dateRangeAlt = ref<[string | null, string | null] | null>([null, null]);
const meetingTime = ref('');
const meetingTimeAlt = ref('');
const meetingDateTime = ref('');
const meetingDateTimeAlt = ref('');
const page = ref(6);
const agreed = ref(false);
const agreedAlt = ref(false);
const notifications = ref(true);
const segmentView = ref<'list' | 'grid' | 'board'>('list');
const segmentViewAlt = ref<'list' | 'grid' | 'board'>('grid');
const activeFilters = ref<Array<string | number>>(['open']);
const activeStatus = ref<string | number | null>('all');
const plan = ref('basic');
const layout = ref('grid');
const tab = ref('overview');
const step = ref(1);
const accordion = ref('shipping');
const toastOpen = ref(false);
const alertOpen = ref(true);
const modalOpen = ref(false);
const confirmDialogOpen = ref(false);
const confirmDialogAccepted = ref(false);
const drawerOpen = ref(false);
const drawerNew = ref(true);
const drawerPopular = ref(false);
const drawerFree = ref(false);
const isDark = ref(document.documentElement.getAttribute('data-theme') === 'dark');
const volume = ref(40);
const priceRange = ref<[number, number]>([200, 700]);
const rating = ref(3);
const ratingValue = ref(4);
const ratingHalf = ref(3.5);
const treeSelected = ref<string | number | undefined>('guides');
const treeExpanded = ref<Array<string | number>>(['docs']);
const treeSelectValue = ref<string | number | undefined>('api');
const treeSelectExpanded = ref<Array<string | number>>(['docs']);
const treeSelectMany = ref<Array<string | number>>(['guides']);
const contextMenuAction = ref('');
const splitButtonAction = ref('');
const commandPaletteOpen = ref(false);
const commandPaletteAction = ref('');
const ratingMarks = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
];
const stepperSteps = [
    { label: 'Account', description: 'Create a profile' },
    { label: 'Plan', description: 'Select a plan' },
    { label: 'Confirm', description: 'Review details' },
];
const timelineEvents = [
    { title: 'Created', description: 'Issue was created', date: '2026-02-17', status: 'info' as const },
    { title: 'In progress', description: 'Developer started work', date: '2026-02-18', status: 'warn' as const },
    { title: 'Done', description: 'Issue closed', date: '2026-02-19', status: 'success' as const },
];
const roles = [
    { label: 'Developer', value: 'dev' },
    { label: 'Designer', value: 'design' },
    { label: 'Product', value: 'product' },
];
const segmentOptions = [
    { label: 'List', value: 'list' },
    { label: 'Grid', value: 'grid' },
    { label: 'Board', value: 'board' },
];
const mentionSuggestions = ref([
    { label: 'alice', value: 'alice', trigger: '@' },
    { label: 'alex', value: 'alex', trigger: '@' },
    { label: 'kirill', value: 'kirill', trigger: '@' },
    { label: 'backend', value: 'backend', trigger: '#' },
    { label: 'frontend', value: 'frontend', trigger: '#' },
    { label: 'release', value: 'release', trigger: '#' },
]);
const mentionUsersDirectory = ['alice', 'alex', 'kirill', 'marina', 'nikita'];
const mentionTopicsDirectory = ['frontend', 'backend', 'release', 'hotfix', 'qa'];
const filterOptions = [
    { label: 'Open', value: 'open', count: 12 },
    { label: 'In progress', value: 'progress', count: 7 },
    { label: 'Blocked', value: 'blocked', count: 2 },
    { label: 'Done', value: 'done', count: 18 },
];
const statusOptions = [
    { label: 'All', value: 'all' },
    { label: 'Unread', value: 'unread', count: 5 },
    { label: 'Archived', value: 'archived' },
];
const countries = [
    { label: 'United States', value: 'us' },
    { label: 'Germany', value: 'de' },
    { label: 'Japan', value: 'jp' },
];
const skillOptions = [
    { label: 'Vue', value: 'vue' },
    { label: 'TypeScript', value: 'ts' },
    { label: 'Vite', value: 'vite' },
    { label: 'Vitest', value: 'vitest' },
    { label: 'ESLint', value: 'eslint' },
];
const brandPresets = ['#2b6cb0', '#0cbc87', '#d6293e', '#f7c32e', '#6f42c1'];
const searchCatalog = [
    'Button',
    'Input',
    'InputGroup',
    'EmptyState',
    'InlineEdit',
    'SearchInput',
    'MentionInput',
    'PasswordInput',
    'OtpInput',
    'ColorPicker',
    'MaskedInput',
    'DatePicker',
    'Calendar',
    'DateRangePicker',
    'DateTimePicker',
    'TimePicker',
    'SegmentedControl',
    'FilterChips',
    'DataTable',
    'TreeSelect',
    'CommandPalette',
];
const serverCatalog = [
    'Documentation',
    'Getting Started',
    'Theming Guide',
    'Components API',
    'Date & Time',
    'Forms',
    'Overlays',
    'Changelog',
    'Roadmap',
];
const localFilteredComponents = computed(() => {
    const query = localSearchQuery.value.trim().toLowerCase();

    if (!query) {
        return searchCatalog.slice(0, 6);
    }

    return searchCatalog.filter(item => item.toLowerCase().includes(query));
});
const extractedMentions = computed(() => {
    const matches = mentionText.value.match(/@([\w-]+)/g) ?? [];

    return Array.from(new Set(matches.map(item => item.slice(1))));
});
const extractedTags = computed(() => {
    const matches = mentionText.value.match(/#([\w-]+)/g) ?? [];

    return Array.from(new Set(matches.map(item => item.slice(1))));
});
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
const contextMenuItems = [
    { label: 'Copy', command: () => (contextMenuAction.value = 'copy') },
    { label: 'Rename', command: () => (contextMenuAction.value = 'rename') },
    { separator: true },
    { label: 'Delete', command: () => (contextMenuAction.value = 'delete') },
];
const splitButtonItems = [
    { label: 'Save as draft', command: () => (splitButtonAction.value = 'draft') },
    { label: 'Save and publish', command: () => (splitButtonAction.value = 'publish') },
];
const commandPaletteItems = [
    { label: 'Open docs', value: 'docs', group: 'Navigation', description: 'Go to documentation section' },
    { label: 'Open changelog', value: 'changelog', group: 'Navigation' },
    { label: 'Save as draft', value: 'draft', group: 'Actions', shortcut: 'Ctrl+S' },
    { label: 'Publish', value: 'publish', group: 'Actions', shortcut: 'Ctrl+Enter' },
];
const treeItems = [
    {
        key: 'docs',
        label: 'Documentation',
        children: [
            { key: 'guides', label: 'Guides' },
            { key: 'components', label: 'Components' },
            { key: 'api', label: 'API Reference' },
        ],
    },
    {
        key: 'resources',
        label: 'Resources',
        children: [
            { key: 'themes', label: 'Themes' },
            { key: 'changelog', label: 'Changelog' },
        ],
    },
];
const breadcrumbItems = [
    { label: 'Home', to: '/' },
    { label: 'Components', href: '#components' },
    { label: 'Breadcrumbs', active: true },
];
const virtualItems = Array.from(
    { length: 500 },
    (_value, index) => `Customer #${(index + 1).toString().padStart(3, '0')}`,
);
let searchAltTimer: ReturnType<typeof setTimeout> | null = null;
let mentionSearchTimer: ReturnType<typeof setTimeout> | null = null;

const onSearchInputSearch = (query: string) => {
    localSearchQuery.value = query;
};
const onSearchInputAltSearch = (query: string) => {
    if (searchAltTimer) {
        clearTimeout(searchAltTimer);
    }

    serverSearchLoading.value = true;
    searchAltTimer = setTimeout(() => {
        const normalized = query.trim().toLowerCase();

        serverResults.value = !normalized ? [] : serverCatalog.filter(item => item.toLowerCase().includes(normalized));
        serverSearchLoading.value = false;
        searchAltTimer = null;
    }, 450);
};
const onSearchInputClear = () => {
    localSearchQuery.value = '';
};
const onSearchInputAltClear = () => {
    if (searchAltTimer) {
        clearTimeout(searchAltTimer);
        searchAltTimer = null;
    }
    serverSearchLoading.value = false;
    serverResults.value = [];
};
const onAutocompleteSearch = (query: string) => {
    autocompleteQuery.value = query;
};
const onAutocompleteAltSearch = (query: string) => {
    autocompleteAltQuery.value = query;
};
const onComboboxCreate = (value: string) => {
    comboLastCreated.value = value;
};
const validateDemoForm = (values: { email?: string; password?: string }) => {
    const nextErrors: Record<string, string> = {};
    const email = String(values.email ?? '').trim();
    const password = String(values.password ?? '');

    if (!email) {
        nextErrors.email = 'Email is required';
    } else if (!/.+@.+\..+/.test(email)) {
        nextErrors.email = 'Invalid email format';
    }

    if (!password) {
        nextErrors.password = 'Password is required';
    } else if (password.length < 8) {
        nextErrors.password = 'Password must be at least 8 characters';
    }

    return nextErrors;
};
const onDemoFormSubmit = (values: { email?: string; password?: string }) => {
    demoFormSubmitState.value = JSON.stringify(values);
};
const onMentionSearch = (payload: { trigger?: string; query?: string }) => {
    if (mentionSearchTimer) {
        clearTimeout(mentionSearchTimer);
    }

    const trigger = payload.trigger ?? '@';
    const query = (payload.query ?? '').trim().toLowerCase();

    mentionLoading.value = true;
    mentionSearchTimer = setTimeout(() => {
        const source = trigger === '#' ? mentionTopicsDirectory : mentionUsersDirectory;
        const result = source
            .filter(item => item.toLowerCase().includes(query))
            .slice(0, 6)
            .map(item => ({
                label: item,
                value: item,
                trigger,
            }));

        mentionSuggestions.value = result;
        mentionLoading.value = false;
        mentionSearchTimer = null;
    }, 250);
};
const onMentionInsert = (payload: { text?: string }) => {
    lastMentionInsert.value = payload.text ?? '';
};

const resetDrawer = () => {
    drawerNew.value = true;
    drawerPopular.value = false;
    drawerFree.value = false;
};
const onCommandPaletteSelect = (item: { value?: string | number; label?: string }) => {
    commandPaletteAction.value = String(item.value ?? item.label ?? '');
};

onBeforeUnmount(() => {
    if (searchAltTimer) {
        clearTimeout(searchAltTimer);
    }

    if (mentionSearchTimer) {
        clearTimeout(mentionSearchTimer);
    }
});
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

.vf-home__grid > * {
    min-width: 0;
}

.vf-home__card {
    padding: 1rem;
    border: 1px solid var(--vf-border-color);
    border-radius: 10px;
    background-color: var(--vf-bg-color);
    min-width: 0;
}

.vf-home__stack {
    display: grid;
    gap: 0.5rem;
    min-width: 0;
}

.vf-home__stack > * {
    min-width: 0;
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

.vf-home__search-list {
    margin: 0;
    padding-left: 1rem;
    display: grid;
    gap: 0.2rem;
}

.vf-home__context-target {
    border: 1px dashed var(--vf-border-color);
    border-radius: 8px;
    padding: 1rem;
    text-align: center;
    user-select: none;
    color: var(--vf-secondary-text-color);
}
</style>
