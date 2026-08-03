import AuthService from "../services/AuthService.js";

const form = document.getElementById("forgotPasswordForm");

const emailInput = document.getElementById("email");

const formError = document.getElementById("formError");
const emailError = document.getElementById("emailError");

function setFieldError(field, message) {
    field.textContent = message;
}

function clearErrors() {

    formError.hidden = true;
    formError.textContent = "";

    setFieldError(emailError, "");

}

function validateForm() {

    clearErrors();

    const email = emailInput.value.trim();

    if (!email) {

        setFieldError(emailError, "Email is required.");

        return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

        setFieldError(emailError, "Please enter a valid email address.");

        return false;
    }

    return true;
}

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    const email = emailInput.value.trim();

    try {

        await AuthService.forgotPassword(email);

        sessionStorage.setItem("resetEmail", email);

        window.location.href = "verify-reset.html";

    } catch (error) {

        formError.hidden = false;

        const resData = error.response?.data;
        if (resData && typeof resData === 'object' && resData.fieldErrors?.email) {
            setFieldError(emailError, resData.fieldErrors.email);
            formError.textContent = resData.message || "Please correct the email format.";
        } else if (resData && typeof resData === 'object' && resData.message) {
            formError.textContent = resData.message;
        } else {
            formError.textContent =
                typeof resData === 'string'
                    ? resData
                    : "Unable to send verification code.";
        }

    }

});

emailInput.addEventListener("input", clearErrors);