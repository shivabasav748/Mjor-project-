/* =========================================================
   VENTUREIQ AI CHATBOT - FLOATING WIDGET
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    /* =================================================
       ELEMENTS
    ================================================= */

    const chatbot = document.querySelector(".chatbot");
    const chatForm = document.getElementById("chatForm");
    const messageInput = document.getElementById("messageInput");
    const chatMessages = document.getElementById("chatMessages");
    const sendButton = document.getElementById("sendButton");
    const closeButton = document.getElementById("closeButton");
    const quickQuestions = document.querySelectorAll(".quick-questions button");
    const toggleButton = document.querySelector(".chatbot-toggle-button");

    // Handle case where chatbot elements might not exist
    if (!chatbot || !chatForm || !messageInput || !chatMessages || !sendButton || !closeButton) {
        console.warn("VentureIQ AI Chatbot: One or more required elements not found.");
        return;
    }

    /* =================================================
       CHATBOT TOGGLE - MINIMIZE/EXPAND
    ================================================= */

    // Initialize chatbot as minimized
    if (localStorage.getItem("chatbotMinimized") !== "false") {
        chatbot.classList.add("minimized");
    }

    // Toggle button click
    if (toggleButton) {
        toggleButton.addEventListener("click", () => {
            chatbot.classList.remove("minimized");
            localStorage.setItem("chatbotMinimized", "false");
            messageInput.focus();
        });
    }

    /* =================================================
       ADD MESSAGE
    ================================================= */

    function addMessage(message, type) {
        const messageElement = document.createElement("div");
        messageElement.className = `message ${type}`;

        if (type === "bot") {
            messageElement.innerHTML = `
                <div class="message-avatar">
                    <i class="fa-solid fa-robot"></i>
                </div>
                <div class="message-bubble">
                    <p>${escapeHTML(message)}</p>
                </div>
            `;
        } else {
            messageElement.innerHTML = `
                <div class="message-bubble">
                    <p>${escapeHTML(message)}</p>
                </div>
            `;
        }

        chatMessages.appendChild(messageElement);
        scrollToBottom();
    }

    /* =================================================
       TYPING INDICATOR
    ================================================= */

    function showTyping() {
        const typingElement = document.createElement("div");
        typingElement.className = "message bot";
        typingElement.id = "typingIndicator";

        typingElement.innerHTML = `
            <div class="message-avatar">
                <i class="fa-solid fa-robot"></i>
            </div>
            <div class="message-bubble">
                <div class="typing">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;

        chatMessages.appendChild(typingElement);
        scrollToBottom();
    }

    /* =================================================
       REMOVE TYPING
    ================================================= */

    function removeTyping() {
        const typing = document.getElementById("typingIndicator");
        if (typing) {
            typing.remove();
        }
    }

    /* =================================================
       SEND TO BACKEND
    ================================================= */

    async function sendMessage(message) {
        if (!message) {
            return;
        }

        /* Show user message */
        addMessage(message, "user");
        showTyping();

        messageInput.value = "";
        messageInput.disabled = true;
        sendButton.disabled = true;

        try {
            /*
             * Your friend's backend
             * should provide this endpoint.
             */
            const response = await fetch("http://localhost:8000/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: message,
                }),
            });

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }

            const data = await response.json();
            removeTyping();

            /*
             * Backend should return:
             *
             * {
             *     "response": "AI response here"
             * }
             */

            const aiResponse =
                data.response ||
                data.message ||
                "I couldn't generate a response.";

            addMessage(aiResponse, "bot");
        } catch (error) {
            console.error("VentureIQ AI Error:", error);
            removeTyping();

            addMessage(
                "I'm unable to connect to VentureIQ AI right now. Please check whether the backend server is running.",
                "bot"
            );
        }

        messageInput.disabled = false;
        sendButton.disabled = false;
        messageInput.focus();
    }

    /* =================================================
       FORM SUBMIT
    ================================================= */

    chatForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const message = messageInput.value.trim();
        sendMessage(message);
    });

    /* =================================================
       QUICK QUESTIONS
    ================================================= */

    quickQuestions.forEach((button) => {
        button.addEventListener("click", () => {
            const question = button.dataset.question;
            sendMessage(question);
        });
    });

    /* =================================================
       CLOSE BUTTON
    ================================================= */

    closeButton.addEventListener("click", () => {
        /*
         * For floating widget, minimize the chatbot
         * Show only the button
         */
        chatbot.classList.add("minimized");
        localStorage.setItem("chatbotMinimized", "true");
    });

    /* =================================================
       SCROLL
    ================================================= */

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    /* =================================================
       SECURITY - HTML ESCAPE
    ================================================= */

    function escapeHTML(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    /* =================================================
       RESTORE STATE
    ================================================= */

    // Check if chatbot should be minimized
    if (localStorage.getItem("chatbotMinimized") === "true") {
        chatbot.classList.add("minimized");
    }

    /* =================================================
       READY
    ================================================= */

    console.log("VentureIQ AI Floating Chatbot loaded successfully.");
});
