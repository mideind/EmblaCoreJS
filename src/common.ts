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
export const supportedSpeechSynthesisVoices = [
    "Guðrún",
    "Gunnar",
];

/** Options for the ASR service. */
export interface ASROptions {
    engine?: string,
    language?: string
}

/** Options for the TTS service. */
export interface TTSOptions {
    voice_id?: string,
    voice_speed?: number
}

// Responses from the server
/** @internal */
interface ResponseMessage {
    type: string,
    code: number
}
/** @internal */
export interface GreetingsResponseMessage extends ResponseMessage {
    info: object
}
/** @internal */
export interface ASRResponseMessage extends ResponseMessage {
    transcript: string,
    is_final: boolean,
    alternatives: [string]
}
/**
 * Response data from the query server.
 */
export interface QueryResponseData {
    valid: boolean,
    answer?: string,
    audio?: string,
}
/** @internal */
export interface QueryResponseMessage extends ResponseMessage {
    data: QueryResponseData
}

/**
 * Interface for audio recording class.
 */
export interface AudioRecorderInterface { }
export interface AudioRecorderStaticInterface {
    new(): AudioRecorderInterface;
    isRecording(): Promise<boolean>;
    start(dataHandler: (data: Blob) => void, errHandler: (error: string) => void): Promise<void>;
    stop(): Promise<void>;
}

/**
 * Interface for audio playing class.
 */
export interface AudioPlayerInterface {}
export interface AudioPlayerStaticInterface {
    new(): AudioPlayerInterface;
    init(): Promise<void>;
    playSessionStart(): void;
    playSessionConfirm(): void;
    playSessionCancel(): void;
    playNoMic(voiceId?: string, playbackSpeed?: number): void;
    playDunno(voiceId: string, playbackSpeed?: number): string;
    playSound(soundName: string, voiceId?: string, playbackSpeed?: number): void;
    playURL(audioURL: string, playbackSpeed?: number): void;
    stop(): void;
    speak(text: string, apiKey?: string, ttsOptions?: TTSOptions): Promise<void>;
}
