import { webSocketGoingAwayCode } from "common.js";
import { EmblaSessionConfig } from "config.js";
import { AudioRecorder } from "recorder.js";
import { AudioPlayer } from "audio.js";

/**
 * Session state.
 * @readonly
 * @enum {number}
 */
export enum EmblaSessionState { idle, starting, streaming, answering, done }


/**
 * Main session object encapsulating Embla's core functionality.
 */
export class EmblaSession {
    /** Current state of session object */
    state: EmblaSessionState = EmblaSessionState.idle;
    private _config: EmblaSessionConfig;
    private _channel?: WebSocket;

    /**
     * Construct a session.
     * @param cfg Embla session config
     */
    constructor(cfg: EmblaSessionConfig) {
        this._config = cfg;
        console.log(`Session created with config: ${cfg.toString()}`);
    }

    static async prepare() {
        // Prefetch audio assets
        await AudioPlayer.init();
    }

    start() {
        if (this.state !== EmblaSessionState.idle) {
            throw new Error("Session is not idle!");
        }

        this.state = EmblaSessionState.starting;

        if (this._config.audio) {
            AudioPlayer.playSessionStart();
        }

        this._config.fetchToken().then(async (_) => {

            if (this.state === EmblaSessionState.done) {
                // User canceled session before token was fetched
                return;
            }

            // Make sure we have a token
            if (this._config.hasValidToken() === false) {
                await this._error("Missing session token!");
                return;
            }

            await this._openWebSocketConnection();
        }).catch(async (_) => {
            await this._error("Error fetching session token!");
        });
    }

    async stop() {
        console.debug("Ending session...");
        await this._stop();

        this.state = EmblaSessionState.done;
        if (this._config.onDone !== undefined) {
            this._config.onDone();
        }
    }

    async cancel() {
        await this.stop();
        if (this._config.audio) {
            AudioPlayer.playSessionCancel();
        }
    }

    isActive(): boolean {
        return (
            this.state !== EmblaSessionState.idle
            && this.state !== EmblaSessionState.done
        );
    }

    currentState(): EmblaSessionState {
        return this.state;
    }

    private async _stop() {
        // Terminate all audio recording and playback
        await AudioRecorder.stop();

        AudioPlayer.stop();
        // Close WebSocket connection
        this._channel?.close(webSocketGoingAwayCode);
    }

    private async _error(errMsg: string) {
        if (this.state === EmblaSessionState.done) {
            // Session already done, ignore error
            return;
        }

        console.debug(`Error in session: ${errMsg}`);
        await this._stop();

        // Set state to done
        this.state = EmblaSessionState.done;

        // Invoke error handler
        if (this._config.onError !== undefined) {
            this._config.onError(errMsg);
        }

        AudioPlayer.playSound("err", this._config.voiceID, this._config.voiceSpeed);
    }

    private async _openWebSocketConnection() {
        try {
            const wsUri = new URL(this._config.socketURL);
            this._channel = new WebSocket(wsUri);
            this._channel.onmessage = this._socketMessageReceived
        } catch (e) {

        }
    }

    private _socketMessageReceived(this: WebSocket, ev: MessageEvent): any {
        ev.data
    }

    toString(): string {
        return `EmblaSession { state: ${this.state} (${(this.isActive() ? "active" : "inactive")}) }`;
    }
}