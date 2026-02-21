<template>
    <component :is="as" class="vf-grid" :style="gridStyle">
        <slot />
    </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type Align = 'start' | 'center' | 'end' | 'stretch';
type Justify = 'start' | 'center' | 'end' | 'stretch';
type Breakpoint = 'sm' | 'md' | 'lg' | 'xl';

type GridBreakpointConfig = {
    columns?: number | string;
    gap?: string;
    columnGap?: string;
    rowGap?: string;
    align?: Align;
    justify?: Justify;
};

interface Props {
    as?: string;
    columns?: number | string;
    gap?: string;
    columnGap?: string;
    rowGap?: string;
    align?: Align;
    justify?: Justify;
    breakpoints?: Partial<Record<Breakpoint, GridBreakpointConfig>>;
}

defineOptions({ name: 'VfGrid' });

const props = withDefaults(defineProps<Props>(), {
    as: 'div',
    columns: '',
    gap: '',
    columnGap: '',
    rowGap: '',
    align: 'stretch',
    justify: 'stretch',
    breakpoints: () => ({}),
});

const normalizeColumns = (value: number | string | undefined) => {
    if (typeof value === 'number') {
        return `repeat(${value}, minmax(0, 1fr))`;
    }

    if (typeof value === 'string') {
        const trimmed = value.trim();

        if (!trimmed) {
            return '';
        }

        if (/^\d+$/.test(trimmed)) {
            return `repeat(${trimmed}, minmax(0, 1fr))`;
        }

        return trimmed;
    }

    return '';
};

const gridStyle = computed(() => {
    const styles: Record<string, string> = {};
    const columns = normalizeColumns(props.columns);

    if (columns) {
        styles['--vf-grid-columns-override'] = columns;
    }

    if (props.gap) {
        styles['--vf-grid-gap-override'] = props.gap;
    }

    if (props.columnGap) {
        styles['--vf-grid-column-gap-override'] = props.columnGap;
    }

    if (props.rowGap) {
        styles['--vf-grid-row-gap-override'] = props.rowGap;
    }

    styles['--vf-grid-align-items-override'] = props.align;
    styles['--vf-grid-justify-items-override'] = props.justify;

    const keys: Breakpoint[] = ['sm', 'md', 'lg', 'xl'];

    for (const key of keys) {
        const config = props.breakpoints[key];

        if (!config) {
            continue;
        }

        const responsiveColumns = normalizeColumns(config.columns);

        if (responsiveColumns) {
            styles[`--vf-grid-columns-${key}-override`] = responsiveColumns;
        }

        if (config.gap) {
            styles[`--vf-grid-gap-${key}-override`] = config.gap;
        }

        if (config.columnGap) {
            styles[`--vf-grid-column-gap-${key}-override`] = config.columnGap;
        }

        if (config.rowGap) {
            styles[`--vf-grid-row-gap-${key}-override`] = config.rowGap;
        }

        if (config.align) {
            styles[`--vf-grid-align-items-${key}-override`] = config.align;
        }

        if (config.justify) {
            styles[`--vf-grid-justify-items-${key}-override`] = config.justify;
        }
    }

    return styles;
});
</script>

<style lang="scss">
.vf-grid {
    display: grid;
    min-width: 0;
    grid-template-columns: var(--vf-grid-columns-override, var(--vf-grid-columns));
    gap: var(--vf-grid-gap-override, var(--vf-grid-gap));
    column-gap: var(--vf-grid-column-gap-override, var(--vf-grid-column-gap));
    row-gap: var(--vf-grid-row-gap-override, var(--vf-grid-row-gap));
    align-items: var(--vf-grid-align-items-override, var(--vf-grid-align-items));
    justify-items: var(--vf-grid-justify-items-override, var(--vf-grid-justify-items));
}

@media (min-width: 640px) {
    .vf-grid {
        grid-template-columns: var(
            --vf-grid-columns-sm-override,
            var(--vf-grid-columns-override, var(--vf-grid-columns))
        );
        gap: var(--vf-grid-gap-sm-override, var(--vf-grid-gap-override, var(--vf-grid-gap)));
        column-gap: var(
            --vf-grid-column-gap-sm-override,
            var(--vf-grid-column-gap-override, var(--vf-grid-column-gap))
        );
        row-gap: var(--vf-grid-row-gap-sm-override, var(--vf-grid-row-gap-override, var(--vf-grid-row-gap)));
        align-items: var(
            --vf-grid-align-items-sm-override,
            var(--vf-grid-align-items-override, var(--vf-grid-align-items))
        );
        justify-items: var(
            --vf-grid-justify-items-sm-override,
            var(--vf-grid-justify-items-override, var(--vf-grid-justify-items))
        );
    }
}

