/**
 * QUICK HAND — Floating AI Chatbot Widget
 * ------------------------------------------------
 * Drop this script (+ its CSS) on any VentureIQ page.
 * It calls /api/quickhand/chat — no auth required.
 *
 * Usage:
 *   <link  rel="stylesheet" href="../css/quickhand.css">
 *   <script src="../js/quickhand.js" defer></script>
 *
 *   Optionally set a page context so AI gives contextual answers:
 *   <meta name="qh-context" content="Market Intelligence">
 */

(function () {
    "use strict";

    /* ── Config ──────────────────────────────────────────── */
    const ENDPOINT = `${window.location.origin}/api/quickhand/chat`;

    /* Detect page context from <meta name="qh-context"> or <title> */
    const pageContext =
        document.querySelector('meta[name="qh-context"]')?.content ||
        document.title.replace(/[—–|-].*$/, "").trim() ||
        "";

    /* Quick suggestion chips shown at start */
    const SUGGESTIONS = [
        "How do I validate my startup idea?",
        "What's a good go-to-market strategy?",
        "How to find my first customers?",
        "Explain product-market fit",
    ];

    /* ── State ───────────────────────────────────────────── */
    let isOpen = false;
    let isTyping = false;
    let suggestionsShown = true;

    /* ── Build HTML ──────────────────────────────────────── */
    function buildWidget() {
        /* --- Floating bubble --- */
        const bubble = document.createElement("button");
        bubble.id = "qh-bubble";
        bubble.setAttribute("aria-label", "Open Quick Hand AI Assistant");
        bubble.innerHTML = `
            <!-- Chat icon -->
            <svg class="icon-chat" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 2H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h3l3 3 3-3h7a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-7 12H7v-2h6v2zm3-4H7v-2h9v2zm0-4H7V4h9v2z"/>
            </svg>
            <!-- Close icon -->
            <svg class="icon-close" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
        `;

        /* --- Chat panel --- */
        const panel = document.createElement("div");
        panel.id = "qh-panel";
        panel.setAttribute("role", "dialog");
        panel.setAttribute("aria-label", "Quick Hand AI Assistant");
        panel.innerHTML = `
            <!-- Header -->
            <div id="qh-header">
                <div id="qh-avatar">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2a5 5 0 1 1 0 10A5 5 0 0 1 12 2zm0 12c5.33 0 8 2.67 8 4v2H4v-2c0-1.33 2.67-4 8-4z"/>
                    </svg>
                </div>
                <div id="qh-title-block">
                    <div id="qh-title">Quick Hand</div>
                    <div id="qh-subtitle">Your instant startup advisor</div>
                </div>
                <div id="qh-status-dot" title="Online"></div>
            </div>

            <!-- Messages -->
            <div id="qh-messages" role="log" aria-live="polite"></div>

            <!-- Suggestions -->
            <div id="qh-suggestions"></div>

            <!-- Input -->
            <div id="qh-input-area">
                <textarea
                    id="qh-input"
                    placeholder="Ask me anything about your startup…"
                    rows="1"
                    maxlength="600"
                    aria-label="Type your question"
                ></textarea>
                <button id="qh-send" aria-label="Send message">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                </button>
            </div>

            <!-- Footer -->
            <div id="qh-footer">Powered by VentureIQ &times; Gemini AI</div>
        `;

        document.body.appendChild(panel);
        document.body.appendChild(bubble);

        return { bubble, panel };
    }

    /* ── Render suggestion chips ─────────────────────────── */
    function renderSuggestions() {
        const container = document.getElementById("qh-suggestions");
        container.innerHTML = "";
        SUGGESTIONS.forEach((text) => {
            const btn = document.createElement("button");
            btn.className = "qh-suggestion";
            btn.textContent = text;
            btn.addEventListener("click", () => {
                hideSuggestions();
                sendMessage(text);
            });
            container.appendChild(btn);
        });
    }

    function hideSuggestions() {
        if (!suggestionsShown) return;
        suggestionsShown = false;
        const container = document.getElementById("qh-suggestions");
        container.style.display = "none";
    }

    /* ── Toggle panel open/close ─────────────────────────── */
    function togglePanel() {
        isOpen = !isOpen;
        const bubble = document.getElementById("qh-bubble");
        const panel  = document.getElementById("qh-panel");

        if (isOpen) {
            bubble.classList.add("is-open");
            panel.classList.add("is-open");
            document.getElementById("qh-input").focus();
        } else {
            bubble.classList.remove("is-open");
            panel.classList.remove("is-open");
        }
    }

    /* ── Append a message bubble ─────────────────────────── */
    function appendMessage(role, text, isTypingIndicator = false) {
        const messages = document.getElementById("qh-messages");

        const wrapper = document.createElement("div");
        wrapper.className = `qh-msg ${role}`;
        if (isTypingIndicator) wrapper.id = "qh-typing-indicator";

        const avatarDiv = document.createElement("div");
        avatarDiv.className = "qh-msg-avatar";
        avatarDiv.textContent = role === "assistant" ? "Q" : "U";

        const bubbleDiv = document.createElement("div");
        bubbleDiv.className = "qh-msg-bubble";

        if (isTypingIndicator) {
            bubbleDiv.innerHTML = `
                <div class="qh-typing-dots">
                    <span></span><span></span><span></span>
                </div>`;
        } else {
            bubbleDiv.textContent = text;
        }

        wrapper.appendChild(avatarDiv);
        wrapper.appendChild(bubbleDiv);
        messages.appendChild(wrapper);

        /* Scroll to bottom */
        messages.scrollTop = messages.scrollHeight;
        return wrapper;
    }

    /* ── Remove typing indicator ─────────────────────────── */
    function removeTypingIndicator() {
        const el = document.getElementById("qh-typing-indicator");
        if (el) el.remove();
    }

    /* ── Send message to backend ─────────────────────────── */
    async function sendMessage(text) {
        if (!text || isTyping) return;

        hideSuggestions();

        /* Show user bubble */
        appendMessage("user", text);

        /* Clear input */
        const input = document.getElementById("qh-input");
        input.value = "";
        autoResize(input);

        /* Disable send */
        isTyping = true;
        document.getElementById("qh-send").disabled = true;

        /* Show typing indicator */
        appendMessage("assistant", "", true);

        try {
            const res = await fetch(ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text, context: pageContext }),
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();

            removeTypingIndicator();
            appendMessage("assistant", data.reply || "Sorry, I couldn't get a response.");
        } catch (err) {
            console.error("[QuickHand] API error:", err);
            removeTypingIndicator();
            appendMessage(
                "assistant",
                "Couldn't reach the server. Make sure the backend is running on localhost:8000."
            );
        } finally {
            isTyping = false;
            document.getElementById("qh-send").disabled = false;
            input.focus();
        }
    }

    /* ── Auto-resize textarea ────────────────────────────── */
    function autoResize(el) {
        el.style.height = "auto";
        el.style.height = Math.min(el.scrollHeight, 100) + "px";
    }

    /* ── Show welcome message ────────────────────────────── */
    function showWelcome() {
        const greeting = pageContext
            ? `Hi! I'm Quick Hand 👋 I can see you're on the **${pageContext}** section. Ask me anything — I'll give you a quick, sharp answer.`
            : "Hi! I'm Quick Hand 👋 Your instant startup advisor. Ask me anything about your startup, strategy, or next steps!";
        appendMessage("assistant", greeting.replace(/\*\*/g, ""));
    }

    /* ── Init ────────────────────────────────────────────── */
    function init() {
        const { bubble, panel } = buildWidget();

        /* Show welcome + suggestions */
        showWelcome();
        renderSuggestions();

        /* Bubble click */
        bubble.addEventListener("click", togglePanel);

        /* Close when clicking outside the panel/bubble */
        document.addEventListener("click", (e) => {
            if (
                isOpen &&
                !panel.contains(e.target) &&
                !bubble.contains(e.target)
            ) {
                togglePanel();
            }
        });

        /* Send button */
        document.getElementById("qh-send").addEventListener("click", () => {
            const input = document.getElementById("qh-input");
            sendMessage(input.value.trim());
        });

        /* Enter to send (Shift+Enter = newline) */
        document.getElementById("qh-input").addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                const input = document.getElementById("qh-input");
                sendMessage(input.value.trim());
            }
        });

        /* Auto-resize textarea */
        document.getElementById("qh-input").addEventListener("input", function () {
            autoResize(this);
        });
    }

    /* Run after DOM ready */
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
