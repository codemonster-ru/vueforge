<template>
    <div ref="root" :class="getClass">
        <button
            ref="control"
            class="vf-datepicker__control"
            type="button"
            :disabled="disabled"
            :aria-readonly="readonly ? 'true' : undefined"
            :aria-label="ariaLabel"
            :aria-expanded="open"
            :aria-controls="panelId"
            aria-haspopup="dialog"
            @click="togglePanel"
            @keydown.down.prevent="openPanel"
            @keydown.enter.prevent="togglePanel"
            @keydown.esc.prevent="close"
            @focus="onFocus"
            @blur="onBlur"
        >
            <span class="vf-datepicker__label" :class="{ 'vf-datepicker__label_placeholder': !selectedDate }">
                {{ selectedLabel || placeholder }}
            </span>
            <span class="vf-datepicker__chevron" aria-hidden="true">&#9662;</span>
        </button>
        <Teleport to="body">
            <div
                v-show="open"
                :id="panelId"
                ref="panel"
                class="vf-datepicker__panel"
                role="dialog"
                :aria-label="panelAriaLabel"
                :data-placement="currentPlacement"
                @keydown.esc.prevent="close"
            >
                <div class="vf-datepicker__header">
                    <button class="vf-datepicker__nav" type="button" aria-label="Previous month" @click="prevMonth">
                        &#8249;
                    </button>
                    <span class="vf-datepicker__month-label">{{ monthLabel }}</span>
                    <button class="vf-datepicker__nav" type="button" aria-label="Next month" @click="nextMonth">
                        &#8250;
                    </button>
                </div>
                <div class="vf-datepicker__weekdays" role="row">
                    <span v-for="day in weekdayLabels" :key="day" class="vf-datepicker__weekday">
                        {{ day }}
                    </span>
                </div>
                <div class="vf-datepicker__days" role="grid">
                    <button
                        v-for="cell in calendarDays"
                        :key="cell.key"
                        class="vf-datepicker__day"
                        :class="{
                            'is-outside': !cell.inCurrentMonth,
                            'is-selected': cell.isSelected,
                            'is-today': cell.isToday,
                        }"
                        type="button"
                        :disabled="cell.isDisabled"
                        :data-date="cell.iso"
                        @click="selectDate(cell.date)"
                    >
                        {{ cell.day }}
                    </button>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { autoUpdate, computePosition, flip, offset } from '@codemonster-ru/floater.js';
import { useDateTimeLocale } from '../config/date-time-locale';

type Size = 'small' | 'normal' | 'large';
type Variant = 'filled' | 'outlined';
type Placement = 'bottom' | 'top';

let datePickerIdCounter = 0;

interface Props {
    modelValue?: string;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    min?: string;
    max?: string;
    locale?: string;
    firstDayOfWeek?: number;
    ariaLabel?: string;
    panelAriaLabel?: string;
    variant?: Variant;
    size?: Size;
}

interface CalendarCell {
    key: string;
    iso: string;
    date: Date;
    day: number;
    inCurrentMonth: boolean;
    isDisabled: boolean;
    isSelected: boolean;
    isToday: boolean;
}

type FloaterInstance = {
    update: () => Promise<void>;
    destroy: () => void;
} | null;

const emits = defineEmits(['update:modelValue', 'change', 'focus', 'blur']);
const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    placeholder: '',
    disabled: false,
    readonly: false,
    min: undefined,
    max: undefined,
    locale: undefined,
    firstDayOfWeek: undefined,
    ariaLabel: 'Date picker',
    panelAriaLabel: 'Calendar',
    variant: 'filled',
    size: 'normal',
});

const dateTimeLocale = useDateTimeLocale();
const effectiveLocale = computed(() => props.locale ?? dateTimeLocale.locale);
const effectiveFirstDayOfWeek = computed(() =>
    normalizeFirstDayOfWeek(props.firstDayOfWeek ?? dateTimeLocale.firstDayOfWeek),
);

