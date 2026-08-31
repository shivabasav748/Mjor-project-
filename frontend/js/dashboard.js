/* =========================================================
   VENTUREIQ — DASHBOARD JAVASCRIPT
   Supabase-connected dynamic dashboard
========================================================= */

import { supabase } from "../config/supabase.js";


document.addEventListener("DOMContentLoaded", async () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const sidebar =
        document.getElementById("sidebar");

    const sidebarOverlay =
        document.getElementById("sidebarOverlay");

    const mobileMenu =
        document.getElementById("mobileMenu");

    const themeToggle =
        document.getElementById("themeToggle");

    const searchButton =
        document.getElementById("searchButton");

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
       GLOBAL USER
    ===================================================== */

    let currentUser = null;


    /* =====================================================
       AUTHENTICATION
    ===================================================== */

    try {

        const {
            data: {
                user
            },
            error
        } = await supabase.auth.getUser();


        if (error) {

            console.error(
                "Unable to get logged-in user:",
                error
            );

            window.location.href =
                "login.html";

            return;
        }


        if (!user) {

            console.warn(
                "No logged-in user found."
            );

            window.location.href =
                "login.html";

            return;
        }


        currentUser = user;


        console.log(
            "Logged-in VentureIQ user:",
            currentUser
        );


        /* =================================================
           LOAD USER + DASHBOARD
        ================================================= */

        await loadDashboard();


        /* =================================================
           REALTIME DATABASE UPDATES
        ================================================= */

        setupRealtimeUpdates();


    } catch (error) {

        console.error(
            "VentureIQ authentication error:",
            error
        );

        window.location.href =
            "login.html";

        return;
    }


    /* =====================================================
       LOAD COMPLETE DASHBOARD
    ===================================================== */

    async function loadDashboard() {

        if (!currentUser) {
            return;
        }


        try {

            await Promise.all([
                loadUserProfile(),
                loadIdeas(),
                loadAnalyses(),
                loadRoadmap(),
                loadActivities()
            ]);


            console.log(
                "VentureIQ dashboard data loaded successfully."
            );


        } catch (error) {

            console.error(
                "Error loading VentureIQ dashboard:",
                error
            );

        }

    }


    /* =====================================================
       LOAD USER PROFILE
    ===================================================== */

    async function loadUserProfile() {

        const {
            data: profile,
            error
        } = await supabase
            .from("profiles")
            .select("full_name, role")
            .eq("id", currentUser.id)
            .maybeSingle();


        if (error) {

            console.error(
                "Profile loading error:",
                error
            );

            return;
        }


        const metadata =
            currentUser.user_metadata || {};


        const name =
            profile?.full_name ||
            metadata.full_name ||
            metadata.name ||
            currentUser.email?.split("@")[0] ||
            "Founder";


        const role =
            profile?.role ||
            "Founder";


        updateUserInformation(
            name,
            currentUser.email,
            role
        );

    }


    /* =====================================================
       UPDATE USER INFORMATION
    ===================================================== */

    function updateUserInformation(
        name,
        email,
        role
    ) {

        const userNameElements =
            document.querySelectorAll(
                ".sidebar-user .user-details strong, " +
                ".header-profile-info strong"
            );


        userNameElements.forEach(
            element => {

                element.textContent =
                    name;

            }
        );


        const roleElements =
            document.querySelectorAll(
                ".sidebar-user .user-details span, " +
                ".header-profile-info span"
            );


        roleElements.forEach(
            element => {

                element.textContent =
                    role;

            }
        );


        const welcomeParagraph =
            document.querySelector(
                ".welcome-copy p"
            );


        if (welcomeParagraph) {

            welcomeParagraph.textContent =
                `Welcome back, ${name}. Let's understand your ideas, discover opportunities and build your next move with confidence.`;

        }


        const avatars =
            document.querySelectorAll(
                ".user-avatar, .header-avatar"
            );


        const initials =
            getInitials(name);


        avatars.forEach(
            avatar => {

                avatar.textContent =
                    initials;

                if (email) {
                    avatar.title = email;
                }

            }
        );

    }


    /* =====================================================
       GET USER INITIALS
    ===================================================== */

    function getInitials(name) {

        if (!name) {
            return "U";
        }


        const words =
            name
                .trim()
                .split(/\s+/);


        if (words.length === 1) {

            return words[0]
                .charAt(0)
                .toUpperCase();

        }


        return (
            words[0].charAt(0) +
            words[words.length - 1].charAt(0)
        ).toUpperCase();

    }


    /* =====================================================
       LOAD IDEAS
    ===================================================== */

    async function loadIdeas() {

        const {
            data: ideas,
            error
        } = await supabase
            .from("ideas")
            .select("*")
            .eq("user_id", currentUser.id)
            .order("created_at", {
                ascending: false
            });


        if (error) {

            console.error(
                "Ideas loading error:",
                error
            );

            return;
        }


        const ideaList =
            ideas || [];


        /* =================================================
           IDEA COUNT
        ================================================= */

        const totalIdeas =
            ideaList.length;


        const activeIdeas =
            ideaList.filter(
                idea =>
                    idea.status === "active"
            ).length;


        updateIdeasCount(
            totalIdeas,
            activeIdeas
        );


        /* =================================================
           AVERAGE VIABILITY
        ================================================= */

        const viabilityValues =
            ideaList
                .map(
                    idea =>
                        Number(
                            idea.viability_score
                        )
                )
                .filter(
                    value =>
                        !Number.isNaN(value)
                );


        const averageViability =
            viabilityValues.length
                ? Math.round(
                    viabilityValues.reduce(
                        (sum, value) =>
                            sum + value,
                        0
                    ) /
                    viabilityValues.length
                )
                : 0;


        updateAverageViability(
            averageViability
        );


        /* =================================================
           LATEST IDEA
        ================================================= */

        const latestIdea =
            ideaList[0];


        if (latestIdea) {

            updateLatestIdea(
                latestIdea
            );

        } else {

            showNoIdeaState();

        }

    }


    /* =====================================================
       UPDATE IDEA COUNT CARD
    ===================================================== */

    function updateIdeasCount(
        total,
        active
    ) {

        const cards =
            document.querySelectorAll(
                ".overview-card"
            );


        const ideasCard =
            cards[0];


        if (!ideasCard) {
            return;
        }


        const value =
            ideasCard.querySelector(
                ".overview-value"
            );


        const small =
            ideasCard.querySelector(
                "small"
            );


        if (value) {

            value.textContent =
                total;

        }


        if (small) {

            small.textContent =
                `${active} idea${active === 1 ? "" : "s"} currently active`;

        }

    }


    /* =====================================================
       UPDATE AVERAGE VIABILITY
    ===================================================== */

    function updateAverageViability(
        score
    ) {

        const cards =
            document.querySelectorAll(
                ".overview-card"
            );


        const viabilityCard =
            cards[1];


        if (!viabilityCard) {
            return;
        }


        const value =
            viabilityCard.querySelector(
                ".overview-value"
            );


        const progress =
            viabilityCard.querySelector(
                ".mini-progress span"
            );


        const small =
            viabilityCard.querySelector(
                "small"
            );


        if (value) {

            value.innerHTML =
                `${score}<span>%</span>`;

        }


        if (progress) {

            progress.style.width =
                `${score}%`;

        }


        if (small) {

            if (score > 0) {

                small.textContent =
                    "Calculated from your analyzed ideas";

            } else {

                small.textContent =
                    "Analyze an idea to generate your score";

            }

        }

    }


    /* =====================================================
       UPDATE LATEST IDEA
    ===================================================== */

    function updateLatestIdea(
        idea
    ) {

        const ideaPanel =
            document.querySelector(
                ".idea-panel"
            );


        if (!ideaPanel) {
            return;
        }


        /* Idea title */

        const title =
            ideaPanel.querySelector(
                ".panel-header h3"
            );


        if (title) {

            title.textContent =
                idea.name || "Untitled Idea";

        }


        /* Idea description */

        const description =
            ideaPanel.querySelector(
                ".idea-description strong"
            );


        if (description) {

            description.textContent =
                idea.description ||
                "No description added yet.";

        }


        /* Detailed description */

        const paragraph =
            ideaPanel.querySelector(
                ".idea-description p"
            );


        if (paragraph) {

            paragraph.textContent =
                idea.description ||
                "Add a description to help VentureIQ understand your idea.";

        }


        /* Viability */

        const metrics =
            ideaPanel.querySelectorAll(
                ".idea-metric"
            );


        if (metrics[0]) {

            updateMetric(
                metrics[0],
                idea.viability_score,
                "%"
            );

        }


        /* Market fit */

        if (metrics[1]) {

            updateMetric(
                metrics[1],
                idea.market_fit_score,
                "%"
            );

        }


        /* Competition */

        if (metrics[2]) {

            const competition =
                idea.competition_level ||
                "Not analyzed";


            const strong =
                metrics[2].querySelector(
                    "strong"
                );


            const bar =
                metrics[2].querySelector(
                    ".metric-bar span"
                );


            if (strong) {

                strong.textContent =
                    competition;

            }


            if (bar) {

                const width =
                    competition === "Low"
                        ? 30
                        : competition === "High"
                            ? 85
                            : 55;


                bar.style.width =
                    `${width}%`;

            }

        }


        /* Last updated */

        const footerText =
            ideaPanel.querySelector(
                ".idea-footer span"
            );


        if (footerText) {

            footerText.textContent =
                `Updated ${formatRelativeTime(idea.updated_at || idea.created_at)}`;

        }

    }


    /* =====================================================
       UPDATE METRIC
    ===================================================== */

    function updateMetric(
        metric,
        value,
        suffix = ""
    ) {

        const number =
            Number(value) || 0;


        const strong =
            metric.querySelector(
                "strong"
            );


        const bar =
            metric.querySelector(
                ".metric-bar span"
            );


        if (strong) {

            strong.textContent =
                `${Math.round(number)}${suffix}`;

        }


        if (bar) {

            bar.style.width =
                `${Math.max(0, Math.min(100, number))}%`;

        }

    }


    /* =====================================================
       EMPTY IDEA STATE
    ===================================================== */

    function showNoIdeaState() {

        const ideaPanel =
            document.querySelector(
                ".idea-panel"
            );


        if (!ideaPanel) {
            return;
        }


        const title =
            ideaPanel.querySelector(
                ".panel-header h3"
            );


        if (title) {

            title.textContent =
                "No ideas yet";

        }


        const strong =
            ideaPanel.querySelector(
                ".idea-description strong"
            );


        if (strong) {

            strong.textContent =
                "Create your first startup idea";

        }


        const paragraph =
            ideaPanel.querySelector(
                ".idea-description p"
            );


        if (paragraph) {

            paragraph.textContent =
                "Start exploring your startup idea with VentureIQ.";

        }


        const metrics =
            ideaPanel.querySelectorAll(
                ".idea-metric"
            );


        metrics.forEach(
            metric => {

                const value =
                    metric.querySelector(
                        "strong"
                    );


                const bar =
                    metric.querySelector(
                        ".metric-bar span"
                    );


                if (value) {
                    value.textContent = "—";
                }


                if (bar) {
                    bar.style.width = "0%";
                }

            }
        );

    }


    /* =====================================================
       LOAD ANALYSES
    ===================================================== */

    async function loadAnalyses() {

        const {
            data: analyses,
            error
        } = await supabase
            .from("analyses")
            .select("*")
            .eq("user_id", currentUser.id)
            .order("created_at", {
                ascending: false
            });


        if (error) {

            console.error(
                "Analysis loading error:",
                error
            );

            return;
        }


        const analysisList =
            analyses || [];


        updateMarketSignals(
            analysisList
        );


        updateStartupHealth(
            analysisList
        );

    }


    /* =====================================================
       MARKET SIGNALS
    ===================================================== */

    function updateMarketSignals(
        analyses
    ) {

        const cards =
            document.querySelectorAll(
                ".overview-card"
            );


        const marketCard =
            cards[2];


        if (!marketCard) {
            return;
        }


        const signalCount =
            analyses.filter(
                analysis =>
                    Number(
                        analysis.market_signals
                    ) > 0
            ).length;


        const value =
            marketCard.querySelector(
                ".overview-value"
            );


        const small =
            marketCard.querySelector(
                "small"
            );


        if (value) {

            value.textContent =
                signalCount;

        }


        if (small) {

            small.textContent =
                signalCount
                    ? `${signalCount} market signal${signalCount === 1 ? "" : "s"} detected`
                    : "No market signals detected yet";

        }


        /* Signal bars */

        const bars =
            marketCard.querySelectorAll(
                ".signal-bars span"
            );


        bars.forEach(
            (bar, index) => {

                if (index < signalCount) {

                    bar.classList.add(
                        "active"
                    );

                } else {

                    bar.classList.remove(
                        "active"
                    );

                }

            }
        );

    }


    /* =====================================================
       STARTUP HEALTH
    ===================================================== */

    function updateStartupHealth(
        analyses
    ) {

        const panel =
            document.querySelector(
                ".intelligence-panel"
            );


        if (!panel) {
            return;
        }


        const latest =
            analyses[0];


        if (!latest) {
            return;
        }


        const market =
            Number(
                latest.market_opportunity
            ) || 0;


        const product =
            Number(
                latest.product_clarity
            ) || 0;


        const competition =
            Number(
                latest.competitive_position
            ) || 0;


        const healthValues =
            [
                market,
                product,
                competition
            ].filter(
                value =>
                    value > 0
            );


        const healthScore =
            healthValues.length
                ? Math.round(
                    healthValues.reduce(
                        (sum, value) =>
                            sum + value,
                        0
                    ) /
                    healthValues.length
                )
                : 0;


        /* Score */

        const score =
            panel.querySelector(
                ".score-center strong"
            );


        if (score) {

            score.textContent =
                healthScore;

        }


        /* Score circle */

        const progress =
            panel.querySelector(
                ".score-progress"
            );


        if (progress) {

            const radius = 50;

            const circumference =
                2 * Math.PI * radius;

            const offset =
                circumference -
                (healthScore / 100) *
                circumference;


            progress.style.strokeDasharray =
                circumference;


            progress.style.strokeDashoffset =
                offset;

        }


        /* Health message */

        const healthStrong =
            panel.querySelector(
                ".health-score > div:last-child strong"
            );


        const healthParagraph =
            panel.querySelector(
                ".health-score > div:last-child p"
            );


        if (healthStrong) {

            if (healthScore >= 80) {

                healthStrong.textContent =
                    "Healthy momentum";

            } else if (healthScore >= 60) {

                healthStrong.textContent =
                    "Promising momentum";

            } else {

                healthStrong.textContent =
                    "Needs attention";

            }

        }


        if (healthParagraph) {

            healthParagraph.textContent =
                `Based on your latest VentureIQ analysis.`;

        }


        /* Factor bars */

        const factors =
            panel.querySelectorAll(
                ".health-factor"
            );


        if (factors[0]) {

            updateHealthFactor(
                factors[0],
                market
            );

        }


        if (factors[1]) {

            updateHealthFactor(
                factors[1],
                product
            );

        }


        if (factors[2]) {

            updateHealthFactor(
                factors[2],
                competition
            );

        }

    }


    /* =====================================================
       HEALTH FACTOR
    ===================================================== */

    function updateHealthFactor(
        element,
        value
    ) {

        const number =
            Math.round(
                Number(value) || 0
            );


        const strong =
            element.querySelector(
                ".factor-top strong"
            );


        const bar =
            element.querySelector(
                ".factor-bar span"
            );


        if (strong) {

            strong.textContent =
                number;

        }


        if (bar) {

            bar.style.width =
                `${Math.max(0, Math.min(100, number))}%`;

        }

    }


    /* =====================================================
       LOAD ROADMAP
    ===================================================== */

    async function loadRoadmap() {

        const {
            data: roadmaps,
            error
        } = await supabase
            .from("roadmaps")
            .select("*")
            .eq("user_id", currentUser.id)
            .order("updated_at", {
                ascending: false
            });


        if (error) {

            console.error(
                "Roadmap loading error:",
                error
            );

            return;
        }


        const roadmap =
            roadmaps?.[0];


        if (!roadmap) {

            updateRoadmap(
                0,
                null
            );

            return;
        }


        updateRoadmap(
            roadmap.progress,
            roadmap
        );

    }


    /* =====================================================
       UPDATE ROADMAP
    ===================================================== */

    function updateRoadmap(
        progress,
        roadmap
    ) {

        const cards =
            document.querySelectorAll(
                ".overview-card"
            );


        const roadmapCard =
            cards[3];


        if (!roadmapCard) {
            return;
        }


        const percentage =
            Math.round(
                Number(progress) || 0
            );


        const value =
            roadmapCard.querySelector(
                ".overview-value"
            );


        const bar =
            roadmapCard.querySelector(
                ".mini-progress span"
            );


        const small =
            roadmapCard.querySelector(
                "small"
            );


        if (value) {

            value.innerHTML =
                `${percentage}<span>%</span>`;

        }


        if (bar) {

            bar.style.width =
                `${percentage}%`;

        }


        if (small) {

            if (roadmap?.next_milestone) {

                small.textContent =
                    `Next: ${roadmap.next_milestone}`;

            } else {

                small.textContent =
                    percentage > 0
                        ? "Roadmap in progress"
                        : "Create a roadmap to get started";

            }

        }

    }


    /* =====================================================
       LOAD ACTIVITIES
    ===================================================== */

    async function loadActivities() {

        const {
            data: activities,
            error
        } = await supabase
            .from("activities")
            .select("*")
            .eq("user_id", currentUser.id)
            .order("created_at", {
                ascending: false
            })
            .limit(4);


        if (error) {

            console.error(
                "Activities loading error:",
                error
            );

            return;
        }


        updateActivities(
            activities || []
        );

    }


    /* =====================================================
       UPDATE ACTIVITIES
    ===================================================== */

    function updateActivities(
        activities
    ) {

        const activityList =
            document.querySelector(
                ".activity-list"
            );


        if (!activityList) {
            return;
        }


        if (!activities.length) {

            activityList.innerHTML = `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fa-regular fa-clock"></i>
                    </div>

                    <div class="activity-info">
                        <strong>No activity yet</strong>
                        <span>Your VentureIQ activity will appear here.</span>
                    </div>

                    <time>—</time>
                </div>
            `;

            return;
        }


        activityList.innerHTML =
            activities
                .map(
                    activity => {

                        const icon =
                            getActivityIcon(
                                activity.activity_type
                            );


                        return `
                            <div class="activity-item">

                                <div class="activity-icon">
                                    <i class="${icon}"></i>
                                </div>

                                <div class="activity-info">

                                    <strong>
                                        ${escapeHTML(
                                            activity.title || "Activity"
                                        )}
                                    </strong>

                                    <span>
                                        ${escapeHTML(
                                            activity.description || ""
                                        )}
                                    </span>

                                </div>

                                <time>
                                    ${formatRelativeTime(
                                        activity.created_at
                                    )}
                                </time>

                            </div>
                        `;

                    }
                )
                .join("");

    }


    /* =====================================================
       ACTIVITY ICON
    ===================================================== */

    function getActivityIcon(
        type
    ) {

        const icons = {

            analysis:
                "fa-solid fa-gauge-high",

            market:
                "fa-solid fa-chart-line",

            roadmap:
                "fa-solid fa-route",

            idea:
                "fa-regular fa-lightbulb",

            competitor:
                "fa-solid fa-users-viewfinder",

            default:
                "fa-regular fa-bell"

        };


        return icons[type] ||
            icons.default;

    }


    /* =====================================================
       FORMAT RELATIVE TIME
    ===================================================== */

    function formatRelativeTime(
        timestamp
    ) {

        if (!timestamp) {
            return "—";
        }


        const date =
            new Date(timestamp);


        const now =
            new Date();


        const difference =
            Math.floor(
                (now - date) / 1000
            );


        if (difference < 60) {
            return "now";
        }


        const minutes =
            Math.floor(
                difference / 60
            );


        if (minutes < 60) {
            return `${minutes}m`;
        }


        const hours =
            Math.floor(
                minutes / 60
            );


        if (hours < 24) {
            return `${hours}h`;
        }


        const days =
            Math.floor(
                hours / 24
            );


        if (days < 30) {
            return `${days}d`;
        }


        const months =
            Math.floor(
                days / 30
            );


        return `${months}mo`;

    }


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHTML(
        value
    ) {

        const div =
            document.createElement(
                "div"
            );


        div.textContent =
            value;


        return div.innerHTML;

    }


    /* =====================================================
       REALTIME SUPABASE UPDATES
    ===================================================== */

    function setupRealtimeUpdates() {

        if (!currentUser) {
            return;
        }


        const channel =
            supabase
                .channel(
                    `ventureiq-dashboard-${currentUser.id}`
                )


                /* -----------------------------------------
                   IDEAS
                ----------------------------------------- */

                .on(
                    "postgres_changes",
                    {
                        event: "*",
                        schema: "public",
                        table: "ideas",
                        filter:
                            `user_id=eq.${currentUser.id}`
                    },
                    async () => {

                        console.log(
                            "Ideas changed — refreshing dashboard."
                        );

                        await loadIdeas();

                    }
                )


                /* -----------------------------------------
                   ANALYSES
                ----------------------------------------- */

                .on(
                    "postgres_changes",
                    {
                        event: "*",
                        schema: "public",
                        table: "analyses",
                        filter:
                            `user_id=eq.${currentUser.id}`
                    },
                    async () => {

                        console.log(
                            "Analysis changed — refreshing dashboard."
                        );

                        await loadAnalyses();

                    }
                )


                /* -----------------------------------------
                   ROADMAP
                ----------------------------------------- */

                .on(
                    "postgres_changes",
                    {
                        event: "*",
                        schema: "public",
                        table: "roadmaps",
                        filter:
                            `user_id=eq.${currentUser.id}`
                    },
                    async () => {

                        console.log(
                            "Roadmap changed — refreshing dashboard."
                        );

                        await loadRoadmap();

                    }
                )


                /* -----------------------------------------
                   ACTIVITIES
                ----------------------------------------- */

                .on(
                    "postgres_changes",
                    {
                        event: "*",
                        schema: "public",
                        table: "activities",
                        filter:
                            `user_id=eq.${currentUser.id}`
                    },
                    async () => {

                        console.log(
                            "Activity changed — refreshing dashboard."
                        );

                        await loadActivities();

                    }
                )


                /* -----------------------------------------
                   PROFILE
                ----------------------------------------- */

                .on(
                    "postgres_changes",
                    {
                        event: "*",
                        schema: "public",
                        table: "profiles",
                        filter:
                            `id=eq.${currentUser.id}`
                    },
                    async () => {

                        console.log(
                            "Profile changed — refreshing user information."
                        );

                        await loadUserProfile();

                    }
                )


                .subscribe(
                    status => {

                        console.log(
                            "VentureIQ realtime status:",
                            status
                        );

                    }
                );


        /* Store channel for cleanup */

        window.ventureIQDashboardChannel =
            channel;

    }


    /* =====================================================
       MOBILE SIDEBAR
    ===================================================== */

    function openSidebar() {

        if (!sidebar) {
            return;
        }


        sidebar.classList.add(
            "open"
        );


        if (sidebarOverlay) {

            sidebarOverlay.classList.add(
                "active"
            );

        }

    }


    function closeSidebar() {

        if (!sidebar) {
            return;
        }


        sidebar.classList.remove(
            "open"
        );


        if (sidebarOverlay) {

            sidebarOverlay.classList.remove(
                "active"
            );

        }

    }


    if (mobileMenu) {

        mobileMenu.addEventListener(
            "click",
            () => {

                if (
                    sidebar &&
                    sidebar.classList.contains("open")
                ) {

                    closeSidebar();

                } else {

                    openSidebar();

                }

            }
        );

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

        dashboard:
            "Dashboard",

        ideas:
            "My Ideas",

        validator:
            "Idea Validator",

        market:
            "Market Intelligence",

        competitors:
            "Competitor Analysis",

        score:
            "Viability Score",

        roadmap:
            "Execution Roadmap",

        notifications:
            "Notifications",

        settings:
            "Settings"

    };


    navItems.forEach(
        item => {

            item.addEventListener(
                "click",
                event => {

                    const href = item.getAttribute("href");

                    if (href && href !== "#") {
                        return;
                    }

                    event.preventDefault();


                    const page =
                        item.getAttribute(
                            "data-page"
                        );


                    navItems.forEach(
                        nav => {

                            nav.classList.remove(
                                "active"
                            );

                        }
                    );


                    item.classList.add(
                        "active"
                    );


                    if (
                        pageTitle &&
                        pageNames[page]
                    ) {

                        pageTitle.textContent =
                            pageNames[page];

                    }

                    if (page === "ideas") {
                        document.querySelector(".idea-panel")?.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });
                    }


                    closeSidebar();


                    console.log(
                        `VentureIQ page selected: ${page}`
                    );

                }
            );

        }
    );


    /* =====================================================
       QUICK ACTIONS
    ===================================================== */

    quickActions.forEach(
        action => {

            action.addEventListener(
                "click",
                () => {

                    const target =
                        action.getAttribute(
                            "data-action"
                        );


                    const matchingNav =
                        document.querySelector(
                            `.nav-item[data-page="${target}"]`
                        );


                    if (matchingNav) {

                        matchingNav.click();

                    }

                }
            );

        }
    );


    /* =====================================================
       NEW IDEA BUTTON
    ===================================================== */

    if (newIdeaButton) {

        newIdeaButton.addEventListener(
            "click",
            () => {

                window.location.href = "aivalidation.html";

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
                    themeToggle.querySelector(
                        "i"
                    );


                if (
                    document.body.classList.contains(
                        "light-theme"
                    )
                ) {

                    if (icon) {

                        icon.classList.remove(
                            "fa-sun"
                        );

                        icon.classList.add(
                            "fa-moon"
                        );

                    }


                    localStorage.setItem(
                        "ventureiq-theme",
                        "light"
                    );

                } else {

                    if (icon) {

                        icon.classList.remove(
                            "fa-moon"
                        );

                        icon.classList.add(
                            "fa-sun"
                        );

                    }


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


    if (
        savedTheme === "light"
    ) {

        document.body.classList.add(
            "light-theme"
        );


        const icon =
            themeToggle?.querySelector(
                "i"
            );


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

            if (
                event.key === "Escape"
            ) {

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

            if (
                window.innerWidth > 900
            ) {

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