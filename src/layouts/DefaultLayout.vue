<template>
    <DefaultLayout>
        <template #headerLeft>
            <Logo
                alt='Codemonster UI'
                type='router-link'
                :to='{ name: "home" }'
                src='/src/assets/images/logo.svg'
                height='20px'
            />
        </template>
        <template #headerRight>
            <Menu :items='data.menuList' orientation='horizontal'>
                <template #[getVersionName]>
                    {{ data.menuList[2].label }}
                </template>
                <template #[getThemePickerName]>
                    <Popover ref='popover' v-click-outside='hide' @on-click='toggle'>
                        <template #button>
                            <div class='cm-menu__link'>
                                <cm-icon :icon='getModeActive' />
                            </div>
                        </template>
                        <template #default>
                            <Menu :items='data.modeList' />
                        </template>
                    </Popover>
                </template>
            </Menu>
        </template>
        <template #footerDefault>
            <div class='cm-footer__copyright'>
                <span>Released under the MIT License.</span>
                <span>Copyright © 2024-present Kirill Kolesnikov</span>
            </div>
        </template>
    </DefaultLayout>
</template>

<script setup lang='ts'>
import { useModeStore } from '@/stores/mode';
import { ref, computed, reactive, onMounted } from 'vue';
import { CmIcon } from '@codemonster-ru/icons';
import { Logo, Menu, Popover, vClickOutside, DefaultLayout } from '@/lib';

onMounted(() => modeStore.getMode());

const modeStore = useModeStore();
const popover = ref();
const data = reactive({
    menuList: [
        {
            label: 'Docs',
            to: { name: 'docs' },
        },
        {
            separator: true,
        },
        {
            label: `v${__APP_VERSION__}`,
            disabled: true,
        },
        {
            separator: true,
        },
        {
            label: 'Dark',
        },
    ],
    modeList: [
        {
            icon: 'sun',
            label: 'Light',
            active: false,
            command: () => setModeActive('light'),
        },
        {
            icon: 'moon',
            label: 'Dark',
            active: false,
            command: () => setModeActive('dark'),
        },
        {
            icon: 'circleHalf',
            label: 'Auto',
            active: false,
            command: () => setModeActive('auto'),
        },
    ],
});
const hide = () => popover.value.hide();
const toggle = () => popover.value.toggle();
const getVersionName = computed(() => `${data.menuList[2].label}_2`);
const getThemePickerName = computed(() => `${data.menuList[4].label}_4`);
const getModeActive = computed(() => {
    data.modeList.map((x) => x.active = x.label.toLowerCase() === modeStore.mode);

    let icon = 'sun';

    if (modeStore.mode === 'dark') {
        icon = 'moon';
    } else if (modeStore.mode === 'auto') {
        icon = 'circleHalf';
    }

    if (modeStore.mode === 'dark' || (modeStore.mode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.dataset.theme = 'dark';
    } else {
        delete document.documentElement.dataset.theme;
    }

    return icon;
});
const setModeActive = (value: string) => {
    modeStore.setMode(value);
    hide();
};
</script>