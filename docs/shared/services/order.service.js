import { API_CONFIG } from '../config/api-config.js';

export const OrderService = {
    async createOrder(orderData) {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await fetch(`${API_CONFIG.BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                ...API_CONFIG.HEADERS,
                'Authorization': `Bearer ${user?.token}`
            },
            body: JSON.stringify(orderData)
        });
        return await response.json();
    }
};
