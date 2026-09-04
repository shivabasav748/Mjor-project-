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


/* =========================================================
   PREMIUM STRATEGY WORKSPACE — additive upgrade
   Illustrative demo data. Does not modify any code above;
   only reads existing DOM text (AI overview / top recommendation)
   and adds new reveal/count-up/tooltip/SVG behaviour.
   ========================================================= */

(function () {
    "use strict";

    const siReducedMotion =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let siRevealBound = false;

    document.addEventListener("DOMContentLoaded", () => {
        try {
            siInitWorkspace();
        } catch (e) {
            console.error("Strategy workspace init failed:", e);
            siShowError();
        }
    });

    function siInitWorkspace() {
        siSetupSwotAccordion();
        siSetupMatrixTooltips();
        siSetupHeroCta();
        siSetupErrorRetry();
        siRenderWorkspaceContent();
    }

    function siRenderWorkspaceContent() {
        try {
            siBuildPositioningTriangle();
            siBuildRiskOpportunityScatter();
            siPopulateAdvisor();
            siSetupReveal();
        } catch (e) {
            console.error("Strategy workspace render failed:", e);
            siShowError();
        }
    }

    /* ---------- helpers ---------- */

    function siEsc(s) {
        return String(s == null ? "" : s).replace(/[&<>"']/g, (m) => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
        }[m]));
    }

    /* ---------- reveal-on-scroll + count-up + bars ---------- */

    function siTriggerReveal(el) {
        if (!el || el.classList.contains("si-in")) return;
        el.classList.add("si-in");
        el.querySelectorAll(".si-stagger").forEach((s) => s.classList.add("si-in"));
        siAnimateCounts(el);
        siAnimateBars(el);
        if (el.id === "siScoreSection") siAnimateScoreRing();
    }

    function siSetupReveal() {
        if (siRevealBound) return;
        siRevealBound = true;

        const targets = document.querySelectorAll(".si-workspace .si-reveal");
        if (!targets.length) return;

        if (siReducedMotion || !("IntersectionObserver" in window)) {
            targets.forEach(siTriggerReveal);
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    siTriggerReveal(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.16 });

        targets.forEach((t) => observer.observe(t));

        // fallback sweep for content already in view
        setTimeout(() => {
            targets.forEach((t) => {
                if (t.classList.contains("si-in")) return;
                const r = t.getBoundingClientRect();
                if (r.top < (window.innerHeight || 800) * 0.92 && r.bottom > 0) {
                    siTriggerReveal(t);
                    observer.unobserve(t);
                }
            });
        }, 500);
    }

    function siAnimateCounts(scope) {
        const nodes = scope.querySelectorAll("[data-count]");
        nodes.forEach((el) => {
            const target = parseFloat(el.getAttribute("data-count"));
            const suffix = el.getAttribute("data-suffix") || "";
            if (isNaN(target)) return;

            if (siReducedMotion) {
                el.textContent = target + suffix;
                return;
            }

            const dur = 1200;
            const start = performance.now();
            function tick(now) {
                const p = Math.min(1, (now - start) / dur);
                const eased = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.round(target * eased) + suffix;
                if (p < 1) requestAnimationFrame(tick);
                else el.textContent = target + suffix;
            }
            requestAnimationFrame(tick);
        });
    }

    function siAnimateBars(scope) {
        const fills = scope.querySelectorAll(
            ".si-bar-fill[data-pct], .si-tradeoff-fill[data-pct], .si-conf-fill[data-pct]"
        );
        fills.forEach((f) => {
            const pct = f.getAttribute("data-pct") + "%";
            if (siReducedMotion) f.style.width = pct;
            else requestAnimationFrame(() => { f.style.width = pct; });
        });

        const knobs = scope.querySelectorAll(".si-tradeoff-knob[data-pct]");
        knobs.forEach((k) => {
            const pct = k.getAttribute("data-pct") + "%";
            if (siReducedMotion) k.style.left = pct;
            else requestAnimationFrame(() => { k.style.left = pct; });
        });
    }

    function siAnimateScoreRing() {
        const arc = document.getElementById("siScoreArc");
        if (!arc) return;
        const score = 82;
        const circumference = 2 * Math.PI * 80;
        arc.style.strokeDasharray = circumference;
        arc.style.strokeDashoffset = circumference;
        const target = circumference * (1 - score / 100);
        if (siReducedMotion) arc.style.strokeDashoffset = target;
        else requestAnimationFrame(() => { arc.style.strokeDashoffset = target; });
    }

    /* ---------- SWOT accordion ---------- */

    function siSetupSwotAccordion() {
        document.querySelectorAll(".si-swot-item-head").forEach((btn) => {
            btn.addEventListener("click", () => {
                const item = btn.closest(".si-swot-item");
                if (!item) return;
                const open = item.getAttribute("data-open") === "true";
                item.setAttribute("data-open", open ? "false" : "true");
                btn.setAttribute("aria-expanded", open ? "false" : "true");
            });
        });
    }

    /* ---------- priority matrix tooltip ---------- */

    function siSetupMatrixTooltips() {
        const tip = document.getElementById("siMatrixTip");
        if (!tip) return;

        document.querySelectorAll(".si-matrix-point").forEach((pt) => {
            const raw = pt.getAttribute("data-tip") || "";
            const parts = raw.split("|");
            const title = parts[0] || "";
            const desc = parts[1] || "";
            const show = (ev) => siShowMatrixTip(ev, pt, tip, title, desc);
            pt.addEventListener("mouseenter", show);
            pt.addEventListener("mousemove", show);
            pt.addEventListener("focus", show);
            pt.addEventListener("mouseleave", () => tip.classList.remove("show"));
            pt.addEventListener("blur", () => tip.classList.remove("show"));
        });
    }

    function siShowMatrixTip(ev, pt, tip, title, desc) {
        const holder = pt.closest(".si-matrix");
        if (!holder) return;
        const hr = holder.getBoundingClientRect();
        const pr = pt.getBoundingClientRect();
        const x = pr.left - hr.left + pr.width / 2;
        const y = pr.top - hr.top;
        tip.innerHTML = "<b>" + siEsc(title) + "</b>" + siEsc(desc);
        tip.style.left = x + "px";
        tip.style.top = Math.max(4, y) + "px";
        tip.classList.add("show");
    }

    /* ---------- positioning triangle (Innovation / Trust / Value) ---------- */

    function siBuildPositioningTriangle() {
        const svg = document.getElementById("siPosSvg");
        if (!svg) return;

        const labels = ["Innovation", "Trust", "Value"];
        const you = [85, 80, 68];
        const avg = [60, 55, 72];
        const cx = 160, cy = 150, R = 105, n = 3;

        function ptFor(i, val) {
            const ang = -Math.PI / 2 + i * (2 * Math.PI / n);
            const r = (val / 100) * R;
            return [cx + r * Math.cos(ang), cy + r * Math.sin(ang)];
        }

        let html = "";
        [0.34, 0.67, 1].forEach((f) => {
            const pts = [];
            for (let i = 0; i < n; i++) {
                const p = ptFor(i, 100 * f);
                pts.push(p[0].toFixed(1) + "," + p[1].toFixed(1));
            }
            html += '<polygon points="' + pts.join(" ") + '" class="si-pos-grid"></polygon>';
        });

        for (let i = 0; i < n; i++) {
            const p = ptFor(i, 100);
            html += '<line x1="' + cx + '" y1="' + cy + '" x2="' + p[0].toFixed(1) + '" y2="' + p[1].toFixed(1) + '" class="si-pos-axis-line"></line>';
            const lp = ptFor(i, 124);
            const anchor = Math.abs(lp[0] - cx) < 8 ? "middle" : (lp[0] > cx ? "start" : "end");
            html += '<text x="' + lp[0].toFixed(1) + '" y="' + lp[1].toFixed(1) + '" text-anchor="' + anchor + '" class="si-pos-axis-label">' + siEsc(labels[i]) + '</text>';
        }

        const youPts = [], avgPts = [];
        for (let i = 0; i < n; i++) {
            const py = ptFor(i, you[i]);
            const pa = ptFor(i, avg[i]);
            youPts.push(py[0].toFixed(1) + "," + py[1].toFixed(1));
            avgPts.push(pa[0].toFixed(1) + "," + pa[1].toFixed(1));
        }
        html += '<polygon points="' + avgPts.join(" ") + '" class="si-pos-avg"></polygon>';
        html += '<polygon points="' + youPts.join(" ") + '" class="si-pos-you"></polygon>';

        for (let i = 0; i < n; i++) {
            const py = ptFor(i, you[i]);
            const pa = ptFor(i, avg[i]);
            html += '<circle cx="' + py[0].toFixed(1) + '" cy="' + py[1].toFixed(1) + '" r="4" style="fill:var(--gold)">' +
                '<title>' + siEsc(labels[i]) + ': Your Startup ' + you[i] + '/100 (illustrative)</title></circle>';
            html += '<circle cx="' + pa[0].toFixed(1) + '" cy="' + pa[1].toFixed(1) + '" r="4" style="fill:var(--blue)">' +
                '<title>' + siEsc(labels[i]) + ': Market Average ' + avg[i] + '/100 (illustrative)</title></circle>';
        }

        svg.innerHTML = html;
    }

    /* ---------- risk vs opportunity scatter ---------- */

    function siBuildRiskOpportunityScatter() {
        const svg = document.getElementById("siScatterSvg");
        const tip = document.getElementById("siScatterTip");
        if (!svg) return;

        const points = [
            { name: "Market", risk: 35, opp: 85, size: 15 },
            { name: "Product", risk: 55, opp: 78, size: 14 },
            { name: "Competition", risk: 45, opp: 60, size: 11 },
            { name: "Technology", risk: 68, opp: 55, size: 12 },
            { name: "Execution", risk: 60, opp: 50, size: 11 }
        ];

        const X0 = 55, X1 = 390, Y0 = 25, Y1 = 300;
        function xp(v) { return X0 + (v / 100) * (X1 - X0); }
        function yp(v) { return Y1 - (v / 100) * (Y1 - Y0); }

        let html = '<line x1="' + X0 + '" y1="' + Y1 + '" x2="' + X1 + '" y2="' + Y1 + '" class="si-scatter-axis"></line>';
        html += '<line x1="' + X0 + '" y1="' + Y0 + '" x2="' + X0 + '" y2="' + Y1 + '" class="si-scatter-axis"></line>';
        html += '<text x="' + (X0 + X1) / 2 + '" y="' + (Y1 + 26) + '" text-anchor="middle" class="si-scatter-axis-label">Risk &#8594;</text>';
        html += '<text x="18" y="' + (Y0 + Y1) / 2 + '" text-anchor="middle" class="si-scatter-axis-label" transform="rotate(-90 18 ' + (Y0 + Y1) / 2 + ')">Opportunity &#8594;</text>';

        points.forEach((p, i) => {
            const x = xp(p.risk), y = yp(p.opp);
            html += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + p.size + '" class="si-scatter-dot" tabindex="0" role="img" ' +
                'aria-label="' + siEsc(p.name) + ': risk ' + p.risk + ' of 100, opportunity ' + p.opp + ' of 100. Illustrative." data-idx="' + i + '" ' +
                'style="fill:var(--gold); fill-opacity:.2; stroke:var(--gold); stroke-width:1.5;"></circle>';
            html += '<text x="' + x.toFixed(1) + '" y="' + (y - p.size - 6).toFixed(1) + '" text-anchor="middle" class="si-scatter-name">' + siEsc(p.name) + '</text>';
        });

        svg.innerHTML = html;

        svg.querySelectorAll(".si-scatter-dot").forEach((dot, i) => {
            const p = points[i];
            const show = (ev) => siShowScatterTip(ev, dot, tip, p);
            dot.addEventListener("mouseenter", show);
            dot.addEventListener("mousemove", show);
            dot.addEventListener("focus", show);
            dot.addEventListener("mouseleave", () => tip && tip.classList.remove("show"));
            dot.addEventListener("blur", () => tip && tip.classList.remove("show"));
        });
    }

    function siShowScatterTip(ev, dot, tip, p) {
        if (!tip) return;
        const holder = dot.closest(".si-scatter-holder");
        if (!holder) return;
        const hr = holder.getBoundingClientRect();
        const dr = dot.getBoundingClientRect();
        const x = dr.left - hr.left + dr.width / 2;
        const y = dr.top - hr.top;
        tip.innerHTML = "<b>" + siEsc(p.name) + "</b>Risk " + p.risk + "/100 &middot; Opportunity " + p.opp + "/100";
        tip.style.left = x + "px";
        tip.style.top = Math.max(4, y) + "px";
        tip.classList.add("show");
    }

    /* ---------- AI strategic advisor (reuses existing on-page AI text) ---------- */

    function siPopulateAdvisor() {
        const knowEl = document.getElementById("siAdvisorKnow");
        const meansEl = document.getElementById("siAdvisorMeans");
        const nextEl = document.getElementById("siAdvisorNext");
        if (!knowEl || !meansEl || !nextEl) return;

        const overviewHeading = document.querySelector(".ai-overview-content h3");
        const overviewBody = document.querySelector(".ai-overview-content p");
        const topRecTitle = document.querySelector(".recommendation-card.priority-high h4");
        const topRecBody = document.querySelector(".recommendation-card.priority-high p");

        knowEl.textContent = (overviewHeading && overviewHeading.textContent.trim().replace(/\s+/g, " ")) ||
            "Problem relevance, market opportunity and product differentiation are the strongest validated signals so far.";

        meansEl.textContent = (overviewBody && overviewBody.textContent.trim().replace(/\s+/g, " ")) ||
            "The strategy can move forward, but execution complexity and user trust remain open questions before scaling.";

        if (topRecTitle && topRecBody) {
            nextEl.textContent = topRecTitle.textContent.trim().replace(/\s+/g, " ") + " — " +
                topRecBody.textContent.trim().replace(/\s+/g, " ");
        } else {
            nextEl.textContent = "Validate with real caregivers before expanding scope.";
        }
    }

    /* ---------- hero "Build Strategy" CTA (professional demo loading) ---------- */

    function siSetupHeroCta() {
        const btn = document.getElementById("siBuildStrategyBtn");
        const overlay = document.getElementById("siLoadingOverlay");
        const statusEl = document.getElementById("siLoadingStatus");
        const fillEl = document.getElementById("siLoadingFill");
        if (!btn || !overlay) return;

        const messages = [
            "Gathering startup signals...",
            "Reviewing validation results...",
            "Evaluating market conditions...",
            "Comparing competitive pressure...",
            "Building strategic recommendations..."
        ];

        btn.addEventListener("click", () => {
            if (overlay.classList.contains("active")) return;
            overlay.classList.add("active");

            let idx = 0;
            let progress = 0;
            if (statusEl) statusEl.textContent = messages[0];
            if (fillEl) fillEl.style.width = "0%";

            const msgTimer = setInterval(() => {
                idx = (idx + 1) % messages.length;
                if (!statusEl) return;
                statusEl.style.opacity = "0";
                setTimeout(() => {
                    statusEl.textContent = messages[idx];
                    statusEl.style.opacity = "1";
                }, 150);
            }, 420);

            const progTimer = setInterval(() => {
                progress += Math.floor(Math.random() * 10) + 8;
                if (progress > 100) progress = 100;
                if (fillEl) fillEl.style.width = progress + "%";

                if (progress >= 100) {
                    clearInterval(msgTimer);
                    clearInterval(progTimer);
                    setTimeout(() => {
                        overlay.classList.remove("active");
                        const target = document.getElementById("siScoreSection");
                        if (target) {
                            target.scrollIntoView({ behavior: siReducedMotion ? "auto" : "smooth", block: "start" });
                        }
                        if (typeof showToast === "function") {
                            showToast("Strategy ready", "Your strategic readiness view is up to date.");
                        }
                    }, 250);
                }
            }, 180);
        });
    }

    /* ---------- error state ---------- */

    function siShowError() {
        const el = document.getElementById("siErrorState");
        if (el) {
            el.classList.add("active");
            el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }

    function siHideError() {
        const el = document.getElementById("siErrorState");
        if (el) el.classList.remove("active");
    }

    function siSetupErrorRetry() {
        const btn = document.getElementById("siRetryBtn");
        if (!btn) return;
        btn.addEventListener("click", () => {
            siHideError();
            siRenderWorkspaceContent();
        });
    }
})();