<template>
    <div ref="root" :class="getClass">
        <button
            ref="control"
            class="vf-daterangepicker__control"
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
            <span class="vf-daterangepicker__label" :class="{ 'vf-daterangepicker__label_placeholder': isEmpty }">
                {{ displayLabel || placeholder }}
            </span>
            <span class="vf-daterangepicker__chevron" aria-hidden="true">&#9662;</span>
        </button>
        <Teleport to="body">
            <div
                v-show="open"
                :id="panelId"
                ref="panel"
                class="vf-daterangepicker__panel"
                role="dialog"
                :aria-label="panelAriaLabel"
                :data-placement="currentPlacement"
                @keydown.esc.prevent="close"
            >
                <div class="vf-daterangepicker__header">
                    <button
                        class="vf-daterangepicker__nav"
                        type="button"
                        aria-label="Previous month"
                        :disabled="disabled || readonly"
                        @click="prevMonth"
                    >
                        &#8249;
                    </button>
                    <span class="vf-daterangepicker__month-label">{{ monthLabel }}</span>
                    <button
                        class="vf-daterangepicker__nav"
                        type="button"
                        aria-label="Next month"
                        :disabled="disabled || readonly"
                        @click="nextMonth"
                    >
                        &#8250;
                    </button>
                </div>
                <div class="vf-daterangepicker__weekdays" role="row">
                    <span v-for="day in weekdayLabels" :key="day" class="vf-daterangepicker__weekday">
                        {{ day }}
                    </span>
                </div>
                <div class="vf-daterangepicker__days" role="grid">
                    <button
                        v-for="cell in calendarDays"
                        :key="cell.key"
                        class="vf-daterangepicker__day"
                        :class="{
                            'is-outside': !cell.inCurrentMonth,
                            'is-in-range': cell.isInRange,
                            'is-selected': cell.isSelected,
                            'is-range-start': cell.isRangeStart,
                            'is-range-end': cell.isRangeEnd,
                            'is-today': cell.isToday,
                        }"
                        type="button"
                        :disabled="disabled || readonly || cell.isDisabled"
                        :data-date="cell.iso"
                        :aria-label="getDayAriaLabel(cell.date)"
                        :aria-selected="cell.isSelected ? 'true' : 'false'"
                        @click="selectDate(cell.date)"
                        @focus="onDayFocus(cell.iso)"
                        @keydown="onDayKeydown($event, cell)"
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
type DateRangeValue = [string | null, string | null] | null;

let dateRangePickerIdCounter = 0;

interface Props {
    modelValue?: DateRangeValue;
    placeholder?: string;
    startPlaceholder?: string;
    endPlaceholder?: string;
    separator?: string;
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
    isRangeStart: boolean;
    isRangeEnd: boolean;
    isInRange: boolean;
    isToday: boolean;
}

type FloaterInstance = {
    update: () => Promise<void>;
    destroy: () => void;
} | null;

