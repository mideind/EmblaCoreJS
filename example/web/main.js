import * as EmblaCore from "@mideind/embla-core";

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

/**
 * Function which fetches authentication tokens from proxy endpoint,
 * and returns instances of EmblaCore.AuthenticationToken.
 */
async function proxyFetchToken() {
    // Note: here we simply use the same Ratatoskur server,
    // but this could be an endpoint in your application which acts as a proxy for the Ratatoskur token endpoint.
    let r = await fetch(`${urlInput.value}/rat/v1/token`, {
        headers: { "X-API-Key": apiKeyInput.value },
    });
    return EmblaCore.AuthenticationToken.fromJson(await r.text());
}

// Create config (this should be reused if possible)
var config = new EmblaCore.EmblaSessionConfig(proxyFetchToken, urlInput.value);

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
    config = new EmblaCore.EmblaSessionConfig(
        proxyFetchToken,
        event.target.value
    );
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
