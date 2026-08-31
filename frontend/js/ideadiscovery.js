/* =========================================================
   VENTUREIQ — AI STARTUP IDEA DISCOVERY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const domainCards =
        document.querySelectorAll(".domain-card");

    const optionButtons =
        document.querySelectorAll(".option-button");

    const discoverButton =
        document.getElementById("discoverButton");

    const loadingSection =
        document.getElementById("loadingSection");

    const resultsSection =
        document.getElementById("resultsSection");

    const ideaResults =
        document.getElementById("ideaResults");

    const resetButton =
        document.getElementById("resetButton");

    const selectedDomain =
        document.getElementById("selectedDomain");

    const selectedInvestment =
        document.getElementById("selectedInvestment");

    const selectedCustomer =
        document.getElementById("selectedCustomer");

    const selectedExperience =
        document.getElementById("selectedExperience");

    const resultsDescription =
        document.getElementById("resultsDescription");


    /* =====================================================
       THEME
    ===================================================== */

    const themeToggle =
        document.getElementById("themeToggle");


    const savedTheme =
        localStorage.getItem(
            "ventureiq-theme"
        );


    /* =====================================================
       LOAD SAVED THEME
    ===================================================== */

    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark-theme"
        );

    }


    /* =====================================================
       UPDATE THEME ICON
    ===================================================== */

    function updateThemeIcon() {

        if (!themeToggle) {
            return;
        }


        const icon =
            themeToggle.querySelector("i");


        if (!icon) {
            return;
        }


        if (
            document.body.classList.contains(
                "dark-theme"
            )
        ) {

            icon.classList.remove(
                "fa-moon"
            );

            icon.classList.add(
                "fa-sun"
            );

            themeToggle.setAttribute(
                "aria-label",
                "Switch to light theme"
            );

            themeToggle.setAttribute(
                "title",
                "Switch to light theme"
            );

        } else {

            icon.classList.remove(
                "fa-sun"
            );

            icon.classList.add(
                "fa-moon"
            );

            themeToggle.setAttribute(
                "aria-label",
                "Switch to dark theme"
            );

            themeToggle.setAttribute(
                "title",
                "Switch to dark theme"
            );

        }

    }


    updateThemeIcon();


    /* =====================================================
       THEME TOGGLE
    ===================================================== */

    if (themeToggle) {

        themeToggle.addEventListener(
            "click",
            () => {

                document.body.classList.toggle(
                    "dark-theme"
                );


                const isDark =
                    document.body.classList.contains(
                        "dark-theme"
                    );


                localStorage.setItem(
                    "ventureiq-theme",
                    isDark
                        ? "dark"
                        : "light"
                );


                updateThemeIcon();

            }
        );

    }


    /* =====================================================
       USER SELECTIONS
    ===================================================== */

    const selections = {

        domain: "",

        investment: "",

        customer: "",

        experience: ""

    };


    /* =====================================================
       DOMAIN SELECTION
    ===================================================== */

    domainCards.forEach(card => {

        card.addEventListener(
            "click",
            () => {


                domainCards.forEach(item => {

                    item.classList.remove(
                        "selected"
                    );

                });


                card.classList.add(
                    "selected"
                );


                selections.domain =
                    card.dataset.domain;


                selectedDomain.textContent =
                    selections.domain;

            }
        );

    });


    /* =====================================================
       PREFERENCE SELECTION
    ===================================================== */

    optionButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const group =
                    button.dataset.group;


                const value =
                    button.dataset.value;


                document
                    .querySelectorAll(
                        `.option-button[data-group="${group}"]`
                    )
                    .forEach(item => {

                        item.classList.remove(
                            "selected"
                        );

                    });


                button.classList.add(
                    "selected"
                );


                selections[group] =
                    value;


                if (
                    group === "investment"
                ) {

                    selectedInvestment.textContent =
                        value;

                }


                if (
                    group === "customer"
                ) {

                    selectedCustomer.textContent =
                        value;

                }


                if (
                    group === "experience"
                ) {

                    selectedExperience.textContent =
                        value;

                }

            }
        );

    });


    /* =====================================================
       MOCK AI DATA

       IMPORTANT:
       This will later be replaced with
       your friend's backend / Gemini API.
    ===================================================== */

    const mockIdeas = {


        "AI & Machine Learning": [

            {
                title:
                    "AI Personal Finance Copilot",

                description:
                    "An intelligent financial assistant that helps users understand spending, savings and financial decisions.",

                icon:
                    "fa-chart-pie",

                market:
                    "High",

                innovation:
                    "92",

                investment:
                    "Medium"
            },


            {
                title:
                    "AI Skill Gap Navigator",

                description:
                    "A personalized AI platform that identifies career skill gaps and creates adaptive learning paths.",

                icon:
                    "fa-route",

                market:
                    "High",

                innovation:
                    "89",

                investment:
                    "Low"
            },


            {
                title:
                    "AI Business Opportunity Scanner",

                description:
                    "An AI system that identifies emerging business opportunities from market and consumer trends.",

                icon:
                    "fa-magnifying-glass-chart",

                market:
                    "Very High",

                innovation:
                    "94",

                investment:
                    "Medium"
            }

        ],


        "FinTech": [

            {
                title:
                    "Smart Micro-Investment Assistant",

                description:
                    "A beginner-friendly platform that helps users understand and plan small-scale investments.",

                icon:
                    "fa-coins",

                market:
                    "High",

                innovation:
                    "86",

                investment:
                    "Medium"
            },


            {
                title:
                    "AI Expense Intelligence",

                description:
                    "An AI-powered system that turns personal spending patterns into actionable financial insights.",

                icon:
                    "fa-wallet",

                market:
                    "High",

                innovation:
                    "88",

                investment:
                    "Low"
            }

        ],


        "HealthTech": [

            {
                title:
                    "AI Preventive Health Companion",

                description:
                    "A digital assistant that helps users understand lifestyle patterns and preventive wellness actions.",

                icon:
                    "fa-heart-pulse",

                market:
                    "Very High",

                innovation:
                    "91",

                investment:
                    "Medium"
            },


            {
                title:
                    "Smart Elder Care Network",

                description:
                    "A connected platform supporting families and caregivers with intelligent elderly-care coordination.",

                icon:
                    "fa-person-cane",

                market:
                    "High",

                innovation:
                    "90",

                investment:
                    "Medium"
            }

        ],


        "AgriTech": [

            {
                title:
                    "AI Crop Doctor",

                description:
                    "A smart agricultural assistant that helps farmers identify crop diseases and receive actionable guidance.",

                icon:
                    "fa-seedling",

                market:
                    "Very High",

                innovation:
                    "94",

                investment:
                    "Medium"
            },


            {
                title:
                    "Smart Farm Decision Engine",

                description:
                    "An intelligent platform that combines crop, weather and market information to support farm decisions.",

                icon:
                    "fa-wheat-awn",

                market:
                    "High",

                innovation:
                    "91",

                investment:
                    "Medium"
            }

        ],


        "EdTech": [

            {
                title:
                    "AI Personalized Study Mentor",

                description:
                    "An AI mentor that adapts learning plans based on student progress, goals and weak areas.",

                icon:
                    "fa-graduation-cap",

                market:
                    "Very High",

                innovation:
                    "90",

                investment:
                    "Low"
            },


            {
                title:
                    "Skill-to-Career Navigator",

                description:
                    "A platform connecting student skills with suitable career paths and learning opportunities.",

                icon:
                    "fa-compass",

                market:
                    "High",

                innovation:
                    "87",

                investment:
                    "Low"
            }

        ],


        "Robotics": [

            {
                title:
                    "AI Elderly Care Robot",

                description:
                    "An intelligent assistive robot designed to support elderly users with daily activities and safety.",

                icon:
                    "fa-robot",

                market:
                    "High",

                innovation:
                    "96",

                investment:
                    "High"
            },


            {
                title:
                    "Autonomous Campus Assistant",

                description:
                    "A mobile robot designed to assist institutions with delivery, guidance and campus services.",

                icon:
                    "fa-location-dot",

                market:
                    "Medium",

                innovation:
                    "93",

                investment:
                    "High"
            }

        ],


        "GreenTech": [

            {
                title:
                    "AI Energy Optimization",

                description:
                    "An intelligent platform that helps businesses identify energy waste and optimize consumption.",

                icon:
                    "fa-bolt",

                market:
                    "Very High",

                innovation:
                    "89",

                investment:
                    "Medium"
            },


            {
                title:
                    "Smart Waste Intelligence",

                description:
                    "A technology platform that improves waste collection and recycling using predictive analytics.",

                icon:
                    "fa-recycle",

                market:
                    "High",

                innovation:
                    "91",

                investment:
                    "Medium"
            }

        ],


        "E-Commerce": [

            {
                title:
                    "AI Shopping Personalizer",

                description:
                    "An AI commerce assistant that creates personalized product discovery experiences.",

                icon:
                    "fa-cart-shopping",

                market:
                    "Very High",

                innovation:
                    "88",

                investment:
                    "Medium"
            },


            {
                title:
                    "Local Business Commerce Engine",

                description:
                    "A digital commerce platform helping small local businesses reach and understand customers.",

                icon:
                    "fa-store",

                market:
                    "High",

                innovation:
                    "86",

                investment:
                    "Low"
            }

        ]

    };


    /* =====================================================
       GENERATE IDEAS
    ===================================================== */

    if (discoverButton) {

        discoverButton.addEventListener(
            "click",
            () => {


                if (!selections.domain) {

                    alert(
                        "Please select a startup domain first."
                    );

                    return;

                }


                loadingSection.classList.add(
                    "active"
                );


                resultsSection.classList.remove(
                    "active"
                );


                window.scrollTo({

                    top:
                        loadingSection.offsetTop - 100,

                    behavior:
                        "smooth"

                });


                setTimeout(
                    () => {

                        generateResults();

                    },
                    1800
                );

            }
        );

    }


    /* =====================================================
       GENERATE RESULTS
    ===================================================== */

    function generateResults() {


        loadingSection.classList.remove(
            "active"
        );


        const ideas =
            mockIdeas[selections.domain] ||
            mockIdeas["AI & Machine Learning"];


        ideaResults.innerHTML = "";


        ideas.forEach(
            (idea, index) => {


                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "idea-card";


                card.innerHTML = `

                    <div class="idea-visual">

                        <i class="fa-solid ${idea.icon}"></i>

                    </div>


                    <div class="idea-content">

                        <span class="tag">
                            AI DISCOVERY ${index + 1}
                        </span>


                        <h3>
                            ${idea.title}
                        </h3>


                        <p>
                            ${idea.description}
                        </p>


                        <div class="idea-metrics">


                            <div class="idea-metric">

                                <span>
                                    MARKET
                                </span>

                                <strong>
                                    ${idea.market}
                                </strong>

                            </div>


                            <div class="idea-metric">

                                <span>
                                    INNOVATION
                                </span>

                                <strong>
                                    ${idea.innovation}
                                </strong>

                            </div>


                            <div class="idea-metric">

                                <span>
                                    INVESTMENT
                                </span>

                                <strong>
                                    ${idea.investment}
                                </strong>

                            </div>


                        </div>


                        <button
                            class="analyze-button"
                            data-idea="${idea.title}"
                        >

                            Analyze This Idea

                            <i class="fa-solid fa-arrow-right"></i>

                        </button>

                    </div>

                `;


                ideaResults.appendChild(
                    card
                );

            }
        );


        resultsDescription.textContent =
            `VentureIQ discovered opportunities in ${selections.domain} based on your selected preferences.`;


        resultsSection.classList.add(
            "active"
        );


        window.scrollTo({

            top:
                resultsSection.offsetTop - 90,

            behavior:
                "smooth"

        });


        attachAnalyzeButtons();

    }


    /* =====================================================
       ANALYZE IDEA
    ===================================================== */

    function attachAnalyzeButtons() {


        const buttons =
            document.querySelectorAll(
                ".analyze-button"
            );


        buttons.forEach(
            button => {


                button.addEventListener(
                    "click",
                    () => {


                        const idea =
                            button.dataset.idea;


                        alert(
                            `"${idea}" selected.\n\nNext step: connect this idea to VentureIQ's analysis engine.`
                        );

                    }
                );

            }
        );

    }


    /* =====================================================
       RESET
    ===================================================== */

    if (resetButton) {

        resetButton.addEventListener(
            "click",
            () => {


                resultsSection.classList.remove(
                    "active"
                );


                domainCards.forEach(
                    card => {

                        card.classList.remove(
                            "selected"
                        );

                    }
                );


                optionButtons.forEach(
                    button => {

                        button.classList.remove(
                            "selected"
                        );

                    }
                );


                selections.domain = "";

                selections.investment = "";

                selections.customer = "";

                selections.experience = "";


                selectedDomain.textContent =
                    "Choose a domain";

                selectedInvestment.textContent =
                    "Not selected";

                selectedCustomer.textContent =
                    "Not selected";

                selectedExperience.textContent =
                    "Not selected";


                window.scrollTo({

                    top: 0,

                    behavior: "smooth"

                });

            }
        );

    }


    /* =====================================================
       INITIALIZATION
    ===================================================== */

    console.log(
        "VentureIQ Idea Discovery initialized successfully."
    );

});