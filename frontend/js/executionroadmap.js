/* =========================================================
   VENTUREIQ — EXECUTION ROADMAP JAVASCRIPT
   Interactive roadmap, task progress, theme & sidebar
========================================================= */


/* =========================================================
   DOM ELEMENTS
========================================================= */

const roadmapApp = document.querySelector(".roadmap-app");

const sidebar = document.getElementById("sidebar");
const mobileMenu = document.getElementById("mobileMenu");
const sidebarOverlay = document.getElementById("sidebarOverlay");

const themeToggle = document.getElementById("themeToggle");

const stageTabs = document.querySelectorAll(".stage-tab");
const roadmapStages = document.querySelectorAll(".roadmap-stage");

const taskCheckboxes = document.querySelectorAll(
    ".task-checkbox"
);

const replanButton = document.getElementById("replanButton");
const nextStepButton = document.getElementById("nextStepButton");

const progressValue = document.getElementById("progressValue");
const progressBar = document.getElementById("progressBar");

const completedTasksValue =
    document.getElementById("completedTasks");

const totalTasksValue =
    document.getElementById("totalTasks");

const currentStageValue =
    document.getElementById("currentStage");

const aiRecommendation =
    document.getElementById("aiRecommendation");

const aiRecommendationText =
    document.getElementById("aiRecommendationText");


/* =========================================================
   CONFIGURATION
========================================================= */

const STORAGE_KEY =
    "ventureiq_execution_roadmap";

const THEME_KEY =
    "ventureiq_theme";

const DEFAULT_STAGE =
    1;


/* =========================================================
   ROADMAP DATA
========================================================= */

const roadmapData = {

    1: {
        name: "Validate",

        recommendation:
            "Validate the problem with real users before investing heavily in development.",

        nextStep:
            "Interview at least 5 potential users and document their most important pain points."
    },

    2: {
        name: "Prototype",

        recommendation:
            "Turn your validated concept into a focused prototype that demonstrates the core value proposition.",

        nextStep:
            "Build the smallest working prototype that solves the primary user problem."
    },

    3: {
        name: "Test",

        recommendation:
            "Put the prototype in front of real users and use their feedback to identify what needs improvement.",

        nextStep:
            "Run a structured user test and collect feedback on usability, usefulness and willingness to adopt."
    },

    4: {
        name: "Launch",

        recommendation:
            "Prepare the validated product for a controlled launch with clear positioning and measurable goals.",

        nextStep:
            "Define your launch audience, core message and first measurable acquisition goal."
    }

};


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeTheme();

        initializeRoadmap();

        initializeSidebar();

        initializeStageTabs();

        initializeTasks();

        initializeActions();

        updateRoadmapProgress();

    }
);


/* =========================================================
   INITIALIZE ROADMAP
========================================================= */

function initializeRoadmap() {

    const savedStage =
        Number(
            localStorage.getItem(
                "ventureiq_current_stage"
            )
        );

    const stage =
        savedStage >= 1 && savedStage <= 4
            ? savedStage
            : DEFAULT_STAGE;

    activateStage(stage);

}


/* =========================================================
   STAGE TABS
========================================================= */

function initializeStageTabs() {

    stageTabs.forEach((tab) => {

        tab.addEventListener(
            "click",
            () => {

                const stage =
                    Number(
                        tab.dataset.stage
                    );

                if (!stage) return;

                activateStage(stage);

            }
        );

    });

}


/* =========================================================
   ACTIVATE STAGE
========================================================= */

function activateStage(stageNumber) {

    stageTabs.forEach((tab) => {

        const tabStage =
            Number(tab.dataset.stage);

        tab.classList.toggle(
            "active",
            tabStage === stageNumber
        );

    });


    roadmapStages.forEach((stage) => {

        const stageNumberFromElement =
            Number(stage.dataset.stage);

        stage.classList.toggle(
            "active",
            stageNumberFromElement === stageNumber
        );

    });


    updateCurrentStage(stageNumber);

    updateAIRecommendation(stageNumber);

    localStorage.setItem(
        "ventureiq_current_stage",
        stageNumber
    );

}


/* =========================================================
   CURRENT STAGE
========================================================= */

function updateCurrentStage(stageNumber) {

    if (!currentStageValue) return;

    const stage =
        roadmapData[stageNumber];

    if (!stage) return;

    currentStageValue.textContent =
        `Stage ${stageNumber} — ${stage.name}`;

}


/* =========================================================
   AI RECOMMENDATION
========================================================= */

function updateAIRecommendation(stageNumber) {

    const stage =
        roadmapData[stageNumber];

    if (!stage) return;


    if (aiRecommendationText) {

        aiRecommendationText.textContent =
            stage.recommendation;

    }


    if (aiRecommendation) {

        aiRecommendation.dataset.stage =
            stageNumber;

    }

}


/* =========================================================
   TASK INITIALIZATION
========================================================= */

function initializeTasks() {

    restoreTaskState();


    taskCheckboxes.forEach((checkbox) => {

        checkbox.addEventListener(
            "change",
            () => {

                updateTaskAppearance(
                    checkbox
                );

                saveTaskState();

                updateRoadmapProgress();

            }
        );

        updateTaskAppearance(
            checkbox
        );

    });

}


