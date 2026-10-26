function isValidStudentNumber(value) {
    return typeof value === "string" &&
        /^\d{2}-\d{4}-\d{3}$/.test(value.trim());
}

function isValidPassword(value) {
    return typeof value === "string" &&
        value.length >= 8 &&
        /[A-Z]/.test(value) &&
        /\d/.test(value) &&
        /[@$!]/.test(value) &&
        !/\s/.test(value);
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = { isValidStudentNumber, isValidPassword };
}

if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", function () {
        const form = document.getElementById("registrationForm");
        if (!form) return;

        const fields = {
            fullName: document.getElementById("fullName"),
            studentNumber: document.getElementById("studentNumber"),
            email: document.getElementById("email"),
            mobileNumber: document.getElementById("mobileNumber"),
            password: document.getElementById("password"),
            confirmPassword: document.getElementById("confirmPassword"),
            course: document.getElementById("course"),
            terms: document.getElementById("terms")
        };

        const successMessage = document.getElementById("successMessage");
        const summary = document.getElementById("registrationSummary");

        const errors = {
            fullName: document.getElementById("fullNameError"),
            studentNumber: document.getElementById("studentNumberError"),
            email: document.getElementById("emailError"),
            mobileNumber: document.getElementById("mobileNumberError"),
            password: document.getElementById("passwordError"),
            confirmPassword: document.getElementById("confirmPasswordError"),
            course: document.getElementById("courseError"),
            terms: document.getElementById("termsError")
        };

        function setError(key, message) {
            errors[key].textContent = message;
            fields[key].setAttribute(
                "aria-invalid", message ? "true" : "false"
            );
        }

        function validateName() {
            const value = fields.fullName.value.trim();
            const message = value.length < 2
                ? "Enter a full name with at least two characters."
                : "";
            setError("fullName", message);
            return !message;
        }

        function validateStudentNumber() {
            const value = fields.studentNumber.value.trim();
            const message = !isValidStudentNumber(value)
                ? "Enter a student number in the format 24-1234-123."
                : "";
            setError("studentNumber", message);
            return !message;
        }

        function validateEmail() {
            const value = fields.email.value.trim();
            const message = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                ? "Enter a valid email address, such as student@email.com."
                : "";
            setError("email", message);
            return !message;
        }

        function validateMobile() {
            const value = fields.mobileNumber.value.trim();
            const message = !/^(09\d{9}|\+639\d{9})$/.test(value)
                ? "Enter 09 followed by nine digits or +639 followed by nine digits."
                : "";
            setError("mobileNumber", message);
            return !message;
        }

        function validatePassword() {
            const value = fields.password.value;
            const message = !isValidPassword(value)
                ? "Use at least 8 characters, one uppercase letter, one digit, and @, $, or !. No spaces."
                : "";
            setError("password", message);
            updatePasswordFeedback();
            return !message;
        }

        function updatePasswordFeedback() {
            const feedback = document.getElementById("passwordFeedback");
            feedback.textContent = isValidPassword(fields.password.value)
                ? "Password meets all requirements."
                : "Password needs 8 characters, an uppercase letter, a digit, and @, $, or !, with no spaces.";
        }

        function validateConfirmPassword() {
            const message = fields.confirmPassword.value === "" ||
                fields.confirmPassword.value !== fields.password.value
                ? "Confirm password must match the password exactly."
                : "";
            setError("confirmPassword", message);
            return !message;
        }

        function validateCourse() {
            const message = !["BSIT", "BSCS"].includes(fields.course.value)
                ? "Please select BSIT or BSCS."
                : "";
            setError("course", message);
            return !message;
        }

        function validateTerms() {
            const message = !fields.terms.checked
                ? "You must agree to the Terms and Conditions."
                : "";
            setError("terms", message);
            return !message;
        }

        function hideOutput() {
            successMessage.textContent = "";
            successMessage.hidden = true;
            summary.hidden = true;
            [
                "summaryName",
                "summaryStudentNumber",
                "summaryEmail",
                "summaryMobileNumber",
                "summaryCourse"
            ].forEach(function (id) {
                document.getElementById(id).textContent = "";
            });
        }

        function validateAll() {
            return [
                validateName(),
                validateStudentNumber(),
                validateEmail(),
                validateMobile(),
                validatePassword(),
                validateConfirmPassword(),
                validateCourse(),
                validateTerms()
            ].every(Boolean);
        }

        fields.fullName.addEventListener("blur", validateName);

        fields.password.addEventListener("input", function () {
            validatePassword();
            if (fields.confirmPassword.value !== "") {
                validateConfirmPassword();
            }
        });

        fields.confirmPassword.addEventListener(
            "input", validateConfirmPassword
        );

        fields.studentNumber.addEventListener(
            "input", validateStudentNumber
        );
        fields.email.addEventListener("input", validateEmail);
        fields.mobileNumber.addEventListener("input", validateMobile);

        fields.course.addEventListener("change", validateCourse);
        fields.terms.addEventListener("change", validateTerms);

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            hideOutput();

            if (!validateAll()) {
                const firstInvalid = form.querySelector(
                    '[aria-invalid="true"]'
                );
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            document.getElementById("summaryName").textContent =
                fields.fullName.value.trim();
            document.getElementById("summaryStudentNumber").textContent =
                fields.studentNumber.value.trim();
            document.getElementById("summaryEmail").textContent =
                fields.email.value.trim();
            document.getElementById("summaryMobileNumber").textContent =
                fields.mobileNumber.value.trim();
            document.getElementById("summaryCourse").textContent =
                fields.course.value;

            successMessage.textContent =
                "Registration details validated successfully!";
            successMessage.hidden = false;
            summary.hidden = false;
        });

        form.addEventListener("reset", function () {
            Object.keys(errors).forEach(function (key) {
                setError(key, "");
            });

            document.getElementById("passwordFeedback").textContent = "";
            hideOutput();
        });

        // Initialize accessibility state
        Object.keys(fields).forEach(function (key) {
            fields[key].setAttribute("aria-invalid", "false");
        });

        // Current date and time
        function updateDateTime() {
            const now = new Date();
            const date = document.getElementById("currentDate");
            const time = document.getElementById("currentTime");

            if (date) {
                date.textContent = now.toLocaleDateString("en-PH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                });
            }

            if (time) {
                time.textContent = now.toLocaleTimeString("en-PH", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true
                });
            }
        }

        updateDateTime();
        setInterval(updateDateTime, 1000);
    });
}
