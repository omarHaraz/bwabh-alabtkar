import AuthService from "../services/AuthService.js";

document.addEventListener("DOMContentLoaded", () => {

    // ============================
    // Elements
    // ============================

    const signupForm = document.getElementById("signupForm");

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const formError = document.getElementById("formError");
    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const otpError = document.getElementById("otpError");

    const otpInputs = document.querySelectorAll(".otp-input");

    const resendBtn = document.getElementById("resendBtn");

    // ============================
    // State
    // ============================

    let signupEmail = "";
    let resendTimer = null;

    // ============================
    // Helpers
    // ============================

    function setFieldError(field, message) {
        field.textContent = message;
    }

    function clearErrors() {

        formError.hidden = true;
        formError.textContent = "";

        setFieldError(nameError, "");
        setFieldError(emailError, "");
        setFieldError(passwordError, "");
        setFieldError(otpError, "");
    }

    function validateForm() {

        clearErrors();

        let valid = true;

        if (!nameInput.value.trim()) {
            setFieldError(nameError, "Full name is required.");
            valid = false;
        }

        const email = emailInput.value.trim();

        if (!email) {
            setFieldError(emailError, "Email is required.");
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setFieldError(emailError, "Invalid email address.");
            valid = false;
        }

        const password = passwordInput.value;

        if (!password) {
            setFieldError(passwordError, "Password is required.");
            valid = false;
        } else if (password.length < 6) {
            setFieldError(passwordError, "Password must be at least 6 characters.");
            valid = false;
        }

        return valid;
    }

    // ============================
    // Views
    // ============================

    function showOtpView(email) {

        signupEmail = email;

        document.getElementById("signupFormContainer").style.display = "none";
        document.getElementById("otpSection").style.display = "block";

        document.getElementById("displayEmail").textContent = email;

        otpInputs.forEach(input => input.value = "");

        otpInputs[0].focus();

        startResendTimer();
    }

    function showSignupView() {

        document.getElementById("signupFormContainer").style.display = "block";
        document.getElementById("otpSection").style.display = "none";

        clearErrors();
    }

    // Make accessible from HTML
    window.showSignup = showSignupView;

    // ============================
    // Password Toggle
    // ============================

    window.togglePassword = function () {

        passwordInput.type =
            passwordInput.type === "password"
                ? "text"
                : "password";
    };

    // ============================
    // OTP Inputs
    // ============================

    otpInputs.forEach((input, index) => {

        input.addEventListener("input", () => {
            const cleaned = input.value.replace(/\D/g, "");
            if (cleaned.length > 1) {
                const digits = cleaned.split("");
                digits.forEach((digit, i) => {
                    if (otpInputs[i]) {
                        otpInputs[i].value = digit;
                    }
                });
                const focusIdx = Math.min(digits.length, otpInputs.length - 1);
                otpInputs[focusIdx].focus();
            } else {
                input.value = cleaned;
                if (input.value && index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
            }
            setFieldError(otpError, "");
        });

        input.addEventListener("paste", (e) => {
            e.preventDefault();
            const pasteData = (e.clipboardData || window.clipboardData).getData("text");
            const digits = pasteData.replace(/\D/g, "").split("");
            if (digits.length > 0) {
                digits.forEach((digit, i) => {
                    if (otpInputs[i]) {
                        otpInputs[i].value = digit;
                    }
                });
                const focusIdx = Math.min(digits.length, otpInputs.length - 1);
                otpInputs[focusIdx].focus();
                setFieldError(otpError, "");
            }
        });

        input.addEventListener("keydown", (e) => {
            if (
                e.key === "Backspace" &&
                input.value === "" &&
                index > 0
            ) {
                otpInputs[index - 1].focus();
            }
        });

    });

    // ============================
    // Signup
    // ============================

    signupForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const signupData = {

            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value

        };

        try {

            await AuthService.requestOtp(signupData);

            showOtpView(signupData.email);

        } catch (error) {

            formError.hidden = false;

            const resData = error.response?.data;
            if (resData && typeof resData === 'object' && resData.fieldErrors) {
                const fe = resData.fieldErrors;
                if (fe.name) setFieldError(nameError, fe.name);
                if (fe.email) setFieldError(emailError, fe.email);
                if (fe.password) setFieldError(passwordError, fe.password);
                formError.textContent = resData.message || "Please correct the highlighted errors.";
            } else if (resData && typeof resData === 'object' && resData.message) {
                formError.textContent = resData.message;
            } else {
                formError.textContent =
                    typeof resData === 'string'
                        ? resData
                        : "Failed to send verification code.";
            }

        }

    });

    // ============================
    // Verify OTP
    // ============================

    window.verifyOtp = async function () {

        const code = Array.from(otpInputs)
            .map(input => input.value)
            .join("");

        if (code.length !== 6) {

            setFieldError(
                otpError,
                "Please enter the 6-digit verification code."
            );

            return;
        }

        try {

            await AuthService.verifyOtp(signupEmail, code);

            const repoPrefix = window.location.pathname.includes("/customer/")
                ? window.location.pathname.split("/customer/")[0]
                : window.location.pathname.includes("/auth/")
                    ? window.location.pathname.split("/auth/")[0]
                    : window.location.pathname.includes("/admin/")
                        ? window.location.pathname.split("/admin/")[0]
                        : "";

            window.location.href = `${repoPrefix}/customer/pages/home.html`;

        } catch (error) {

            setFieldError(
                otpError,
                error.response?.data || "Verification failed."
            );

        }

    };

    // ============================
    // Resend OTP
    // ============================

    window.resendOtp = async function () {

        try {

            await AuthService.resendOtp(signupEmail);

            otpInputs.forEach(input => input.value = "");

            otpInputs[0].focus();

            setFieldError(
                otpError,
                "A new verification code has been sent."
            );

            startResendTimer();

        } catch (error) {

            setFieldError(
                otpError,
                error.response?.data || "Unable to resend code."
            );

        }

    };

    // ============================
    // Resend Timer
    // ============================

    function startResendTimer() {

        if (!resendBtn) return;

        clearInterval(resendTimer);

        let seconds = 60;

        resendBtn.disabled = true;

        resendBtn.textContent = `Resend in ${seconds}s`;

        resendTimer = setInterval(() => {

            seconds--;

            resendBtn.textContent = `Resend in ${seconds}s`;

            if (seconds <= 0) {

                clearInterval(resendTimer);

                resendBtn.disabled = false;

                resendBtn.textContent = "Resend OTP";

            }

        }, 1000);

    }

    // ============================
    // Events
    // ============================

    if (resendBtn) {
        resendBtn.addEventListener("click", window.resendOtp);
    }

    [nameInput, emailInput, passwordInput].forEach(input => {
        input.addEventListener("input", clearErrors);
    });

});