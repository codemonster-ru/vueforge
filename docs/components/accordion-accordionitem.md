# Accordion / AccordionItem

## Overview

Props (Accordion):

- `modelValue?: string | number | Array<string | number>` (v-model)
- `multiple?: boolean` (default `false`)
- `disabled?: boolean`
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

## Slots

- This component does not expose named slots.

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

## Accessibility

- Header buttons expose `aria-expanded` and `aria-controls`, and panels use `region` + `aria-labelledby`.
- Header keyboard traversal supports `ArrowUp`/`ArrowDown` and `Home`/`End`.
- Ensure visible focus state and sufficient color contrast in usage contexts.
