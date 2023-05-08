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