import AuthService from "../services/AuthService.js";

document.addEventListener("DOMContentLoaded", () => {

    // ============================
    // Elements
    // ============================

    const resetForm = document.getElementById("resetPasswordForm");

    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    const passwordError = document.getElementById("passwordError");
    const confirmPasswordError = document.getElementById("confirmPasswordError");
    const formError = document.getElementById("formError");

    const togglePassword = document.getElementById("togglePassword");
    const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

    // ============================
    // State
    // ============================

    const email = sessionStorage.getItem("resetEmail");
    const code = sessionStorage.getItem("resetCode");

    if (!email || !code) {
        window.location.href = "forgot-password.html";
        return;
    }

    // ============================
    // Helpers
    // ============================

    function setFieldError(field, message) {
        field.textContent = message;
    }

    function clearErrors() {

        formError.hidden = true;
        formError.textContent = "";

        setFieldError(passwordError, "");
        setFieldError(confirmPasswordError, "");

    }

    function validateForm() {

        clearErrors();

        let valid = true;

        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (!password) {

            setFieldError(
                passwordError,
                "Password is required."
            );

            valid = false;

        } else if (password.length < 6) {

            setFieldError(
                passwordError,
                "Password must be at least 6 characters."
            );

            valid = false;

        }

        if (!confirmPassword) {

            setFieldError(
                confirmPasswordError,
                "Please confirm your password."
            );

            valid = false;

        } else if (password !== confirmPassword) {

            setFieldError(
                confirmPasswordError,
                "Passwords do not match."
            );

            valid = false;

        }

        return valid;

    }

    function toggleInput(input) {

        input.type =
            input.type === "password"
                ? "text"
                : "password";

    }

    // ============================
    // Reset Password
    // ============================

    resetForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {

            await AuthService.resetPassword(
                email,
                code,
                passwordInput.value
            );

            sessionStorage.removeItem("resetEmail");
            sessionStorage.removeItem("resetCode");

            alert("Password reset successfully.");

            window.location.href = "login.html";

        } catch (error) {

            formError.hidden = false;

            const resData = error.response?.data;
            if (resData && typeof resData === 'object' && resData.fieldErrors) {
                const fe = resData.fieldErrors;
                if (fe.password) setFieldError(passwordError, fe.password);
                formError.textContent = resData.message || "Please correct the password errors.";
            } else if (resData && typeof resData === 'object' && resData.message) {
                formError.textContent = resData.message;
            } else {
                formError.textContent =
                    typeof resData === 'string'
                        ? resData
                        : "Unable to reset password.";
            }

        }

    });

    // ============================
    // Password Toggle
    // ============================

    if (togglePassword) {

        togglePassword.addEventListener("click", () => {

            toggleInput(passwordInput);

            const icon = togglePassword.querySelector("i");

            icon.classList.toggle("fa-eye");
            icon.classList.toggle("fa-eye-slash");

        });

    }

    if (toggleConfirmPassword) {

        toggleConfirmPassword.addEventListener("click", () => {

            toggleInput(confirmPasswordInput);

            const icon = toggleConfirmPassword.querySelector("i");

            icon.classList.toggle("fa-eye");
            icon.classList.toggle("fa-eye-slash");

        });

    }

    // ============================
    // Events
    // ============================

    [passwordInput, confirmPasswordInput].forEach(input => {

        input.addEventListener("input", clearErrors);

    });

});