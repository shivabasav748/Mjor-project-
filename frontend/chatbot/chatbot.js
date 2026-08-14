/* =========================================================
   VENTUREIQ AI CHATBOT
   Speech-to-Text + Text-to-Speech
========================================================= */


document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const chatArea =
        document.getElementById("chatArea");

    const messageInput =
        document.getElementById("messageInput");

    const sendButton =
        document.getElementById("sendButton");

    const micButton =
        document.getElementById("micButton");

    const clearChat =
        document.getElementById("clearChat");

    const stopSpeakingButton =
        document.getElementById("stopSpeaking");

    const speakingIndicator =
        document.getElementById("speakingIndicator");

    const quickPrompts =
        document.querySelectorAll(
            ".quick-prompts button"
        );


    /* =====================================================
       SPEECH-TO-TEXT
    ===================================================== */

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    let recognition = null;

    let isListening = false;


    if (SpeechRecognition) {


        recognition =
            new SpeechRecognition();


        recognition.continuous = false;

        recognition.interimResults = true;

        recognition.lang = "en-IN";


        /* ================================================
           SPEECH START
        ================================================= */

        recognition.onstart = () => {

            isListening = true;


            micButton.classList.add(
                "listening"
            );


            micButton.innerHTML =
                '<i class="fa-solid fa-microphone-lines"></i>';


            micButton.title =
                "Listening... Click to stop";

        };


        /* ================================================
           SPEECH RESULT
        ================================================= */

        recognition.onresult = event => {

            let transcript = "";


            for (
                let i = event.resultIndex;
                i < event.results.length;
                i++
            ) {

                transcript +=
                    event.results[i][0].transcript;

            }


            messageInput.value =
                transcript;


            autoResize();

        };


        /* ================================================
           SPEECH ERROR
        ================================================= */

        recognition.onerror = event => {

            console.error(
                "Speech recognition error:",
                event.error
            );


            stopListening();


            if (
                event.error === "not-allowed"
            ) {

                alert(
                    "Microphone permission was denied. Please allow microphone access in your browser."
                );

            }

        };


        /* ================================================
           SPEECH END
        ================================================= */

        recognition.onend = () => {

            stopListening();

        };

    } else {

        micButton.title =
            "Speech-to-text is not supported";


    }


    /* =====================================================
       START / STOP MICROPHONE
    ===================================================== */

    function toggleMicrophone() {


        if (!recognition) {

            alert(
                "Speech-to-text is not supported in this browser. Please use Google Chrome or Microsoft Edge."
            );

            return;

        }


        if (isListening) {

            recognition.stop();

            return;

        }


        try {

            recognition.start();

        } catch (error) {

            console.error(
                "Could not start microphone:",
                error
            );

        }

    }


    function stopListening() {

        isListening = false;


        micButton.classList.remove(
            "listening"
        );


        micButton.innerHTML =
            '<i class="fa-solid fa-microphone"></i>';


        micButton.title =
            "Speak to VentureIQ AI";

    }


    micButton.addEventListener(
        "click",
        toggleMicrophone
    );


    /* =====================================================
       TEXT-TO-SPEECH
    ===================================================== */

    function speakText(
        text,
        button = null
    ) {


        if (
            !("speechSynthesis" in window)
        ) {

            alert(
                "Text-to-speech is not supported in this browser."
            );

            return;

        }


        /*
         * Stop any previous speech first.
         */

        window.speechSynthesis.cancel();


        /*
         * Remove previous speaking states.
         */

        document
            .querySelectorAll(
                ".speak-button.speaking"
            )
            .forEach(
                element => {

                    element.classList.remove(
                        "speaking"
                    );

                }
            );


        const cleanText =
            text
                .replace(/<[^>]*>/g, "")
                .replace(/\*\*/g, "")
                .trim();


        if (!cleanText) {

            return;

        }


        const speech =
            new SpeechSynthesisUtterance(
                cleanText
            );


        speech.lang =
            "en-IN";


        speech.rate =
            0.95;


        speech.pitch =
            1;


        speech.volume =
            1;


        speech.onstart = () => {

            speakingIndicator.classList.add(
                "active"
            );


            if (button) {

                button.classList.add(
                    "speaking"
                );

            }

        };


        speech.onend = () => {

            speakingIndicator.classList.remove(
                "active"
            );


            if (button) {

                button.classList.remove(
                    "speaking"
                );

            }

        };


        speech.onerror = () => {

            speakingIndicator.classList.remove(
                "active"
            );


            if (button) {

                button.classList.remove(
                    "speaking"
                );

            }

        };


        window.speechSynthesis.speak(
            speech
        );

    }


    /* =====================================================
       STOP SPEAKING
    ===================================================== */

    stopSpeakingButton.addEventListener(
        "click",
        () => {

            window.speechSynthesis.cancel();


            speakingIndicator.classList.remove(
                "active"
            );


            document
                .querySelectorAll(
                    ".speak-button.speaking"
                )
                .forEach(
                    button => {

                        button.classList.remove(
                            "speaking"
                        );

                    }
                );

        }
    );


    /* =====================================================
       SPEAKER BUTTONS
    ===================================================== */

    function attachSpeakerButton(
        button
    ) {

        button.addEventListener(
            "click",
            () => {

                const text =
                    button.getAttribute(
                        "data-speak"
                    );


                if (!text) {

                    return;

                }


                /*
                 * If currently speaking,
                 * stop it.
                 */

                if (
                    window.speechSynthesis.speaking &&
                    button.classList.contains(
                        "speaking"
                    )
                ) {

                    window.speechSynthesis.cancel();


                    button.classList.remove(
                        "speaking"
                    );


                    speakingIndicator.classList.remove(
                        "active"
                    );


                    return;

                }


                speakText(
                    text,
                    button
                );

            }
        );

    }


    document
        .querySelectorAll(
            ".speak-button"
        )
        .forEach(
            attachSpeakerButton
        );


    /* =====================================================
       SEND MESSAGE
    ===================================================== */

    async function sendMessage(
        suppliedMessage = null
    ) {


        const text =
            suppliedMessage ||
            messageInput.value.trim();


        if (!text) {

            return;

        }


        /*
         * Stop microphone if it is listening.
         */

        if (
            isListening &&
            recognition
        ) {

            recognition.stop();

        }


        /*
         * Stop previous speech.
         */

        window.speechSynthesis.cancel();


        /*
         * Add user's message.
         */

        addMessage(
            text,
            "user"
        );


        /*
         * Clear input.
         */

        messageInput.value = "";

        autoResize();


        /*
         * Hide quick prompts.
         */

        const prompts =
            document.getElementById(
                "quickPrompts"
            );


        if (prompts) {

            prompts.style.display =
                "none";

        }


        /*
         * Show typing indicator.
         */

        const typingId =
            showTyping();


        /*
         * Get AI response.
         *
         * Currently this uses the temporary
         * local response function.
         *
         * Later your friend can connect
         * this function to the Gemini backend.
         */

        const response =
            await getAIResponse(text);


        /*
         * Remove typing.
         */

        removeTyping(
            typingId
        );


        /*
         * Add AI response.
         */

        addMessage(
            response,
            "bot"
        );


        /*
         * Automatically read AI response.
         */

        const latestSpeaker =
            chatArea.querySelector(
                ".message:last-of-type .speak-button"
            );


        speakText(
            response,
            latestSpeaker
        );

    }


    /* =====================================================
       SEND BUTTON
    ===================================================== */

    sendButton.addEventListener(
        "click",
        () => {

            sendMessage();

        }
    );


    /* =====================================================
       ENTER TO SEND
    ===================================================== */

    messageInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                sendMessage();

            }

        }
    );


    /* =====================================================
       QUICK PROMPTS
    ===================================================== */

    quickPrompts.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const message =
                        button.getAttribute(
                            "data-message"
                        );


                    sendMessage(
                        message
                    );

                }
            );

        }
    );


    /* =====================================================
       ADD MESSAGE
    ===================================================== */

    function addMessage(
        text,
        sender
    ) {


        const message =
            document.createElement(
                "div"
            );


        message.className =
            sender === "user"
                ? "message user-message"
                : "message bot-message";


        const avatar =
            document.createElement(
                "div"
            );


        avatar.className =
            "message-avatar";


        avatar.innerHTML =
            sender === "user"
                ? '<i class="fa-solid fa-user"></i>'
                : '<i class="fa-solid fa-robot"></i>';


        const content =
            document.createElement(
                "div"
            );


        content.className =
            "message-content";


        const name =
            document.createElement(
                "div"
            );


        name.className =
            "message-name";


        name.textContent =
            sender === "user"
                ? "You"
                : "VentureIQ AI";


        const bubble =
            document.createElement(
                "div"
            );


        bubble.className =
            "message-bubble";


        const paragraph =
            document.createElement(
                "p"
            );


        paragraph.textContent =
            text;


        bubble.appendChild(
            paragraph
        );


        content.appendChild(
            name
        );


        content.appendChild(
            bubble
        );


        /*
         * Add speaker button only to AI messages.
         */

        if (
            sender === "bot"
        ) {


            const actions =
                document.createElement(
                    "div"
                );


            actions.className =
                "message-actions";


            const speaker =
                document.createElement(
                    "button"
                );


            speaker.type =
                "button";


            speaker.className =
                "speak-button";


            speaker.title =
                "Read aloud";


            speaker.setAttribute(
                "aria-label",
                "Read message aloud"
            );


            speaker.setAttribute(
                "data-speak",
                text
            );


            speaker.innerHTML =
                '<i class="fa-solid fa-volume-high"></i>';


            actions.appendChild(
                speaker
            );


            content.appendChild(
                actions
            );


            attachSpeakerButton(
                speaker
            );

        }


        const time =
            document.createElement(
                "div"
            );


        time.className =
            "message-time";


        time.textContent =
            getCurrentTime();


        content.appendChild(
            time
        );


        message.appendChild(
            avatar
        );


        message.appendChild(
            content
        );


        chatArea.appendChild(
            message
        );


        scrollToBottom();

    }


    /* =====================================================
       TYPING INDICATOR
    ===================================================== */

    function showTyping() {


        const id =
            "typing-" +
            Date.now();


        const message =
            document.createElement(
                "div"
            );


        message.id =
            id;


        message.className =
            "message bot-message";


        message.innerHTML = `

            <div class="message-avatar">

                <i class="fa-solid fa-robot"></i>

            </div>


            <div class="message-content">

                <div class="message-name">
                    VentureIQ AI
                </div>


                <div class="message-bubble typing-message">

                    <span class="typing-dot"></span>

                    <span class="typing-dot"></span>

                    <span class="typing-dot"></span>

                </div>

            </div>

        `;


        chatArea.appendChild(
            message
        );


        scrollToBottom();


        return id;

    }


    function removeTyping(
        id
    ) {

        const element =
            document.getElementById(
                id
            );


        if (element) {

            element.remove();

        }

    }


    /* =====================================================
       TEMPORARY AI RESPONSE
    ===================================================== */

    async function getAIResponse(
        userMessage
    ) {


        /*
         * Temporary delay.
         */

        await new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    700
                )
        );


        const message =
            userMessage.toLowerCase();


        if (
            message.includes("validate") ||
            message.includes("idea")
        ) {

            return (
                "I can help you validate your startup idea. " +
                "We can evaluate the problem, target users, " +
                "market opportunity, uniqueness, competition " +
                "and overall viability."
            );

        }


        if (
            message.includes("market")
        ) {

            return (
                "Market intelligence is an important part " +
                "of evaluating a startup. We can look at " +
                "the target market, customer demand, trends, " +
                "growth opportunities and potential risks."
            );

        }


        if (
            message.includes("competitor")
        ) {

            return (
                "I can help you understand your competitive " +
                "landscape by comparing competitors, products, " +
                "pricing, strengths, weaknesses and potential " +
                "differentiation."
            );

        }


        if (
            message.includes("roadmap")
        ) {

            return (
                "A good startup roadmap should break your " +
                "idea into clear stages such as validation, " +
                "MVP development, testing, launch and growth. " +
                "VentureIQ can help organize these steps."
            );

        }


        if (
            message.includes("hello") ||
            message.includes("hi")
        ) {

            return (
                "Hello! 👋 I'm VentureIQ AI. " +
                "Tell me about your startup idea or ask me " +
                "about markets, competitors or business strategy."
            );

        }


        return (
            "That's an interesting question. I'm VentureIQ AI, " +
            "your startup intelligence assistant. I can help " +
            "with idea validation, market analysis, competitor " +
            "research and startup roadmaps."
        );

    }


    /* =====================================================
       CLEAR CHAT
    ===================================================== */

    clearChat.addEventListener(
        "click",
        () => {


            const confirmed =
                confirm(
                    "Clear this conversation?"
                );


            if (!confirmed) {

                return;

            }


            /*
             * Stop speech.
             */

            window.speechSynthesis.cancel();


            speakingIndicator.classList.remove(
                "active"
            );


            /*
             * Remove dynamically created
             * messages while preserving
             * the initial welcome message.
             */

            const messages =
                chatArea.querySelectorAll(
                    ".message"
                );


            messages.forEach(
                (message, index) => {

                    if (index > 0) {

                        message.remove();

                    }

                }
            );


            /*
             * Show quick prompts again.
             */

            const prompts =
                document.getElementById(
                    "quickPrompts"
                );


            if (prompts) {

                prompts.style.display =
                    "flex";

            }

        }
    );


    /* =====================================================
       AUTO RESIZE
    ===================================================== */

    function autoResize() {


        messageInput.style.height =
            "auto";


        messageInput.style.height =
            Math.min(
                messageInput.scrollHeight,
                100
            ) + "px";

    }


    messageInput.addEventListener(
        "input",
        autoResize
    );


    /* =====================================================
       SCROLL
    ===================================================== */

    function scrollToBottom() {

        chatArea.scrollTop =
            chatArea.scrollHeight;

    }


    /* =====================================================
       CURRENT TIME
    ===================================================== */

    function getCurrentTime() {

        return new Date()
            .toLocaleTimeString(
                "en-IN",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    console.log(
        "VentureIQ AI Chatbot initialized successfully."
    );

});