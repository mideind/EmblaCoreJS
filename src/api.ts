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

// TODO: Implement querying

import * as common from "./common";
import type { QueryOptions } from "./messages";
import { fetchWithTimeout } from "./util";

type _clearUserDataArgs = {
    action: "clear_all" | "clear";
    client_id: string;
    // Allow other attributes without type errors
    [attr: string]: unknown;
};
type _synthesizeArgs = {
    text: string;
    tts_options?: common.SpeechOptions;
    transcribe?: boolean;
    transcription_options?: common.TranscriptionOptions;
    [attr: string]: unknown;
};
type _synthesizeReturn = {
    audio_url: string;
    text: string;
    [attr: string]: unknown;
};

/**
 * @summary Class handling communication with HTTP endpoints.
 * @remarks
 * Has methods for performing queries,
 * clearing query history and requesting TTS for a given text.
 */
export class EmblaAPI {
    private constructor() {}

    /**
     * Send a query to a query service.
     * @async
     * @param {string} query Query string.
     * @param {string?} apiKey Server API key.
     * @param {QueryOptions?} queryOptions Options to send to query server.
     * @param {string?} serverURL Server URL.
     * @return Answer to query.
     */ // @ts-ignore
    public static async performQuery(
        _query: string,
        _apiKey: string,
        _queryOptions?: QueryOptions,
        _serverURL?: string
    ) {
        throw new Error("not implemented");
    }

    /**
     * Send request to clear query history and/or client data for a given device ID.
     * @param {string} clientID ID for this client.
     * @param {string?} apiKey Server API key.
     * @param {boolean} allData Whether all client specific data or only the query history should be deleted server-side.
     * @param {string?} serverURL Server URL.
     */
    static async clearUserData(
        clientID: string,
        apiKey?: string,
        allData: boolean = false,
        serverURL: string = common.defaultServer
    ) {
        const qargs: _clearUserDataArgs = {
            action: allData ? "clear_all" : "clear",
            client_id: clientID,
        };

        const apiURL = `${serverURL}${common.clearHistoryEndpoint}`;
        return await this._makePOSTRequest(apiURL, apiKey, qargs);
    }

    /**
     * Request speech synthesis of the given text. Returns audio URL.
     * @async
     * @param {string} text Text to speech synthesize.
     * @param {string?} apiKey Server API key.
     * @param {common.SpeechOptions?} ttsOptions Options for speech synthesis.
     * @param {common.TranscriptionOptions?} transcriptionOptions Options for transcription (only for Icelandic voices).
     * @param {boolean?} transcribe Whether to phonetically transcribe text before TTS (only for Icelandic voices).
     * @param {string?} serverURL Server URL.
     * @returns URL to speech synthesized audio file.
     */
    public static async synthesize(
        text: string,
        apiKey?: string,
        ttsOptions?: common.SpeechOptions,
        transcriptionOptions?: common.TranscriptionOptions,
        transcribe: boolean = true,
        serverURL: string = common.defaultServer
    ): Promise<string | undefined> {
        const qargs: _synthesizeArgs = { text: text, transcribe: transcribe };
        if (ttsOptions) {
            qargs.tts_options = ttsOptions;
        }
        if (transcriptionOptions) {
            qargs.transcription_options = transcriptionOptions;
        }

        const apiURL = `${serverURL}${common.speechSynthesisEndpoint}`;

        const body: _synthesizeReturn = await this._makePOSTRequest(
            apiURL,
            apiKey,
            qargs
        );
        return body.audio_url;
    }

    /**
     * Send POST request.
     * @param apiURL API URL.
     * @param apiKey Server API key.
     * @param qargs JSON body to send in request.
     * @returns JSON response.
     */
    private static async _makePOSTRequest(
        apiURL: string,
        apiKey?: string,
        qargs?: any
    ): Promise<any> {
        return await fetchWithTimeout(
            apiURL,
            {
                method: "POST",
                headers: {
                    "X-API-KEY": apiKey ?? "",
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(qargs),
            },
            common.requestTimeout
        );
    }
}
