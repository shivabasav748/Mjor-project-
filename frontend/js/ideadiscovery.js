/* =========================================================
   VENTUREIQ — AI STARTUP IDEA DISCOVERY
   Premium opportunity workspace.

   NOTE: This module has no backend / API / Supabase calls.
   Opportunity data is illustrative and derived locally from
   the domain the user selects. The setTimeout below is the
   async stand-in for a future AI request — the loading state
   is cleared only when that "request" resolves (or fails).
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const themeToggle       = document.getElementById("themeToggle");

    const domainGrid        = document.getElementById("domainGrid");
    const domainCards       = document.querySelectorAll(".domain-card");
    const optionButtons     = document.querySelectorAll(".option-button");

    const discoverButton    = document.getElementById("discoverButton");
    const discoverHint      = document.getElementById("discoverHint");

    const emptyState        = document.getElementById("emptyState");
    const loadingSection    = document.getElementById("loadingSection");
    const loadingStatus     = document.getElementById("loadingStatus");
    const loadingSteps      = document.getElementById("loadingSteps");

    const resultsSection    = document.getElementById("resultsSection");
    const resultsDescription = document.getElementById("resultsDescription");
    const resetButton       = document.getElementById("resetButton");

    const ideaResults       = document.getElementById("ideaResults");
    const resultDomainName  = document.getElementById("resultDomainName");

    const errorState        = document.getElementById("errorState");
    const retryButton       = document.getElementById("retryButton");

    const oppRingProgress   = document.getElementById("oppRingProgress");
    const oppScoreValue     = document.getElementById("oppScoreValue");
    const oppScoreCaption   = document.getElementById("oppScoreCaption");
    const oppBreakdown      = document.getElementById("oppBreakdown");
    const oppRadarShape     = document.getElementById("oppRadarShape");

    const comparisonChart   = document.getElementById("comparisonChart");
    const signalGrid        = document.getElementById("signalGrid");
    const learnGrid         = document.getElementById("learnGrid");
    const learnDomainName   = document.getElementById("learnDomainName");

    const selectedDomain      = document.getElementById("selectedDomain");
    const selectedInvestment  = document.getElementById("selectedInvestment");
    const selectedCustomer    = document.getElementById("selectedCustomer");
    const selectedExperience  = document.getElementById("selectedExperience");

    const gapNeed        = document.getElementById("gapNeed");
    const gapExisting    = document.getElementById("gapExisting");
    const gapUnmet       = document.getElementById("gapUnmet");
    const gapOpportunity = document.getElementById("gapOpportunity");

    const perspWhyNow    = document.getElementById("perspWhyNow");
    const perspWhoNeeds  = document.getElementById("perspWhoNeeds");
    const perspDifferent = document.getElementById("perspDifferent");


    /* =====================================================
       MOTION PREFERENCE
    ===================================================== */

    let prefersReduced = false;
    try {
        prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (e) { /* noop */ }


    /* =====================================================
       THEME  (class: dark-theme · key: ventureiq-theme)
       Unchanged mechanism from the original implementation.
    ===================================================== */

    function updateThemeIcon() {
        if (!themeToggle) return;
        const icon = themeToggle.querySelector("i");
        if (!icon) return;
        if (document.body.classList.contains("dark-theme")) {
            icon.classList.remove("fa-moon");
            icon.classList.add("fa-sun");
        } else {
            icon.classList.remove("fa-sun");
            icon.classList.add("fa-moon");
        }
    }

    if (localStorage.getItem("ventureiq-theme") === "dark") {
        document.body.classList.add("dark-theme");
    }
    updateThemeIcon();

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-theme");
            localStorage.setItem(
                "ventureiq-theme",
                document.body.classList.contains("dark-theme") ? "dark" : "light"
            );
            updateThemeIcon();
        });
    }


    /* =====================================================
       SELECTIONS
    ===================================================== */

    const selections = {
        domain: "",
        investment: "",
        customer: "",
        experience: ""
    };

    domainCards.forEach((card) => {
        card.addEventListener("click", () => {
            domainCards.forEach((item) => {
                item.classList.remove("selected");
                item.setAttribute("aria-pressed", "false");
            });
            card.classList.add("selected");
            card.setAttribute("aria-pressed", "true");

            selections.domain = card.dataset.domain;
            if (selectedDomain) selectedDomain.textContent = selections.domain;

            if (discoverHint) discoverHint.hidden = true;
            if (domainGrid) domainGrid.classList.remove("needs-domain");
        });
    });

    optionButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const group = button.dataset.group;
            const value = button.dataset.value;

            document
                .querySelectorAll('.option-button[data-group="' + group + '"]')
                .forEach((item) => {
                    item.classList.remove("selected");
                    item.setAttribute("aria-pressed", "false");
                });

            button.classList.add("selected");
            button.setAttribute("aria-pressed", "true");

            selections[group] = value;

            if (group === "investment" && selectedInvestment) selectedInvestment.textContent = value;
            if (group === "customer" && selectedCustomer) selectedCustomer.textContent = value;
            if (group === "experience" && selectedExperience) selectedExperience.textContent = value;
        });
    });


    /* =====================================================
       OPPORTUNITY DATA  (illustrative)
       score / demand / innovation / feasibility / growth
       lowRivalry = how open the space is (higher = less crowded)
    ===================================================== */

    const IDEA_DATA = {

        "AI & Machine Learning": [
            {
                title: "AI Personal Finance Copilot",
                description: "An intelligent assistant that helps people understand spending, savings and everyday money decisions.",
                icon: "fa-chart-pie",
                audience: "Young professionals managing money for the first time",
                problem: "People know they should budget but existing tools feel like spreadsheets, not guidance.",
                score: 92, demand: 90, innovation: 88, feasibility: 74, growth: 91, lowRivalry: 48
            },
            {
                title: "AI Skill Gap Navigator",
                description: "A personalised platform that identifies career skill gaps and builds an adaptive learning path.",
                icon: "fa-route",
                audience: "Mid-career professionals planning their next move",
                problem: "Learners waste months on courses that don't map to the roles they actually want.",
                score: 89, demand: 84, innovation: 82, feasibility: 80, growth: 87, lowRivalry: 63
            },
            {
                title: "AI Business Opportunity Scanner",
                description: "A system that surfaces emerging business opportunities from market and consumer trend data.",
                icon: "fa-magnifying-glass-chart",
                audience: "Founders and corporate strategy teams",
                problem: "Opportunity research is slow, manual and out of date by the time it's finished.",
                score: 94, demand: 88, innovation: 93, feasibility: 68, growth: 92, lowRivalry: 66
            }
        ],

        "FinTech": [
            {
                title: "Smart Micro-Investment Assistant",
                description: "A beginner-friendly platform that helps people understand and plan small-scale investments.",
                icon: "fa-coins",
                audience: "First-time investors with limited disposable income",
                problem: "New investors are intimidated by jargon and minimum balances.",
                score: 86, demand: 83, innovation: 74, feasibility: 72, growth: 84, lowRivalry: 44
            },
            {
                title: "AI Expense Intelligence",
                description: "A system that turns personal spending patterns into clear, actionable financial insight.",
                icon: "fa-wallet",
                audience: "Households trying to cut recurring costs",
                problem: "Bank apps show transactions but never explain what to actually change.",
                score: 88, demand: 86, innovation: 79, feasibility: 78, growth: 82, lowRivalry: 52
            }
        ],

        "HealthTech": [
            {
                title: "AI Preventive Health Companion",
                description: "A digital assistant that helps people understand lifestyle patterns and preventive wellness actions.",
                icon: "fa-heart-pulse",
                audience: "Adults 30-55 with early lifestyle risk factors",
                problem: "Preventive advice is generic; people don't know which change matters most for them.",
                score: 91, demand: 89, innovation: 84, feasibility: 62, growth: 90, lowRivalry: 61
            },
            {
                title: "Smart Elder Care Network",
                description: "A connected platform supporting families and caregivers with intelligent elderly-care coordination.",
                icon: "fa-person-cane",
                audience: "Adult children caring for ageing parents remotely",
                problem: "Care coordination happens over scattered calls, texts and paper notes.",
                score: 90, demand: 87, innovation: 78, feasibility: 66, growth: 88, lowRivalry: 69
            }
        ],

        "AgriTech": [
            {
                title: "AI Crop Doctor",
                description: "A smart agricultural assistant that helps farmers identify crop diseases and get actionable guidance.",
                icon: "fa-seedling",
                audience: "Smallholder farmers with limited access to agronomists",
                problem: "By the time disease is visible, a big part of the yield is already lost.",
                score: 94, demand: 88, innovation: 85, feasibility: 70, growth: 90, lowRivalry: 67
            },
            {
                title: "Smart Farm Decision Engine",
                description: "A platform that combines crop, weather and market data to support day-to-day farm decisions.",
                icon: "fa-wheat-awn",
                audience: "Mid-size farm operators and co-operatives",
                problem: "Key decisions rely on gut feel because the data lives in five different places.",
                score: 91, demand: 82, innovation: 80, feasibility: 68, growth: 86, lowRivalry: 64
            }
        ],

        "EdTech": [
            {
                title: "AI Personalised Study Mentor",
                description: "An AI mentor that adapts learning plans based on student progress, goals and weak areas.",
                icon: "fa-graduation-cap",
                audience: "High-school and early-university students",
                problem: "Classrooms move at one pace; struggling students fall behind silently.",
                score: 90, demand: 88, innovation: 81, feasibility: 78, growth: 85, lowRivalry: 41
            },
            {
                title: "Skill-to-Career Navigator",
                description: "A platform connecting a student's skills to suitable career paths and learning opportunities.",
                icon: "fa-compass",
                audience: "Final-year students and recent graduates",
                problem: "Graduates struggle to translate what they studied into a realistic first role.",
                score: 87, demand: 80, innovation: 76, feasibility: 82, growth: 83, lowRivalry: 58
            }
        ],

        "Robotics": [
            {
                title: "AI Elderly Care Robot",
                description: "An assistive robot designed to support elderly users with daily activities and safety.",
                icon: "fa-robot",
                audience: "Older adults living independently and their families",
                problem: "There aren't enough carers, and families can't monitor safety around the clock.",
                score: 88, demand: 84, innovation: 96, feasibility: 52, growth: 90, lowRivalry: 72
            },
            {
                title: "Autonomous Campus Assistant",
                description: "A mobile robot that assists institutions with delivery, guidance and campus services.",
                icon: "fa-location-dot",
                audience: "Universities, hospitals and large campuses",
                problem: "Internal logistics eat staff time that should go to people, not parcels.",
                score: 84, demand: 74, innovation: 88, feasibility: 55, growth: 82, lowRivalry: 70
            }
        ],

        "GreenTech": [
            {
                title: "AI Energy Optimisation",
                description: "A platform that helps businesses identify energy waste and optimise consumption.",
                icon: "fa-bolt",
                audience: "Small and mid-size commercial property operators",
                problem: "Energy bills are a black box; owners can't see where the waste is.",
                score: 89, demand: 88, innovation: 82, feasibility: 74, growth: 90, lowRivalry: 63
            },
            {
                title: "Smart Waste Intelligence",
                description: "A platform that improves waste collection and recycling using predictive analytics.",
                icon: "fa-recycle",
                audience: "Municipalities and facility management firms",
                problem: "Collection routes run on fixed schedules whether bins are full or empty.",
                score: 91, demand: 83, innovation: 79, feasibility: 71, growth: 87, lowRivalry: 66
            }
        ],

        "E-Commerce": [
            {
                title: "AI Shopping Personaliser",
                description: "A commerce assistant that creates a genuinely personalised product discovery experience.",
                icon: "fa-cart-shopping",
                audience: "Mid-market online retailers",
                problem: "Generic recommendation widgets convert poorly and feel the same everywhere.",
                score: 88, demand: 85, innovation: 78, feasibility: 76, growth: 84, lowRivalry: 39
            },
            {
                title: "Local Business Commerce Engine",
                description: "A commerce platform helping small local businesses reach and understand their customers.",
                icon: "fa-store",
                audience: "Independent local shops going online",
                problem: "Local shops are pushed onto marketplaces that own the customer relationship.",
                score: 86, demand: 79, innovation: 72, feasibility: 83, growth: 82, lowRivalry: 56
            }
        ]
    };


    /* Per-domain AI perspective (illustrative). */
    const PERSPECTIVES = {
        "AI & Machine Learning": {
            whyNow: "Foundation models made capable AI cheap to build on. The advantage is no longer the model — it's the specific problem and data you point it at.",
            whoNeeds: "Teams and individuals drowning in a repetitive, judgement-heavy task who can't justify hiring a specialist to do it.",
            different: "Win on a narrow workflow and proprietary context, not on raw model quality. Depth beats breadth here."
        },
        "FinTech": {
            whyNow: "Open banking and instant payment rails removed years of integration work. Distribution and trust are now the real moats.",
            whoNeeds: "People underserved by incumbents — first-timers, thin-file customers, or a niche the big players find too small.",
            different: "Compliance and reliability are table stakes; differentiation comes from a sharper wedge segment and a simpler experience."
        },
        "HealthTech": {
            whyNow: "Care systems are short-staffed and shifting cost toward prevention and remote monitoring.",
            whoNeeds: "Patients and caregivers managing an ongoing condition between appointments, with no one coordinating the gaps.",
            different: "Clinical credibility plus a workflow clinicians and families will actually adopt. Regulation is a barrier and a moat."
        },
        "AgriTech": {
            whyNow: "Cheap sensors, satellite data and phone cameras put decision-grade information in every field.",
            whoNeeds: "Smaller operators without an in-house agronomist, making high-stakes calls on limited information.",
            different: "Meet farmers where they are — offline-tolerant, local-language, tied to a concrete yield or cost outcome."
        },
        "EdTech": {
            whyNow: "Personalised tutoring, once a luxury, is now affordable to deliver at scale.",
            whoNeeds: "Learners who fall behind quietly in one-pace environments and the parents watching it happen.",
            different: "Outcomes people can see — grades, placements, confidence — not hours of content consumed."
        },
        "Robotics": {
            whyNow: "Hardware costs fell and perception software matured, making constrained, indoor autonomy practical.",
            whoNeeds: "Organisations with a labour shortage in a repetitive physical task inside a controlled environment.",
            different: "Pick a bounded environment and nail reliability. A robot that works 99% of the time in one setting beats a general one that mostly works."
        },
        "GreenTech": {
            whyNow: "Energy prices and reporting rules turned sustainability from optional to a line-item businesses must manage.",
            whoNeeds: "Operators with rising costs and no visibility into where the waste actually is.",
            different: "Tie every feature to money saved or a compliance box ticked — not to abstract impact."
        },
        "E-Commerce": {
            whyNow: "Acquisition costs keep climbing, so retention, personalisation and margin are where the game is now won.",
            whoNeeds: "Mid-market retailers stuck between generic plugins and enterprise suites they can't afford.",
            different: "Own a specific merchant type and their specific conversion problem rather than being a horizontal tool."
        }
    };

    const GENERIC_PERSPECTIVE = {
        whyNow: "The enabling technology is now cheap and accessible, so the advantage has moved to owning a specific problem and customer.",
        whoNeeds: "A clearly underserved group already paying — in time or money — to work around this problem today.",
        different: "Start narrow. A focused solution for one segment is easier to build, sell and defend than a broad one."
    };


    /* Emerging signal cards (illustrative). */
    const SIGNALS = [
        { icon: "fa-arrow-trend-up", title: "Rising customer demand", text: "Search interest and community discussion around this problem are climbing steadily.", strength: "high" },
        { icon: "fa-microchip", title: "Emerging technology", text: "New tooling has dropped the cost of building a credible solution in this space.", strength: "high" },
        { icon: "fa-users-viewfinder", title: "Increasing competition", text: "Early entrants are appearing — validation of the space, and a reason to move deliberately.", strength: "medium" },
        { icon: "fa-scale-balanced", title: "Regulation shift", text: "Policy changes are opening (or forcing) new behaviour that a product can serve.", strength: "medium" },
        { icon: "fa-shapes", title: "New business models", text: "Usage-based and outcome-based pricing are making previously unviable ideas work.", strength: "emerging" },
        { icon: "fa-user-plus", title: "Underserved segment", text: "A specific customer group is routinely ignored by incumbents chasing larger accounts.", strength: "emerging" }
    ];

    const LOADING_MESSAGES = [
        "Analyzing market signals…",
        "Finding customer problems…",
        "Evaluating competition…",
        "Identifying opportunity gaps…"
    ];


    /* Candidate strategic plays. Each scores its own fit against
       a specific idea's profile — the top 3 surface per card. */
    const RECO_LIBRARY = [
        {
            id: "validate-demand",
            icon: "fa-vial-circle-check",
            title: "Pressure-test demand before you build",
            text: "Demand reads strong ({demand}/100) but unproven for this exact idea. Put a landing page and 5 conversations in front of {audience} this week.",
            action: { label: "Open AI Validation", href: "aivalidation.html" },
            fit: function (i) { return 58 + (i.demand - i.feasibility) * 0.7 + (i.score >= 88 ? 8 : 0); }
        },
        {
            id: "derisk-build",
            icon: "fa-screwdriver-wrench",
            title: "De-risk the hardest part first",
            text: "Feasibility is the soft spot ({feasibility}/100). Scope a two-week thin prototype that proves the single riskiest assumption — not the whole product.",
            action: { label: "Plan the roadmap", href: "executionroadmap.html" },
            fit: function (i) { return 92 - i.feasibility + (i.innovation >= 85 ? 12 : 0); }
        },
        {
            id: "sharper-wedge",
            icon: "fa-bullseye",
            title: "Cut to a sharper wedge segment",
            text: "The space is busy (competition: {competitionWord}). Take the narrowest slice of {audience} you can fully own, win it, then widen.",
            action: { label: "Study competitors", href: "competitoranalysis.html" },
            fit: function (i) { return (100 - i.lowRivalry) + (i.score >= 85 ? 6 : 0); }
        },
        {
            id: "own-open-lane",
            icon: "fa-flag",
            title: "Move fast — the lane is still open",
            text: "Low rivalry ({lowRivalry}/100) plus rising demand is a timing window. Ship a rough v1 in {domain} within 60 days to plant a flag.",
            action: { label: "Build strategy", href: "strategicintelligence.html" },
            fit: function (i) { return i.lowRivalry * 0.75 + i.demand * 0.25 - 18; }
        },
        {
            id: "capital-light",
            icon: "fa-feather",
            title: "Keep the first version capital-light",
            text: "Growth potential is high ({growth}/100) — protect runway. Run manual-in-the-loop for the first 20 customers before spending on engineering.",
            action: { label: "Score viability", href: "viabilityscore.html" },
            fit: function (i) { return (i.growth >= 85 ? 46 : 26) + (i.feasibility < 70 ? 20 : 0); }
        },
        {
            id: "lead-with-mechanism",
            icon: "fa-lightbulb",
            title: "Lead the pitch with the mechanism",
            text: "Innovation is the standout ({innovation}/100). Make “how it works” the headline — that is the part buyers and investors remember.",
            action: { label: "Market intelligence", href: "marketintelligence.html" },
            fit: function (i) { return i.innovation - 38; }
        },
        {
            id: "pricing-experiment",
            icon: "fa-tags",
            title: "Trial outcome-based pricing early",
            text: "For {audience}, willingness to pay is the real unknown. Test usage- or outcome-based pricing with three design partners before locking a model.",
            action: { label: "Build strategy", href: "strategicintelligence.html" },
            fit: function (i) { return 44 + (i.demand >= 82 ? 16 : 0) + (i.score >= 85 ? 8 : 0); }
        },
        {
            id: "one-channel",
            icon: "fa-bullhorn",
            title: "Pick one distribution channel and go deep",
            text: "Ideas in {domain} usually stall on distribution, not product. Commit to a single channel to reach {audience} and master it before adding a second.",
            action: { label: "Market intelligence", href: "marketintelligence.html" },
            fit: function (i) { return 40 + (i.lowRivalry < 55 ? 18 : 0) + (i.demand >= 84 ? 8 : 0); }
        }
    ];

    /* One tailored play per domain — usually surfaces in the top 3. */
    const DOMAIN_RECO = {
        "AI & Machine Learning": { icon: "fa-database", title: "Compete on proprietary context, not the model", text: "Anyone can call a foundation model. Line up a data or workflow advantage for {audience} that a rival cannot copy in a weekend.", action: { label: "Study competitors", href: "competitoranalysis.html" } },
        "FinTech": { icon: "fa-shield-halved", title: "Design for trust and compliance from day one", text: "In FinTech a clean regulatory and security story is the wedge. Bake it into the first build for {audience}, not a later phase.", action: { label: "Build strategy", href: "strategicintelligence.html" } },
        "HealthTech": { icon: "fa-user-doctor", title: "Earn clinical credibility before scale", text: "Recruit a clinical advisor and one pilot site. Adoption by {audience} follows proof, not features.", action: { label: "Open AI Validation", href: "aivalidation.html" } },
        "AgriTech": { icon: "fa-signal", title: "Build for low-connectivity, local reality", text: "Make it offline-tolerant and local-language, and tie every feature to a concrete yield or cost outcome for {audience}.", action: { label: "Market intelligence", href: "marketintelligence.html" } },
        "EdTech": { icon: "fa-graduation-cap", title: "Sell the outcome, not the content", text: "Grades, placements and confidence move {audience} to pay — hours of content do not. Instrument the outcome from the start.", action: { label: "Score viability", href: "viabilityscore.html" } },
        "Robotics": { icon: "fa-warehouse", title: "Own one bounded environment first", text: "A robot that works 99% of the time in a single setting beats a general one that mostly works. Pick that setting for {audience} and nail reliability.", action: { label: "Plan the roadmap", href: "executionroadmap.html" } },
        "GreenTech": { icon: "fa-file-invoice-dollar", title: "Tie every feature to money or compliance", text: "For {audience}, connect the product to a cost saved or a reporting box ticked — not to abstract impact.", action: { label: "Build strategy", href: "strategicintelligence.html" } },
        "E-Commerce": { icon: "fa-store", title: "Own one merchant type and their conversion gap", text: "Go vertical: solve one specific conversion or retention problem for {audience} rather than being a horizontal tool.", action: { label: "Market intelligence", href: "marketintelligence.html" } }
    };


    /* =====================================================
       SMALL HELPERS
    ===================================================== */

    function avg(list, key) {
        if (!list.length) return 0;
        return Math.round(list.reduce((s, x) => s + (Number(x[key]) || 0), 0) / list.length);
    }

    function clamp(n) { return Math.max(0, Math.min(100, Number(n) || 0)); }

    function escapeHTML(value) {
        const d = document.createElement("div");
        d.textContent = value == null ? "" : String(value);
        return d.innerHTML;
    }

    function competitionLabel(lowRivalry) {
        if (lowRivalry >= 65) return "Low";
        if (lowRivalry >= 45) return "Moderate";
        return "High";
    }

    function countUp(el, target, dur) {
        if (!el) return;
        if (prefersReduced) { el.textContent = String(Math.round(target)); return; }
        const start = performance.now();
        (function step(now) {
            const p = Math.min((now - start) / (dur || 900), 1);
            el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(step);
        })(performance.now());
    }

    function setRing(el, score) {
        if (!el) return;
        const c = 314;
        const offset = c - (clamp(score) / 100) * c;
        if (prefersReduced) { el.style.strokeDashoffset = String(offset); return; }
        el.style.strokeDashoffset = String(c);
        requestAnimationFrame(() => requestAnimationFrame(() => {
            el.style.strokeDashoffset = String(offset);
        }));
    }

    function renderRadar(shape, axesArr) {
        if (!shape) return;
        try {
            const center = (shape.getAttribute("data-center") || "120,110").split(",").map(Number);
            const outer = (shape.getAttribute("data-outer") || "").trim().split(/\s+/)
                .map((pair) => pair.split(",").map(Number));
            if (outer.length < 3 || axesArr.length !== outer.length) return;
            const cx = center[0], cy = center[1];
            const pts = outer.map((o, i) => {
                const v = Math.max(6, clamp(axesArr[i])) / 100;
                return (cx + (o[0] - cx) * v).toFixed(1) + "," + (cy + (o[1] - cy) * v).toFixed(1);
            });
            shape.setAttribute("data-axes", axesArr.join(","));
            shape.setAttribute("points", pts.join(" "));
        } catch (e) { /* noop */ }
    }

    function paintBars(root) {
        const bars = (root || document).querySelectorAll("[data-w]");
        const apply = () => bars.forEach((b) => { b.style.width = clamp(b.getAttribute("data-w")) + "%"; });
        if (prefersReduced) { apply(); return; }
        requestAnimationFrame(() => requestAnimationFrame(apply));
    }


    /* =====================================================
       RENDER — IDEA CARDS
    ===================================================== */

    function badgesFor(idea) {
        const out = [];
        if (idea.score >= 85) out.push('<span class="opp-badge badge-opp">HIGH OPPORTUNITY</span>');
        if (idea.lowRivalry >= 62) out.push('<span class="opp-badge badge-comp">LOW COMPETITION</span>');
        if (idea.demand >= 85) out.push('<span class="opp-badge badge-demand">HIGH DEMAND</span>');
        if (idea.growth >= 88) out.push('<span class="opp-badge badge-emerging">EMERGING MARKET</span>');
        return out.join("");
    }

    function fillTemplate(str, idea, domain) {
        return String(str)
            .replace(/\{demand\}/g, idea.demand)
            .replace(/\{feasibility\}/g, idea.feasibility)
            .replace(/\{innovation\}/g, idea.innovation)
            .replace(/\{growth\}/g, idea.growth)
            .replace(/\{lowRivalry\}/g, idea.lowRivalry)
            .replace(/\{score\}/g, idea.score)
            .replace(/\{audience\}/g, idea.audience)
            .replace(/\{domain\}/g, domain)
            .replace(/\{competitionWord\}/g, competitionLabel(idea.lowRivalry).toLowerCase());
    }

    function buildRecommendations(idea, domain) {
        const pool = RECO_LIBRARY.map(function (r) {
            return { ref: r, raw: r.fit(idea) };
        });
        const dr = DOMAIN_RECO[domain];
        if (dr) pool.push({ ref: dr, raw: 70 + (idea.score - 82) * 0.5 });

        pool.sort(function (a, b) { return b.raw - a.raw; });

        return pool.slice(0, 3).map(function (p, idx) {
            return {
                rank: idx + 1,
                icon: p.ref.icon,
                title: fillTemplate(p.ref.title, idea, domain),
                text: fillTemplate(p.ref.text, idea, domain),
                fit: Math.round(Math.max(56, Math.min(97, p.raw))),
                actionLabel: p.ref.action.label,
                actionHref: p.ref.action.href
            };
        });
    }

    function recoItemHTML(r) {
        return '' +
        '<li class="reco-item">' +
            '<span class="reco-rank">' + r.rank + '</span>' +
            '<div class="reco-body">' +
                '<div class="reco-head">' +
                    '<span class="reco-icon"><i class="fa-solid ' + escapeHTML(r.icon) + '" aria-hidden="true"></i></span>' +
                    '<strong>' + escapeHTML(r.title) + '</strong>' +
                    '<span class="reco-fit" title="Fit with this idea’s profile">' + r.fit + '% fit</span>' +
                '</div>' +
                '<p>' + escapeHTML(r.text) + '</p>' +
                '<a class="reco-action" href="' + escapeHTML(r.actionHref) + '">' + escapeHTML(r.actionLabel) + ' <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>' +
            '</div>' +
        '</li>';
    }

    function ideaCardHTML(idea, index) {
        const comp = competitionLabel(idea.lowRivalry);
        return '' +
        '<article class="idea-card">' +
            '<div class="idea-card-head">' +
                '<span class="idea-visual"><i class="fa-solid ' + escapeHTML(idea.icon) + '" aria-hidden="true"></i></span>' +
                '<div class="idea-badges">' + badgesFor(idea) + '</div>' +
            '</div>' +
            '<div class="idea-content">' +
                '<span class="tag">AI DISCOVERY ' + (index + 1) + '</span>' +
                '<h3>' + escapeHTML(idea.title) + '</h3>' +
                '<p>' + escapeHTML(idea.description) + '</p>' +
                '<div class="idea-facts">' +
                    '<div><span>Target audience</span><strong>' + escapeHTML(idea.audience) + '</strong></div>' +
                    '<div><span>Problem being solved</span><strong>' + escapeHTML(idea.problem) + '</strong></div>' +
                '</div>' +
                '<div class="idea-metrics">' +
                    metricHTML("Opp. score", idea.score, idea.score) +
                    metricHTML("Demand", idea.demand, idea.demand) +
                    metricHTML("Competition", comp, idea.lowRivalry) +
                    metricHTML("Feasibility", idea.feasibility, idea.feasibility) +
                    metricHTML("Innovation", idea.innovation, idea.innovation) +
                    metricHTML("Growth", idea.growth, idea.growth) +
                '</div>' +
                '<div class="idea-actions">' +
                    '<button type="button" class="idea-action idea-action-analyze" aria-expanded="false" aria-controls="idea-recos-' + index + '">' +
                        '<i class="fa-solid fa-wand-sparkles" aria-hidden="true"></i> ' +
                        '<span class="idea-analyze-label">Analyze — top 3 moves</span>' +
                        '<i class="fa-solid fa-chevron-down reco-caret" aria-hidden="true"></i>' +
                    '</button>' +
                    '<a class="idea-action" href="aivalidation.html"><i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i> Validate</a>' +
                    '<a class="idea-action" href="marketintelligence.html"><i class="fa-solid fa-chart-line" aria-hidden="true"></i> Market</a>' +
                    '<a class="idea-action" href="competitoranalysis.html"><i class="fa-solid fa-users-viewfinder" aria-hidden="true"></i> Competitors</a>' +
                    '<a class="idea-action" href="strategicintelligence.html"><i class="fa-solid fa-chess" aria-hidden="true"></i> Strategy</a>' +
                '</div>' +
                '<div class="idea-recos" id="idea-recos-' + index + '" hidden>' +
                    '<div class="idea-recos-head">' +
                        '<span class="result-eyebrow">TOP 3 RECOMMENDED MOVES</span>' +
                        '<span class="result-note">AI-shaped &middot; illustrative</span>' +
                    '</div>' +
                    '<ol class="reco-list">' +
                        buildRecommendations(idea, selections.domain).map(recoItemHTML).join("") +
                    '</ol>' +
                '</div>' +
            '</div>' +
        '</article>';
    }

    function metricHTML(label, displayValue, barValue) {
        return '' +
        '<div class="idea-metric">' +
            '<span>' + escapeHTML(label) + '</span>' +
            '<strong>' + escapeHTML(displayValue) + '</strong>' +
            '<div class="idea-metric-bar"><span data-w="' + clamp(barValue) + '"></span></div>' +
        '</div>';
    }


    /* =====================================================
       RENDER — SCORE / RADAR / BREAKDOWN
    ===================================================== */

    function renderScoreAndRadar(ideas) {
        const dims = {
            demand: avg(ideas, "demand"),
            innovation: avg(ideas, "innovation"),
            growth: avg(ideas, "growth"),
            lowRivalry: avg(ideas, "lowRivalry"),
            feasibility: avg(ideas, "feasibility")
        };
        const overall = avg(ideas, "score");

        countUp(oppScoreValue, overall, 1000);
        setRing(oppRingProgress, overall);

        if (oppScoreCaption) {
            oppScoreCaption.textContent =
                "Aggregate potential across " + ideas.length +
                " illustrative " + (ideas.length === 1 ? "opportunity" : "opportunities") +
                " in " + selections.domain + ".";
        }

        const rows = [
            ["Market demand", dims.demand, "How strongly the underlying need is trending."],
            ["Competition", dims.lowRivalry, "Higher means the space is less crowded today."],
            ["Innovation", dims.innovation, "How novel the approach is versus current solutions."],
            ["Feasibility", dims.feasibility, "How buildable this is for a small early team."],
            ["Growth potential", dims.growth, "Room for the market to expand over the next few years."]
        ];

        if (oppBreakdown) {
            oppBreakdown.innerHTML = rows.map((r) => '' +
                '<div class="opp-breakdown-row">' +
                    '<span class="obr-label">' + escapeHTML(r[0]) + '</span>' +
                    '<span class="obr-score">' + clamp(r[1]) + '</span>' +
                    '<div class="obr-bar"><span data-w="' + clamp(r[1]) + '"></span></div>' +
                    '<span class="obr-note">' + escapeHTML(r[2]) + '</span>' +
                '</div>'
            ).join("");
        }

        // Radar vertex order: top, upper-right, lower-right, lower-left, upper-left
        // = Market demand, Innovation, Growth, Competition (lowRivalry), Feasibility
        renderRadar(oppRadarShape, [
            dims.demand, dims.innovation, dims.growth, dims.lowRivalry, dims.feasibility
        ]);
    }

    function animateRadarIn() {
        if (!oppRadarShape) return;
        if (prefersReduced) { oppRadarShape.classList.add("viq-in"); return; }
        oppRadarShape.classList.remove("viq-in");
        requestAnimationFrame(() => requestAnimationFrame(() => {
            oppRadarShape.classList.add("viq-in");
        }));
    }


    /* =====================================================
       RENDER — COMPARISON
    ===================================================== */

    function renderComparison(ideas) {
        if (!comparisonChart) return;
        comparisonChart.innerHTML = ideas.map((idea) => '' +
            '<div class="cmp-row">' +
                '<div class="cmp-row-name">' + escapeHTML(idea.title) + '</div>' +
                '<div class="cmp-bars">' +
                    cmpBar("score", idea.score) +
                    cmpBar("demand", idea.demand) +
                    cmpBar("competition", idea.lowRivalry) +
                    cmpBar("feasibility", idea.feasibility) +
                '</div>' +
            '</div>'
        ).join("");
    }

    function cmpBar(key, value) {
        return '<div class="cmp-bar" data-k="' + key + '">' +
            '<span data-w="' + clamp(value) + '"></span>' +
            '<b>' + clamp(value) + '</b>' +
        '</div>';
    }


    /* =====================================================
       RENDER — MARKET GAP / PERSPECTIVE / SIGNALS
    ===================================================== */

    function renderGap(domain) {
        if (gapNeed) gapNeed.textContent =
            "In " + domain + ", people already lose time or money working around a recurring problem.";
        if (gapExisting) gapExisting.textContent =
            "Incumbents solve part of it — slowly, at enterprise prices, or aimed at a different customer.";
        if (gapUnmet) gapUnmet.textContent =
            "A fast, affordable, focused solution built for the customer everyone else overlooks.";
        if (gapOpportunity) gapOpportunity.textContent =
            "Enter narrow in " + domain + ", win a beachhead segment, then expand outward.";
    }

    function renderPerspective(domain) {
        const p = PERSPECTIVES[domain] || GENERIC_PERSPECTIVE;
        if (perspWhyNow) perspWhyNow.textContent = p.whyNow;
        if (perspWhoNeeds) perspWhoNeeds.textContent = p.whoNeeds;
        if (perspDifferent) perspDifferent.textContent = p.different;
    }

    /* ---- Learn the space: domain-scoped YouTube resources ----
       Uses YouTube search URLs (never dead) rather than fixed
       video ids. Each domain gets three learning angles. */

    function learnResources(domain) {
        const d = domain || "startup";
        return [
            {
                icon: "fa-rocket",
                title: "How founders start in " + d,
                sub: "Suggested YouTube search",
                q: "how to start a " + d + " startup"
            },
            {
                icon: "fa-chart-simple",
                title: d + " market, trends & opportunities",
                sub: "Suggested YouTube search",
                q: d + " startup market analysis trends"
            },
            {
                icon: "fa-screwdriver-wrench",
                title: d + " product build walkthroughs",
                sub: "Suggested YouTube search",
                q: d + " MVP build tutorial case study"
            }
        ];
    }

    function learnCardHTML(r) {
        const url = "https://www.youtube.com/results?search_query=" + encodeURIComponent(r.q);
        return '' +
        '<a class="learn-card" href="' + escapeHTML(url) + '" target="_blank" rel="noopener noreferrer">' +
            '<span class="learn-thumb" aria-hidden="true">' +
                '<i class="fa-brands fa-youtube"></i>' +
            '</span>' +
            '<span class="learn-body">' +
                '<strong>' + escapeHTML(r.title) + '</strong>' +
                '<small>' + escapeHTML(r.sub) + '</small>' +
            '</span>' +
            '<i class="fa-solid fa-arrow-up-right-from-square learn-ext" aria-hidden="true"></i>' +
        '</a>';
    }

    function renderLearn(domain) {
        if (learnDomainName) learnDomainName.textContent = domain;
        if (!learnGrid) return;
        learnGrid.innerHTML = learnResources(domain).map(learnCardHTML).join("");
    }

    function renderSignals() {
        if (!signalGrid) return;
        const strengthOn = { high: 4, medium: 3, emerging: 2 };
        const strengthText = { high: "Strong", medium: "Building", emerging: "Emerging" };
        signalGrid.innerHTML = SIGNALS.map((s) => {
            const on = strengthOn[s.strength] || 2;
            let bars = "";
            for (let i = 0; i < 4; i++) bars += '<i' + (i < on ? ' class="on"' : "") + "></i>";
            return '' +
            '<article class="signal-card" data-strength="' + s.strength + '">' +
                '<div class="signal-card-icon"><i class="fa-solid ' + s.icon + '" aria-hidden="true"></i></div>' +
                '<h4>' + escapeHTML(s.title) + '</h4>' +
                '<p>' + escapeHTML(s.text) + '</p>' +
                '<div class="signal-strength">' +
                    '<span class="signal-strength-bars" aria-hidden="true">' + bars + '</span>' +
                    '<span class="signal-strength-label">' + strengthText[s.strength] + '</span>' +
                '</div>' +
            '</article>';
        }).join("");
    }


    /* =====================================================
       STATE TRANSITIONS
    ===================================================== */

    function showEmpty() {
        if (emptyState) { emptyState.classList.add("active"); emptyState.setAttribute("aria-hidden", "false"); }
        if (loadingSection) loadingSection.classList.remove("active");
        if (resultsSection) resultsSection.classList.remove("active");
    }

    function showLoading() {
        if (emptyState) { emptyState.classList.remove("active"); emptyState.setAttribute("aria-hidden", "true"); }
        if (resultsSection) resultsSection.classList.remove("active");
        if (loadingSection) loadingSection.classList.add("active");
    }

    function setResultBlocksVisible(visible) {
        resultsSection.querySelectorAll(".result-block").forEach((b) => {
            b.style.display = visible ? "" : "none";
        });
    }

    function showResults() {
        if (loadingSection) loadingSection.classList.remove("active");
        if (errorState) errorState.hidden = true;
        setResultBlocksVisible(true);
        if (resultsSection) resultsSection.classList.add("active");
    }

    function showError() {
        if (loadingSection) loadingSection.classList.remove("active");
        if (emptyState) emptyState.classList.remove("active");
        setResultBlocksVisible(false);
        if (errorState) errorState.hidden = false;
        if (resultsSection) resultsSection.classList.add("active");
        scrollToEl(resultsSection);
    }

    function scrollToEl(el) {
        if (!el) return;
        try {
            el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
        } catch (e) {
            window.scrollTo(0, el.offsetTop - 90);
        }
    }


    /* =====================================================
       LOADING ANIMATION (message cycle — not a fake progress)
    ===================================================== */

    let loadingTimer = null;
    let loadingIndex = 0;

    function startLoadingCycle() {
        loadingIndex = 0;
        updateLoadingStep(0);
        if (prefersReduced) return;
        loadingTimer = window.setInterval(() => {
            loadingIndex = (loadingIndex + 1) % LOADING_MESSAGES.length;
            updateLoadingStep(loadingIndex);
        }, 650);
    }

    function stopLoadingCycle() {
        if (loadingTimer) { window.clearInterval(loadingTimer); loadingTimer = null; }
    }

    function updateLoadingStep(i) {
        if (loadingStatus) loadingStatus.textContent = LOADING_MESSAGES[i];
        if (!loadingSteps) return;
        loadingSteps.querySelectorAll("li").forEach((li) => {
            const step = Number(li.dataset.step);
            li.classList.toggle("is-active", step === i);
            li.classList.toggle("is-done", step < i);
        });
    }


    /* =====================================================
       DISCOVER FLOW
    ===================================================== */

    let discoverTimeout = null;

    function beginDiscovery() {
        if (!selections.domain) {
            if (discoverHint) discoverHint.hidden = false;
            if (domainGrid) {
                domainGrid.classList.remove("needs-domain");
                // force reflow so the animation replays
                void domainGrid.offsetWidth;
                domainGrid.classList.add("needs-domain");
            }
            scrollToEl(domainGrid);
            return;
        }

        if (discoverButton) {
            discoverButton.disabled = true;
            discoverButton.classList.add("is-loading");
        }

        showLoading();
        startLoadingCycle();
        scrollToEl(loadingSection);

        // Async stand-in for a future AI request.
        if (discoverTimeout) window.clearTimeout(discoverTimeout);
        discoverTimeout = window.setTimeout(finishDiscovery, prefersReduced ? 400 : 2200);
    }

    function finishDiscovery() {
        stopLoadingCycle();

        try {
            const ideas = IDEA_DATA[selections.domain] || IDEA_DATA["AI & Machine Learning"];
            if (!Array.isArray(ideas) || ideas.length === 0) {
                throw new Error("No opportunity data for the selected domain.");
            }

            if (resultDomainName) resultDomainName.textContent = selections.domain;

            if (resultsDescription) {
                const prefBits = [];
                if (selections.investment) prefBits.push(selections.investment.toLowerCase() + " investment");
                if (selections.customer) prefBits.push(selections.customer.toLowerCase());
                if (selections.experience) prefBits.push(selections.experience.toLowerCase() + " founder");
                resultsDescription.textContent = prefBits.length
                    ? "VentureIQ shaped these " + selections.domain + " opportunities around " + prefBits.join(", ") + "."
                    : "VentureIQ found these opportunities in " + selections.domain + ".";
            }

            ideaResults.innerHTML = ideas.map(ideaCardHTML).join("");
            renderScoreAndRadar(ideas);
            renderComparison(ideas);
            renderGap(selections.domain);
            renderPerspective(selections.domain);
            renderSignals();
            renderLearn(selections.domain);

            showResults();
            paintBars(resultsSection);
            animateRadarIn();
            revealResults();
            scrollToEl(resultsSection);
        } catch (err) {
            if (window.console) console.error("Idea Discovery render failed:", err);
            showError();
        } finally {
            if (discoverButton) {
                discoverButton.disabled = false;
                discoverButton.classList.remove("is-loading");
            }
        }
    }

    if (discoverButton) discoverButton.addEventListener("click", beginDiscovery);
    if (retryButton) retryButton.addEventListener("click", beginDiscovery);


    /* ---- Per-idea "Analyze" -> Top 3 recommendations panel ----
       Delegated so it survives every re-render of #ideaResults. */

    function openRecos(btn, panel) {
        btn.setAttribute("aria-expanded", "true");
        btn.classList.add("is-open");
        const label = btn.querySelector(".idea-analyze-label");
        if (label) label.textContent = "Hide recommendations";
        panel.hidden = false;
        if (prefersReduced) { panel.classList.add("is-open"); return; }
        requestAnimationFrame(() => requestAnimationFrame(() => panel.classList.add("is-open")));
    }

    function closeRecos(btn, panel) {
        btn.setAttribute("aria-expanded", "false");
        btn.classList.remove("is-open");
        const label = btn.querySelector(".idea-analyze-label");
        if (label) label.textContent = "Analyze — top 3 moves";
        panel.classList.remove("is-open");
        if (prefersReduced) { panel.hidden = true; return; }
        let done = false;
        const finish = () => {
            if (done) return;
            done = true;
            panel.hidden = true;
            panel.removeEventListener("transitionend", finish);
        };
        panel.addEventListener("transitionend", finish);
        window.setTimeout(finish, 480);
    }

    if (ideaResults) {
        ideaResults.addEventListener("click", (e) => {
            const btn = e.target.closest ? e.target.closest(".idea-action-analyze") : null;
            if (!btn || !ideaResults.contains(btn)) return;
            const panel = document.getElementById(btn.getAttribute("aria-controls") || "");
            if (!panel) return;
            if (btn.getAttribute("aria-expanded") === "true") {
                closeRecos(btn, panel);
            } else {
                openRecos(btn, panel);
            }
        });
    }


    /* =====================================================
       RESET
    ===================================================== */

    if (resetButton) {
        resetButton.addEventListener("click", () => {
            domainCards.forEach((c) => { c.classList.remove("selected"); c.setAttribute("aria-pressed", "false"); });
            optionButtons.forEach((b) => { b.classList.remove("selected"); b.setAttribute("aria-pressed", "false"); });

            selections.domain = "";
            selections.investment = "";
            selections.customer = "";
            selections.experience = "";

            if (selectedDomain) selectedDomain.textContent = "Choose a domain";
            if (selectedInvestment) selectedInvestment.textContent = "Not selected";
            if (selectedCustomer) selectedCustomer.textContent = "Not selected";
            if (selectedExperience) selectedExperience.textContent = "Not selected";

            if (ideaResults) ideaResults.innerHTML = "";
            if (errorState) errorState.hidden = true;
            if (discoverHint) discoverHint.hidden = true;
            if (oppRadarShape) oppRadarShape.classList.remove("viq-in");

            showEmpty();
            window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
        });
    }


    /* =====================================================
       ENTRANCE ANIMATIONS
    ===================================================== */

    const REVEAL_INPUT = ".discovery-hero, .domain-card, .preferences-card, .empty-state";
    const REVEAL_RESULT = ".results-heading, .result-block, .idea-card, .signal-card, .perspective-card, .cmp-row, .gap-stage";

    function initReveal(selector, root) {
        const nodes = Array.prototype.slice.call((root || document).querySelectorAll(selector));
        if (!nodes.length) return;

        if (prefersReduced || !("IntersectionObserver" in window)) return;

        document.body.classList.add("viq-anim-ready");
        nodes.forEach((el, i) => {
            el.classList.add("viq-reveal");
            el.style.transitionDelay = Math.min(i * 40, 300) + "ms";
        });

        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("viq-in");
                io.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

        nodes.forEach((el) => io.observe(el));
    }

    function revealResults() {
        try { initReveal(REVEAL_RESULT, resultsSection); } catch (e) { /* noop */ }
    }


    /* =====================================================
       INIT
    ===================================================== */

    try { initReveal(REVEAL_INPUT); } catch (e) { document.body.classList.remove("viq-anim-ready"); }
    showEmpty();

    console.log("VentureIQ Idea Discovery initialized successfully.");

});
