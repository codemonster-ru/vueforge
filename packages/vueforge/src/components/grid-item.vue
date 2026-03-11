<template>
    <component :is="as" class="vf-grid-item" :style="itemStyle">
        <slot />
    </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl';

type GridItemBreakpointConfig = {
    span?: number | string;
    start?: number | string;
    end?: number | string;
};

interface Props {
    as?: string;
    span?: number | string;
    start?: number | string;
    end?: number | string;
    breakpoints?: Partial<Record<Breakpoint, GridItemBreakpointConfig>>;
}

defineOptions({ name: 'VfGridItem' });

const props = withDefaults(defineProps<Props>(), {
    as: 'div',
    span: '',
    start: '',
    end: '',
    breakpoints: () => ({}),
});

const composeColumn = (span?: number | string, start?: number | string, end?: number | string) => {
    const spanValue = span === '' || span === undefined ? '' : String(span).trim();
    const startValue = start === '' || start === undefined ? '' : String(start).trim();
    const endValue = end === '' || end === undefined ? '' : String(end).trim();

    if (!spanValue && !startValue && !endValue) {
        return '';
    }

    if (startValue && endValue) {
        return `${startValue} / ${endValue}`;
    }

    if (startValue && spanValue) {
        return `${startValue} / span ${spanValue}`;
    }

    if (endValue && spanValue) {
        return `span ${spanValue} / ${endValue}`;
    }

    if (startValue) {
        return startValue;
    }

    if (endValue) {
        return `auto / ${endValue}`;
    }

    return `span ${spanValue} / span ${spanValue}`;
};

const itemStyle = computed(() => {
    const styles: Record<string, string> = {};
    const baseColumn = composeColumn(props.span, props.start, props.end);

    if (baseColumn) {
        styles['--vf-grid-item-column-override'] = baseColumn;
    }

    const keys: Breakpoint[] = ['sm', 'md', 'lg', 'xl'];

    for (const key of keys) {
        const config = props.breakpoints[key];

        if (!config) {
            continue;
        }

        const column = composeColumn(config.span, config.start, config.end);

        if (column) {
            styles[`--vf-grid-item-column-${key}-override`] = column;
        }
    }

    return styles;
});
</script>

<style lang="scss">
.vf-grid-item {
    min-width: 0;
    grid-column: var(--vf-grid-item-column-override, auto);
}

@media (min-width: 640px) {
    .vf-grid-item {
        grid-column: var(--vf-grid-item-column-sm-override, var(--vf-grid-item-column-override, auto));
    }
}

@media (min-width: 768px) {
    .vf-grid-item {
        grid-column: var(
            --vf-grid-item-column-md-override,
            var(--vf-grid-item-column-sm-override, var(--vf-grid-item-column-override, auto))
        );
    }
}

@media (min-width: 1024px) {
    .vf-grid-item {
        grid-column: var(
            --vf-grid-item-column-lg-override,
            var(
                --vf-grid-item-column-md-override,
                var(--vf-grid-item-column-sm-override, var(--vf-grid-item-column-override, auto))
            )
        );
    }
}

@media (min-width: 1280px) {
    .vf-grid-item {
        grid-column: var(
            --vf-grid-item-column-xl-override,
            var(
                --vf-grid-item-column-lg-override,
                var(
                    --vf-grid-item-column-md-override,
                    var(--vf-grid-item-column-sm-override, var(--vf-grid-item-column-override, auto))
                )
            )
        );
    }
}
</style>
