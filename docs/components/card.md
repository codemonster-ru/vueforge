# Card

Provide a reusable bordered surface for grouped content, settings blocks, and dashboard tiles.

## Import

```ts
import { Card } from '@codemonster-ru/vueforge';
```

## Examples

Use `Card` as a lightweight content surface rather than a heavy layout primitive.

### Basic

Use the default slot for simple content blocks.

```vue
<template>
    <Card>
        <p>Project settings are inherited from the workspace by default.</p>
    </Card>
</template>
```

### Structured Card

Use header, body, and footer slots when the surface needs clear content regions.

```vue
<template>
    <Card>
        <template #header>
            <PageHeader title="Workspace access" subtitle="Manage seats and roles" />
        </template>
        <template #body>
            <p>Invite collaborators and review pending access requests.</p>
        </template>
        <template #footer>
            <Button size="small">Manage members</Button>
        </template>
    </Card>
</template>
```

### Grid Of Cards

Use cards as repeatable dashboard tiles.

```vue
<template>
    <Inline gap="1rem" wrap="wrap">
        <Card><template #body>Open issues: 14</template></Card>
        <Card><template #body>Deployments today: 3</template></Card>
        <Card><template #body>Incidents: 0</template></Card>
    </Inline>
</template>
```

## Props

- This component does not expose props.

## Events

- This component does not emit component-specific events.

## Slots

- `default`
- `header`
- `body`
- `footer`

## Theming

- Override via `theme.overrides.components.card`.

## Tokens

Component tokens (override via `theme.overrides.components.card`):

- `padding`, `borderColor`, `borderRadius`

## Recipes

- Use `Card` to group related actions or metrics without introducing another layout abstraction.
- Prefer slot regions when the surface contains mixed content types such as headings, copy, and actions.
- Keep nested cards rare; use spacing and dividers first.

## Accessibility

- `Card` is a neutral surface. Apply semantic headings, landmarks, or interactive elements inside it as needed.
