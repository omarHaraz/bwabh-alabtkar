import { API_CONFIG } from '../config/api-config.js';

export const AuthService = {
    async login(email, password) {
        const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
            method: 'POST',
            headers: API_CONFIG.HEADERS,
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Login failed');
        if (data.token) {
            localStorage.setItem('user', JSON.stringify(data));
        }
        return data;
    },

    async signup(name, email, password) {
        const response = await fetch(`${API_CONFIG.BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: API_CONFIG.HEADERS,
            body: JSON.stringify({ name, email, password })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Signup failed');
        return data;
    },

    async verifyOtp(email, otpCode) {
        const response = await fetch(`${API_CONFIG.BASE_URL}/auth/verify-otp`, {
            method: 'POST',
            headers: API_CONFIG.HEADERS,
            body: JSON.stringify({ email, otpCode })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'OTP verification failed');
        return data;
    },

    async forgotPassword(email) {
        const response = await fetch(`${API_CONFIG.BASE_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: API_CONFIG.HEADERS,
            body: JSON.stringify({ email })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Forgot password request failed');
        return data;
    },

    async resetPassword(email, otpCode, newPassword) {
        const response = await fetch(`${API_CONFIG.BASE_URL}/auth/reset-password`, {
            method: 'POST',
            headers: API_CONFIG.HEADERS,
            body: JSON.stringify({ email, otpCode, newPassword })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Password reset failed');
        return data;
    },

    logout() {
        localStorage.removeItem('user');
        window.location.href = '/auth/login/index.html';
    },

    getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch (e) {
            return null;
        }
    }
};
