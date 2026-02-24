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

    it('uploads in chunks and emits progress/success in advanced mode', async () => {
        const file = createFile('chunked.bin', 12);
        const uploadRequest = vi.fn(async () => undefined);
        const wrapper = mount(FileUpload, {
            props: {
                multiple: true,
                modelValue: [file],
                advanced: true,
                chunkSize: 5,
                uploadRequest,
            },
        });

        await wrapper.find('.vf-file-upload__actions .vf-file-upload__button').trigger('click');
        await wrapper.vm.$nextTick();

        expect(uploadRequest).toHaveBeenCalledTimes(3);
        expect(wrapper.emitted('uploadProgress')?.length).toBe(3);
        expect(wrapper.emitted('uploadSuccess')?.length).toBe(1);
        expect(wrapper.emitted('uploadComplete')?.[0]?.[0]).toEqual({
            total: 1,
            success: 1,
            failed: 0,
        });
    });

    it('retries failed chunk upload and resumes from failed chunk', async () => {
        const file = createFile('retry.bin', 12);
        let calls = 0;
        const uploadRequest = vi.fn(async (context: { chunkIndex: number }) => {
            calls += 1;

            if (calls === 2) {
                throw new Error(`fail-chunk-${context.chunkIndex.toString()}`);
            }
        });

        const wrapper = mount(FileUpload, {
            props: {
                multiple: true,
                modelValue: [file],
                advanced: true,
                chunkSize: 5,
                maxRetries: 0,
                uploadRequest,
            },
        });

        await wrapper.find('.vf-file-upload__actions .vf-file-upload__button').trigger('click');
        await wrapper.vm.$nextTick();

        expect(wrapper.emitted('uploadError')?.length).toBe(1);
        expect(wrapper.find('.vf-file-upload__retry').exists()).toBe(true);

        await wrapper.find('.vf-file-upload__retry').trigger('click');
        await wrapper.vm.$nextTick();

        expect(uploadRequest).toHaveBeenCalledTimes(4);
        expect(wrapper.emitted('uploadSuccess')?.length).toBe(1);
    });

    it('uses signed URL resolver in advanced mode', async () => {
        const file = createFile('signed.bin', 10);
        const signedUrlResolver = vi.fn(async (context: { chunkIndex: number }) => ({
            url: `https://upload.local/chunk/${context.chunkIndex.toString()}`,
            method: 'PUT',
            headers: { 'x-test': '1' },
        }));
        const uploadRequest = vi.fn(async () => undefined);

        const wrapper = mount(FileUpload, {
            props: {
                multiple: true,
                modelValue: [file],
                advanced: true,
                chunkSize: 4,
                signedUrlResolver,
                uploadRequest,
            },
        });

        await wrapper.find('.vf-file-upload__actions .vf-file-upload__button').trigger('click');
        await wrapper.vm.$nextTick();
        await Promise.resolve();

        expect(signedUrlResolver.mock.calls.length).toBeGreaterThanOrEqual(2);
        expect(uploadRequest.mock.calls.length).toBe(signedUrlResolver.mock.calls.length);
        const firstCall = (
            uploadRequest as unknown as { mock: { calls: Array<Array<{ signedRequest?: { url: string } }>> } }
        ).mock.calls[0]?.[0];
        expect(firstCall?.signedRequest?.url).toContain('/chunk/0');
    });
});