const emits = defineEmits(['update:modelValue', 'change', 'focus', 'blur']);
const props = withDefaults(defineProps<Props>(), {
    modelValue: null,
    placeholder: '',
    startPlaceholder: 'Start',
    endPlaceholder: 'End',
    separator: ' - ',
    disabled: false,
    readonly: false,
    min: undefined,
    max: undefined,
    locale: undefined,
    firstDayOfWeek: undefined,
    ariaLabel: 'Date range picker',
    panelAriaLabel: 'Calendar range',
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
const panelId = `vf-daterangepicker-panel-${++dateRangePickerIdCounter}`;
const monthCursor = ref(startOfMonth(new Date()));
const focusedIso = ref<string | null>(null);
let floater: FloaterInstance = null;

const minDate = computed(() => parseIsoDate(props.min));
const maxDate = computed(() => parseIsoDate(props.max));
const rangeValue = computed(() => normalizeRange(props.modelValue));
const rangeStart = computed(() => rangeValue.value[0]);
const rangeEnd = computed(() => rangeValue.value[1]);
const isEmpty = computed(() => !rangeStart.value && !rangeEnd.value);
const displayLabel = computed(() => {
    if (isEmpty.value) {
        return '';
    }

    const formatter = new Intl.DateTimeFormat(effectiveLocale.value, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
    const startLabel = rangeStart.value ? formatter.format(rangeStart.value) : props.startPlaceholder;
    const endLabel = rangeEnd.value ? formatter.format(rangeEnd.value) : props.endPlaceholder;

    return `${startLabel}${props.separator}${endLabel}`;
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
    const todayIso = formatIsoDate(new Date());
    const startTime = rangeStart.value ? startOfDay(rangeStart.value).getTime() : null;
    const endTime = rangeEnd.value ? startOfDay(rangeEnd.value).getTime() : null;
    const startIso = rangeStart.value ? formatIsoDate(rangeStart.value) : null;
    const endIso = rangeEnd.value ? formatIsoDate(rangeEnd.value) : null;

    return Array.from({ length: 42 }, (_, index) => {
        const date = addDays(start, index);
        const iso = formatIsoDate(date);
        const time = startOfDay(date).getTime();
        const isInRange = startTime !== null && endTime !== null ? time >= startTime && time <= endTime : false;
        const isRangeStart = startIso === iso;
        const isRangeEnd = endIso === iso;

        return {
            key: `${iso}-${index}`,
            iso,
            date,
            day: date.getDate(),
            inCurrentMonth: date.getMonth() === monthCursor.value.getMonth(),
            isDisabled: isDateDisabled(date, minDate.value, maxDate.value),
            isSelected: isRangeStart || isRangeEnd,
            isRangeStart,
            isRangeEnd,
            isInRange,
            isToday: iso === todayIso,
        };
    });
});
const getClass = computed(() => {
    const classes = [
        'vf-daterangepicker',
        `vf-daterangepicker_${props.variant}`,
        open.value ? 'vf-daterangepicker_open' : '',
    ];

    if (props.size !== 'normal') {
        classes.push(`vf-daterangepicker_${props.size}`);
    }

    if (props.disabled) {
        classes.push('vf-daterangepicker_disabled');
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
    if (props.disabled || props.readonly) {
        return;
    }

    monthCursor.value = shiftMonth(monthCursor.value, -1);
};

const nextMonth = () => {
    if (props.disabled || props.readonly) {
        return;
    }

    monthCursor.value = shiftMonth(monthCursor.value, 1);
};

const onDayFocus = (iso: string) => {
    focusedIso.value = iso;
};

const focusDayByIso = async (iso: string) => {
    await Promise.resolve();
    const element = document.querySelector<HTMLButtonElement>(`.vf-daterangepicker__day[data-date="${iso}"]`);

    element?.focus();
};

const shiftFocusedDay = async (delta: number) => {
    const baseDate = parseIsoDate(focusedIso.value ?? undefined) ?? rangeStart.value ?? rangeEnd.value ?? new Date();
    const nextDate = addDays(baseDate, delta);

    monthCursor.value = startOfMonth(nextDate);
    focusedIso.value = formatIsoDate(nextDate);
    await focusDayByIso(focusedIso.value);
};

const jumpFocusedDayInRow = async (toEnd: 'start' | 'end') => {
    const baseDate = parseIsoDate(focusedIso.value ?? undefined) ?? rangeStart.value ?? rangeEnd.value ?? new Date();
    const currentWeekday = baseDate.getDay();
    const col = (currentWeekday - effectiveFirstDayOfWeek.value + 7) % 7;
    const delta = toEnd === 'start' ? -col : 6 - col;
    const nextDate = addDays(baseDate, delta);

    monthCursor.value = startOfMonth(nextDate);
    focusedIso.value = formatIsoDate(nextDate);
    await focusDayByIso(focusedIso.value);
};

const shiftFocusedMonth = async (delta: number) => {
    const baseDate = parseIsoDate(focusedIso.value ?? undefined) ?? rangeStart.value ?? rangeEnd.value ?? new Date();
    const nextDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + delta, baseDate.getDate());

    monthCursor.value = startOfMonth(nextDate);
    focusedIso.value = formatIsoDate(nextDate);
    await focusDayByIso(focusedIso.value);
};

const onDayKeydown = async (event: KeyboardEvent, cell: CalendarCell) => {
    if (props.disabled || props.readonly) {
        return;
    }

    if (event.key === 'ArrowRight') {
        event.preventDefault();
        await shiftFocusedDay(1);

        return;
    }

    if (event.key === 'ArrowLeft') {
        event.preventDefault();
        await shiftFocusedDay(-1);

        return;
    }

    if (event.key === 'ArrowDown') {
        event.preventDefault();
        await shiftFocusedDay(7);

        return;
    }

    if (event.key === 'ArrowUp') {
        event.preventDefault();
        await shiftFocusedDay(-7);

        return;
    }

    if (event.key === 'Home') {
        event.preventDefault();
        await jumpFocusedDayInRow('start');

        return;
    }

    if (event.key === 'End') {
        event.preventDefault();
        await jumpFocusedDayInRow('end');

        return;
    }

    if (event.key === 'PageUp') {
        event.preventDefault();
        await shiftFocusedMonth(-1);

        return;
    }

    if (event.key === 'PageDown') {
        event.preventDefault();
        await shiftFocusedMonth(1);

        return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectDate(cell.date);
    }
};

const updateRange = (start: Date | null, end: Date | null) => {
    const startIso = start ? formatIsoDate(start) : null;
    const endIso = end ? formatIsoDate(end) : null;

    emits('update:modelValue', [startIso, endIso]);
    emits('change', [startIso, endIso]);
};

const selectDate = (date: Date) => {
    if (props.readonly || isDateDisabled(date, minDate.value, maxDate.value)) {
        return;
    }

    const start = rangeStart.value;
    const end = rangeEnd.value;

    if (!start || (start && end)) {
        updateRange(date, null);

        return;
    }

    const startTime = startOfDay(start).getTime();
    const nextTime = startOfDay(date).getTime();

    if (nextTime < startTime) {
        updateRange(date, start);
    } else {
        updateRange(start, date);
    }

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
        const [start, end] = normalizeRange(value);
        const cursor = start ?? end ?? new Date();

        monthCursor.value = startOfMonth(cursor);
        focusedIso.value = start ? formatIsoDate(start) : end ? formatIsoDate(end) : null;
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

function normalizeRange(value?: DateRangeValue): [Date | null, Date | null] {
    if (!value || !Array.isArray(value)) {
        return [null, null];
    }

    const [start, end] = value;

    return [parseIsoDate(start ?? undefined), parseIsoDate(end ?? undefined)];
}

function getDayAriaLabel(date: Date) {
    return date.toLocaleDateString(effectiveLocale.value, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

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
.vf-daterangepicker {
    position: relative;
    display: inline-block;
    min-width: var(--vf-daterangepicker-min-width);
    height: var(--vf-controls-height);
    box-sizing: border-box;
    border-radius: var(--vf-daterangepicker-border-radius);
    border: var(--vf-border-width) solid var(--vf-daterangepicker-border-color);
    background-color: var(--vf-daterangepicker-background-color);
    color: var(--vf-daterangepicker-text-color);
    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
}

.vf-daterangepicker_outlined {
    background-color: transparent;
}

.vf-daterangepicker__control {
    width: 100%;
    height: var(--vf-controls-height);
    box-sizing: border-box;
    border: none;
    background: transparent;
    color: inherit;
    padding: var(--vf-daterangepicker-padding);
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--vf-daterangepicker-control-gap);
    font-size: var(--vf-daterangepicker-font-size);
    line-height: var(--vf-typography-line-height);
    font-family: inherit;
    cursor: pointer;
    outline: none;
}

.vf-daterangepicker__label {
    text-align: left;
}

.vf-daterangepicker__label_placeholder {
    color: var(--vf-daterangepicker-placeholder-color);
}

.vf-daterangepicker__chevron {
    font-size: var(--vf-daterangepicker-chevron-size);
    opacity: 0.7;
}

.vf-daterangepicker__panel {
    position: fixed;
    z-index: 50;
    width: var(--vf-daterangepicker-panel-width);
    padding: var(--vf-daterangepicker-panel-padding);
    border-radius: calc(var(--vf-daterangepicker-border-radius) + var(--vf-daterangepicker-panel-radius-offset));
    border: var(--vf-border-width) solid var(--vf-daterangepicker-panel-border-color);
    background-color: var(--vf-daterangepicker-panel-background-color);
    box-shadow: var(--vf-daterangepicker-panel-shadow);
    color: var(--vf-daterangepicker-text-color);
}

.vf-daterangepicker__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--vf-daterangepicker-header-gap);
    padding: var(--vf-daterangepicker-header-padding);
}

.vf-daterangepicker__month-label {
    font-size: var(--vf-daterangepicker-month-label-font-size);
    font-weight: var(--vf-daterangepicker-month-label-font-weight);
}

.vf-daterangepicker__nav {
    width: var(--vf-daterangepicker-nav-button-size);
    height: var(--vf-daterangepicker-nav-button-size);
    border-radius: var(--vf-daterangepicker-nav-button-radius);
    border: none;
    background: transparent;
    color: inherit;
    cursor: pointer;
    font-size: var(--vf-daterangepicker-nav-button-font-size);
    line-height: 1;
}

.vf-daterangepicker__nav:hover,
.vf-daterangepicker__nav:focus-visible {
    background-color: var(--vf-daterangepicker-day-hover-background-color);
    outline: none;
}

.vf-daterangepicker__weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    margin-bottom: var(--vf-daterangepicker-weekdays-margin-bottom);
}

.vf-daterangepicker__weekday {
    text-align: center;
    color: var(--vf-daterangepicker-weekday-color);
    font-size: var(--vf-daterangepicker-weekday-font-size);
    line-height: 1.2;
}

.vf-daterangepicker__days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: var(--vf-daterangepicker-days-gap);
}

.vf-daterangepicker__day {
    width: var(--vf-daterangepicker-day-size);
    height: var(--vf-daterangepicker-day-size);
    margin: 0 auto;
    border-radius: var(--vf-daterangepicker-day-border-radius);
    border: var(--vf-border-width) solid transparent;
    background: transparent;
    color: inherit;
    cursor: pointer;
    font-size: var(--vf-daterangepicker-day-font-size);
    line-height: 1;
}

.vf-daterangepicker__day:hover:not(:disabled),
.vf-daterangepicker__day:focus-visible:not(:disabled) {
    background-color: var(--vf-daterangepicker-day-hover-background-color);
    outline: none;
}

.vf-daterangepicker__day.is-in-range {
    background-color: var(--vf-daterangepicker-day-range-background-color);
    color: var(--vf-daterangepicker-day-range-text-color);
}

.vf-daterangepicker__day.is-selected {
    background-color: var(--vf-daterangepicker-day-selected-background-color);
    color: var(--vf-daterangepicker-day-selected-text-color);
}

.vf-daterangepicker__day.is-today {
    border-color: var(--vf-daterangepicker-day-today-border-color);
}

.vf-daterangepicker__day.is-outside {
    color: var(--vf-daterangepicker-day-muted-color);
}

.vf-daterangepicker__day:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.vf-daterangepicker_open {
    border-color: var(--vf-daterangepicker-focus-border-color);
    box-shadow: var(--vf-daterangepicker-focus-ring-shadow);
}

.vf-daterangepicker:hover:not(.vf-daterangepicker_disabled) {
    border-color: var(--vf-daterangepicker-hover-border-color);
}

.vf-daterangepicker:focus-within:not(.vf-daterangepicker_disabled) {
    border-color: var(--vf-daterangepicker-focus-border-color);
}

.vf-daterangepicker_small {
    .vf-daterangepicker__control {
        padding: var(--vf-daterangepicker-small-padding);
        font-size: var(--vf-daterangepicker-small-font-size);
    }

    .vf-daterangepicker__day {
        width: var(--vf-daterangepicker-small-day-size);
        height: var(--vf-daterangepicker-small-day-size);
    }
}

.vf-daterangepicker_large {
    .vf-daterangepicker__control {
        padding: var(--vf-daterangepicker-large-padding);
        font-size: var(--vf-daterangepicker-large-font-size);
    }

    .vf-daterangepicker__day {
        width: var(--vf-daterangepicker-large-day-size);
        height: var(--vf-daterangepicker-large-day-size);
    }
}

.vf-daterangepicker_disabled {
    opacity: var(--vf-daterangepicker-disabled-opacity);
    cursor: not-allowed;

    .vf-daterangepicker__control {
        cursor: not-allowed;
    }
}
</style>
