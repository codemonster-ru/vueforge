# Wizard / WizardStep

## Purpose

Organize multi-section and multi-step workflows with explicit progression and navigation semantics.
Support dense information architecture in settings, onboarding, and detail screens.

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

- `Wizard`: `update:modelValue`, `change`, `next`, `prev`, `complete`, `invalidStep`
- `WizardStep`: no emitted events

## Slots

- `Wizard`: `default`, `indicator`, `actions`
- `WizardStep`: default slot for step content

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

## Recipes

### Linear onboarding flow with validation

```vue
<Wizard
    v-model="step"
    :steps="steps"
    :validate-step="currentStep => (currentStep.value === 'account' && !email ? 'Email is required' : true)"
    @invalid-step="message => showError(message)"
>
    <WizardStep value="account">
        <Input v-model="email" placeholder="Email" />
    </WizardStep>
    <WizardStep value="plan">
        <Select v-model="plan" :options="plans" />
    </WizardStep>
    <WizardStep value="confirm">Review and finish</WizardStep>
</Wizard>
```

### Non-linear edit/review flow

```vue
<Wizard v-model="step" :steps="steps" :linear="false">
    <WizardStep value="profile">Profile form</WizardStep>
    <WizardStep value="notifications">Notification settings</WizardStep>
    <WizardStep value="review">Review changes</WizardStep>
</Wizard>
```

## Theming

- Override via theme component overrides for each component documented on this page.

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

- Step header uses `tablist`/`tab` relationships and step content uses `tabpanel` with label linkage.
- Keyboard navigation supports `ArrowLeft`/`ArrowRight` and `Home`/`End` across enabled steps.
- Ensure visible focus state and sufficient color contrast in usage contexts.
