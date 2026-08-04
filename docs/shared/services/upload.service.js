import { API_CONFIG } from '../config/api-config.js';

export const UploadService = {
    async uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch(`${API_CONFIG.BASE_URL}/upload`, {
            method: 'POST',
            body: formData
        });
        return await response.json();
    }
};
