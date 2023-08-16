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

import { EmblaAPI } from "./api";
import {
    type AudioPlayer,
    defaultSpeechSynthesisVoice,
    type TTSOptions,
} from "./common";
import { asciify } from "./util";

/**
 * Class containing methods for playing audio and TTS.
 */
export class WebAudioPlayer implements AudioPlayer {
    private _currAudio?: HTMLAudioElement;
    private _audioQueue: HTMLAudioElement[] = [];
    private _fileExtension = "mp3";
    private _audioURL = "https://embla.is/assets/audio";

    /**
     * Pre-fetch audio assets.
     * (Note: does nothing as of now.)
     * @async
     */
    async init() {
        // const fileNames = [
        //     "conn-gudrun",
        //     "conn-gunnar",
        //     "dunno01-gudrun",
        //     "dunno01-gunnar",
        //     "dunno02-gudrun",
        //     "dunno02-gunnar",
        //     "dunno03-gudrun",
        //     "dunno03-gunnar",
        //     "dunno04-gudrun",
        //     "dunno04-gunnar",
        //     "dunno05-gudrun",
        //     "dunno05-gunnar",
        //     "dunno06-gudrun",
        //     "dunno06-gunnar",
        //     "dunno07-gudrun",
        //     "dunno07-gunnar",
        //     "err-gudrun",
        //     "err-gunnar",
        //     "mynameis-gudrun",
        //     "mynameis-gunnar",
        //     "nomic-gudrun",
        //     "nomic-gunnar",
        //     "rec_begin",
        //     "rec_cancel",
        //     "rec_confirm",
        //     "voicespeed-gudrun",
        //     "voicespeed-gunnar"
        // ];
    }

    /**
     * Play sound signifying session start.
     */
    playSessionStart() {
        this.playSound("rec_begin");
    }

    /**
     * Play sound signifying session confirmation.
     */
    playSessionConfirm() {
        this.playSound("rec_confirm");
    }

    /**
     * Play sound signifying session cancellation.
     * Stops any currently playing sounds.
     */
    playSessionCancel() {
        this.stop();
        this.playSound("rec_cancel");
    }

    /**
     * Play sound signifying no microphone permissions.
     * @param {string} voiceId Selected TTS voice.
     * @param {number?} playbackSpeed Selected TTS speed.
     */
    playNoMic(voiceId?: string, playbackSpeed?: number) {
        this.playSound(
            "nomic",
            voiceId ?? defaultSpeechSynthesisVoice,
            playbackSpeed
        );
    }

    /**
     * Play a random sound signifying that the query couldn't be answered.
     * @param {string} voiceId Selected TTS voice.
     * @param {number?} playbackSpeed Selected TTS speed.
     * @returns The text that was read (for displaying in UI).
     */
    playDunno(voiceId: string, playbackSpeed?: number): string {
        const dunnoStrings: { [key: string]: string } = {
            dunno01: "Ég get ekki svarað því.",
            dunno02: "Ég get því miður ekki svarað því.",
            dunno03: "Ég kann ekki svar við því.",
            dunno04: "Ég skil ekki þessa fyrirspurn.",
            dunno05: "Ég veit það ekki.",
            dunno06: "Því miður skildi ég þetta ekki.",
            dunno07: "Því miður veit ég það ekki.",
        };
        const keys = Object.keys(dunnoStrings);
        const randomKey = keys[Math.floor(keys.length * Math.random())]!;
        this.playSound(randomKey, voiceId, playbackSpeed);
        return dunnoStrings[randomKey]!;
    }

    /**
     * Play a specific sound. Some sounds are dependent on TTS settings.
     * @param {string} soundName Name of sound to play.
     * @param {string?} voiceId Selected TTS voice (if applicable).
     * @param {number?} playbackSpeed Selected TTS speed.
     */
    playSound(soundName: string, voiceId?: string, playbackSpeed?: number) {
        let url = `${this._audioURL}/${soundName}`;
        if (voiceId !== undefined) {
            // If TTS voice is specified, asciify and lowercase before adding to URL
            url += `-${asciify(voiceId.toLowerCase())}`;
        }
        url += `.${this._fileExtension}`;
        this.playURL(url, playbackSpeed);
    }

    /**
     * Play sound fetched from a URL.
     * @param {string} audioURL URL to audio file for playing.
     * @param {number?} playbackSpeed Playback speed/rate.
     */
    playURL(audioURL: string, playbackSpeed?: number) {
        this._playAudio(audioURL, playbackSpeed);
    }

    /**
     * Stop playing sound.
     */
    stop() {
        if (this._currAudio !== undefined) {
            this._currAudio.pause();
        }
        this._currAudio = undefined;
        this._audioQueue = [];
    }

    /**
     * Request speech synthesis of the given text. Returns audio URL.
     * @async
     * @param {string} text Text to speech synthesize.
     * @param {string?} apiKey Server API key.
     * @param {TTSOptions?} ttsOptions Options for speech synthesis (Voice ID and speed).
     * @throws {Error} If TTS service returned no audio.
     * @returns URL to speech synthesized audio file.
     */
    async speak(text: string, apiKey?: string, ttsOptions?: TTSOptions) {
        const audioURL = await EmblaAPI.synthesize(text, apiKey, ttsOptions);
        if (audioURL === undefined) {
            throw new Error("Error during speech synthesis");
        }
        this._playAudio(audioURL);
    }

    /**
     * Play HTMLAudioElement and wait for it to finish (or be paused).
     * @param {string} audioURL URL to audio file for playing.
     * @param {number?} playbackSpeed Playback speed/rate, default is 1.
     */
    private _playAudio(audioURL: string, playbackSpeed?: number) {
        const audio = new Audio(audioURL);
        audio.playbackRate = playbackSpeed ?? 1;
        this._audioQueue.push(audio);

        this._playAudioQueue();
    }

    /**
     * @internal
     */
    private _playAudioQueue() {
        if (this._currAudio === undefined) {
            // If we aren't already playing audio, get the next audio element from queue
            this._currAudio = this._audioQueue.shift();
            if (this._currAudio !== undefined) {
                // Found an audio element in the queue, start playing and
                // play the next audio in queue when this audio element finishes
                this._currAudio.onended = () => {
                    // Remove current audio to signify we aren't playing audio
                    this._currAudio = undefined;
                    this._playAudioQueue();
                };
                this._currAudio.play();
            }
        }
    }
}
