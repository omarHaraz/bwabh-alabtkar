import AuthService from "/auth/services/AuthService.js";

export async function requireLogin() {

    const user = await AuthService.validateSession();

    if (!user) {

        window.location.href = "/auth/login.html";

        return null;
    }

    return user;
}