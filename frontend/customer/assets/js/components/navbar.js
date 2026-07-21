import AuthService from "/auth/services/AuthService.js";

export async function loadNavbar() {

    const response = await fetch("/customer/components/navbar.html");

    document.getElementById("navbar").innerHTML =
        await response.text();

    await renderAuthSection();
}


async function renderAuthSection() {

    const authSection =
        document.getElementById("auth-section");

    if (!authSection)
        return;

    const user =
        await AuthService.validateSession();

    if (user) {

        authSection.innerHTML = `
            <div class="profile-icon">
                <i class="fa-solid fa-circle-user"></i>
            </div>
        `;

    } else {

        authSection.innerHTML = `
            <div class="auth-buttons">
                <a href="/auth/signup.html"
                    class="signup-btn">
                    Sign Up
                </a>

                <a href="/auth/login.html"
                    class="login-btn">
                    Login
                </a>
            </div>
        `;
    }
}