import { Ref, ref } from 'vue';
import { defineStore } from 'pinia';

export const useModeStore = defineStore('mode', () => {
    const mode: Ref<string | null> = ref(null);
    const getMode = () => mode.value = localStorage.getItem('darkMode') || 'system';
    const setMode = (value: string) => {
        localStorage.setItem('darkMode', value);
        getMode();
    };

    return { mode, getMode, setMode };
});