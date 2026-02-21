# Starter Recipe: Settings Page

## Goal

Build a settings page with grouped sections, toggles, and save/cancel actions.

## Example

```vue
<template>
    <Section as="main" background="transparent">
        <Container size="lg">
            <Stack gap="1rem">
                <PageHeader title="Settings" subtitle="Manage account and notifications" divider />

                <Card>
                    <template #header>Profile</template>
                    <template #body>
                        <Stack gap="0.75rem">
                            <FormField label="Display name">
                                <template #default="{ id }">
                                    <Input :id="id" model-value="Alice Johnson" />
                                </template>
                            </FormField>
                            <FormField label="Email">
                                <template #default="{ id }">
                                    <Input :id="id" model-value="alice@example.com" />
                                </template>
                            </FormField>
                        </Stack>
                    </template>
                </Card>

                <Card>
                    <template #header>Notifications</template>
                    <template #body>
                        <Stack gap="0.75rem">
                            <Inline justify="space-between" align="center">
                                <span>Email alerts</span>
                                <Switch model-value />
                            </Inline>
                            <Inline justify="space-between" align="center">
                                <span>Weekly summary</span>
                                <Switch :model-value="false" />
                            </Inline>
                        </Stack>
                    </template>
                </Card>

                <Inline justify="end" gap="0.5rem">
                    <Button label="Cancel" variant="outlined" severity="secondary" />
                    <Button label="Save changes" />
                </Inline>
            </Stack>
        </Container>
    </Section>
</template>
```
