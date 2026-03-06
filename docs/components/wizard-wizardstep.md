# Wizard / WizardStep

Coordinate multi-step workflows with step headers, validation gates, and step-specific content panels.

## Import

```ts
import { Wizard, WizardStep } from '@codemonster-ru/vueforge';
```

## Examples

Use `Wizard` when the component should own both step navigation and the visible content panels.

### Basic

Use `WizardStep` children to define the content for each configured step.

```vue
<template>
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
</template>
```

### Linear Validation

Use `validateStep` to block forward movement until the current step is valid.

```vue
<template>
    <Wizard
        v-model="step"
        :steps="steps"
        :validate-step="currentStep => (currentStep.value === 'account' && !email ? 'Email is required' : true)"
        @invalid-step="showError"
    >
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
</template>
```

### Custom Actions

Use the `actions` slot when the footer controls should reflect product-specific wording or layout.

```vue
<template>
    <Wizard v-model="step" :steps="steps">
        <template #actions="{ isFirst, isLast, prev, next, complete }">
            <Button variant="outlined" :disabled="isFirst" @click="prev()">Back</Button>
            <Button @click="isLast ? complete() : next()">
                {{ isLast ? 'Finish setup' : 'Continue' }}
            </Button>
        </template>
        <WizardStep value="profile">Profile form</WizardStep>
        <WizardStep value="review">Review</WizardStep>
    </Wizard>
</template>
```

## Wizard Props

- `modelValue?: string | number`
- `steps?: Array<{ value: string | number; title?: string; description?: string; optional?: boolean; disabled?: boolean; validate?: (value, index) => boolean | string | Promise<...> }>`
- `linear?: boolean` (default `true`)
- `disabled?: boolean` (default `false`)
- `nextLabel?: string` (default `Next`)
- `prevLabel?: string` (default `Back`)
- `finishLabel?: string` (default `Finish`)
- `validateStep?: (step, index, value) => boolean | string | Promise<...>`
- `ariaLabel?: string`
- `ariaLabelledby?: string`

## WizardStep Props

- `value: string | number`

## Events

- `Wizard`: `update:modelValue`, `change`, `next`, `prev`, `complete`, `invalidStep`
- `WizardStep`: this component does not emit component-specific events

## Slots

- `Wizard`: `default`, `indicator`, `actions`
- `WizardStep`: `default`

## Theming

- Override via `theme.overrides.components.wizard`.

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

## Recipes

- Use `Wizard` when the component should orchestrate both step state and visible panels.
- Prefer `Stepper` when you only need progress or navigation headers.
- Keep `steps[].value` and `WizardStep.value` aligned exactly to avoid silent mismatches.

## Accessibility

- Step headers use `tablist` and `tab` semantics.
- Visible content panels use `tabpanel` with label linkage back to the step headers.
- Keyboard navigation supports arrow traversal and home or end across enabled steps.
