import AuthService from '../services/AuthService.js';

const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const formError = document.getElementById('formError');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');

const setFieldError = (field, message) => {
    field.textContent = message;
};

const clearErrors = () => {
    formError.hidden = true;
    formError.textContent = '';
    setFieldError(emailError, '');
    setFieldError(passwordError, '');
};

const validateForm = () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    let isValid = true;

    if (!email) {
        setFieldError(emailError, 'Email is required.');
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setFieldError(emailError, 'Please enter a valid email address.');
        isValid = false;
    }

    if (!password) {
        setFieldError(passwordError, 'Password is required.');
        isValid = false;
    } else if (password.length < 6) {
        setFieldError(passwordError, 'Password must be at least 6 characters.');
        isValid = false;
    }

    return isValid;
};

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    if (!validateForm()) {
        return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    try {
            const user = await AuthService.login(email, password);
            const payload = JSON.parse(atob(user.token.split('.')[1]));
            const roles = payload.roles || [];
          
const repoPrefix = window.location.pathname.includes("/customer/")
    ? window.location.pathname.split("/customer/")[0]
    : window.location.pathname.includes("/auth/")
        ? window.location.pathname.split("/auth/")[0]
        : window.location.pathname.includes("/admin/")
            ? window.location.pathname.split("/admin/")[0]
            : "";

if (roles.includes("ROLE_ADMIN") || roles.includes("ROLE_SUPER_ADMIN")) {
    console.log("Redirecting to admin...");
    window.location.href = `${repoPrefix}/admin/pages/dashboard.html`;
} else {
    console.log("Redirecting to customer...");
    window.location.href = `${repoPrefix}/customer/pages/home.html`;
}
    } catch (error) {
        formError.hidden = false;
        const resData = error.response?.data;
        if (resData && typeof resData === 'object' && resData.fieldErrors) {
            const fe = resData.fieldErrors;
            if (fe.email) setFieldError(emailError, fe.email);
            if (fe.password) setFieldError(passwordError, fe.password);
            formError.textContent = resData.message || 'Please correct the errors above.';
        } else if (resData && typeof resData === 'object' && resData.message) {
            formError.textContent = resData.message;
        } else {
            formError.textContent = typeof resData === 'string' ? resData : 'Login failed. Please check your credentials.';
        }
    }
});

[emailInput, passwordInput].forEach((input) => {
    input.addEventListener('input', clearErrors);
});

const togglePassword = document.getElementById('togglePassword');
const eyeIcon = togglePassword.querySelector('i');

togglePassword.addEventListener('click', () => {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
        togglePassword.setAttribute('aria-label', 'Hide password');
    } else {
        passwordInput.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
        togglePassword.setAttribute('aria-label', 'Show password');
    }
});