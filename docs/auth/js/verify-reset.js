import AuthService from "../services/AuthService.js";

document.addEventListener("DOMContentLoaded", () => {

    // ============================
    // Elements
    // ============================

    const otpInputs = document.querySelectorAll(".otp-input");

    const verifyBtn = document.getElementById("verifyBtn");
    const resendBtn = document.getElementById("resendBtn");

    const otpError = document.getElementById("otpError");
    const displayEmail = document.getElementById("displayEmail");

    // ============================
    // State
    // ============================

    const email = sessionStorage.getItem("resetEmail");

    let resendTimer = null;

    if (!email) {
        window.location.href = "forgot-password.html";
        return;
    }

    displayEmail.textContent = email;

    // ============================
    // Helpers
    // ============================

    function setError(message) {
        otpError.textContent = message;
    }

    function clearError() {
        otpError.textContent = "";
    }

    // ============================
    // OTP Inputs
    // ============================

    otpInputs.forEach((input, index) => {

        input.addEventListener("input", () => {

            input.value = input.value.replace(/\D/g, "");

            if (
                input.value &&
                index < otpInputs.length - 1
            ) {
                otpInputs[index + 1].focus();
            }

            clearError();

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
    // Verify
    // ============================

    async function verifyCode() {

        clearError();

        const code = Array.from(otpInputs)
            .map(input => input.value)
            .join("");

        if (code.length !== 6) {

            setError("Please enter the 6-digit verification code.");

            return;
        }

        try {

            await AuthService.verifyResetCode(email, code);

            sessionStorage.setItem("resetCode", code);

            window.location.href = "reset-password.html";

        } catch (error) {

            setError(
                error.response?.data ||
                "Invalid verification code."
            );

        }

    }

    // ============================
    // Resend
    // ============================

    async function resendCode() {

        clearError();

        try {

            await AuthService.resendResetCode(email);

            otpInputs.forEach(input => input.value = "");

            otpInputs[0].focus();

            startTimer();

            setError("A new verification code has been sent.");

        } catch (error) {

            setError(
                error.response?.data ||
                "Unable to resend verification code."
            );

        }

    }

    // ============================
    // Timer
    // ============================

    function startTimer() {

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

                resendBtn.textContent = "Resend Code";

            }

        }, 1000);

    }

    // ============================
    // Events
    // ============================

    verifyBtn.addEventListener("click", verifyCode);

    resendBtn.addEventListener("click", resendCode);

    startTimer();

});