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
/**
 * The main functionality of EmblaCore is contained within {@link EmblaSession}.
 *
 * @example
 * Simple example of usage:
 * ```js
 * import * as EmblaCore from emblacore.js
 *
 * // Set up an `EmblaSessionConfig` instance, optionally specifying a proxy token fetching method.
 * // (For the sake of brevity, here we simply set the API key and use the default token fetching)
 * let config = new EmblaCore.EmblaSessionConfig();
 * // Set server API key (if code is run client-side, prefer proxying to exposing the API key like this)
 * config.apiKey = "...your api key here...";
 * // Optionally set handlers for different events
 * // (see section `Event Handlers` in documentation for EmblaSessionConfig)
 * config.onQueryAnswerReceived = (answer) => { /* ... *\/ };
 * /* Note: to allow query service to answer location based questions set `config.getLocation` *\/
 * /* ... *\/
 *
 * // Create and start an EmblaSession
 * let session = new EmblaCore.EmblaSession(config);
 * await session.start();
 * ```
 * @see {@link EmblaSessionConfig} - Configuration object for sessions.
 * @see {@link EmblaSession} - Session objects.
 *
 * @packageDocumentation
 */

// Classes
export { EmblaSessionConfig } from "./config";
export { EmblaAPI } from "./api";
export { AuthenticationToken } from "./token";

// Web specific classes
import { WebAudioPlayer } from "./audio.web";
import { WebAudioRecorder } from "./recorder.web";
import { EmblaSession, EmblaSessionState } from "./session";

// Attach audio classes for web
EmblaSession._attachAudioClasses(WebAudioRecorder, WebAudioPlayer);
export { EmblaSessionState, EmblaSession, WebAudioPlayer, WebAudioRecorder };

// Interfaces
export type { QueryOptions, GreetingsOutputMessage } from "./messages";
export type {
    AudioRecorder,
    AudioPlayer,
    ASROptions,
    TTSOptions,
    GreetingsResponseMessage,
    ASRResponseMessage,
    QueryResponseMessage,
    QueryResponseData,
} from "./common";
// Constants
export { SOFTWARE_VERSION as EmblaCoreVersion } from "./common";
