<template>
    <div ref="root" :class="getClass">
        <button
            ref="control"
            class="vf-datetimepicker__control"
            type="button"
            :disabled="disabled"
            :aria-readonly="readonly ? 'true' : undefined"
            :aria-label="ariaLabel"
            :aria-expanded="open"
            :aria-controls="panelId"
            aria-haspopup="dialog"
            @click="togglePanel"
            @keydown.down.prevent="openAndFocusTime"
            @keydown.enter.prevent="togglePanel"
            @keydown.esc.prevent="close"
            @focus="onFocus"
            @blur="onBlur"
        >
            <span class="vf-datetimepicker__label" :class="{ 'vf-datetimepicker__label_placeholder': !selectedLabel }">
                {{ selectedLabel || placeholder }}
            </span>
            <span class="vf-datetimepicker__chevron" aria-hidden="true">&#9662;</span>
        </button>
        <Teleport to="body">
            <div
                v-show="open"
                :id="panelId"
                ref="panel"
                class="vf-datetimepicker__panel"
                role="dialog"
                :aria-label="panelAriaLabel"
                :data-placement="currentPlacement"
                @keydown.esc.prevent="close"
            >
                <div class="vf-datetimepicker__calendar">
                    <div class="vf-datetimepicker__header">
                        <button
                            class="vf-datetimepicker__nav"
                            type="button"
                            aria-label="Previous month"
                            @click="prevMonth"
                        >
                            &#8249;
                        </button>
                        <span class="vf-datetimepicker__month-label">{{ monthLabel }}</span>
                        <button class="vf-datetimepicker__nav" type="button" aria-label="Next month" @click="nextMonth">
                            &#8250;
                        </button>
                    </div>
                    <div class="vf-datetimepicker__weekdays" role="row">
                        <span v-for="day in weekdayLabels" :key="day" class="vf-datetimepicker__weekday">
                            {{ day }}
                        </span>
                    </div>
                    <div class="vf-datetimepicker__days" role="grid">
                        <button
                            v-for="cell in calendarDays"
                            :key="cell.key"
                            class="vf-datetimepicker__day"
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
                <div class="vf-datetimepicker__times" role="listbox" :aria-label="timeListAriaLabel">
                    <button
                        v-for="(option, index) in timeOptions"
                        :id="getTimeOptionId(index)"
                        :key="option.value"
                        class="vf-datetimepicker__time"
                        :class="{ 'is-active': option.isSelected, 'is-disabled': option.isDisabled }"
                        type="button"
                        role="option"
                        :data-time="option.value"
                        :disabled="option.isDisabled"
                        :aria-selected="option.isSelected"
                        @focus="onTimeOptionFocus(index)"
                        @keydown="onTimeOptionKeydown($event, index)"
                        @click="selectTime(option.minutes)"
                    >
                        {{ option.label }}
                    </button>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { autoUpdate, computePosition, flip, offset } from '@codemonster-ru/floater.js';

type Size = 'small' | 'normal' | 'large';
type Variant = 'filled' | 'outlined';
type TimeFormat = '24h' | '12h';
type Placement = 'bottom' | 'top';

interface Props {
    modelValue?: string;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    min?: string;
    max?: string;
    locale?: string;
    firstDayOfWeek?: number;
    minuteStep?: number;
    format?: TimeFormat;
    ariaLabel?: string;
    panelAriaLabel?: string;
    timeListAriaLabel?: string;
    variant?: Variant;
    size?: Size;
}

interface ParsedDateTime {
    date: Date;
    minutes: number;
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

interface TimeOption {
    value: string;
    label: string;
    minutes: number;
    isSelected: boolean;
    isDisabled: boolean;
}

type FloaterInstance = {
    update: () => Promise<void>;
    destroy: () => void;
} | null;

let datetimePickerIdCounter = 0;

const emits = defineEmits(['update:modelValue', 'change', 'focus', 'blur']);
const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    placeholder: '',
    disabled: false,
    readonly: false,
    min: undefined,
    max: undefined,
    locale: 'en-US',
    firstDayOfWeek: 0,
    minuteStep: 30,
    format: '24h',
    ariaLabel: 'Date and time picker',
    panelAriaLabel: 'Date and time selection',
    timeListAriaLabel: 'Time options',
    variant: 'filled',
    size: 'normal',
});

