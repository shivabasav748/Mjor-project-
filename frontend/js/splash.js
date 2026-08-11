/* =========================================================
   VENTUREIQ — SPLASH SCREEN JAVASCRIPT
   Flow: splash.html → index.html
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const splashScreen = document.getElementById("splashScreen");
const loadingProgress = document.getElementById("loadingProgress");


/* =========================================================
   CONFIGURATION
========================================================= */

// Splash screen stays visible for 2 seconds
const SPLASH_DURATION = 2000;

// Fade-out duration
const FADE_DURATION = 700;


/* =========================================================
   INITIALIZE SPLASH SCREEN
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    startSplashScreen();

});


/* =========================================================
   START SPLASH SCREEN
========================================================= */

function startSplashScreen() {

    /*
        Make sure the loading bar starts from zero.
    */

    if (loadingProgress) {

        loadingProgress.style.width = "0%";

    }


    /*
        Start the loading bar animation.
    */

    requestAnimationFrame(() => {

        if (loadingProgress) {

            loadingProgress.style.transition =
                `width ${SPLASH_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1)`;

            loadingProgress.style.width = "100%";

        }

    });


    /*
        Wait for 2 seconds,
        then move to the main website.
    */

    setTimeout(() => {

        goToWebsite();

    }, SPLASH_DURATION);

}


/* =========================================================
   GO TO MAIN WEBSITE
========================================================= */

function goToWebsite() {

    /*
        Start the splash fade-out animation.
    */

    if (splashScreen) {

        splashScreen.classList.add("fade-out");

    }


    /*
        Wait for the fade-out animation to finish,
        then open index.html.
    */

    setTimeout(() => {
        try {
            localStorage.setItem('splashVisited', 'true');
        } catch (e) {
            /* ignore storage errors */
        }

        window.location.href = "index.html";

    }, FADE_DURATION);

}