const root = ref<HTMLElement | null>(null);
const control = ref<HTMLButtonElement | null>(null);
const panel = ref<HTMLElement | null>(null);
const open = ref(false);
const basePlacement = ref<Placement>('bottom');
const currentPlacement = ref<Placement>('bottom');
const panelId = `vf-datepicker-panel-${++datePickerIdCounter}`;
const monthCursor = ref(startOfMonth(parseIsoDate(props.modelValue) ?? new Date()));
let floater: FloaterInstance = null;

const selectedDate = computed(() => parseIsoDate(props.modelValue));
const minDate = computed(() => parseIsoDate(props.min));
const maxDate = computed(() => parseIsoDate(props.max));
const selectedLabel = computed(() => {
    if (!selectedDate.value) {
        return '';
    }

    return selectedDate.value.toLocaleDateString(effectiveLocale.value, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
});
const monthLabel = computed(() => {
    return monthCursor.value.toLocaleDateString(effectiveLocale.value, {
        year: 'numeric',
        month: 'long',
    });
});
const weekdayLabels = computed(() => {
    const formatter = new Intl.DateTimeFormat(effectiveLocale.value, { weekday: 'short' });
    const referenceSunday = new Date(2026, 0, 4);

    return Array.from({ length: 7 }, (_, index) => {
        const shiftedIndex = (index + effectiveFirstDayOfWeek.value) % 7;
        const labelDate = new Date(referenceSunday);

        labelDate.setDate(referenceSunday.getDate() + shiftedIndex);

        return formatter.format(labelDate);
    });
});
const calendarDays = computed<Array<CalendarCell>>(() => {
    const start = startOfGrid(monthCursor.value, effectiveFirstDayOfWeek.value);
    const selectedIso = selectedDate.value ? formatIsoDate(selectedDate.value) : null;
    const todayIso = formatIsoDate(new Date());

    return Array.from({ length: 42 }, (_, index) => {
        const date = addDays(start, index);
        const iso = formatIsoDate(date);

        return {
            key: `${iso}-${index}`,
            iso,
            date,
            day: date.getDate(),
            inCurrentMonth: date.getMonth() === monthCursor.value.getMonth(),
            isDisabled: isDateDisabled(date, minDate.value, maxDate.value),
            isSelected: selectedIso === iso,
            isToday: iso === todayIso,
        };
    });
});
const getClass = computed(() => {
    const classes = ['vf-datepicker', `vf-datepicker_${props.variant}`, open.value ? 'vf-datepicker_open' : ''];

    if (props.size !== 'normal') {
        classes.push(`vf-datepicker_${props.size}`);
    }

    if (props.disabled) {
        classes.push('vf-datepicker_disabled');
    }

    return classes.filter(Boolean);
});

const onFocus = (event: FocusEvent) => emits('focus', event);
const onBlur = (event: FocusEvent) => emits('blur', event);

const openPanel = () => {
    if (props.disabled || props.readonly) {
        return;
    }

    open.value = true;
    basePlacement.value = 'bottom';
    currentPlacement.value = 'bottom';
};

const close = () => {
    open.value = false;
    basePlacement.value = 'bottom';
    currentPlacement.value = 'bottom';
};

const togglePanel = () => {
    if (open.value) {
        close();

        return;
    }

    openPanel();
};

const prevMonth = () => {
    monthCursor.value = shiftMonth(monthCursor.value, -1);
};

const nextMonth = () => {
    monthCursor.value = shiftMonth(monthCursor.value, 1);
};

const selectDate = (date: Date) => {
    if (props.readonly || isDateDisabled(date, minDate.value, maxDate.value)) {
        return;
    }

    const iso = formatIsoDate(date);

    emits('update:modelValue', iso);
    emits('change', iso);

    close();
};

const onDocumentClick = (event: MouseEvent) => {
    if (!open.value || !root.value) {
        return;
    }

    const target = event.target as Node;

    if (root.value.contains(target) || panel.value?.contains(target)) {
        return;
    }

    close();
};

const mountFloater = () => {
    if (!control.value || !panel.value) {
        return;
    }

    const reference = control.value;
    const floating = panel.value;

    const applyPosition = async () => {
        const {
            x,
            y,
            placement: resolvedPlacement,
        } = await computePosition(reference, floating, {
            placement: basePlacement.value,
            strategy: 'fixed',
            middleware: [offset(2), flip({ placements: ['bottom', 'top'] })],
        });

        currentPlacement.value = (resolvedPlacement as Placement) ?? basePlacement.value;
        floating.style.left = `${x}px`;
        floating.style.top = `${y}px`;
    };
    const update = async () => {
        await applyPosition();
    };

    const cleanup = autoUpdate(reference, () => {
        void update();
    });

    const onScrollOrResize = () => {
        void update();
    };

    document.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize, false);

    floater = {
        update,
        destroy: () => {
            cleanup();

            document.removeEventListener('scroll', onScrollOrResize, true);
            window.removeEventListener('resize', onScrollOrResize, false);
        },
    };
    void floater.update();
};

