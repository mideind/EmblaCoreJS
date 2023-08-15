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

import type { ASROptions, TTSOptions } from "./common";
import type { EmblaSessionConfig } from "./config";

/** Options for the query service. */
export interface QueryOptions {
    url?: string;
    client_id?: string;
    client_type?: string;
    client_version?: string;
    latitude?: number;
    longitude?: number;
}

/**
 * Options included in the initial
 * greetings message to the server.
 */
export interface GreetingsData {
    private: boolean;
    asr_options?: ASROptions;
    query: boolean;
    query_options?: QueryOptions;
    tts: boolean;
    tts_options?: TTSOptions;
}

/** Class representing a `greetings` JSON message sent to the server */
export class GreetingsOutputMessage {
    readonly type: string = "greetings";

    /**
     * @internal
     */
    constructor(protected token: string, public data: GreetingsData) {}

    /**
     * Create a greetings message from a session config object.
     * @param {EmblaSessionConfig} config Session config object.
     * @returns Greetings message.
     */
    static fromConfig(config: EmblaSessionConfig): GreetingsOutputMessage {
        // Engine options
        const asrOpts: ASROptions = {};
        if (config.engine !== undefined) {
            asrOpts.engine = config.engine;
        }
        // Unused
        // if (config.language !== undefined) {
        //     engineOpts.language = config.language;
        // }

        // Query options, which includes client details.
        const qOpts: QueryOptions = {};
        qOpts.url = `${config.queryServer}/query.api`;
        if (config.privateMode === false) {
            // Client details are only sent if the session is not private.
            if (config.clientID !== undefined) {
                qOpts.client_id = config.clientID;
            }
            if (config.clientType !== undefined) {
                qOpts.client_type = config.clientType;
            }
            if (config.clientVersion !== undefined) {
                qOpts.client_version = config.clientVersion;
            }
            if (config.getLocation !== undefined) {
                const loc = config.getLocation!();
                if (loc?.length === 2) {
                    qOpts.latitude = loc[0];
                    qOpts.longitude = loc[1];
                }
            }
        }

        const ttsOpts: TTSOptions = {};
        // Speech synthesis settings
        ttsOpts.voice_id = config.voiceID;
        ttsOpts.voice_speed = config.voiceSpeed;

        let data: GreetingsData = {
            // Privacy setting
            private: config.privateMode,
            // ASR options
            asr_options: asrOpts,
            // Query options
            query: config.query,
            query_options: qOpts,
            // TTS options
            tts: config.tts,
            tts_options: ttsOpts,
        };

        // Token
        let token = config.token ?? "";
        return new GreetingsOutputMessage((token = token), (data = data));
    }

    /** Convert this message object to a JSON string representation. */
    toJSON(): string {
        const msg = {
            type: this.type,
            token: this.token,
            data: this.data,
        };
        return JSON.stringify(msg);
    }
}
