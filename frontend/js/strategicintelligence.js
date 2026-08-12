/* =========================================================
   VENTUREIQ — STRATEGIC INTELLIGENCE JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initializeStrategicIntelligence();
});


/* =========================================================
   INITIALIZATION
   ========================================================= */

function initializeStrategicIntelligence() {

    setupMobileSidebar();
    setupThemeToggle();
    setupNotifications();
    setupSearch();
    setupUserMenu();
    setupAnalyzeButton();
    setupInsightCards();
    setupRecommendationActions();
    setupNavigationLinks();

    animateIntelligenceElements();
}


/* =========================================================
   MOBILE SIDEBAR
   ========================================================= */

function setupMobileSidebar() {

    const mobileMenu = document.getElementById("mobileMenu");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");

    if (!mobileMenu || !sidebar) {
        return;
    }

    mobileMenu.addEventListener("click", () => {

        sidebar.classList.toggle("open");

        if (overlay) {
            overlay.classList.toggle("active");
        }

        document.body.classList.toggle("sidebar-open");
    });


    if (overlay) {

        overlay.addEventListener("click", () => {

            sidebar.classList.remove("open");
            overlay.classList.remove("active");
            document.body.classList.remove("sidebar-open");

        });

    }


    const sidebarLinks = sidebar.querySelectorAll("a");

    sidebarLinks.forEach(link => {

        link.addEventListener("click", () => {

            if (window.innerWidth <= 900) {

                sidebar.classList.remove("open");

                if (overlay) {
                    overlay.classList.remove("active");
                }

                document.body.classList.remove("sidebar-open");

            }

        });

    });

}


/* =========================================================
   THEME TOGGLE
   ========================================================= */

function setupThemeToggle() {

    const themeToggle = document.getElementById("themeToggle");

    if (!themeToggle) {
        return;
    }


    const savedTheme = localStorage.getItem("ventureiq-theme");


    if (savedTheme === "light") {

        document.body.classList.add("light-theme");

        updateThemeIcon(themeToggle, true);

    }


    themeToggle.addEventListener("click", () => {

        const isLight =
            document.body.classList.toggle("light-theme");

        localStorage.setItem(
            "ventureiq-theme",
            isLight ? "light" : "dark"
        );

        updateThemeIcon(themeToggle, isLight);

    });

}


/* =========================================================
   THEME ICON
   ========================================================= */

function updateThemeIcon(button, isLight) {

    const icon = button.querySelector("i");

    if (!icon) {
        return;
    }


    if (isLight) {

        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");

    } else {

        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");

    }

}


/* =========================================================
   NOTIFICATIONS
   ========================================================= */

function setupNotifications() {

    const notificationButton =
        document.getElementById("notificationButton");

    if (!notificationButton) {
        return;
    }


    notificationButton.addEventListener("click", () => {

        showToast(
            "You’re all caught up.",
            "No new intelligence alerts."
        );

    });

}


/* =========================================================
   SEARCH
   ========================================================= */

function setupSearch() {

    const searchButton =
        document.getElementById("searchButton");

    if (!searchButton) {
        return;
    }


    searchButton.addEventListener("click", () => {

        createSearchOverlay();

    });

}


/* =========================================================
   SEARCH OVERLAY
   ========================================================= */

function createSearchOverlay() {

    if (document.getElementById("strategicSearchOverlay")) {
        return;
    }


    const overlay = document.createElement("div");

    overlay.id = "strategicSearchOverlay";

    overlay.className = "search-overlay";


    overlay.innerHTML = `
        <div class="search-modal">

            <button
                class="search-close"
                id="closeStrategicSearch"
                aria-label="Close search"
            >
                <i class="fa-solid fa-xmark"></i>
            </button>

            <span class="search-label">
                VENTUREIQ SEARCH
            </span>

            <h3>
                Search your intelligence
            </h3>

            <div class="search-input-wrapper">

                <i class="fa-solid fa-magnifying-glass"></i>

                <input
                    type="text"
                    id="strategicSearchInput"
                    placeholder="Search insights, risks, recommendations..."
                    autocomplete="off"
                >

            </div>

            <div
                class="search-results"
                id="strategicSearchResults"
            >
                <span>
                    Start typing to search your intelligence.
                </span>
            </div>

        </div>
    `;


    document.body.appendChild(overlay);


    requestAnimationFrame(() => {
        overlay.classList.add("active");
    });


    const input =
        document.getElementById("strategicSearchInput");

    const closeButton =
        document.getElementById("closeStrategicSearch");


    if (input) {

        input.focus();

        input.addEventListener("input", () => {

            performStrategicSearch(input.value);

        });

    }


    if (closeButton) {

        closeButton.addEventListener("click", closeSearchOverlay);

    }


    overlay.addEventListener("click", event => {

        if (event.target === overlay) {
            closeSearchOverlay();
        }

    });


    document.addEventListener(
        "keydown",
        handleSearchEscape
    );

}


