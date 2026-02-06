import { mount } from '@vue/test-utils';
import FileUpload from '../file-upload.vue';

const createFile = (name: string, size = 1024, type = 'text/plain') => {
    const content = new Array(size).fill('a').join('');

    return new File([content], name, { type });
};

const setInputFiles = (input: HTMLInputElement, files: Array<File>) => {
    Object.defineProperty(input, 'files', {
        value: files,
        writable: false,
    });
};

describe('FileUpload', () => {
    it('emits update:modelValue on file selection', async () => {
        const wrapper = mount(FileUpload);
        const input = wrapper.find('input[type="file"]');
        const file = createFile('hello.txt');

        setInputFiles(input.element as HTMLInputElement, [file]);

        await input.trigger('change');

        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([file]);
    });

    it('rejects files when maxFiles is exceeded', async () => {
        const wrapper = mount(FileUpload, {
            props: {
                multiple: true,
                maxFiles: 1,
            },
        });
        const input = wrapper.find('input[type="file"]');
        const fileA = createFile('a.txt');
        const fileB = createFile('b.txt');

        setInputFiles(input.element as HTMLInputElement, [fileA, fileB]);

        await input.trigger('change');

        const emitted = wrapper.emitted('update:modelValue')?.[0]?.[0] as Array<File>;
        const rejected = wrapper.emitted('reject')?.[0]?.[0] as Array<{ file: File; reason: string }>;

        expect(emitted).toHaveLength(1);
        expect(emitted[0].name).toBe('a.txt');
        expect(rejected).toHaveLength(1);
        expect(rejected[0].file.name).toBe('b.txt');
        expect(rejected[0].reason).toBe('maxFiles');
    });

    it('emits update:modelValue when removing a file', async () => {
        const file = createFile('remove.txt');
        const wrapper = mount(FileUpload, {
            props: {
                multiple: true,
                modelValue: [file],
            },
        });

        await wrapper.find('.vf-file-upload__remove').trigger('click');

        expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual([]);
    });
});