/* =========================================================
   TASK APPEARANCE
========================================================= */

function updateTaskAppearance(
    checkbox
) {

    const task =
        checkbox.closest(".roadmap-task");

    if (!task) return;

    task.classList.toggle(
        "completed",
        checkbox.checked
    );


    const taskText =
        task.querySelector(
            ".task-content"
        );

    if (
        taskText &&
        checkbox.checked
    ) {

        taskText.classList.add(
            "task-completed"
        );

    } else if (taskText) {

        taskText.classList.remove(
            "task-completed"
        );

    }

}


/* =========================================================
   SAVE TASK STATE
========================================================= */

function saveTaskState() {

    const taskState = [];

    taskCheckboxes.forEach(
        (checkbox, index) => {

            taskState.push({
                index: index,
                completed: checkbox.checked
            });

        }
    );


    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(taskState)
    );

}


/* =========================================================
   RESTORE TASK STATE
========================================================= */

function restoreTaskState() {

    const saved =
        localStorage.getItem(
            STORAGE_KEY
        );

    if (!saved) return;


    try {

        const taskState =
            JSON.parse(saved);


        taskState.forEach(
            (item) => {

                const checkbox =
                    taskCheckboxes[item.index];

                if (!checkbox) return;

                checkbox.checked =
                    Boolean(item.completed);

            }
        );

    } catch (error) {

        console.warn(
            "VentureIQ: Unable to restore roadmap state.",
            error
        );

    }

}


/* =========================================================
   UPDATE ROADMAP PROGRESS
========================================================= */

function updateRoadmapProgress() {

    const total =
        taskCheckboxes.length;

    const completed =
        [...taskCheckboxes]
            .filter(
                checkbox =>
                    checkbox.checked
            )
            .length;


    const percentage =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );


    /* Total tasks */

    if (totalTasksValue) {

        totalTasksValue.textContent =
            total;

    }


    /* Completed tasks */

    if (completedTasksValue) {

        completedTasksValue.textContent =
            completed;

    }


    /* Percentage */

    if (progressValue) {

        progressValue.textContent =
            `${percentage}%`;

    }

    const overallProgress =
        document.getElementById("overallProgress");

    if (overallProgress) {
        overallProgress.textContent = `${percentage}%`;
    }

    const ringValue = document.getElementById("ringValue");
    const progressRing = document.querySelector(".progress-ring");

    if (ringValue) ringValue.textContent = `${percentage}%`;
    if (progressRing) {
        progressRing.style.setProperty(
            "--progress",
            `${percentage * 3.6}deg`
        );
    }

    const ringSummary =
        document.querySelector(".progress-ring-panel .progress-ring + .legend");

    if (ringSummary) {
        const summary = ringSummary.previousElementSibling?.querySelector("span");
        if (summary) summary.innerHTML = `${completed} of ${total}<br>milestones complete`;
    }


    /* Progress bar */

    if (progressBar) {

        progressBar.style.width =
            `${percentage}%`;

        progressBar.setAttribute(
            "aria-valuenow",
            percentage
        );

    }


    updateStageCompletion();


    updateOverallStatus(
        percentage
    );

}


/* =========================================================
   STAGE COMPLETION
========================================================= */

function updateStageCompletion() {

    roadmapStages.forEach(
        (stage) => {

            const stageTasks =
                stage.querySelectorAll(
                    ".task-checkbox"
                );

            if (
                stageTasks.length === 0
            ) return;


            const completed =
                [...stageTasks]
                    .filter(
                        checkbox =>
                            checkbox.checked
                    ).length;


            const stageComplete =
                completed ===
                stageTasks.length;


            stage.classList.toggle(
                "completed",
                stageComplete
            );


            const stageNumber =
                stage.dataset.stage;

            const tab =
                document.querySelector(
                    `.stage-tab[data-stage="${stageNumber}"]`
                );


            if (tab) {

                tab.classList.toggle(
                    "completed",
                    stageComplete
                );

            }

        }
    );

}


/* =========================================================
   OVERALL STATUS
========================================================= */

function updateOverallStatus(
    percentage
) {

    const statusElement =
        document.getElementById(
            "roadmapStatus"
        );

    if (!statusElement) return;


    if (percentage === 100) {

        statusElement.textContent =
            "ROADMAP COMPLETE";

        statusElement.className =
            "roadmap-status complete";

        return;

    }


    if (percentage >= 75) {

        statusElement.textContent =
            "NEAR COMPLETION";

        statusElement.className =
            "roadmap-status strong";

        return;

    }


    if (percentage >= 40) {

        statusElement.textContent =
            "IN PROGRESS";

        statusElement.className =
            "roadmap-status progress";

        return;

    }


    statusElement.textContent =
        "JUST STARTED";

    statusElement.className =
        "roadmap-status starting";

}


/* =========================================================
   ACTION BUTTONS
========================================================= */

