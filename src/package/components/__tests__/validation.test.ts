import {
    buildValidationDescribedBy,
    createValidationMessages,
    createValidationState,
    normalizeValidationErrors,
} from '../validation';

describe('validation contracts', () => {
    it('normalizes validation results into flat error map', () => {
        expect(normalizeValidationErrors(undefined)).toEqual({});
        expect(normalizeValidationErrors(true)).toEqual({});
        expect(normalizeValidationErrors(false)).toEqual({ _form: 'Form is invalid' });
        expect(normalizeValidationErrors('Bad request')).toEqual({ _form: 'Bad request' });
        expect(normalizeValidationErrors({ email: 'Invalid', age: '' })).toEqual({ email: 'Invalid' });
    });

    it('builds deduplicated describedBy wiring', () => {
        const describedBy = buildValidationDescribedBy('hint-id', ['error-id', 'hint-id'], undefined);
        expect(describedBy).toBe('hint-id error-id');
    });

    it('creates scoped validation messages for field and form', () => {
        const messages = createValidationMessages(
            {
                email: 'Required',
                _form: 'Cannot submit',
            },
            { field: 'email', idPrefix: 'signup' },
        );

        expect(messages).toEqual([
            { id: 'signup-email', field: 'email', text: 'Required', level: 'error' },
            { id: 'signup-_form', field: '_form', text: 'Cannot submit', level: 'error' },
        ]);
    });

    it('creates validation state with pending/invalid flags and aria mapping', () => {
        const state = createValidationState({
            errors: { password: 'Too short' },
            field: 'password',
            pending: false,
            describedBy: 'password-hint',
            idPrefix: 'login',
        });

        expect(state.status).toBe('invalid');
        expect(state.invalid).toBe(true);
        expect(state.ariaInvalid).toBe('true');
        expect(state.describedBy).toBe('password-hint login-password');
    });
});
