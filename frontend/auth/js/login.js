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

    const username = emailInput.value.trim();
    const password = passwordInput.value;

    try {
            const user = await AuthService.login(username, password);
            const payload = JSON.parse(atob(user.token.split('.')[1]));
            const roles = payload.roles || [];
          
if (roles.includes("ROLE_ADMIN") || roles.includes("ROLE_SUPER_ADMIN")) {
    console.log("Redirecting to admin...");
    window.location.href = "/admin/pages/dashboard.html";
} else {
    console.log("Redirecting to customer...");
    window.location.href = "/customer/pages/home.html";
}
    } catch (error) {
        formError.hidden = false;
        formError.textContent = 'Login failed. Please check your credentials.';
        setFieldError(passwordError, '');
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