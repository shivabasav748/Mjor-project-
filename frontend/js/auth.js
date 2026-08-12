/* =========================================================
   VENTUREIQ — AUTHENTICATION JAVASCRIPT
   Login Page Interactions
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ====================================================== */

    const loader = document.getElementById("authLoader");
    const themeToggle = document.getElementById("themeToggle");

    const loginForm = document.getElementById("loginForm");
    const loginButton = document.getElementById("loginButton");

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");

    const passwordToggle = document.getElementById("passwordToggle");
    const googleLogin = document.getElementById("googleLogin");
    const forgotPassword = document.getElementById("forgotPassword");


    /* =====================================================
       PAGE LOADER
    ====================================================== */

    window.addEventListener("load", () => {

        setTimeout(() => {

            if (loader) {
                loader.classList.add("hidden");
            }

        }, 500);

    });


    /* =====================================================
       THEME SYSTEM
    ====================================================== */

    const savedTheme = localStorage.getItem("ventureiq-theme");

    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
        updateThemeIcon();
    }


    if (themeToggle) {

        themeToggle.addEventListener("click", () => {

            document.body.classList.toggle("light-theme");

            const currentTheme =
                document.body.classList.contains("light-theme")
                    ? "light"
                    : "dark";

            localStorage.setItem(
                "ventureiq-theme",
                currentTheme
            );

            updateThemeIcon();

        });

    }


    function updateThemeIcon() {

        if (!themeToggle) return;

        const icon = themeToggle.querySelector("i");

        if (!icon) return;

        if (document.body.classList.contains("light-theme")) {

            icon.classList.remove("fa-sun");
            icon.classList.add("fa-moon");

        } else {

            icon.classList.remove("fa-moon");
            icon.classList.add("fa-sun");

        }

    }


    /* =====================================================
       PASSWORD SHOW / HIDE
    ====================================================== */

    if (passwordToggle && passwordInput) {

        passwordToggle.addEventListener("click", () => {

            const icon = passwordToggle.querySelector("i");

            if (passwordInput.type === "password") {

                passwordInput.type = "text";

                if (icon) {
                    icon.classList.remove("fa-eye");
                    icon.classList.add("fa-eye-slash");
                }

                passwordToggle.setAttribute(
                    "aria-label",
                    "Hide password"
                );

            } else {

                passwordInput.type = "password";

                if (icon) {
                    icon.classList.remove("fa-eye-slash");
                    icon.classList.add("fa-eye");
                }

                passwordToggle.setAttribute(
                    "aria-label",
                    "Show password"
                );

            }

        });

    }


    /* =====================================================
       INPUT FOCUS EFFECTS
    ====================================================== */

    const inputs = document.querySelectorAll(
        ".input-wrapper input"
    );

    inputs.forEach((input) => {

        input.addEventListener("focus", () => {

            input.parentElement.classList.add("focused");

        });


        input.addEventListener("blur", () => {

            input.parentElement.classList.remove("focused");

        });


        input.addEventListener("input", () => {

            clearInputError(input);

        });

    });


    function clearInputError(input) {

        input.classList.remove("input-error");

        const errorElement =
            input.id === "email"
                ? emailError
                : passwordError;

        if (errorElement) {
            errorElement.textContent = "";
        }

    }


    /* =====================================================
       EMAIL VALIDATION
    ====================================================== */

    function validateEmail(email) {

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return emailPattern.test(email);

    }


    /* =====================================================
       LOGIN FORM
    ====================================================== */

    if (loginForm) {

        loginForm.addEventListener("submit", async (event) => {

            event.preventDefault();


            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value.trim();


            let isValid = true;


            /* ---------------------------------------------
               CLEAR PREVIOUS ERRORS
            --------------------------------------------- */

            emailError.textContent = "";
            passwordError.textContent = "";

            emailInput.classList.remove("input-error");
            passwordInput.classList.remove("input-error");


            /* ---------------------------------------------
               EMAIL VALIDATION
            --------------------------------------------- */

            if (!email) {

                emailError.textContent =
                    "Please enter your email address.";

                emailInput.classList.add("input-error");

                isValid = false;

            } else if (!validateEmail(email)) {

                emailError.textContent =
                    "Please enter a valid email address.";

                emailInput.classList.add("input-error");

                isValid = false;

            }


            /* ---------------------------------------------
               PASSWORD VALIDATION
            --------------------------------------------- */

            if (!password) {

                passwordError.textContent =
                    "Please enter your password.";

                passwordInput.classList.add("input-error");

                isValid = false;

            } else if (password.length < 6) {

                passwordError.textContent =
                    "Password must contain at least 6 characters.";

                passwordInput.classList.add("input-error");

                isValid = false;

            }


            if (!isValid) {
                return;
            }


            /* ---------------------------------------------
               LOGIN BUTTON LOADING STATE
            --------------------------------------------- */

            const originalButtonHTML =
                loginButton.innerHTML;

            loginButton.disabled = true;

            loginButton.innerHTML = `
                <span>Signing in...</span>
                <i class="fa-solid fa-spinner fa-spin"></i>
            `;


            /*
              TEMPORARY FRONTEND LOGIN

              Real authentication will be connected later
              using Firebase / Supabase / backend API.
            */

            setTimeout(() => {

                loginButton.innerHTML = `
                    <span>Login successful</span>
                    <i class="fa-solid fa-check"></i>
                `;


                /* -----------------------------------------
                   TEMPORARY DEMO REDIRECT
                ----------------------------------------- */

                setTimeout(() => {

                    /*
                      For now we return to the homepage.

                      Later this will become:
                      dashboard.html
                    */

                    window.location.href =
                        "../index.html";

                }, 700);


            }, 1200);

        });

    }


    /* =====================================================
       GOOGLE LOGIN
    ====================================================== */

    if (googleLogin) {

        googleLogin.addEventListener("click", () => {

            const originalHTML =
                googleLogin.innerHTML;

            googleLogin.disabled = true;

            googleLogin.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Connecting to Google...
            `;


            /*
              Google authentication will be connected later
              using Firebase Authentication.
            */

            setTimeout(() => {

                googleLogin.disabled = false;

                googleLogin.innerHTML =
                    originalHTML;


                showAuthMessage(
                    "Google authentication will be connected soon.",
                    "info"
                );

            }, 1200);

        });

    }


    /* =====================================================
       FORGOT PASSWORD
    ====================================================== */

    if (forgotPassword) {

        forgotPassword.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                showAuthMessage(
                    "Password recovery will be connected with authentication.",
                    "info"
                );

            }
        );

    }


    /* =====================================================
       AUTH MESSAGE
    ====================================================== */

    function showAuthMessage(message, type = "info") {

        const existingMessage =
            document.querySelector(".auth-message");

        if (existingMessage) {
            existingMessage.remove();
        }


        const messageBox =
            document.createElement("div");

        messageBox.className =
            `auth-message auth-message-${type}`;

        messageBox.innerHTML = `
            <i class="fa-solid fa-circle-info"></i>
            <span>${message}</span>
        `;


        if (loginForm) {

            loginForm.insertBefore(
                messageBox,
                loginForm.firstChild
            );

        }


        setTimeout(() => {

            messageBox.classList.add("hide");

            setTimeout(() => {

                messageBox.remove();

            }, 300);

        }, 3500);

    }


    /* =====================================================
       ENTER KEY EXPERIENCE
    ====================================================== */

    if (passwordInput) {

        passwordInput.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Enter" &&
                    loginForm
                ) {

                    loginForm.requestSubmit();

                }

            }
        );

    }


    /* =====================================================
       SUBTLE REVEAL ANIMATION
    ====================================================== */

    const revealElements =
        document.querySelectorAll(
            ".auth-intro, .auth-card-wrapper"
        );

    revealElements.forEach((element, index) => {

        element.style.opacity = "0";
        element.style.transform =
            "translateY(20px)";

        setTimeout(() => {

            element.style.transition =
                "opacity 0.7s ease, transform 0.7s ease";

            element.style.opacity = "1";

            element.style.transform =
                "translateY(0)";

        }, 250 + (index * 150));

    });

});