watch(
    () => props.modelValue,
    value => {
        const parsed = parseIsoDate(value);

        if (parsed) {
            monthCursor.value = startOfMonth(parsed);
        }
    },
    { immediate: true },
);

watch(
    () => [props.min, props.max],
    () => {
        void floater?.update();
    },
);

watch(open, async value => {
    if (!value) {
        if (floater) {
            floater.destroy();

            floater = null;
        }

        return;
    }

    await nextTick();

    if (!floater) {
        mountFloater();
    }

    void floater?.update();
});

onMounted(() => {
    document.addEventListener('click', onDocumentClick);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', onDocumentClick);

    floater?.destroy();

    floater = null;
});

function parseIsoDate(value?: string) {
    if (!value) {
        return null;
    }

    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (!match) {
        return null;
    }

    const year = Number(match[1]);
    const month = Number(match[2]) - 1;
    const day = Number(match[3]);
    const date = new Date(year, month, day);

    if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
        return null;
    }

    return startOfDay(date);
}

function startOfDay(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function shiftMonth(date: Date, delta: number) {
    return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

function addDays(date: Date, amount: number) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

function startOfGrid(month: Date, firstDayOfWeek: number) {
    const monthStart = startOfMonth(month);
    const day = monthStart.getDay();
    const offsetDays = (day - firstDayOfWeek + 7) % 7;

    return addDays(monthStart, -offsetDays);
}

function formatIsoDate(date: Date) {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function isDateDisabled(date: Date, min: Date | null, max: Date | null) {
    const time = startOfDay(date).getTime();

    if (min && time < min.getTime()) {
        return true;
    }

    if (max && time > max.getTime()) {
        return true;
    }

    return false;
}

function normalizeFirstDayOfWeek(value: number) {
    if (!Number.isFinite(value)) {
        return 0;
    }

    return ((Math.floor(value) % 7) + 7) % 7;
}
</script>

<style lang="scss">
.vf-datepicker {
    position: relative;
    display: inline-block;
    min-width: var(--vf-datepicker-min-width);
    height: var(--vf-controls-height);
    box-sizing: border-box;
    border-radius: var(--vf-datepicker-border-radius);
    border: var(--vf-border-width) solid var(--vf-datepicker-border-color);
    background-color: var(--vf-datepicker-background-color);
    color: var(--vf-datepicker-text-color);
    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
}

.vf-datepicker_outlined {
    background-color: transparent;
}

.vf-datepicker__control {
    width: 100%;
    height: var(--vf-controls-height);
    box-sizing: border-box;
    border: none;
    background: transparent;
    color: inherit;
    padding: var(--vf-datepicker-padding);
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--vf-datepicker-control-gap);
    font-size: var(--vf-datepicker-font-size);
    line-height: var(--vf-typography-line-height);
    font-family: inherit;
    cursor: pointer;
    outline: none;
}

.vf-datepicker__label {
    text-align: left;
}

.vf-datepicker__label_placeholder {
    color: var(--vf-datepicker-placeholder-color);
}

.vf-datepicker__chevron {
    font-size: var(--vf-datepicker-chevron-size);
    opacity: 0.7;
}

.vf-datepicker__panel {
    position: fixed;
    z-index: 50;
    width: var(--vf-datepicker-panel-width);
    padding: var(--vf-datepicker-panel-padding);
    border-radius: calc(var(--vf-datepicker-border-radius) + var(--vf-datepicker-panel-radius-offset));
    border: var(--vf-border-width) solid var(--vf-datepicker-panel-border-color);
    background-color: var(--vf-datepicker-panel-background-color);
    box-shadow: var(--vf-datepicker-panel-shadow);
    color: var(--vf-datepicker-text-color);
}

.vf-datepicker__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--vf-datepicker-header-gap);
    padding: var(--vf-datepicker-header-padding);
}