/* =========================================================
   SEARCH FUNCTION
   ========================================================= */

function performStrategicSearch(query) {

    const results =
        document.getElementById("strategicSearchResults");

    if (!results) {
        return;
    }


    const searchText =
        query.trim().toLowerCase();


    if (!searchText) {

        results.innerHTML = `
            <span>
                Start typing to search your intelligence.
            </span>
        `;

        return;
    }


    const searchableItems = [

        {
            title: "Market opportunity",
            description:
                "Strong demand signals detected in the target market."
        },

        {
            title: "Competitive pressure",
            description:
                "Moderate competition with opportunities for differentiation."
        },

        {
            title: "Customer validation",
            description:
                "Validate the problem with real target users."
        },

        {
            title: "Execution complexity",
            description:
                "Prototype development requires structured technical planning."
        },

        {
            title: "Strategic recommendation",
            description:
                "Focus on validation before expanding the product scope."
        },

        {
            title: "Viability score",
            description:
                "Current startup viability score indicates strong potential."
        }

    ];


    const matches =
        searchableItems.filter(item =>
            `${item.title} ${item.description}`
                .toLowerCase()
                .includes(searchText)
        );


    if (matches.length === 0) {

        results.innerHTML = `
            <div class="search-empty">
                <i class="fa-regular fa-face-frown"></i>
                <strong>No intelligence found</strong>
                <span>Try another keyword.</span>
            </div>
        `;

        return;
    }


    results.innerHTML = matches.map(item => `

        <div class="search-result-item">

            <div class="search-result-icon">
                <i class="fa-solid fa-sparkles"></i>
            </div>

            <div>
                <strong>
                    ${item.title}
                </strong>

                <span>
                    ${item.description}
                </span>
            </div>

        </div>

    `).join("");

}


/* =========================================================
   CLOSE SEARCH
   ========================================================= */

function closeSearchOverlay() {

    const overlay =
        document.getElementById("strategicSearchOverlay");

    if (!overlay) {
        return;
    }


    overlay.classList.remove("active");


    setTimeout(() => {

        overlay.remove();

    }, 250);


    document.removeEventListener(
        "keydown",
        handleSearchEscape
    );

}


/* =========================================================
   ESCAPE SEARCH
   ========================================================= */

function handleSearchEscape(event) {

    if (event.key === "Escape") {

        closeSearchOverlay();

    }

}


/* =========================================================
   USER MENU
   ========================================================= */

function setupUserMenu() {

    const userMenu =
        document.getElementById("userMenu");

    if (!userMenu) {
        return;
    }


    userMenu.addEventListener("click", () => {

        showToast(
            "Founder workspace",
            "Workspace settings are available soon."
        );

    });

}


/* =========================================================
   ANALYZE / REFRESH BUTTON
   ========================================================= */

function setupAnalyzeButton() {

    const analyzeButton =
        document.getElementById("reanalyzeButton");

    if (!analyzeButton) {
        return;
    }


    analyzeButton.addEventListener("click", () => {

        startAnalysis(analyzeButton);

    });

}


/* =========================================================
   START ANALYSIS
   ========================================================= */

