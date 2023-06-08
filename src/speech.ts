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
import { TTSOptions } from "./messages.js";

interface TTSInput extends TTSOptions {
    apiURL: string | undefined
}

/** Speech synthesizer static class. */
export class EmblaSpeechSynthesizer {
    private constructor() { }

    /**
     * Request speech synthesis of the given text. Returns audio URL.
     * @async
     * @param {string} text Text to speech synthesize.
     * @param {string} apiKey API key for Ratatoskur.
     * @param {TTSInput?} ttsOptions Options for speech synthesis (Voice ID and speed).
     * @returns URL to speech synthesized audio file.
     */
    public static async synthesize(text: string, apiKey: string, ttsOptions?: TTSInput): Promise<string | null> {
        const qargs = {
            "text": text,
            "options": {
                "voice_id": ttsOptions?.voice_id ?? common.defaultSpeechSynthesisVoice,
                "voice_speed": ttsOptions?.voice_speed?.toString() ?? common.defaultSpeechSynthesisSpeed.toString(),
            }
        };
        const apiURL = (ttsOptions?.apiURL) ? ttsOptions.apiURL : `${common.defaultServer}${common.speechSynthesisEndpoint}`;

        let response: Response | null;
        try {
            response = await fetch(
                new URL(apiURL),
                {
                    method: "POST",
                    headers: {
                        "X-API-KEY": apiKey,
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(qargs),
                    signal: AbortSignal.timeout(common.requestTimeout)
                }
            );
            if (response.status !== 200) {
                return null;
            }
            // Parse JSON body and return audio URL
            const body = await response.json();
            return body.audio_url;
        } catch (e) {
            // NOTE: the following cast is unsafe,
            // JS can raise other things than Errors
            const err = e as Error;
            if (err.name === "TimeoutError") {
                console.debug("Timed out while requesting speech synthesis");
            } else {
                console.debug(`Error when requesting speech synthesis: ${err.name}, ${err.message}`);
            }
            return null;
        }
    }
}
