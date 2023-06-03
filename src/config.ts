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

import * as common from "./common.js";
import * as token from "./token.js";

/**
 * EmblaSession configuration object.
 */
export class EmblaSessionConfig {

    private static _token?: token.AuthenticationToken;

    /**
     * Create an EmblaSessionConfig instance.
     * @param server Server to communicate with. Default is {@link common.defaultServer}.
     */
    constructor(server: string = common.defaultServer) {
        console.debug("Creating EmblaSessionConfig object");
        this._tokenURL = `${server}${common.tokenEndpoint}`;

        let webSocketURL: string = server;
        if (webSocketURL.startsWith("https")) {
            // We're using SSL, so we need to use wss://
            webSocketURL = webSocketURL.replace("https", "wss");
        } else {
            webSocketURL = webSocketURL.replace("http", "ws");
        }
        console.debug(`Using socket URL ${webSocketURL}`);
        this.socketURL = `${webSocketURL}${common.socketEndpoint}`;
    }

    /**
     * URL to API that provides authentication
     * token for WebSocket communication.
     */
    private _tokenURL: string;
    /**
     * WebSocket URL for the Ratatoskur ASR + Query + TTS pipeline.
     */
    socketURL: string;
    /** Server API key. */
    apiKey?: string;
    /**
     * Speech-to-text language (e.g. `is-IS`).
     * Currently ignored as only `is-IS` is supported.
     */
    language: string = common.speechToTextLanguage;
    /** Override default ASR engine. */
    engine?: string;
    /**
     * Voice ID to use when synthesizing speech.
     * Default is {@link common.defaultSpeechSynthesisVoice}.
     */
    voiceID: string = common.defaultSpeechSynthesisVoice;
    /**
     * Voice speed to use when synthesizing speech.
     * Default is {@link common.defaultSpeechSynthesisSpeed}.
     */
    voiceSpeed: number = common.defaultSpeechSynthesisSpeed;
    /** Don't send client info to server. Default is `false`. */
    privateMode: boolean = false;
    /**
     * Client ID should be set by client app.
     * Ideally, a unique app-specific client ID should be provided.
     */
    clientID?: string;
    /**
     * Client type string (e.g. `web`, `ios`, `android`).
     * Third-party clients should use their own name
     * here, e.g. `myappname_web`, `myappname_ios`, `myappname_android`.
     */
    clientType?: string;
    /** Client version string(e.g. `1.3.1`). */
    clientVersion?: string;
    /**
     * Whether Ratatoskur should send ASR text to the query server
     * and subsequently forward the query response to the client.
     * Defaults to `true`.
     */
    query: boolean = true;
    /**
     * Whether Ratatoskur should speech synthesize query server answer
     * and subsequently forward the audio to the client.
     * Defaults to `true`.
     */
    tts: boolean = true;
    /**
     * Query server URL. Defaults to {@link common.defaultQueryServer}.
     */
    queryServer: string = common.defaultQueryServer;
    /** Whether to play session UI sounds. */
    audio: boolean = true;
    /**
     * Optional callback that provides the user's current
     * location as WGS84 coordinates (latitude, longitude).
     */
    getLocation?: () => number[] | undefined;

    // Handlers for session events

    /**
     * Called when the session has received a greeting from
     * the server and has begun streaming audio.
     */
    onStartStreaming?: () => void;
    /**
     * Called when the session has received
     * speech text from the server.
     */
    onSpeechTextReceived?: (transcript: string, isFinal: boolean, msg: common.ASRResponseMessage) => void;
    /**
     * Called when the session has received *final* speech text
     * from the server and is waiting for a query answer.
     */
    onStartQuerying?: () => void;
    /**
     * Called when the session has received
     * a query answer from the server.
     */
    onQueryAnswerReceived?: (answer: common.QueryResponseData) => void;
    /**
     * Called when the session is playing the
     * answer as audio.
     */
    onStartAnswering?: () => void;
    /**
     * Called when the session has finished playing the audio
     * answer or has been manually ended.
     */
    onDone?: () => void;
    /**
     * Called when the session has encountered
     * an error and ended.
     */
    onError?: (error: string) => void;


    /**
     * WebSocket token for authenticated
     * communication with the server.
     */
    get token(): string {
        return EmblaSessionConfig._token?.tokenString || "";
    }

    hasValidToken(): boolean {
        const t = EmblaSessionConfig._token;
        return t?.tokenString !== "" && !t?.isExpired();
    }

    /**
     * Update token for WebSocket communication if needed.
     * @async
     */
    async fetchToken(): Promise<void> {
        if (EmblaSessionConfig._token !== undefined && !EmblaSessionConfig._token.isExpired()) {
            console.debug("Token still valid, not fetching a new one");
            return;
        }
        // We either haven't gotten a token yet, or the one we
        // have has expired, so we fetch a new one.
        const timeout = 5e3; // milliseconds
        try {
            const key: string = this.apiKey ?? "";
            console.debug(`Fetching token from ${this._tokenURL} (X-API-Key: ${key})`);

            const response = await fetch(
                new URL(this._tokenURL),
                {
                    headers: { "X-API-Key": key },
                    signal: AbortSignal.timeout(timeout)
                }
            );

            EmblaSessionConfig._token = token.AuthenticationToken.fromJson(await response.text());
            console.debug(`Received ${EmblaSessionConfig._token}`);
        } catch (e) {
            // NOTE: the following cast is unsafe,
            // JS can raise other things than Errors
            const err = e as Error;
            if (err.name === "TimeoutError") {
                console.debug("Timed out while fetching token");
            } else {
                console.debug(`Error while fetching WebSocket token: ${err.name}, ${err.message}`);
            }
            EmblaSessionConfig._token = undefined;
        }
    }
}
