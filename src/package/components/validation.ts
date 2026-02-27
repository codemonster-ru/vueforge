export type ValidationErrors = Record<string, string>;
export type ValidationResultInput = ValidationErrors | string | boolean | null | undefined;
export type ValidationMessageLevel = 'error' | 'warning' | 'info' | 'success';
export type ValidationStatus = 'idle' | 'valid' | 'invalid' | 'pending';

export type ValidationMessage = {
    id?: string;
    field?: string;
    text: string;
    level?: ValidationMessageLevel;
};

export type ValidationState = {
    status: ValidationStatus;
    invalid: boolean;
    pending: boolean;
    messages: Array<ValidationMessage>;
    describedBy?: string;
    ariaInvalid?: 'true';
};

type CreateValidationMessagesOptions = {
    field?: string;
    formKey?: string;
    includeForm?: boolean;
    idPrefix?: string;
};

type CreateValidationStateOptions = {
    errors?: ValidationErrors;
    field?: string;
    pending?: boolean;
    includeForm?: boolean;
    describedBy?: string | Array<string | undefined> | null;
    idPrefix?: string;
};

const DEFAULT_FORM_KEY = '_form';
const DEFAULT_FALSE_MESSAGE = 'Form is invalid';

const toIdParts = (value: string | Array<string | undefined> | null | undefined): Array<string> => {
    if (!value) {
        return [];
    }

    const list = Array.isArray(value) ? value : [value];
    const unique = new Set<string>();

    for (const item of list) {
        if (!item) {
            continue;
        }

        const normalized = item.trim();
        if (normalized) {
            unique.add(normalized);
        }
    }

    return Array.from(unique);
};

export const buildValidationDescribedBy = (...parts: Array<string | Array<string | undefined> | null | undefined>) => {
    const ids = parts.flatMap(part => toIdParts(part));

    if (!ids.length) {
        return undefined;
    }

    return Array.from(new Set(ids)).join(' ');
};

export const normalizeValidationErrors = (
    result: ValidationResultInput,
    options: { falseMessage?: string; formKey?: string } = {},
): ValidationErrors => {
    const falseMessage = options.falseMessage ?? DEFAULT_FALSE_MESSAGE;
    const formKey = options.formKey ?? DEFAULT_FORM_KEY;

    if (result === undefined || result === null || result === true) {
        return {};
    }

    if (result === false) {
        return { [formKey]: falseMessage };
    }

    if (typeof result === 'string') {
        return result ? { [formKey]: result } : {};
    }

    if (!result || typeof result !== 'object' || Array.isArray(result)) {
        return {};
    }

    const normalized: ValidationErrors = {};
    for (const key in result) {
        const value = result[key];
        if (typeof value === 'string' && value) {
            normalized[key] = value;
        }
    }

    return normalized;
};

export const createValidationMessages = (
    errors: ValidationErrors,
    options: CreateValidationMessagesOptions = {},
): Array<ValidationMessage> => {
    const field = options.field?.trim();
    const formKey = options.formKey ?? DEFAULT_FORM_KEY;
    const includeForm = options.includeForm !== false;
    const idPrefix = options.idPrefix?.trim();
    const list: Array<ValidationMessage> = [];

    if (field) {
        const fieldMessage = errors[field];
        if (fieldMessage) {
            list.push({
                id: idPrefix ? `${idPrefix}-${field}` : undefined,
                field,
                text: fieldMessage,
                level: 'error',
            });
        }
    }

    if (includeForm && errors[formKey]) {
        list.push({
            id: idPrefix ? `${idPrefix}-${formKey}` : undefined,
            field: formKey,
            text: errors[formKey],
            level: 'error',
        });
    }

    if (!field) {
        for (const key in errors) {
            if (key === formKey) {
                continue;
            }

            const text = errors[key];
            if (!text) {
                continue;
            }

            list.push({
                id: idPrefix ? `${idPrefix}-${key}` : undefined,
                field: key,
                text,
                level: 'error',
            });
        }
    }

    return list;
};

export const createValidationState = (options: CreateValidationStateOptions = {}): ValidationState => {
    const errors = options.errors ?? {};
    const pending = !!options.pending;
    const messages = createValidationMessages(errors, {
        field: options.field,
        includeForm: options.includeForm,
        idPrefix: options.idPrefix,
    });
    const invalid = messages.length > 0;
    const status: ValidationStatus = pending ? 'pending' : invalid ? 'invalid' : 'valid';
    const describedBy = buildValidationDescribedBy(
        options.describedBy,
        messages.map(message => message.id),
    );

    return {
        status,
        invalid,
        pending,
        messages,
        describedBy,
        ariaInvalid: invalid ? 'true' : undefined,
    };
};
