import axios from "https://cdn.skypack.dev/axios";

const API_URL = "http://localhost:8080/api/auth/";

class AuthService {

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

    // NEW
    async validateSession() {

        const token = this.getToken();

        if (!token)
            return null;

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
}

export default new AuthService();