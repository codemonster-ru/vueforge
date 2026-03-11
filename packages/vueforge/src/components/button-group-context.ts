import type { ComputedRef, InjectionKey } from 'vue';

export interface ButtonGroupContext {
    size?: 'small' | 'normal' | 'large';
    variant?: 'filled' | 'outlined' | 'text';
    severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger';
    disabled?: boolean;
}

export const buttonGroupContextKey: InjectionKey<ComputedRef<ButtonGroupContext>> = Symbol('buttonGroupContext');