function startAnalysis(button) {

    if (button.classList.contains("loading")) {
        return;
    }


    const originalContent =
        button.innerHTML;


    button.classList.add("loading");

    button.disabled = true;


    button.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Analyzing...
    `;


    showToast(
        "Intelligence analysis started",
        "VentureIQ is refreshing your strategic signals."
    );


    setTimeout(() => {

        button.classList.remove("loading");

        button.disabled = false;

        button.innerHTML = originalContent;


        updateIntelligenceTimestamp();


        showToast(
            "Analysis updated",
            "Your strategic intelligence is now refreshed."
        );

    }, 2200);

}


/* =========================================================
   UPDATE TIMESTAMP
   ========================================================= */

function updateIntelligenceTimestamp() {

    const timestamp =
        document.querySelector("[data-analysis-time]");

    if (!timestamp) {
        return;
    }


    const now = new Date();


    timestamp.textContent =
        `Updated ${now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        })}`;

}


/* =========================================================
   INSIGHT CARDS
   ========================================================= */

function setupInsightCards() {

    const cards =
        document.querySelectorAll(
            ".intelligence-card, .insight-card, .signal-card"
        );


    cards.forEach(card => {

        card.addEventListener("mouseenter", () => {

            card.classList.add("insight-hover");

        });


        card.addEventListener("mouseleave", () => {

            card.classList.remove("insight-hover");

        });

    });

}


/* =========================================================
   RECOMMENDATION ACTIONS
   ========================================================= */

function setupRecommendationActions() {

    const buttons =
        document.querySelectorAll(
            ".recommendation-action, .next-step-button, .decision-action"
        );


    buttons.forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();


            const text =
                button.dataset.message ||
                "Your next strategic action is ready to explore.";


            showToast(
                "Next step",
                text
            );

        });

    });

}


/* =========================================================
   NAVIGATION LINKS
   ========================================================= */

function setupNavigationLinks() {

    const links =
        document.querySelectorAll(
            ".sidebar-nav .nav-item"
        );


    links.forEach(link => {

        link.addEventListener("click", function () {

            links.forEach(item =>
                item.classList.remove("active")
            );

            this.classList.add("active");

        });

    });

}


/* =========================================================
   ANIMATE INTELLIGENCE ELEMENTS
   ========================================================= */

function animateIntelligenceElements() {

    const elements =
        document.querySelectorAll(
            ".intelligence-card, .insight-card, .signal-card, .recommendation-card"
        );


    elements.forEach((element, index) => {

        element.style.opacity = "0";
        element.style.transform = "translateY(18px)";


        setTimeout(() => {

            element.style.transition =
                "opacity 0.6s ease, transform 0.6s ease";

            element.style.opacity = "1";
            element.style.transform = "translateY(0)";

        }, 120 + index * 100);

    });

}


/* =========================================================
   TOAST NOTIFICATION
   ========================================================= */

function showToast(title, message) {

    const existingToast =
        document.querySelector(".ventureiq-toast");


    if (existingToast) {
        existingToast.remove();
    }


    const toast =
        document.createElement("div");


    toast.className =
        "ventureiq-toast";


    toast.innerHTML = `

        <div class="toast-icon">
            <i class="fa-solid fa-sparkles"></i>
        </div>

        <div class="toast-content">

            <strong>
                ${title}
            </strong>

            <span>
                ${message}
            </span>

        </div>

        <button
            class="toast-close"
            aria-label="Close notification"
        >
            <i class="fa-solid fa-xmark"></i>
        </button>

    `;


    document.body.appendChild(toast);


    requestAnimationFrame(() => {

        toast.classList.add("show");

    });


    const closeButton =
        toast.querySelector(".toast-close");


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            () => removeToast(toast)
        );

    }


    setTimeout(() => {

        removeToast(toast);

    }, 4000);

}


/* =========================================================
   REMOVE TOAST
   ========================================================= */

function removeToast(toast) {

    if (!toast) {
        return;
    }


    toast.classList.remove("show");


    setTimeout(() => {

        if (toast.parentNode) {
            toast.remove();
        }

    }, 300);

}


/* =========================================================
   ACTIVE NAVIGATION ON SCROLL
   ========================================================= */

window.addEventListener("scroll", () => {

    const sections =
        document.querySelectorAll(
            "main section[id]"
        );


    if (!sections.length) {
        return;
    }


    let currentSection = "";


    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 180;


        if (window.scrollY >= sectionTop) {

            currentSection =
                section.getAttribute("id");

        }

    });


    if (!currentSection) {
        return;
    }


    document
        .querySelectorAll(
            ".sidebar-nav .nav-item"
        )
        .forEach(link => {

            const href =
                link.getAttribute("href");


            if (href &&
                href.includes(currentSection)) {

                link.classList.add("active");

            }

        });

});


/* =========================================================
   WINDOW RESIZE
   ========================================================= */

window.addEventListener("resize", () => {

    if (window.innerWidth > 900) {

        const sidebar =
            document.getElementById("sidebar");

        const overlay =
            document.getElementById("sidebarOverlay");


        if (sidebar) {
            sidebar.classList.remove("open");
        }


        if (overlay) {
            overlay.classList.remove("active");
        }


        document.body.classList.remove(
            "sidebar-open"
        );

    }

});


/* =========================================================
   KEYBOARD SHORTCUT
   ========================================================= */

document.addEventListener("keydown", event => {

    /*
        Ctrl + K / Cmd + K
        Opens VentureIQ search.
    */

    if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
    ) {

        event.preventDefault();

        createSearchOverlay();

    }

});


/* =========================================================
   CONSOLE MESSAGE
   ========================================================= */

console.log(
    "%cVentureIQ Strategic Intelligence",
    "font-size:16px;font-weight:bold;"
);

console.log(
    "Strategic intelligence module initialized successfully."
);