import axios from "https://cdn.skypack.dev/axios";

const API_URL = "http://localhost:8080/api/auth/";

class AuthService {

    // ==========================
    // Authentication
    // ==========================

    async login(email, password) {

        const response = await axios.post(API_URL + "login", {
            email,
            password
        });

        if (response.data.token) {
            localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
    }

    logout() {
        localStorage.removeItem("user");
    }

    // ==========================
    // Signup
    // ==========================

    async requestOtp(signupData) {

        const response = await axios.post(
            API_URL + "request-otp",
            signupData
        );

        return response.data;
    }

    async verifyOtp(email, code) {

        const response = await axios.post(
            API_URL + "verify-otp",
            {
                email,
                code
            }
        );

        if (response.data.token) {
            localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
    }

    async resendOtp(email) {

        const response = await axios.post(
            API_URL + "resend-otp",
            {
                email
            }
        );

        return response.data;
    }

    // ==========================
    // User
    // ==========================

    getCurrentUser() {

        const user = localStorage.getItem("user");

        return user ? JSON.parse(user) : null;
    }

    getToken() {
        return this.getCurrentUser()?.token || null;
    }

    getAuthHeader() {

        const token = this.getToken();

        return token
            ? {
                  Authorization: `Bearer ${token}`
              }
            : {};
    }

    isLoggedIn() {
        return this.getToken() !== null;
    }

    async validateSession() {

        const token = this.getToken();

        if (!token) {
            return null;
        }

        try {

            const response = await axios.get(
                API_URL + "me",
                {
                    headers: this.getAuthHeader()
                }
            );

            return response.data;

        } catch (e) {

            this.logout();

            return null;
        }
    }


    async forgotPassword(email) {
    
        const response = await axios.post(
            API_URL + "forgot-password",
            {
                email
            }
        );
    
        return response.data;
    }
    
    async verifyResetCode(email, code) {
    
        const response = await axios.post(
            API_URL + "verify-reset-code",
            {
                email,
                code
            }
        );
    
        return response.data;
    }
    
    async resendResetCode(email) {
    
        const response = await axios.post(
            API_URL + "resend-reset-code",
            {
                email
            }
        );
    
        return response.data;
    }
    
    async resetPassword(email, code, password) {
    
        const response = await axios.post(
            API_URL + "reset-password",
            {
                email,
                code,
                password
            }
        );
    
        return response.data;
    }


}








export default new AuthService();