<template>
    <div :class="getClass">
        <div class="vf-calendar__header">
            <button
                class="vf-calendar__nav"
                type="button"
                aria-label="Previous month"
                :disabled="disabled"
                @click="prevMonth"
            >
                &#8249;
            </button>
            <span class="vf-calendar__month-label">{{ monthLabel }}</span>
            <button
                class="vf-calendar__nav"
                type="button"
                aria-label="Next month"
                :disabled="disabled"
                @click="nextMonth"
            >
                &#8250;
            </button>
        </div>
        <div class="vf-calendar__weekdays" role="row">
            <span v-for="day in weekdayLabels" :key="day" class="vf-calendar__weekday">
                {{ day }}
            </span>
        </div>
        <div class="vf-calendar__days" role="grid">
            <button
                v-for="cell in calendarDays"
                :key="cell.key"
                class="vf-calendar__day"
                :class="{
                    'is-outside': !cell.inCurrentMonth,
                    'is-selected': cell.isSelected,
                    'is-today': cell.isToday,
                }"
                type="button"
                :disabled="disabled || cell.isDisabled"
                :data-date="cell.iso"
                @click="selectDate(cell.date)"
            >
                {{ cell.day }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

type Size = 'small' | 'normal' | 'large';
type Variant = 'filled' | 'outlined';

interface Props {
    modelValue?: string;
    disabled?: boolean;
    readonly?: boolean;
    min?: string;
    max?: string;
    locale?: string;
    firstDayOfWeek?: number;
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

const emits = defineEmits(['update:modelValue', 'change']);
const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    disabled: false,
    readonly: false,
    min: undefined,
    max: undefined,
    locale: 'en-US',
    firstDayOfWeek: 0,
    variant: 'filled',
    size: 'normal',
});

const monthCursor = ref(startOfMonth(parseIsoDate(props.modelValue) ?? new Date()));

const selectedDate = computed(() => parseIsoDate(props.modelValue));
const minDate = computed(() => parseIsoDate(props.min));
const maxDate = computed(() => parseIsoDate(props.max));
const monthLabel = computed(() => {
    return monthCursor.value.toLocaleDateString(props.locale, {
        year: 'numeric',
        month: 'long',
    });
});
const weekdayLabels = computed(() => {
    const formatter = new Intl.DateTimeFormat(props.locale, { weekday: 'short' });
    const referenceSunday = new Date(2026, 0, 4);

    return Array.from({ length: 7 }, (_, index) => {
        const shiftedIndex = (index + props.firstDayOfWeek) % 7;
        const labelDate = new Date(referenceSunday);

        labelDate.setDate(referenceSunday.getDate() + shiftedIndex);

        return formatter.format(labelDate);
    });
});
const calendarDays = computed<Array<CalendarCell>>(() => {
    const start = startOfGrid(monthCursor.value, props.firstDayOfWeek);
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
    const classes = ['vf-calendar', `vf-calendar_${props.variant}`];

    if (props.size !== 'normal') {
        classes.push(`vf-calendar_${props.size}`);
    }

    if (props.disabled) {
        classes.push('vf-calendar_disabled');
    }

    return classes;
});

const prevMonth = () => {
    monthCursor.value = shiftMonth(monthCursor.value, -1);
};

const nextMonth = () => {
    monthCursor.value = shiftMonth(monthCursor.value, 1);
};

const selectDate = (date: Date) => {
    if (props.disabled || props.readonly || isDateDisabled(date, minDate.value, maxDate.value)) {
        return;
    }

    const iso = formatIsoDate(date);

    emits('update:modelValue', iso);
    emits('change', iso);
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
</script>

<style lang="scss">
.vf-calendar {
    width: var(--vf-calendar-width);
    max-width: 100%;
    box-sizing: border-box;
    border-radius: var(--vf-calendar-border-radius);
    border: var(--vf-border-width) solid var(--vf-calendar-border-color);
    background-color: var(--vf-calendar-background-color);
    color: var(--vf-calendar-text-color);
    padding: var(--vf-calendar-padding);
    font-size: var(--vf-calendar-font-size);
}

.vf-calendar_outlined {
    background-color: transparent;
}

.vf-calendar__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--vf-calendar-header-gap);
    padding: var(--vf-calendar-header-padding);
}

.vf-calendar__month-label {
    font-size: var(--vf-calendar-month-label-font-size);
    font-weight: var(--vf-calendar-month-label-font-weight);
}

.vf-calendar__nav {
    width: var(--vf-calendar-nav-button-size);
    height: var(--vf-calendar-nav-button-size);
    border-radius: var(--vf-calendar-nav-button-radius);
    border: none;
    background: transparent;
    color: inherit;
    cursor: pointer;
    font-size: var(--vf-calendar-nav-button-font-size);
    line-height: 1;
}

.vf-calendar__nav:hover:not(:disabled),
.vf-calendar__nav:focus-visible:not(:disabled) {
    background-color: var(--vf-calendar-day-hover-background-color);
    outline: none;
}

.vf-calendar__weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    margin-bottom: var(--vf-calendar-weekdays-margin-bottom);
}

.vf-calendar__weekday {
    text-align: center;
    color: var(--vf-calendar-weekday-color);
    font-size: var(--vf-calendar-weekday-font-size);
    line-height: 1.2;
}

.vf-calendar__days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: var(--vf-calendar-days-gap);
}

.vf-calendar__day {
    width: var(--vf-calendar-day-size);
    height: var(--vf-calendar-day-size);
    margin: 0 auto;
    border-radius: var(--vf-calendar-day-border-radius);
    border: var(--vf-border-width) solid transparent;
    background: transparent;
    color: inherit;
    cursor: pointer;
    font-size: var(--vf-calendar-day-font-size);
    line-height: 1;
}

.vf-calendar__day:hover:not(:disabled),
.vf-calendar__day:focus-visible:not(:disabled) {
    background-color: var(--vf-calendar-day-hover-background-color);
    outline: none;
}

.vf-calendar__day.is-selected {
    background-color: var(--vf-calendar-day-selected-background-color);
    color: var(--vf-calendar-day-selected-text-color);
}

.vf-calendar__day.is-today {
    border-color: var(--vf-calendar-day-today-border-color);
}

.vf-calendar__day.is-outside {
    color: var(--vf-calendar-day-muted-color);
}

.vf-calendar__day:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.vf-calendar_small {
    padding: var(--vf-calendar-small-padding);
    font-size: var(--vf-calendar-small-font-size);

    .vf-calendar__day {
        width: var(--vf-calendar-small-day-size);
        height: var(--vf-calendar-small-day-size);
    }
}

.vf-calendar_large {
    padding: var(--vf-calendar-large-padding);
    font-size: var(--vf-calendar-large-font-size);

    .vf-calendar__day {
        width: var(--vf-calendar-large-day-size);
        height: var(--vf-calendar-large-day-size);
    }
}

.vf-calendar_disabled {
    opacity: var(--vf-calendar-disabled-opacity);
    cursor: not-allowed;
}
</style>
