import { supabase } from "../config/supabase.js";

const desktopDashboardLink = document.getElementById("homeDashboardLink");
const mobileDashboardLink = document.getElementById("homeMobileDashboardLink");
const loginLink = document.querySelector('.nav-login[href="pages/login.html"]');
const mobileLoginLink = document.querySelector('.mobile-nav-cta[href="pages/login.html"]');
const userMenu = document.getElementById("homeUserMenu");
const userButton = document.getElementById("homeUserButton");
const userName = document.getElementById("homeUserName");
const userDropdown = document.getElementById("homeUserDropdown");
const logoutButton = document.getElementById("homeLogoutButton");
const mobileLogoutButton = document.getElementById("homeMobileLogoutButton");

function getDisplayName(user) {
    return user?.user_metadata?.full_name?.trim() ||
        user?.email?.trim() ||
        "Founder";
}

function closeUserDropdown() {
    if (!userDropdown || !userButton) return;

    userDropdown.hidden = true;
    userButton.setAttribute("aria-expanded", "false");
}

function openUserDropdown() {
    if (!userDropdown || !userButton) return;

    userDropdown.hidden = false;
    userButton.setAttribute("aria-expanded", "true");
}

function updateDashboardLinks(session) {
    const isAuthenticated = Boolean(session);

    if (desktopDashboardLink) {
        desktopDashboardLink.hidden = !isAuthenticated;
    }

    if (mobileDashboardLink) {
        mobileDashboardLink.hidden = !isAuthenticated;
    }

    if (loginLink) {
        loginLink.hidden = isAuthenticated;
    }

    if (mobileLoginLink) {
        mobileLoginLink.hidden = isAuthenticated;
    }

    if (userMenu) {
        userMenu.hidden = !isAuthenticated;
    }

    if (mobileLogoutButton) {
        mobileLogoutButton.hidden = !isAuthenticated;
    }

    if (userName && isAuthenticated) {
        userName.textContent = getDisplayName(session.user);
    }

    if (!isAuthenticated) {
        closeUserDropdown();
    }
}

userButton?.addEventListener("click", () => {
    if (userDropdown?.hidden) {
        openUserDropdown();
    } else {
        closeUserDropdown();
    }
});

document.addEventListener("click", (event) => {
    if (userMenu && !userMenu.contains(event.target)) {
        closeUserDropdown();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeUserDropdown();
});

async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error("VentureIQ logout failed:", error);
        return;
    }

    updateDashboardLinks(null);
    window.location.replace("pages/login.html");
}

logoutButton?.addEventListener("click", signOut);
mobileLogoutButton?.addEventListener("click", signOut);

async function initializeHomeSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
        updateDashboardLinks(null);
        return;
    }

    updateDashboardLinks(data.session);

    supabase.auth.onAuthStateChange((_event, session) => {
        updateDashboardLinks(session);
    });
}

initializeHomeSession();