.vf-datepicker__month-label {
    font-size: var(--vf-datepicker-month-label-font-size);
    font-weight: var(--vf-datepicker-month-label-font-weight);
}

.vf-datepicker__nav {
    width: var(--vf-datepicker-nav-button-size);
    height: var(--vf-datepicker-nav-button-size);
    border-radius: var(--vf-datepicker-nav-button-radius);
    border: none;
    background: transparent;
    color: inherit;
    cursor: pointer;
    font-size: var(--vf-datepicker-nav-button-font-size);
    line-height: 1;
}

.vf-datepicker__nav:hover,
.vf-datepicker__nav:focus-visible {
    background-color: var(--vf-datepicker-day-hover-background-color);
    outline: none;
}

.vf-datepicker__weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    margin-bottom: var(--vf-datepicker-weekdays-margin-bottom);
}

.vf-datepicker__weekday {
    text-align: center;
    color: var(--vf-datepicker-weekday-color);
    font-size: var(--vf-datepicker-weekday-font-size);
    line-height: 1.2;
}

.vf-datepicker__days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: var(--vf-datepicker-days-gap);
}

.vf-datepicker__day {
    width: var(--vf-datepicker-day-size);
    height: var(--vf-datepicker-day-size);
    margin: 0 auto;
    border-radius: var(--vf-datepicker-day-border-radius);
    border: var(--vf-border-width) solid transparent;
    background: transparent;
    color: inherit;
    cursor: pointer;
    font-size: var(--vf-datepicker-day-font-size);
    line-height: 1;
}

.vf-datepicker__day:hover:not(:disabled),
.vf-datepicker__day:focus-visible:not(:disabled) {
    background-color: var(--vf-datepicker-day-hover-background-color);
    outline: none;
}

.vf-datepicker__day.is-selected {
    background-color: var(--vf-datepicker-day-selected-background-color);
    color: var(--vf-datepicker-day-selected-text-color);
}

.vf-datepicker__day.is-today {
    border-color: var(--vf-datepicker-day-today-border-color);
}

.vf-datepicker__day.is-outside {
    color: var(--vf-datepicker-day-muted-color);
}

.vf-datepicker__day:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.vf-datepicker_open {
    border-color: var(--vf-datepicker-focus-border-color);
    box-shadow: var(--vf-datepicker-focus-ring-shadow);
}

.vf-datepicker:hover:not(.vf-datepicker_disabled) {
    border-color: var(--vf-datepicker-hover-border-color);
}

.vf-datepicker:focus-within:not(.vf-datepicker_disabled) {
    border-color: var(--vf-datepicker-focus-border-color);
}

.vf-datepicker_small {
    .vf-datepicker__control {
        padding: var(--vf-datepicker-small-padding);
        font-size: var(--vf-datepicker-small-font-size);
    }

    .vf-datepicker__day {
        width: var(--vf-datepicker-small-day-size);
        height: var(--vf-datepicker-small-day-size);
    }
}

.vf-datepicker_large {
    .vf-datepicker__control {
        padding: var(--vf-datepicker-large-padding);
        font-size: var(--vf-datepicker-large-font-size);
    }

    .vf-datepicker__day {
        width: var(--vf-datepicker-large-day-size);
        height: var(--vf-datepicker-large-day-size);
    }
}

.vf-datepicker_disabled {
    opacity: var(--vf-datepicker-disabled-opacity);
    cursor: not-allowed;

    .vf-datepicker__control {
        cursor: not-allowed;
    }
}
</style>
