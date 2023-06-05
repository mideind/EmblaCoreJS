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
 * Class containing static methods for playing audio.
 */
export class AudioPlayer {
    private static _currAudio?: HTMLAudioElement;
    private static _fileExtension = "mp3";
    // private static _audioFiles = {};
    private static _audioUrl = "https://embla.is/assets/audio";

    /**
     * Pre-fetch audio assets.
     * @async
     */
    static async init() {
        const fileNames = [
            "conn-gudrun",
            "conn-gunnar",
            "dunno01-gudrun",
            "dunno01-gunnar",
            "dunno02-gudrun",
            "dunno02-gunnar",
            "dunno03-gudrun",
            "dunno03-gunnar",
            "dunno04-gudrun",
            "dunno04-gunnar",
            "dunno05-gudrun",
            "dunno05-gunnar",
            "dunno06-gudrun",
            "dunno06-gunnar",
            "dunno07-gudrun",
            "dunno07-gunnar",
            "err-gudrun",
            "err-gunnar",
            "mynameis-gudrun",
            "mynameis-gunnar",
            "nomic-gudrun",
            "nomic-gunnar",
            "rec_begin",
            "rec_cancel",
            "rec_confirm",
            "voicespeed-gudrun",
            "voicespeed-gunnar"
        ];
        console.log(`audio fileNames: ${fileNames}`);
    }

    /**
     * Play sound signifying session start.
     * @async
     */
    static async playSessionStart() {
        this._currAudio = new Audio(`${this._audioUrl}/rec_begin.${this._fileExtension}`);
        await this._playAudio(this._currAudio);
    }

    /**
     * Play sound signifying session confirmation.
     * @async
     */
    static async playSessionConfirm() {
        this._currAudio = new Audio(`${this._audioUrl}/rec_confirm.${this._fileExtension}`);
        await this._playAudio(this._currAudio);
    }

    /**
     * Play sound signifying session cancellation.
     * @async
     */
    static async playSessionCancel() {
        this._currAudio = new Audio(`${this._audioUrl}/rec_cancel.${this._fileExtension}`);
        await this._playAudio(this._currAudio);
    }

    /**
     * Play sound signifying no microphone permissions.
     * @async
     */
    static async playNoMic(voiceId?: string) {
        this._currAudio = new Audio(`${this._audioUrl}/nomic-${voiceId ?? "gudrun"}.${this._fileExtension}`);
        await this._playAudio(this._currAudio);
    }

    /**
     * Play a specific sound. Some sounds are dependent on TTS settings.
     * @async
     * @param soundName Name of sound to play.
     * @param voiceId Selected TTS voice (if applicable).
     * @param playbackSpeed Selected TTS speed (if applicable). Defaults to 1.
     */
    static async playSound(soundName: string, voiceId?: string, playbackSpeed: number = 1) {
        this._currAudio = new Audio(`${this._audioUrl}/${soundName}-${voiceId}.${this._fileExtension}`);
        await this._playAudio(this._currAudio, playbackSpeed);
    }

    /**
     * Play a random sound signifying that the query couldn't be answered.
     * @async
     * @param voiceId Selected TTS voice.
     * @param playbackSpeed Selected TTS speed. Defaults to 1.
     * @returns The text that was read (for displaying in UI).
     */
    static async playDunno(voiceId: string, playbackSpeed: number = 1): Promise<string> {
        // TODO
        console.log(voiceId);
        console.log(playbackSpeed);
        return "dunno";
    }

    /**
     * Play sound fetched from a URL.
     * @async
     * @param audioUrl URL to audio file for playing.
     */
    static async playURL(audioUrl: string) {
        this._currAudio = new Audio(audioUrl);
        return await this._playAudio(this._currAudio);
    }

    /**
     * Stop playing sounds.
     */
    static stop() {
        console.log("STOPPING AUDIO: ", this._currAudio, "ended? ", this._currAudio?.ended);
        if (this._currAudio !== undefined) {
            this._currAudio.pause();
        }
        this._currAudio = undefined;
    }

    /**
     * Play HTMLAudioElement and wait for it to finish (or is paused).
     * @param audio HTMLAudioElement to play.
     * @param playbackSpeed Playback speed/rate, default is 1.
     */
    private static _playAudio(audio: HTMLAudioElement, playbackSpeed: number = 1) {
        return new Promise((resolve) => {
            // Promise resolves when any of the following events fire
            audio.onended = resolve;
            audio.onpause = resolve;
            // audio.onabort = resolve;
            // audio.oncancel = resolve;
            // audio.onsuspend = resolve;
            // audio.onclose = resolve;

            audio.playbackRate = playbackSpeed;
            audio.play();
        });
    }
}
