import * as EmblaCore from "./emblacore.js";

const apiKeyInput = document.getElementById("server_api_key");

const button = document.getElementById("start_button");
const urlInput = document.getElementById("server_url");

// Helper function for easier viewing of logs
const logArea = document.getElementById("log");
logArea.value = "";
function log(msg) {
    logArea.value += msg + "\n";
    console.log(msg);
    // Auto scroll log textarea
    logArea.scrollTop = logArea.scrollHeight;
}

// Create config (this should be reused if possible)
var config = new EmblaCore.EmblaSessionConfig(urlInput.value);

/** Set handler functions and API key for the current config. */
function setupConfig() {
    config.onStartStreaming = () => {
        log("[ASR] Started streaming audio...");
    };
    config.onSpeechTextReceived = (transcript, isFinal, data) => {
        log(
            `[ASR] Transcript: '${transcript}', isFinal: ${isFinal}, alternatives: ${data.alternatives}`
        );
    };
    config.onStartQuerying = () => {
        log("[ASR] Stopped streaming audio.");
        log("[QUERY] Sending query...");
    };
    config.onQueryAnswerReceived = (qanswer) => {
        log(`[QUERY] Got query answer: ${qanswer.answer}`);
    };
    config.onStartAnswering = () => {
        log("[TTS] Reading answer...");
    };
    config.onDone = () => {
        log("Session finished.");
        updateButton();
    };
    config.onError = (error) => {
        log(`ERROR: ${error}`);
        updateButton();
    };
    console.log(config);
}

var session;
function sessionIsActive() {
    return (
        session === undefined ||
        session.state === EmblaCore.EmblaSessionState.idle ||
        session.state === EmblaCore.EmblaSessionState.done
    );
}
function updateButton() {
    if (sessionIsActive()) {
        button.value = "Stream microphone";
    } else {
        button.value = "Stop session";
    }
}
async function toggle_start() {
    if (sessionIsActive()) {
        log("Starting session...");
        // Ensure config API key is in sync with text input
        config.apiKey = apiKeyInput.value;
        session = new EmblaCore.EmblaSession(config);
        await session.start();
    } else {
        log("Cancelling session...");
        await session.cancel();
        session = undefined;
    }
    updateButton();
}

// Add change event listener to url input
urlInput.addEventListener("change", (event) => {
    config = new EmblaCore.EmblaSessionConfig(event.target.value);
    setupConfig();
});

// Add click event listener to the start button
button.addEventListener("click", (_) => {
    toggle_start();
});

// Set up callback handlers in config instance
setupConfig();
// Prepare audio assets
await EmblaCore.EmblaSession.prepare();
