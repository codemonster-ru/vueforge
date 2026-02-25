# Accordion / AccordionItem

## Purpose

Organize multi-section and multi-step workflows with explicit progression and navigation semantics.
Support dense information architecture in settings, onboarding, and detail screens.

## Overview

Props (Accordion):

- `modelValue?: string | number | Array<string | number>` (v-model)
- `multiple?: boolean` (default `false`)
- `disabled?: boolean`
- `dense?: boolean` (default `false`)
- `grouped?: boolean` (default `false`)
- `groupTitle?: string`
- `groupDescription?: string`
- `analytics?: boolean` (default `false`)
- `analyticsContext?: string`
- `variant?: 'filled' | 'outlined'` (default `filled`)
- `size?: 'small' | 'normal' | 'large'` (default `normal`)
- `ariaLabel?: string`
- `ariaLabelledby?: string`

Props (AccordionItem):

- `value: string | number`
- `title?: string`
- `disabled?: boolean`
- `unmount?: boolean` (default `false`)

## Props

- No additional props documented for this component at the moment.

## Events

- `update:modelValue`
- `change`
- `itemToggle` - payload `{ value, expanded, values, event }`
- `itemExpand`
- `itemCollapse`
- `analytics` - payload `{ type, value, values, context, at }`

## Slots

- `group-title`
- `group-description`
- `group-actions`
- `title` (on `AccordionItem`)

## Examples

```vue
<Accordion v-model="faq">
    <AccordionItem value="shipping" title="Shipping">
        Shipping details
    </AccordionItem>
    <AccordionItem value="returns" title="Returns">
        Returns policy
    </AccordionItem>
</Accordion>
```

## Recipes

### FAQ disclosure with single-open behavior

```vue
<Accordion v-model="activeFaq" aria-label="Frequently asked questions">
    <AccordionItem value="shipping" title="Shipping">Shipping details</AccordionItem>
    <AccordionItem value="returns" title="Returns">Returns policy</AccordionItem>
    <AccordionItem value="warranty" title="Warranty">Warranty terms</AccordionItem>
</Accordion>
```

### Multi-open policy sections

```vue
<Accordion v-model="openSections" multiple>
    <AccordionItem value="privacy" title="Privacy">Privacy policy</AccordionItem>
    <AccordionItem value="terms" title="Terms">Terms of service</AccordionItem>
</Accordion>
```

### Grouped expansion panel with dense mode and analytics

```vue
<Accordion
    v-model="openPanels"
    grouped
    dense
    group-title="Access controls"
    group-description="Policy and approval settings"
    analytics
    analytics-context="security-settings"
    @analytics="trackAccordion"
>
    <template #group-actions>
        <Button size="small">Manage roles</Button>
    </template>
    <AccordionItem value="policy" title="Policy rules">...</AccordionItem>
    <AccordionItem value="approvals" title="Approval matrix">...</AccordionItem>
</Accordion>
```

## Theming

- Override via theme component overrides for each component documented on this page.

## Tokens

Component tokens (override via `theme.overrides.components.accordion`):

- `gap`, `borderRadius`, `borderColor`, `backgroundColor`
- `headerGap`, `headerPadding`, `headerFontSize`, `headerFontWeight`
- `headerTextColor`, `headerBackgroundColor`, `headerHoverBackgroundColor`, `headerActiveBackgroundColor`
- `contentPadding`, `contentTextColor`, `contentBackgroundColor`
- `iconSize`, `iconColor`, `dividerColor`
- `focusRingShadow`, `disabledOpacity`
- `small.headerPadding`, `small.headerFontSize`, `small.contentPadding`
- `large.headerPadding`, `large.headerFontSize`, `large.contentPadding`

## Responsive

Validate tab/step headers for overflow, wrap, and scroll behavior on smaller viewports.
Ensure active indicator and navigation controls remain clear and tappable on touch devices.

## SSR/Hydration

Preserve initially active section/step state and panel visibility across server and client render.
Avoid hydration drift from client-only measurement used for indicator positioning.

## Testing

Cover controlled/uncontrolled active state, keyboard navigation, and disabled step/tab behavior.
Add tests for deep-link/page-state sync when applicable and ARIA tab/step semantics.

## Accessibility

- Header buttons expose `aria-expanded` and `aria-controls`, and panels use `region` + `aria-labelledby`.
- Header keyboard traversal supports `ArrowUp`/`ArrowDown` and `Home`/`End`.
- Ensure visible focus state and sufficient color contrast in usage contexts.