const root = ref<HTMLElement | null>(null);
const control = ref<HTMLButtonElement | null>(null);
const panel = ref<HTMLElement | null>(null);
const open = ref(false);
const focusedTimeIndex = ref(-1);
const basePlacement = ref<Placement>('bottom');
const currentPlacement = ref<Placement>('bottom');
const panelId = `vf-datetimepicker-panel-${++datetimePickerIdCounter}`;
const monthCursor = ref(startOfMonth(new Date()));
const draftDate = ref<Date | null>(null);
const draftMinutes = ref<number | null>(null);
let floater: FloaterInstance = null;

const stepMinutes = computed(() => {
    if (!props.minuteStep || props.minuteStep <= 0) {
        return 30;
    }

    return Math.min(Math.max(Math.round(props.minuteStep), 1), 1440);
});
const selectedDateTime = computed(() => parseIsoDateTime(props.modelValue));
const minDateTime = computed(() => parseIsoDateTime(props.min));
const maxDateTime = computed(() => parseIsoDateTime(props.max));

const selectedLabel = computed(() => {
    if (!selectedDateTime.value) {
        return '';
    }

    const dateLabel = selectedDateTime.value.date.toLocaleDateString(props.locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
    const timeLabel = formatTimeLabel(selectedDateTime.value.minutes, props.format);

    return `${dateLabel}, ${timeLabel}`;
});
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
    const selectedIso = draftDate.value ? formatIsoDate(draftDate.value) : null;
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
            isDisabled: isDateDisabled(date, minDateTime.value, maxDateTime.value),
            isSelected: selectedIso === iso,
            isToday: iso === todayIso,
        };
    });
});
const timeOptions = computed<Array<TimeOption>>(() => {
    const options: Array<TimeOption> = [];

    for (let minutes = 0; minutes < 1440; minutes += stepMinutes.value) {
        options.push({
            value: formatTime(minutes),
            label: formatTimeLabel(minutes, props.format),
            minutes,
            isSelected: draftMinutes.value === minutes,
            isDisabled: isTimeDisabled(draftDate.value, minutes, minDateTime.value, maxDateTime.value),
        });
    }

    return options;
});
const getClass = computed(() => {
    const classes = [
        'vf-datetimepicker',
        `vf-datetimepicker_${props.variant}`,
        open.value ? 'vf-datetimepicker_open' : '',
    ];

    if (props.size !== 'normal') {
        classes.push(`vf-datetimepicker_${props.size}`);
    }

    if (props.disabled) {
        classes.push('vf-datetimepicker_disabled');
    }

    return classes.filter(Boolean);
});
const getTimeOptionId = (index: number) => `${panelId}-time-option-${index}`;
const firstEnabledTimeIndex = () => timeOptions.value.findIndex(option => !option.isDisabled);
const focusTimeOption = (index: number) => {
    if (index < 0 || index >= timeOptions.value.length) {
        return;
    }

    focusedTimeIndex.value = index;
    panel.value?.querySelectorAll<HTMLButtonElement>('.vf-datetimepicker__time')[index]?.focus();
};
const moveTimeFocus = (step: 1 | -1) => {
    if (!timeOptions.value.length) {
        return;
    }

    let index = focusedTimeIndex.value;
    const size = timeOptions.value.length;

    if (index < 0 || index >= size) {
        index = step > 0 ? -1 : size;
    }

    for (let i = 0; i < size; i += 1) {
        index = (index + step + size) % size;

        if (!timeOptions.value[index].isDisabled) {
            focusTimeOption(index);

            return;
        }
    }
};

const onFocus = (event: FocusEvent) => emits('focus', event);
const onBlur = (event: FocusEvent) => emits('blur', event);

const emitValueIfReady = () => {
    if (!draftDate.value || draftMinutes.value === null) {
        return;
    }

    if (isTimeDisabled(draftDate.value, draftMinutes.value, minDateTime.value, maxDateTime.value)) {
        return;
    }

    const iso = formatIsoDateTime(draftDate.value, draftMinutes.value);

    emits('update:modelValue', iso);
    emits('change', iso);
};

const syncDraftFromModel = () => {
    const parsed = selectedDateTime.value;

    if (parsed) {
        draftDate.value = parsed.date;
        draftMinutes.value = parsed.minutes;
        monthCursor.value = startOfMonth(parsed.date);

        return;
    }

    draftDate.value = null;
    draftMinutes.value = null;
};

const ensureValidTimeForDate = (date: Date) => {
    if (
        draftMinutes.value !== null &&
        !isTimeDisabled(date, draftMinutes.value, minDateTime.value, maxDateTime.value)
    ) {
        return;
    }

    const firstAvailable = timeOptions.value.find(
        option => !isTimeDisabled(date, option.minutes, minDateTime.value, maxDateTime.value),
    );

    draftMinutes.value = firstAvailable ? firstAvailable.minutes : null;
};

