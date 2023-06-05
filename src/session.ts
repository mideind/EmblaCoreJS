/*
 * This file is part of the EmblaCoreJS package
 *
 * Copyright (c) 2023 Miðeind ehf. <mideind@mideind.is>
 * Original author: Logi Eyjolfsson
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import { ASRResponseMessage, GreetingsResponseMessage, QueryResponseMessage, WAVHeaderLength } from "./common.js";
import { EmblaSessionConfig } from "./config.js";
import { AudioRecorder } from "./recorder.js";
import { AudioPlayer } from "./audio.js";
import { GreetingsOutputMessage } from "./messages.js";
import { capFirst } from "./util.js";

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
    /** Current state of session object. @type {EmblaSessionState} */
    state: EmblaSessionState = EmblaSessionState.idle;
    private _config: EmblaSessionConfig;
    private _channel?: WebSocket;

    /**
     * Construct a session with the given configuration.
     * @param cfg Embla session config.
     */
    constructor(cfg: EmblaSessionConfig) {
        this._config = cfg;
        console.log(`Session created with config: ${cfg.toString()}`);
    }

    /**
     * Static method to preload required assets.
     * Minimizes delay when starting a session for the first time.
     * Call this method as early as possible.
     */
    static async prepare() {
        // Prefetch audio assets
        await AudioPlayer.init();
    }

    /**
     * Start an Embla session.
     */
    async start() {
        if (this.state !== EmblaSessionState.idle) {
            throw new Error("Session is not idle!");
        }

        this.state = EmblaSessionState.starting;

        try {
            await this._config.fetchToken();

            if (this.state !== EmblaSessionState.starting) {
                // User cancelled session before token was fetched
                return;
            }

            // Make sure we have a token
            if (this._config.hasValidToken() === false) {
                await this._error("Missing session token!");
                return;
            }
            await this._openWebSocketConnection();
        } catch (err) {
            await this._error("Error fetching session token!");
        }
    }

    /**
     * Stop an ongoing Embla session.
     * @async
     */
    async stop() {
        console.debug("Ending session...");
        await this._stop();

        this.state = EmblaSessionState.done;
        if (this._config.onDone !== undefined) {
            this._config.onDone();
        }
    }

    /**
     * Cancel an ongoing Embla session.
     */
    async cancel() {
        await this.stop();
        if (this._config.audio) {
            AudioPlayer.playSessionCancel();
        }
    }

    /**
     * Check whether the session is active or not.
     * @returns true if this session is not idle or finished.
     */
    isActive(): boolean {
        return (
            this.state !== EmblaSessionState.idle
            && this.state !== EmblaSessionState.done
        );
    }

    /**
     * Return current state of the session.
     * @returns The current state of the session.
     */
    currentState(): EmblaSessionState {
        return this.state;
    }

    private async _stop() {
        // Terminate all audio recording and playback
        await AudioRecorder.stop();

        AudioPlayer.stop();
        // Close WebSocket connection
        if (this._channel !== undefined) {
            this._channel.close();
        }
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

            this._channel.onopen = async (_ev: Event) => {
                // Send greeting message when connection is opened
                const greetings = GreetingsOutputMessage.fromConfig(this._config);
                this._channel!.send(greetings.toJSON());
                // Start streaming audio to server
                await this._startStreaming();
            };
            this._channel.onerror = async (ev: Event) => {
                await this._error(`Error listening on WebSocket connection: ${ev}`);
            };

            this._channel.onmessage = this._createOnMessageHandler();

        } catch (err) {
            await this._error(`Error communicating with server: ${err}`);
        }
    }

    private async _startStreaming() {
        this.state = EmblaSessionState.streaming;
        await AudioRecorder.start(
            (data: Blob) => {
                console.log("sending blob: ", data);
                // Skip WAV header (RecordRTC prepends a WAV header to each blob)
                this._channel!.send(data.slice(WAVHeaderLength));
            },
            async (error: string) => {
                await this._error(error);
            }
        );
        if (this._config.audio) {
            await AudioPlayer.playSessionStart();
        }
    }

    /**
     * Create a message handler function.
     * (Done so that `this` doesn't point to the WebSocket.)
     * @returns Message handler function.
     */
    private _createOnMessageHandler() {
        return async (ev: MessageEvent<any>) => {
            try {
                const msg = JSON.parse(ev.data);
                switch (msg.type) {
                    case "greetings":
                        await this._handleGreetingsMessage(msg);
                        break;
                    case "asr_result":
                        await this._handleASRResultMessage(msg);
                        break;
                    case "query_result":
                        await this._handleQueryResultMessage(msg);
                        break;
                    case "error":
                        if (msg.name === "timeout_error") {
                            await this.cancel();
                            return;
                        }
                        throw new Error(msg.message);
                    default:
                        throw new Error(`Invalid message type: ${msg.type}`);
                }
            } catch (err) {
                await this._error(`Error handling message: ${err}`);
            }
        };
    }

    private async _handleGreetingsMessage(_msg: GreetingsResponseMessage) {
        if (this._config.onStartStreaming !== undefined) {
            this._config.onStartStreaming();
        }
    }

    private async _handleASRResultMessage(msg: ASRResponseMessage) {
        if (this.state !== EmblaSessionState.streaming) {
            throw new Error("Session is not streaming!");
        }

        const transcript: string = capFirst(msg.transcript);
        const isFinal: boolean = msg.is_final;

        if (isFinal) {
            await AudioRecorder.stop();
            if (this._config.query) {
                this.state = EmblaSessionState.answering;
                if (this._config.audio) {
                    await AudioPlayer.playSessionConfirm();
                }
            }
        }

        if (this._config.onSpeechTextReceived !== undefined) {
            this._config.onSpeechTextReceived(transcript, isFinal, msg);
        }

        if (isFinal && transcript === "") {
            await this.cancel();
            return;
        }

        // If this is the final ASR result and config has
        // disabled querying, we end the session.
        if (isFinal && (this._config.query === false)) {
            await this.stop();
        }
    }

    private async _handleQueryResultMessage(msg: QueryResponseMessage) {
        if (this.state !== EmblaSessionState.answering) {
            throw new Error("Session is not answering query!");
        }

        try {
            const data = msg.data;
            if (data === undefined ||
                data === null ||
                data.valid === false ||
                data.answer === undefined) {
                // Handle no answer scenario
                console.log("Query result did not contain an answer, playing dunno answer");
                const dunnoMsg = await AudioPlayer.playDunno(this._config.voiceID, this._config.voiceSpeed);
                await this.stop();

                if (this._config.onQueryAnswerReceived !== undefined) {
                    // This is a bit of a hack, but we need to pass
                    // the dunno message text to the callback function
                    // so that it can be displayed in the UI.
                    data!.answer = dunnoMsg;
                    this._config.onQueryAnswerReceived(data);
                }
                return;
            }

            // OK, we got an answer, notify via handler
            if (this._config.onQueryAnswerReceived !== undefined) {
                this._config.onQueryAnswerReceived(data);
            }

            // Play remote audio file
            const audioURL = data.audio;
            console.log(audioURL);
            if (audioURL !== undefined && audioURL !== "") {
                try {
                    await AudioPlayer.playURL(audioURL).then(async () => { await this.stop(); console.log("stopping") });
                } catch (err) {
                    await this._error(`Error playing audio at URL ${audioURL}: ${err}`);
                }
            } else {
                // End session after audio answer has finished playing
                await this.stop();
            }
        } catch (e) {
            await this._error(`Error handling query result: ${e}`);
            return;
        }
    }

    toString(): string {
        return `EmblaSession { state: ${this.state} (${(this.isActive() ? "active" : "inactive")}) }`;
    }
}