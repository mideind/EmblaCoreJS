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

import type {
    ASRResponseMessage,
    AudioPlayer,
    AudioRecorder,
    GreetingsResponseMessage,
    QueryResponseMessage,
} from "./common";
import { EmblaSessionConfig } from "./config";
import { GreetingsOutputMessage } from "./messages";
import { capFirst } from "./util";

/**
 * Session state.
 * @readonly
 * @enum {number}
 */
export enum EmblaSessionState {
    /** Session is idle (hasn't started yet). */
    idle,
    /** Session is starting but hasn't started streaming audio. */
    starting,
    /** Session is streaming audio. */
    streaming,
    /** Session has received final ASR result and is answering a query. */
    answering,
    /** Session has finished. */
    done,
}

/**
 * @summary Main session object encapsulating Embla's core functionality.
 * @remarks
 * A usual session consists of three phases:
 * 1. **ASR**
 *
 *      User speaks into their microphone and receives transcription feedback from the server.
 * 2. **Query**
 *
 *      The final transcription is sent to query server and an answer is received from the server.
 * 3. **TTS**
 *
 *      The answer to the query is read aloud for the user.
 *
 * The query and TTS phases can be skipped by setting the
 * appropriate flags in the {@link EmblaSessionConfig|configuration object}.
 */
export class EmblaSession {
    protected static _audioRecorder: AudioRecorder;
    protected static _audioPlayer: AudioPlayer;

    /** Current state of session object. */
    state: EmblaSessionState = EmblaSessionState.idle;

    private _config: EmblaSessionConfig;
    private _socket?: WebSocket;

    /**
     * Construct a session with the given configuration.
     * @param {EmblaSessionConfig} cfg Embla session config.
     */
    constructor(cfg: EmblaSessionConfig) {
        this._config = cfg;
    }

    /**
     * @internal
     */
    static async _attachAudioClasses(
        audioRecorder: new () => AudioRecorder,
        audioPlayer: new () => AudioPlayer
    ) {
        EmblaSession._audioRecorder = new audioRecorder();
        EmblaSession._audioPlayer = new audioPlayer();
    }

    /**
     * Static method to preload required assets.
     * Call once, as early as possible.
     */
    static async prepare() {
        // Prefetch audio assets
        await EmblaSession._audioPlayer.init();
    }

    /**
     * Start an Embla session.
     * @async
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
        await this._stop();

        this.state = EmblaSessionState.done;
        if (this._config.onDone !== undefined) {
            this._config.onDone();
        }
    }

    /**
     * Cancel an ongoing Embla session.
     * @async
     */
    async cancel() {
        await this.stop();
        if (this._config.audio) {
            EmblaSession._audioPlayer.playSessionCancel();
        }
    }

    /**
     * Check whether the session is active or not.
     * @returns `true` if this session is not idle or finished.
     */
    isActive(): boolean {
        return (
            this.state !== EmblaSessionState.idle &&
            this.state !== EmblaSessionState.done
        );
    }

    /**
     * Return current {@link EmblaSessionState|state} of the session.
     * @returns The current state of the session.
     */
    currentState(): EmblaSessionState {
        return this.state;
    }

    private async _stop() {
        // Terminate audio recording
        await EmblaSession._audioRecorder.stop();

        // Close WebSocket connection
        if (this._socket !== undefined) {
            this._socket.close();
        }
    }

    private async _error(errMsg: string) {
        if (this.state === EmblaSessionState.done) {
            // Session already done, ignore error
            return;
        }

        await this._stop();

        // Set state to done
        this.state = EmblaSessionState.done;

        // Invoke error handler
        if (this._config.onError !== undefined) {
            this._config.onError(errMsg);
        }

        EmblaSession._audioPlayer.playSound(
            "err",
            this._config.voiceID,
            this._config.voiceSpeed
        );
    }

    private async _openWebSocketConnection() {
        try {
            const wsUri = this._config.socketURL;
            this._socket = new WebSocket(wsUri);

            this._socket.onopen = async () => {
                // Send greeting message when connection is opened
                const greetings = GreetingsOutputMessage.fromConfig(
                    this._config
                );
                this._socket!.send(greetings.toJSON());
                // Start streaming audio to server
                await this._startStreaming();
            };
            this._socket.onerror = async (ev: Event) => {
                await this._error(
                    `Error listening on WebSocket connection: ${ev}`
                );
            };

            this._socket.onmessage = this._createOnMessageHandler();
        } catch (err) {
            await this._error(`Error communicating with server: ${err}`);
        }
    }

    private async _startStreaming() {
        this.state = EmblaSessionState.streaming;
        await EmblaSession._audioRecorder.start(
            (data) => {
                if (this._socket !== undefined) {
                    this._socket.send(data);
                }
            },
            async (error: string) => {
                await this._error(error);
            }
        );
        if (this._config.audio) {
            EmblaSession._audioPlayer.playSessionStart();
        }
    }

    /**
     * Create a message handler function.
     * (Workaround so that `this` doesn't point to the WebSocket.)
     * @internal
     * @returns Message handler function.
     */
    private _createOnMessageHandler(): (ev: any) => Promise<void> {
        return async (ev: any) => {
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
                        if (msg.name === "token_error") {
                            // Error with our token, reset token in config
                            this._config.resetToken();
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
            await EmblaSession._audioRecorder.stop();
            if (this._config.query) {
                this.state = EmblaSessionState.answering;
                if (this._config.audio) {
                    EmblaSession._audioPlayer.playSessionConfirm();
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
        if (isFinal && this._config.query === false) {
            await this.stop();
        }
    }

    private async _handleQueryResultMessage(msg: QueryResponseMessage) {
        if (this.state !== EmblaSessionState.answering) {
            throw new Error("Session is not answering query!");
        }

        try {
            const data = msg.data;
            if (
                data === undefined ||
                data === null ||
                data.valid === false ||
                data.answer === undefined
            ) {
                // Handle no answer scenario
                const dunnoMsg = EmblaSession._audioPlayer.playDunno(
                    this._config.voiceID,
                    this._config.voiceSpeed
                );
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
            if (audioURL !== undefined && audioURL !== "") {
                try {
                    EmblaSession._audioPlayer.playURL(audioURL);
                } catch (err) {
                    await this._error(
                        `Error playing audio at URL ${audioURL}: ${err}`
                    );
                }
            }
            // End session after audio answer has finished playing
            await this.stop();
        } catch (e) {
            await this._error(`Error handling query result: ${e}`);
            return;
        }
    }

    toString(): string {
        let active = this.isActive() ? "active" : "inactive";
        return `EmblaSession { state: ${this.state} (${active}) }`;
    }
}
