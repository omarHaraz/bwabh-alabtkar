import { API_CONFIG } from '../config/api-config.js';

export const ProductService = {
    async getAllProducts() {
        const response = await fetch(`${API_CONFIG.BASE_URL}/products`, {
            headers: API_CONFIG.HEADERS
        });
        return await response.json();
    }
};
