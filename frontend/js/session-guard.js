import { supabase } from "../config/supabase.js";

const LOGIN_PATH = "login.html";
let activeUser = null;

function getDisplayName(user) {
    return user?.user_metadata?.full_name?.trim() ||
        user?.email?.trim() ||
        "Founder";
}

function getInitials(name) {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("") || "F";
}

function updateIdentity(user) {
    activeUser = user;
    const name = getDisplayName(user);
    const initials = getInitials(name);

    document.querySelectorAll(
        ".sidebar-user .user-details strong, .header-profile-info strong, .viability-user-menu .user-menu-header strong"
    ).forEach((element) => {
        element.textContent = name;
    });

    document.querySelectorAll(
        ".user-avatar, .header-avatar, .user-menu-avatar"
    ).forEach((element) => {
        element.textContent = initials;
    });
}

const identityObserver = new MutationObserver((mutations) => {
    const menuAdded = mutations.some((mutation) =>
        [...mutation.addedNodes].some((node) =>
            node.nodeType === Node.ELEMENT_NODE &&
            (node.matches(".viability-user-menu") ||
                node.querySelector(".viability-user-menu"))
        )
    );

    if (activeUser && menuAdded) updateIdentity(activeUser);
});

identityObserver.observe(document.body, {
    childList: true,
    subtree: true
});

async function signOutAndRedirect() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error("VentureIQ logout failed:", error);
        return;
    }

    window.location.replace(LOGIN_PATH);
}

async function protectPage() {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
        window.location.replace(LOGIN_PATH);
        return;
    }

    updateIdentity(data.session.user);

    supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_OUT" || !session) {
            window.location.replace(LOGIN_PATH);
            return;
        }

        updateIdentity(session.user);
    });
}

// Capture logout clicks, including menus created after page load.
document.addEventListener("click", (event) => {
    const logoutButton = event.target.closest(".logout-option");

    if (!logoutButton) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    signOutAndRedirect();
}, true);

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", protectPage, { once: true });
} else {
    protectPage();
}