const openPanel = () => {
    if (props.disabled || props.readonly) {
        return;
    }

    syncDraftFromModel();

    if (!draftDate.value) {
        draftDate.value = startOfDay(new Date());
        monthCursor.value = startOfMonth(draftDate.value);
    }

    ensureValidTimeForDate(draftDate.value);

    open.value = true;
    basePlacement.value = 'bottom';
    currentPlacement.value = 'bottom';
};
const openAndFocusTime = async () => {
    if (props.disabled || props.readonly) {
        return;
    }

    if (!open.value) {
        openPanel();
        await nextTick();
    }

    focusTimeOption(firstEnabledTimeIndex());
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
    if (props.readonly || isDateDisabled(date, minDateTime.value, maxDateTime.value)) {
        return;
    }

    draftDate.value = startOfDay(date);

    ensureValidTimeForDate(draftDate.value);
    emitValueIfReady();
};

const selectTime = (minutes: number) => {
    if (props.readonly || !draftDate.value) {
        return;
    }

    if (isTimeDisabled(draftDate.value, minutes, minDateTime.value, maxDateTime.value)) {
        return;
    }

    draftMinutes.value = minutes;

    emitValueIfReady();
    close();
};
const onTimeOptionFocus = (index: number) => {
    focusedTimeIndex.value = index;
};
const onTimeOptionKeydown = (event: KeyboardEvent, index: number) => {
    if (!open.value || props.disabled || props.readonly) {
        return;
    }

    if (event.key === 'ArrowDown') {
        event.preventDefault();
        moveTimeFocus(1);

        return;
    }

    if (event.key === 'ArrowUp') {
        event.preventDefault();
        moveTimeFocus(-1);

        return;
    }

    if (event.key === 'Home') {
        event.preventDefault();
        focusTimeOption(firstEnabledTimeIndex());

        return;
    }

    if (event.key === 'End') {
        event.preventDefault();

        for (let i = timeOptions.value.length - 1; i >= 0; i -= 1) {
            if (!timeOptions.value[i].isDisabled) {
                focusTimeOption(i);
                break;
            }
        }

        return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const option = timeOptions.value[index];

        if (option && !option.isDisabled) {
            selectTime(option.minutes);
            control.value?.focus();
        }

        return;
    }

    if (event.key === 'Escape') {
        event.preventDefault();
        close();
        control.value?.focus();
    }
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
        const margin = 8;
        const panelWidth = floating.getBoundingClientRect().width;
        const maxX = Math.max(margin, window.innerWidth - panelWidth - margin);
        const clampedX = Math.min(Math.max(x, margin), maxX);

        floating.style.left = `${clampedX}px`;
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
        const parsed = parseIsoDateTime(value);

        if (parsed) {
            monthCursor.value = startOfMonth(parsed.date);
        }
    },
    { immediate: true },
);

watch(
    () => [props.min, props.max, props.minuteStep],
    () => {
        if (draftDate.value) {
            ensureValidTimeForDate(draftDate.value);
        }
        void floater?.update();
    },
);

watch(open, async value => {
    if (!value) {
        focusedTimeIndex.value = -1;
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

    if (focusedTimeIndex.value < 0) {
        const selectedIndex = timeOptions.value.findIndex(option => option.isSelected && !option.isDisabled);

        focusedTimeIndex.value = selectedIndex >= 0 ? selectedIndex : firstEnabledTimeIndex();
    }
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

function parseTime(value?: string) {
    if (!value) {
        return null;
    }

    const match = value.match(/^(\d{2}):(\d{2})$/);

    if (!match) {
        return null;
    }

    const hours = Number(match[1]);
    const minutes = Number(match[2]);

    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
        return null;
    }

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        return null;
    }

    return hours * 60 + minutes;
}

function parseIsoDateTime(value?: string): ParsedDateTime | null {
    if (!value) {
        return null;
    }

    const match = value.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})$/);

    if (!match) {
        return null;
    }

    const date = parseIsoDate(match[1]);
    const minutes = parseTime(match[2]);

    if (!date || minutes === null) {
        return null;
    }

    return { date, minutes };
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