@media (min-width: 768px) {
    .vf-grid {
        grid-template-columns: var(
            --vf-grid-columns-md-override,
            var(--vf-grid-columns-sm-override, var(--vf-grid-columns-override, var(--vf-grid-columns)))
        );
        gap: var(
            --vf-grid-gap-md-override,
            var(--vf-grid-gap-sm-override, var(--vf-grid-gap-override, var(--vf-grid-gap)))
        );
        column-gap: var(
            --vf-grid-column-gap-md-override,
            var(--vf-grid-column-gap-sm-override, var(--vf-grid-column-gap-override, var(--vf-grid-column-gap)))
        );
        row-gap: var(
            --vf-grid-row-gap-md-override,
            var(--vf-grid-row-gap-sm-override, var(--vf-grid-row-gap-override, var(--vf-grid-row-gap)))
        );
        align-items: var(
            --vf-grid-align-items-md-override,
            var(--vf-grid-align-items-sm-override, var(--vf-grid-align-items-override, var(--vf-grid-align-items)))
        );
        justify-items: var(
            --vf-grid-justify-items-md-override,
            var(
                --vf-grid-justify-items-sm-override,
                var(--vf-grid-justify-items-override, var(--vf-grid-justify-items))
            )
        );
    }
}

@media (min-width: 1024px) {
    .vf-grid {
        grid-template-columns: var(
            --vf-grid-columns-lg-override,
            var(
                --vf-grid-columns-md-override,
                var(--vf-grid-columns-sm-override, var(--vf-grid-columns-override, var(--vf-grid-columns)))
            )
        );
        gap: var(
            --vf-grid-gap-lg-override,
            var(
                --vf-grid-gap-md-override,
                var(--vf-grid-gap-sm-override, var(--vf-grid-gap-override, var(--vf-grid-gap)))
            )
        );
        column-gap: var(
            --vf-grid-column-gap-lg-override,
            var(
                --vf-grid-column-gap-md-override,
                var(--vf-grid-column-gap-sm-override, var(--vf-grid-column-gap-override, var(--vf-grid-column-gap)))
            )
        );
        row-gap: var(
            --vf-grid-row-gap-lg-override,
            var(
                --vf-grid-row-gap-md-override,
                var(--vf-grid-row-gap-sm-override, var(--vf-grid-row-gap-override, var(--vf-grid-row-gap)))
            )
        );
        align-items: var(
            --vf-grid-align-items-lg-override,
            var(
                --vf-grid-align-items-md-override,
                var(--vf-grid-align-items-sm-override, var(--vf-grid-align-items-override, var(--vf-grid-align-items)))
            )
        );
        justify-items: var(
            --vf-grid-justify-items-lg-override,
            var(
                --vf-grid-justify-items-md-override,
                var(
                    --vf-grid-justify-items-sm-override,
                    var(--vf-grid-justify-items-override, var(--vf-grid-justify-items))
                )
            )
        );
    }
}

@media (min-width: 1280px) {
    .vf-grid {
        grid-template-columns: var(
            --vf-grid-columns-xl-override,
            var(
                --vf-grid-columns-lg-override,
                var(
                    --vf-grid-columns-md-override,
                    var(--vf-grid-columns-sm-override, var(--vf-grid-columns-override, var(--vf-grid-columns)))
                )
            )
        );
        gap: var(
            --vf-grid-gap-xl-override,
            var(
                --vf-grid-gap-lg-override,
                var(
                    --vf-grid-gap-md-override,
                    var(--vf-grid-gap-sm-override, var(--vf-grid-gap-override, var(--vf-grid-gap)))
                )
            )
        );
        column-gap: var(
            --vf-grid-column-gap-xl-override,
            var(
                --vf-grid-column-gap-lg-override,
                var(
                    --vf-grid-column-gap-md-override,
                    var(--vf-grid-column-gap-sm-override, var(--vf-grid-column-gap-override, var(--vf-grid-column-gap)))
                )
            )
        );
        row-gap: var(
            --vf-grid-row-gap-xl-override,
            var(
                --vf-grid-row-gap-lg-override,
                var(
                    --vf-grid-row-gap-md-override,
                    var(--vf-grid-row-gap-sm-override, var(--vf-grid-row-gap-override, var(--vf-grid-row-gap)))
                )
            )
        );
        align-items: var(
            --vf-grid-align-items-xl-override,
            var(
                --vf-grid-align-items-lg-override,
                var(
                    --vf-grid-align-items-md-override,
                    var(
                        --vf-grid-align-items-sm-override,
                        var(--vf-grid-align-items-override, var(--vf-grid-align-items))
                    )
                )
            )
        );
        justify-items: var(
            --vf-grid-justify-items-xl-override,
            var(
                --vf-grid-justify-items-lg-override,
                var(
                    --vf-grid-justify-items-md-override,
                    var(
                        --vf-grid-justify-items-sm-override,
                        var(--vf-grid-justify-items-override, var(--vf-grid-justify-items))
                    )
                )
            )
        );
    }
}
</style>
