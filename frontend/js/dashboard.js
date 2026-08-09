/* =========================================================
   VENTUREIQ — DASHBOARD JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const sidebar = document.getElementById("sidebar");
    const sidebarOverlay = document.getElementById("sidebarOverlay");
    const mobileMenu = document.getElementById("mobileMenu");

    const themeToggle = document.getElementById("themeToggle");
    const searchButton = document.getElementById("searchButton");
    const notificationButton =
        document.getElementById("notificationButton");

    const newIdeaButton =
        document.getElementById("newIdeaButton");

    const pageTitle =
        document.getElementById("pageTitle");

    const navItems =
        document.querySelectorAll(".nav-item");

    const quickActions =
        document.querySelectorAll(".quick-action");


    /* =====================================================
       MOBILE SIDEBAR
    ===================================================== */

    function openSidebar() {

        if (!sidebar) return;

        sidebar.classList.add("open");

        if (sidebarOverlay) {
            sidebarOverlay.classList.add("active");
        }
    }


    function closeSidebar() {

        if (!sidebar) return;

        sidebar.classList.remove("open");

        if (sidebarOverlay) {
            sidebarOverlay.classList.remove("active");
        }
    }


    if (mobileMenu) {

        mobileMenu.addEventListener("click", () => {

            if (sidebar.classList.contains("open")) {
                closeSidebar();
            } else {
                openSidebar();
            }

        });

    }


    if (sidebarOverlay) {

        sidebarOverlay.addEventListener(
            "click",
            closeSidebar
        );

    }


    /* =====================================================
       SIDEBAR NAVIGATION
    ===================================================== */

    const pageNames = {

        dashboard: "Dashboard",
        ideas: "My Ideas",
        validator: "Idea Validator",
        market: "Market Intelligence",
        competitors: "Competitor Analysis",
        score: "Viability Score",
        roadmap: "Execution Roadmap",
        notifications: "Notifications",
        settings: "Settings"

    };


    navItems.forEach(item => {

        item.addEventListener("click", event => {

            event.preventDefault();

            const page =
                item.getAttribute("data-page");

            /* Remove active state */

            navItems.forEach(nav => {
                nav.classList.remove("active");
            });

            /* Activate clicked item */

            item.classList.add("active");


            /* Update page title */

            if (pageTitle && pageNames[page]) {

                pageTitle.textContent =
                    pageNames[page];

            }


            /* Close mobile sidebar */

            closeSidebar();


            console.log(
                `VentureIQ page selected: ${page}`
            );

        });

    });


    /* =====================================================
       QUICK ACTIONS
    ===================================================== */

    quickActions.forEach(action => {

        action.addEventListener("click", () => {

            const target =
                action.getAttribute("data-action");

            /* Find matching sidebar item */

            const matchingNav =
                document.querySelector(
                    `.nav-item[data-page="${target}"]`
                );

            if (matchingNav) {

                matchingNav.click();

            }

        });

    });


    /* =====================================================
       NEW IDEA BUTTON
    ===================================================== */

    if (newIdeaButton) {

        newIdeaButton.addEventListener(
            "click",
            () => {

                alert(
                    "New Idea feature will be connected here."
                );

            }
        );

    }


    /* =====================================================
       THEME TOGGLE
    ===================================================== */

    if (themeToggle) {

        themeToggle.addEventListener(
            "click",
            () => {

                document.body.classList.toggle(
                    "light-theme"
                );


                const icon =
                    themeToggle.querySelector("i");


                if (
                    document.body.classList.contains(
                        "light-theme"
                    )
                ) {

                    icon.classList.remove(
                        "fa-sun"
                    );

                    icon.classList.add(
                        "fa-moon"
                    );

                    localStorage.setItem(
                        "ventureiq-theme",
                        "light"
                    );

                } else {

                    icon.classList.remove(
                        "fa-moon"
                    );

                    icon.classList.add(
                        "fa-sun"
                    );

                    localStorage.setItem(
                        "ventureiq-theme",
                        "dark"
                    );

                }

            }
        );

    }


    /* =====================================================
       LOAD SAVED THEME
    ===================================================== */

    const savedTheme =
        localStorage.getItem(
            "ventureiq-theme"
        );


    if (savedTheme === "light") {

        document.body.classList.add(
            "light-theme"
        );


        const icon =
            themeToggle?.querySelector("i");


        if (icon) {

            icon.classList.remove(
                "fa-sun"
            );

            icon.classList.add(
                "fa-moon"
            );

        }

    }


    /* =====================================================
       SEARCH BUTTON
    ===================================================== */

    if (searchButton) {

        searchButton.addEventListener(
            "click",
            () => {

                const searchTerm =
                    prompt(
                        "What would you like to search in VentureIQ?"
                    );


                if (
                    searchTerm &&
                    searchTerm.trim() !== ""
                ) {

                    console.log(
                        "Searching for:",
                        searchTerm
                    );

                    alert(
                        `Search feature will search for: ${searchTerm}`
                    );

                }

            }
        );

    }


    /* =====================================================
       NOTIFICATION BUTTON
    ===================================================== */

    if (notificationButton) {

        notificationButton.addEventListener(
            "click",
            () => {

                alert(
                    "You have new VentureIQ notifications."
                );

            }
        );

    }


    /* =====================================================
       KEYBOARD SHORTCUT
       ESC = CLOSE SIDEBAR
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                closeSidebar();

            }

        }
    );


    /* =====================================================
       WINDOW RESIZE
    ===================================================== */

    window.addEventListener(
        "resize",
        () => {

            if (window.innerWidth > 900) {

                closeSidebar();

            }

        }
    );


    /* =====================================================
       DASHBOARD READY
    ===================================================== */

    console.log(
        "VentureIQ Dashboard initialized successfully."
    );

});