function formatTime(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

function formatIsoDateTime(date: Date, minutes: number) {
    return `${formatIsoDate(date)}T${formatTime(minutes)}`;
}

function formatTimeLabel(minutes: number, format: TimeFormat) {
    if (format === '12h') {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const period = hours >= 12 ? 'PM' : 'AM';
        const normalized = hours % 12 || 12;

        return `${normalized}:${String(mins).padStart(2, '0')} ${period}`;
    }

    return formatTime(minutes);
}

function isDateDisabled(date: Date, min: ParsedDateTime | null, max: ParsedDateTime | null) {
    const dayTime = startOfDay(date).getTime();

    if (min && dayTime < min.date.getTime()) {
        return true;
    }

    if (max && dayTime > max.date.getTime()) {
        return true;
    }

    return false;
}

function isTimeDisabled(date: Date | null, minutes: number, min: ParsedDateTime | null, max: ParsedDateTime | null) {
    if (!date) {
        return true;
    }

    const currentDay = startOfDay(date).getTime();

    if (min && currentDay === min.date.getTime() && minutes < min.minutes) {
        return true;
    }

    if (max && currentDay === max.date.getTime() && minutes > max.minutes) {
        return true;
    }

    return false;
}
</script>

<style lang="scss">
.vf-datetimepicker {
    position: relative;
    display: inline-block;
    min-width: var(--vf-datetimepicker-min-width);
    height: var(--vf-controls-height);
    box-sizing: border-box;
    border-radius: var(--vf-datetimepicker-border-radius);
    border: var(--vf-border-width) solid var(--vf-datetimepicker-border-color);
    background-color: var(--vf-datetimepicker-background-color);
    color: var(--vf-datetimepicker-text-color);
    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
}

.vf-datetimepicker_outlined {
    background-color: transparent;
}

.vf-datetimepicker__control {
    width: 100%;
    height: var(--vf-controls-height);
    box-sizing: border-box;
    border: none;
    background: transparent;
    color: inherit;
    padding: var(--vf-datetimepicker-padding);
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--vf-datetimepicker-control-gap);
    font-size: var(--vf-datetimepicker-font-size);
    line-height: var(--vf-typography-line-height);
    font-family: inherit;
    cursor: pointer;
    outline: none;
}

.vf-datetimepicker__label {
    text-align: left;
}

.vf-datetimepicker__label_placeholder {
    color: var(--vf-datetimepicker-placeholder-color);
}

.vf-datetimepicker__chevron {
    font-size: var(--vf-datetimepicker-chevron-size);
    opacity: 0.7;
}

.vf-datetimepicker__panel {
    position: fixed;
    z-index: 50;
    width: var(--vf-datetimepicker-panel-width);
    max-width: calc(100vw - 1rem);
    padding: var(--vf-datetimepicker-panel-padding);
    border-radius: calc(var(--vf-datetimepicker-border-radius) + var(--vf-datetimepicker-panel-radius-offset));
    border: var(--vf-border-width) solid var(--vf-datetimepicker-panel-border-color);
    background-color: var(--vf-datetimepicker-panel-background-color);
    box-shadow: var(--vf-datetimepicker-panel-shadow);
    color: var(--vf-datetimepicker-text-color);
    display: flex;
    align-items: flex-start;
    gap: var(--vf-datetimepicker-panel-gap);
    box-sizing: border-box;
    overflow: hidden;
}

.vf-datetimepicker__calendar {
    flex: 1 1 auto;
    min-width: 0;
}

.vf-datetimepicker__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--vf-datetimepicker-header-gap);
    padding: var(--vf-datetimepicker-header-padding);
}

.vf-datetimepicker__month-label {
    font-size: var(--vf-datetimepicker-month-label-font-size);
    font-weight: var(--vf-datetimepicker-month-label-font-weight);
}

.vf-datetimepicker__nav {
    width: var(--vf-datetimepicker-nav-button-size);
    height: var(--vf-datetimepicker-nav-button-size);
    border-radius: var(--vf-datetimepicker-nav-button-radius);
    border: none;
    background: transparent;
    color: inherit;
    cursor: pointer;
    font-size: var(--vf-datetimepicker-nav-button-font-size);
    line-height: 1;
}

.vf-datetimepicker__nav:hover,
.vf-datetimepicker__nav:focus-visible {
    background-color: var(--vf-datetimepicker-day-hover-background-color);
    outline: none;
}

.vf-datetimepicker__weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    margin-bottom: var(--vf-datetimepicker-weekdays-margin-bottom);
}

.vf-datetimepicker__weekday {
    text-align: center;
    color: var(--vf-datetimepicker-weekday-color);
    font-size: var(--vf-datetimepicker-weekday-font-size);
}

.vf-datetimepicker__days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: var(--vf-datetimepicker-days-gap);
}

