const API_URL = 'http://localhost:8080/api/auth/';

document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const formError = document.getElementById('formError');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const otpError = document.getElementById('otpError');

    const setFieldError = (field, message) => {
        field.textContent = message;
    };

    const clearErrors = () => {
        formError.hidden = true;
        formError.textContent = '';
        setFieldError(nameError, '');
        setFieldError(emailError, '');
        setFieldError(passwordError, '');
        setFieldError(otpError, '');
    };

    const validateForm = () => {
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        let isValid = true;

        if (!name) {
            setFieldError(nameError, 'Full name is required.');
            isValid = false;
        }

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

    // Password Toggle
    window.togglePassword = function () {
        const pw = document.getElementById('password');
        pw.type = pw.type === 'password' ? 'text' : 'password';
    };

    // Switch to OTP view
    window.showOtpView = function (email) {
        document.getElementById('signupFormContainer').style.display = 'none';
        document.getElementById('otpSection').style.display = 'block';
        document.getElementById('displayEmail').innerText = email;
        clearErrors();
    };

    // Switch back to Signup
    window.showSignup = function () {
        document.getElementById('signupFormContainer').style.display = 'block';
        document.getElementById('otpSection').style.display = 'none';
        clearErrors();
    };

    // OTP Input Logic
    const inputs = document.querySelectorAll('.otp-input');

    inputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            input.value = input.value.replace(/[^0-9]/g, '');

            if (input.value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });
    });

    [nameInput, emailInput, passwordInput].forEach((input) => {
        input.addEventListener('input', clearErrors);
    });

    // Signup Form
    document.getElementById('signupForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors();

        if (!validateForm()) {
            return;
        }

        const signupData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value
        };

        await requestOtp(signupData);
    });

    // Verify OTP
    window.verifyOtp = async function () {
        const email = document.getElementById('displayEmail').innerText;
        const code = Array.from(inputs)
            .map(input => input.value)
            .join('');

        if (code.length !== 6) {
            setFieldError(otpError, 'Please enter the full 6-digit code.');
            return;
        }

        try {
            const response = await axios.post(
                API_URL + 'verify-otp',
                {
                    email: email,
                    code: code
                }
            );

            localStorage.setItem('jwtToken', response.data.token);
            window.location.href = 'index.html';
        } catch (error) {
            setFieldError(otpError, error.response?.data || 'Verification failed.');
        }
    };

    async function requestOtp(signupData) {
        try {
            await axios.post(
                API_URL + 'request-otp',
                signupData
            );

            showOtpView(signupData.email);
        } catch (error) {
            formError.hidden = false;
            formError.textContent = error.response?.data || 'Failed to send verification code.';
        }
    }
});