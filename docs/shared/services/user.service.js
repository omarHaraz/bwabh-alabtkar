import { API_CONFIG } from '../config/api-config.js';

export const UserService = {
    async getProfile() {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await fetch(`${API_CONFIG.BASE_URL}/user/profile`, {
            headers: {
                ...API_CONFIG.HEADERS,
                'Authorization': `Bearer ${user?.token}`
            }
        });
        return await response.json();
    }
};