.vf-datetimepicker__day {
    width: var(--vf-datetimepicker-day-size);
    height: var(--vf-datetimepicker-day-size);
    margin: 0 auto;
    border-radius: var(--vf-datetimepicker-day-border-radius);
    border: var(--vf-border-width) solid transparent;
    background: transparent;
    color: inherit;
    cursor: pointer;
    font-size: var(--vf-datetimepicker-day-font-size);
    line-height: 1;
}

.vf-datetimepicker__day:hover:not(:disabled),
.vf-datetimepicker__day:focus-visible:not(:disabled) {
    background-color: var(--vf-datetimepicker-day-hover-background-color);
    outline: none;
}

.vf-datetimepicker__day.is-selected {
    background-color: var(--vf-datetimepicker-day-selected-background-color);
    color: var(--vf-datetimepicker-day-selected-text-color);
}

.vf-datetimepicker__day.is-today {
    border-color: var(--vf-datetimepicker-day-today-border-color);
}

.vf-datetimepicker__day.is-outside {
    color: var(--vf-datetimepicker-day-muted-color);
}

.vf-datetimepicker__day:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.vf-datetimepicker__times {
    flex: 0 0 var(--vf-datetimepicker-times-width);
    width: var(--vf-datetimepicker-times-width);
    max-height: var(--vf-datetimepicker-times-max-height);
    overflow: auto;
    padding-left: var(--vf-datetimepicker-times-padding-left);
    border-left: var(--vf-border-width) solid var(--vf-datetimepicker-times-border-color);
    box-sizing: border-box;
}

.vf-datetimepicker__time {
    width: 100%;
    text-align: left;
    border: none;
    background: transparent;
    padding: var(--vf-datetimepicker-time-option-padding);
    border-radius: var(--vf-datetimepicker-time-option-border-radius);
    color: inherit;
    cursor: pointer;
    font-size: var(--vf-datetimepicker-time-option-font-size);
    line-height: var(--vf-typography-line-height);
    font-family: inherit;
}

.vf-datetimepicker__time:hover:not(.is-disabled),
.vf-datetimepicker__time:focus-visible:not(.is-disabled) {
    background-color: var(--vf-datetimepicker-time-option-hover-background-color);
    outline: none;
}

.vf-datetimepicker__time.is-active {
    background-color: var(--vf-datetimepicker-time-option-active-background-color);
    color: var(--vf-datetimepicker-time-option-active-text-color);
}

.vf-datetimepicker__time.is-disabled {
    opacity: var(--vf-datetimepicker-disabled-opacity);
    cursor: not-allowed;
}

.vf-datetimepicker_open {
    border-color: var(--vf-datetimepicker-focus-border-color);
    box-shadow: var(--vf-datetimepicker-focus-ring-shadow);
}

.vf-datetimepicker:hover:not(.vf-datetimepicker_disabled) {
    border-color: var(--vf-datetimepicker-hover-border-color);
}

.vf-datetimepicker:focus-within:not(.vf-datetimepicker_disabled) {
    border-color: var(--vf-datetimepicker-focus-border-color);
}

.vf-datetimepicker_small {
    .vf-datetimepicker__control {
        padding: var(--vf-datetimepicker-small-padding);
        font-size: var(--vf-datetimepicker-small-font-size);
    }

    .vf-datetimepicker__day {
        width: var(--vf-datetimepicker-small-day-size);
        height: var(--vf-datetimepicker-small-day-size);
    }
}

.vf-datetimepicker_large {
    .vf-datetimepicker__control {
        padding: var(--vf-datetimepicker-large-padding);
        font-size: var(--vf-datetimepicker-large-font-size);
    }

    .vf-datetimepicker__day {
        width: var(--vf-datetimepicker-large-day-size);
        height: var(--vf-datetimepicker-large-day-size);
    }
}

.vf-datetimepicker_disabled {
    opacity: var(--vf-datetimepicker-disabled-opacity);
    cursor: not-allowed;

    .vf-datetimepicker__control {
        cursor: not-allowed;
    }
}

@media (max-width: 700px) {
    .vf-datetimepicker__panel {
        width: min(var(--vf-datetimepicker-panel-width), calc(100vw - 1rem));
        flex-direction: column;
    }

    .vf-datetimepicker__times {
        width: 100%;
        flex-basis: auto;
        max-height: 10rem;
        padding-left: 0;
        padding-top: 0.35rem;
        border-left: none;
        border-top: var(--vf-border-width) solid var(--vf-datetimepicker-times-border-color);
    }
}
</style>