function initializeActions() {

    /* Re-plan */

    if (replanButton) {

        replanButton.addEventListener(
            "click",
            () => {

                replanRoadmap();

            }
        );

    }


    /* Next Step */

    if (nextStepButton) {

        nextStepButton.addEventListener(
            "click",
            () => {

                goToNextStep();

            }
        );

    }

}


/* =========================================================
   RE-PLAN ROADMAP
========================================================= */

function replanRoadmap() {

    const confirmed =
        window.confirm(
            "Reset all roadmap task progress and start the execution plan again?"
        );

    if (!confirmed) return;


    taskCheckboxes.forEach(
        (checkbox) => {

            checkbox.checked = false;

            updateTaskAppearance(
                checkbox
            );

        }
    );


    localStorage.removeItem(
        STORAGE_KEY
    );


    activateStage(1);

    updateRoadmapProgress();


    showNotification(
        "Roadmap reset successfully."
    );

}


/* =========================================================
   NEXT STEP
========================================================= */

function goToNextStep() {

    const activeTab =
        document.querySelector(
            ".stage-tab.active"
        );

    let currentStage =
        activeTab
            ? Number(
                activeTab.dataset.stage
            )
            : 1;


    const stage =
        roadmapData[currentStage];

    if (!stage) return;


    if (currentStage < 4) {

        activateStage(
            currentStage + 1
        );

        showNotification(
            `Moved to Stage ${currentStage + 1}: ${roadmapData[currentStage + 1].name}`
        );

    } else {

        showNotification(
            stage.nextStep
        );

    }

}


/* =========================================================
   NOTIFICATION MESSAGE
========================================================= */

function showNotification(
    message
) {

    let notification =
        document.getElementById(
            "roadmapNotification"
        );


    if (!notification) {

        notification =
            document.createElement(
                "div"
            );

        notification.id =
            "roadmapNotification";

        notification.className =
            "roadmap-notification";

        document.body.appendChild(
            notification
        );

    }


    notification.textContent =
        message;

    notification.classList.add(
        "show"
    );


    clearTimeout(
        notification._timer
    );


    notification._timer =
        setTimeout(
            () => {

                notification.classList.remove(
                    "show"
                );

            },
            3500
        );

}


/* =========================================================
   MOBILE SIDEBAR
========================================================= */

function initializeSidebar() {

    if (mobileMenu) {

        mobileMenu.addEventListener(
            "click",
            openSidebar
        );

    }


    if (sidebarOverlay) {

        sidebarOverlay.addEventListener(
            "click",
            closeSidebar
        );

    }

}


function openSidebar() {

    if (sidebar) {

        sidebar.classList.add(
            "open"
        );

    }


    if (sidebarOverlay) {

        sidebarOverlay.classList.add(
            "active"
        );

    }


    document.body.classList.add(
        "sidebar-open"
    );

}


function closeSidebar() {

    if (sidebar) {

        sidebar.classList.remove(
            "open"
        );

    }


    if (sidebarOverlay) {

        sidebarOverlay.classList.remove(
            "active"
        );

    }


    document.body.classList.remove(
        "sidebar-open"
    );

}


/* =========================================================
   CLOSE MOBILE SIDEBAR AFTER NAVIGATION
========================================================= */

document
    .querySelectorAll(".sidebar .nav-item")
    .forEach(
        (item) => {

            item.addEventListener(
                "click",
                () => {

                    if (
                        window.innerWidth <= 900
                    ) {

                        closeSidebar();

                    }

                }
            );

        }
    );


/* =========================================================
   THEME
========================================================= */

function initializeTheme() {

    const savedTheme =
        localStorage.getItem(
            THEME_KEY
        );


    if (
        savedTheme === "light"
    ) {

        document.body.classList.add(
            "light-theme"
        );

        updateThemeIcon(
            true
        );

    } else {

        document.body.classList.remove(
            "light-theme"
        );

        updateThemeIcon(
            false
        );

    }


    if (themeToggle) {

        themeToggle.addEventListener(
            "click",
            toggleTheme
        );

    }

}


/* =========================================================
   TOGGLE THEME
========================================================= */

function toggleTheme() {

    const isLight =
        document.body.classList.toggle(
            "light-theme"
        );


    localStorage.setItem(
        THEME_KEY,
        isLight
            ? "light"
            : "dark"
    );


    updateThemeIcon(
        isLight
    );

}


/* =========================================================
   UPDATE THEME ICON
========================================================= */

function updateThemeIcon(
    isLight
) {

    if (!themeToggle) return;


    const icon =
        themeToggle.querySelector(
            "i"
        );

    if (!icon) return;


    icon.className =
        isLight
            ? "fa-solid fa-moon"
            : "fa-solid fa-sun";

}


/* =========================================================
   KEYBOARD ACCESSIBILITY
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        /* Escape closes mobile sidebar */

        if (
            event.key === "Escape"
        ) {

            closeSidebar();

        }

    }
);


/* =========================================================
   WINDOW RESIZE
========================================================= */

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


/* =========================================================
   DEBUG / DEVELOPMENT INFO
========================================================= */

console.log(
    "VentureIQ Execution Roadmap initialized."
);