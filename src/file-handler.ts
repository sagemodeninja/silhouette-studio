export const projectFileOptions = {
    types: [{
        description: 'Silhouette Studio Tool Project',
        accept: {'application/octet-stream': ['.studio4']}
    }],
    excludeAcceptAllOption: true,
    multiple: false,
};

export const imageFileOptions = {
    types: [{
        description: 'Images',
        accept: {'image/*': ['.png', '.jpeg', '.jpg']},
    }],
    excludeAcceptAllOption: true,
    multiple: false,
};

/**
 * Utility for handling files.
 */
export class FileHandler {
    public static async open(action: string) {
        const options = action === 'open' ? projectFileOptions : imageFileOptions;
        const [handle] = await window.showOpenFilePicker(options);

        return handle;
    }
}

// TODO: Remove if official support comes.
declare const window: Window &
typeof globalThis & {
    showOpenFilePicker: any,
    showSaveFilePicker: any,
}