# Wizard / WizardStep

## Overview

Props (`Wizard`):

- `modelValue?: string | number` (v-model active step value)
- `steps?: Array<{ value: string | number; title?: string; description?: string; optional?: boolean; disabled?: boolean; validate?: (value, index) => boolean | string | Promise<...> }>`
- `linear?: boolean` (default `true`)
- `disabled?: boolean` (default `false`)
- `nextLabel?: string` (default `Next`)
- `prevLabel?: string` (default `Back`)
- `finishLabel?: string` (default `Finish`)
- `validateStep?: (step, index, value) => boolean | string | Promise<...>`
- `ariaLabel?: string`
- `ariaLabelledby?: string`

Props (`WizardStep`):

- `value: string | number` (must match one of `Wizard.steps[].value`)

Slots (`Wizard`):

- `default` - place `WizardStep` components
- `indicator` (optional) - slot props `{ step, index }`
- `actions` (optional) - slot props `{ step, index, isFirst, isLast, next, prev, complete }`

Events (`Wizard`):

- `update:modelValue`
- `change`
- `next`
- `prev`
- `complete`
- `invalidStep`

## Props

- No additional props documented for this component at the moment.

## Events

- This component does not emit component-specific events.

## Slots

- This component does not expose named slots.

## Examples

```vue
<Wizard v-model="wizardStep" :steps="wizardSteps">
    <WizardStep value="account">
        <Input v-model="email" placeholder="Email" />
    </WizardStep>
    <WizardStep value="plan">
        <Select v-model="plan" :options="plans" />
    </WizardStep>
    <WizardStep value="confirm">
        Review and finish
    </WizardStep>
</Wizard>
```

## Tokens

Component tokens (override via `theme.overrides.components.wizard`):

- `gap`, `borderColor`, `headerPaddingBottom`
- `itemGap`, `stepGap`
- `indicatorSize`, `indicatorBorderRadius`, `indicatorFontSize`
- `indicatorBorderColor`, `indicatorBackgroundColor`, `indicatorTextColor`
- `activeIndicatorBorderColor`, `activeIndicatorBackgroundColor`, `activeIndicatorTextColor`
- `completedIndicatorBorderColor`, `completedIndicatorBackgroundColor`, `completedIndicatorTextColor`
- `errorIndicatorBorderColor`, `errorIndicatorBackgroundColor`, `errorIndicatorTextColor`
- `titleFontSize`, `titleColor`, `descriptionFontSize`, `descriptionColor`
- `actionsGap`
- `buttonMinWidth`, `buttonPadding`, `buttonBorderRadius`
- `buttonBorderColor`, `buttonBackgroundColor`, `buttonTextColor`, `buttonHoverBackgroundColor`
- `secondaryButtonBorderColor`, `secondaryButtonBackgroundColor`, `secondaryButtonTextColor`, `secondaryButtonHoverBackgroundColor`
- `disabledOpacity`

## Accessibility

- Ensure keyboard access, visible focus state, and sufficient color contrast in usage contexts.
