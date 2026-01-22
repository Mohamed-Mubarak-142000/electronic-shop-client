import api from './api';

export const uploadService = {
    async uploadImages(files: FileList | File[]): Promise<string[]> {
        const formData = new FormData();
        // Handle both FileList and File[]
        if (files instanceof FileList) {
            for (let i = 0; i < files.length; i++) {
                formData.append('images', files[i]);
            }
        } else {
            files.forEach(file => {
                formData.append('images', file);
            });
        }

        const response = await api.post('/upload/cloudinary/multiple', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        return response.data;
    },

    async uploadImage(file: File): Promise<{ path: string }> {
        const formData = new FormData();
        formData.append('image', file);

        const response = await api.post('/upload/cloudinary', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        return response.data;
    }
};

