/* =========================================================
   VENTUREIQ — VIABILITY SCORE JAVASCRIPT
   Handles:
   - Sidebar
   - Theme
   - Score animation
   - Re-analysis
   - Navigation
   - Notifications
   - Search
   - User menu
   - Next step
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const sidebar = document.getElementById("sidebar");
    const mobileMenu = document.getElementById("mobileMenu");
    const sidebarOverlay = document.getElementById("sidebarOverlay");

    const themeToggle = document.getElementById("themeToggle");

    const reanalyzeButton = document.getElementById("reanalyzeButton");
    const nextStepButton = document.getElementById("nextStepButton");

    const searchButton = document.getElementById("searchButton");
    const notificationButton =
        document.getElementById("notificationButton");

    const userMenu = document.getElementById("userMenu");

    const scoreValue = document.getElementById("scoreValue");
    const scoreProgress = document.getElementById("scoreProgress");


    /* =====================================================
       SCORE CONFIGURATION
    ===================================================== */

    const currentScore = 82;

    const scoreRadius = 76;

    const circumference =
        2 * Math.PI * scoreRadius;


    /* =====================================================
       INITIAL SCORE CIRCLE
    ===================================================== */

    if (scoreProgress) {

        scoreProgress.style.strokeDasharray =
            circumference;

        scoreProgress.style.strokeDashoffset =
            circumference;

        setTimeout(() => {
            animateScore(currentScore);
        }, 400);

    }


    /* =====================================================
       ANIMATE SCORE
    ===================================================== */

    function animateScore(targetScore) {

        if (!scoreValue || !scoreProgress) return;

        let current = 0;

        const duration = 1200;

        const startTime = performance.now();

        function updateScore(currentTime) {

            const elapsed =
                currentTime - startTime;

            const progress =
                Math.min(elapsed / duration, 1);

            /*
             * Ease-out animation
             */
            const eased =
                1 - Math.pow(1 - progress, 3);

            current =
                Math.round(targetScore * eased);

            scoreValue.textContent = current;


            /*
             * Circle progress
             */
            const offset =
                circumference -
                (current / 100) * circumference;

            scoreProgress.style.strokeDashoffset =
                offset;


            if (progress < 1) {

                requestAnimationFrame(updateScore);

            } else {

                scoreValue.textContent =
                    targetScore;

            }

        }

        requestAnimationFrame(updateScore);

    }


    /* =====================================================
       MOBILE SIDEBAR
    ===================================================== */

    function openSidebar() {

        if (!sidebar) return;

        sidebar.classList.add("open");

        if (sidebarOverlay) {
            sidebarOverlay.classList.add("active");
        }

        document.body.style.overflow = "hidden";

    }


    function closeSidebar() {

        if (!sidebar) return;

        sidebar.classList.remove("open");

        if (sidebarOverlay) {
            sidebarOverlay.classList.remove("active");
        }

        document.body.style.overflow = "";

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
       CLOSE SIDEBAR AFTER NAVIGATION
    ===================================================== */

    if (sidebar) {

        const navItems =
            sidebar.querySelectorAll(".nav-item");

        navItems.forEach(item => {

            item.addEventListener("click", () => {

                if (window.innerWidth <= 900) {

                    closeSidebar();

                }

            });

        });

    }


    /* =====================================================
       THEME TOGGLE
    ===================================================== */

    const savedTheme =
        localStorage.getItem("ventureiq-theme");


    if (savedTheme === "light") {

        document.body.classList.add("light-theme");

        updateThemeIcon();

    }


    function updateThemeIcon() {

        if (!themeToggle) return;

        const icon =
            themeToggle.querySelector("i");

        if (!icon) return;


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

        } else {

            icon.classList.remove(
                "fa-moon"
            );

            icon.classList.add(
                "fa-sun"
            );

        }

    }


    if (themeToggle) {

        themeToggle.addEventListener("click", () => {

            document.body.classList.toggle(
                "light-theme"
            );


            const theme =
                document.body.classList.contains(
                    "light-theme"
                )
                    ? "light"
                    : "dark";


            localStorage.setItem(
                "ventureiq-theme",
                theme
            );


            updateThemeIcon();

        });

    }


    /* =====================================================
       RE-ANALYZE BUTTON
    ===================================================== */

    if (reanalyzeButton) {

        reanalyzeButton.addEventListener(
            "click",
            () => {

                const icon =
                    reanalyzeButton.querySelector("i");


                /*
                 * Prevent multiple clicks
                 */
                if (
                    reanalyzeButton.classList.contains(
                        "loading"
                    )
                ) {
                    return;
                }


                reanalyzeButton.classList.add(
                    "loading"
                );


                if (icon) {

                    icon.classList.add(
                        "fa-spin"
                    );

                }


                reanalyzeButton.innerHTML = `
                    <i class="fa-solid fa-rotate fa-spin"></i>
                    Analyzing...
                `;


                /*
                 * Reset score animation
                 */
                if (scoreProgress) {

                    scoreProgress.style.strokeDashoffset =
                        circumference;

                }


                if (scoreValue) {

                    scoreValue.textContent = "0";

                }


                setTimeout(() => {

                    animateScore(currentScore);


                    reanalyzeButton.innerHTML = `
                        <i class="fa-solid fa-check"></i>
                        Analysis Updated
                    `;


                    reanalyzeButton.classList.remove(
                        "loading"
                    );


                    setTimeout(() => {

                        reanalyzeButton.innerHTML = `
                            <i class="fa-solid fa-rotate"></i>
                            Re-analyze
                        `;

                    }, 1800);

                }, 1500);

            }
        );

    }


    /* =====================================================
       NEXT STEP BUTTON
    ===================================================== */

    if (nextStepButton) {

        nextStepButton.addEventListener(
            "click",
            () => {

                /*
                 * Scroll to the score breakdown
                 */
                const factorsSection =
                    document.querySelector(
                        ".factors-section"
                    );


                if (factorsSection) {

                    factorsSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }


                /*
                 * Small visual feedback
                 */
                nextStepButton.innerHTML = `
                    Exploring
                    <i class="fa-solid fa-arrow-down"></i>
                `;


                setTimeout(() => {

                    nextStepButton.innerHTML = `
                        Next step
                        <i class="fa-solid fa-arrow-right"></i>
                    `;

                }, 1200);

            }
        );

    }


    /* =====================================================
       SEARCH BUTTON
    ===================================================== */

    if (searchButton) {

        searchButton.addEventListener(
            "click",
            () => {

                /*
                 * Check if search already exists
                 */
                let searchBox =
                    document.querySelector(
                        ".viability-search-box"
                    );


                if (searchBox) {

                    searchBox.classList.toggle(
                        "active"
                    );

                    if (
                        searchBox.classList.contains(
                            "active"
                        )
                    ) {

                        searchBox
                            .querySelector("input")
                            ?.focus();

                    }

                    return;

                }


                /*
                 * Create search box
                 */
                searchBox =
                    document.createElement("div");

                searchBox.className =
                    "viability-search-box";


                searchBox.innerHTML = `
                    <div class="search-inner">
                        <i class="fa-solid fa-magnifying-glass"></i>

                        <input
                            type="text"
                            placeholder="Search VentureIQ..."
                            aria-label="Search VentureIQ"
                        >

                        <button
                            type="button"
                            class="close-search"
                            aria-label="Close search"
                        >
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                `;


                document.body.appendChild(
                    searchBox
                );


                requestAnimationFrame(() => {

                    searchBox.classList.add(
                        "active"
                    );

                });


                const input =
                    searchBox.querySelector(
                        "input"
                    );

                const closeButton =
                    searchBox.querySelector(
                        ".close-search"
                    );


                input?.focus();


                closeButton?.addEventListener(
                    "click",
                    () => {

                        searchBox.classList.remove(
                            "active"
                        );

                        setTimeout(() => {
                            searchBox.remove();
                        }, 250);

                    }
                );


                /*
                 * Close when pressing Escape
                 */
                document.addEventListener(
                    "keydown",
                    function searchEscape(event) {

                        if (
                            event.key === "Escape"
                        ) {

                            searchBox.classList.remove(
                                "active"
                            );

                            setTimeout(() => {

                                if (
                                    document.body.contains(
                                        searchBox
                                    )
                                ) {
                                    searchBox.remove();
                                }

                            }, 250);


                            document.removeEventListener(
                                "keydown",
                                searchEscape
                            );

                        }

                    }
                );

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

                /*
                 * If a notification panel already
                 * exists, toggle it.
                 */
                let notificationPanel =
                    document.querySelector(
                        ".viability-notification-panel"
                    );


                if (notificationPanel) {

                    notificationPanel.classList.toggle(
                        "active"
                    );

                    return;

                }


                /*
                 * Create notification panel
                 */
                notificationPanel =
                    document.createElement("div");


                notificationPanel.className =
                    "viability-notification-panel";


                notificationPanel.innerHTML = `
                    <div class="notification-panel-header">
                        <div>
                            <span>VENTUREIQ</span>
                            <strong>Notifications</strong>
                        </div>

                        <button
                            type="button"
                            class="close-notifications"
                            aria-label="Close notifications"
                        >
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    <div class="notification-item">
                        <div class="notification-item-icon">
                            <i class="fa-solid fa-gauge-high"></i>
                        </div>

                        <div>
                            <strong>Viability analysis ready</strong>
                            <span>Caretroid received a score of 82%.</span>
                        </div>
                    </div>

                    <div class="notification-item">
                        <div class="notification-item-icon">
                            <i class="fa-solid fa-chart-line"></i>
                        </div>

                        <div>
                            <strong>Market signal detected</strong>
                            <span>Strong demand signals were identified.</span>
                        </div>
                    </div>

                    <div class="notification-empty">
                        <i class="fa-regular fa-bell"></i>
                        <span>You're all caught up.</span>
                    </div>
                `;


                document.body.appendChild(
                    notificationPanel
                );


                requestAnimationFrame(() => {

                    notificationPanel.classList.add(
                        "active"
                    );

                });


                const closeNotifications =
                    notificationPanel.querySelector(
                        ".close-notifications"
                    );


                closeNotifications?.addEventListener(
                    "click",
                    () => {

                        notificationPanel.classList.remove(
                            "active"
                        );

                    }
                );

            }
        );

    }


    /* =====================================================
       USER MENU
    ===================================================== */

    if (userMenu) {

        userMenu.addEventListener(
            "click",
            () => {

                let menu =
                    document.querySelector(
                        ".viability-user-menu"
                    );


                if (menu) {

                    menu.classList.toggle(
                        "active"
                    );

                    return;

                }


                menu =
                    document.createElement("div");


                menu.className =
                    "viability-user-menu";


                menu.innerHTML = `
                    <div class="user-menu-header">
                        <div class="user-menu-avatar">
                            S
                        </div>

                        <div>
                            <strong>Sampada</strong>
                            <span>Founder workspace</span>
                        </div>
                    </div>

                    <button type="button">
                        <i class="fa-solid fa-user"></i>
                        Profile
                    </button>

                    <button type="button">
                        <i class="fa-solid fa-sliders"></i>
                        Settings
                    </button>

                    <button type="button" class="logout-option">
                        <i class="fa-solid fa-arrow-right-from-bracket"></i>
                        Log out
                    </button>
                `;


                document.body.appendChild(menu);


                requestAnimationFrame(() => {

                    menu.classList.add(
                        "active"
                    );

                });


                /*
                 * Logout button
                 */
                const logout =
                    menu.querySelector(
                        ".logout-option"
                    );


                logout?.addEventListener(
                    "click",
                    () => {

                        const confirmLogout =
                            confirm(
                                "Are you sure you want to log out?"
                            );


                        if (confirmLogout) {

                            /*
                             * Change this path if your
                             * login page is located elsewhere.
                             */
                            window.location.href =
                                "../login.html";

                        }

                    }
                );

            }
        );

    }


    /* =====================================================
       FACTOR CARD INTERACTION
    ===================================================== */

    const factorCards =
        document.querySelectorAll(
            ".factor-card"
        );


    factorCards.forEach(card => {

        card.addEventListener(
            "click",
            () => {

                /*
                 * Remove selected state
                 */
                factorCards.forEach(item => {

                    item.classList.remove(
                        "selected"
                    );

                });


                /*
                 * Add selected state
                 */
                card.classList.add(
                    "selected"
                );

            }
        );

    });


    /* =====================================================
       SIDEBAR NAVIGATION
    ===================================================== */

    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );


    navItems.forEach(item => {

        item.addEventListener(
            "click",
            function(event) {

                const href =
                    this.getAttribute("href");


                /*
                 * Only prevent navigation
                 * for placeholder links.
                 */
                if (
                    !href ||
                    href === "#"
                ) {

                    event.preventDefault();

                }


                /*
                 * Active state
                 */
                navItems.forEach(nav => {

                    nav.classList.remove(
                        "active"
                    );

                });


                this.classList.add(
                    "active"
                );


                /*
                 * Close mobile sidebar
                 */
                if (
                    window.innerWidth <= 900
                ) {

                    closeSidebar();

                }

            }
        );

    });


    /* =====================================================
       UPGRADE CARD
    ===================================================== */

    const upgradeButton =
        document.querySelector(
            ".upgrade-card button"
        );


    if (upgradeButton) {

        upgradeButton.addEventListener(
            "click",
            () => {

                upgradeButton.innerHTML = `
                    Exploring
                    <i class="fa-solid fa-arrow-right"></i>
                `;


                setTimeout(() => {

                    upgradeButton.innerHTML = `
                        Explore
                        <i class="fa-solid fa-arrow-right"></i>
                    `;

                }, 1200);

            }
        );

    }


    /* =====================================================
       WINDOW RESIZE
    ===================================================== */

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth > 900
            ) {

                closeSidebar();

            }

        }
    );


    /* =====================================================
       ESCAPE KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeSidebar();

            }

        }
    );


    /* =====================================================
       CONSOLE MESSAGE
    ===================================================== */

    console.log(
        "VentureIQ Viability Score initialized successfully."
    );

});