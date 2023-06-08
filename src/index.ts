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

export { EmblaSession, EmblaSessionState } from "./session.js";
export { EmblaSessionConfig } from "./config.js";
export { EmblaSpeechSynthesizer } from "./speech.js";
export { AudioPlayer } from "./audio.js";
export { AudioRecorder } from "./recorder.js";
import {
    SOFTWARE_VERSION
} from "./common.js";
/** Current version number for EmblaCoreJS. */
export const EmblaCoreVersion = SOFTWARE_VERSION;
