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
 * // Set up an `EmblaSessionConfig` instance, optionally specifying server URL as argument
 * let config = new EmblaCore.EmblaSessionConfig();
 * // Set server API key
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
export { EmblaSession, EmblaSessionState } from "./session.js";
export { EmblaSessionConfig } from "./config.js";
export { EmblaAPI } from "./api.js";
export { AudioPlayer } from "./audio.js";
export { AudioRecorder } from "./recorder.js";
export { AuthenticationToken as _AuthenticationToken } from "./token.js";
export {
    GreetingsResponseMessage as _GreetingsResponseMessage,
    ASRResponseMessage as _ASRResponseMessage,
    QueryResponseMessage as _QueryResponseMessage
} from "./common.js";
// Interfaces
export { QueryResponseData } from "./common.js";
export { ASROptions, TTSOptions, QueryOptions } from './messages.js';
// Constants
export { SOFTWARE_VERSION as EmblaCoreVersion } from "./common.js";
