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

import pkg from "../package.json";

// Software
export const SOFTWARE_NAME = pkg.name;
export const SOFTWARE_VERSION = pkg.version;
export const SOFTWARE_AUTHOR = pkg.author;
export const SOFTWARE_LICENSE = pkg.license;

// Speech recognition settings
export const speechToTextLanguage = "is-IS";

// Audio recording settings
export const audioSampleRate = 16000;
export const audioBitRate = 16;
export const audioNumChannels = 1;

// Server communication
export const defaultServer = "https://api.greynir.is";
export const tokenEndpoint = "/rat/v1/token";
export const socketEndpoint = "/rat/v1/short_asr";
export const speechSynthesisEndpoint = "/rat/v1/tts";
export const clearHistoryEndpoint = "/rat/v1/clear_history";
export const defaultQueryServer = "https://greynir.is";

export const requestTimeout = 10e3; // 10 seconds in milliseconds

export const WAVHeaderLength = 44;

// Speech synthesis
export const defaultSpeechSynthesisSpeed = 1.0;
export const defaultSpeechSynthesisVoice = "Guðrún";
export const supportedSpeechSynthesisVoices = ["Guðrún", "Gunnar"];

/** Options for the ASR service. */
export interface ASROptions {
    engine?: string;
    language?: string;
}

/** Options for the TTS service. */
export interface TTSOptions {
    voice_id?: string;
    voice_speed?: number;
}

// Responses from the server
/** @internal */
interface ResponseMessage {
    type: string;
    code: number;
}
/** @internal */
export interface GreetingsResponseMessage extends ResponseMessage {
    info: object;
}
/** @internal */
export interface ASRResponseMessage extends ResponseMessage {
    transcript: string;
    is_final: boolean;
    alternatives: [string];
}
/**
 * Response data from the query server.
 */
export interface QueryResponseData {
    valid: boolean;
    answer?: string;
    audio?: string;
}
/** @internal */
export interface QueryResponseMessage extends ResponseMessage {
    data: QueryResponseData;
}

/**
 * Interface for audio recording class.
 */
export interface AudioRecorder {
    isRecording(): Promise<boolean>;
    start(
        dataHandler: (
            data: Blob | ArrayBuffer | Uint16Array | DataView
        ) => void,
        errHandler: (error: string) => void
    ): Promise<void>;
    stop(): Promise<void>;
}

/**
 * Interface for audio playing class.
 */
export interface AudioPlayer {
    /**
     * Pre-fetch audio assets.
     * @async
     */
    init(): Promise<void>;
    playSessionStart(): void;
    playSessionConfirm(): void;
    playSessionCancel(): void;
    playNoMic(voiceId?: string, playbackSpeed?: number): void;
    playDunno(voiceId: string, playbackSpeed?: number): string;
    /**
     * Play a specific sound. Some sounds are dependent on TTS settings.
     * @param {string} soundName Name of sound to play.
     * @param {string?} voiceId Selected TTS voice (if applicable).
     * @param {number?} playbackSpeed Selected TTS speed.
     */
    playSound(
        soundName: string,
        voiceId?: string,
        playbackSpeed?: number
    ): void;
    /**
     * Play sound fetched from a URL.
     * @param {string} audioURL URL to audio file for playing.
     * @param {number?} playbackSpeed Playback speed/rate.
     */
    playURL(audioURL: string, playbackSpeed?: number): void;
    /**
     * Stop playing sound.
     */
    stop(): void;
    /**
     * Request speech synthesis of the given text. Returns audio URL.
     * @async
     * @param {string} text Text to speech synthesize.
     * @param {string?} apiKey Server API key.
     * @param {TTSOptions?} ttsOptions Options for speech synthesis (Voice ID and speed).
     * @throws {Error} If TTS service returned no audio.
     * @returns URL to speech synthesized audio file.
     */
    speak(
        text: string,
        apiKey?: string,
        ttsOptions?: TTSOptions
    ): Promise<void>;
}
