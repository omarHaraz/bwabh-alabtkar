import { API_CONFIG } from '../config/api-config.js';

export const CategoryService = {
    async getCategories() {
        const response = await fetch(`${API_CONFIG.BASE_URL}/categories`, {
            headers: API_CONFIG.HEADERS
        });
        return await response.json();
    }
};
