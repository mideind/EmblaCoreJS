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
    // private _audioUrl = "https://embla.is/"
    /**
     * Initialize audio assets.
     * @async
     */
    static async init() {
        // TODO
    }
    /**
     * Play sound signifying session start.
     * @async
     */
    static async playSessionStart() {
        // TODO
    }
    /**
     * Play sound signifying session confirmation.
     * @async
     */
    static async playSessionConfirm() {
        // TODO
    }
    /**
     * Play sound signifying session cancellation.
     * @async
     */
    static async playSessionCancel() {
        // TODO
    }
    /**
     * Play sound signifying no microphone permissions.
     * @async
     */
    static async playNoMic(voiceId?: string) {
        // TODO
        console.log(voiceId);
    }
    /**
     * Play a specific sound. Some sounds are dependent on TTS settings.
     * @async
     * @param soundName Name of sound to play.
     * @param voiceId Selected TTS voice (if applicable).
     * @param playbackSpeed Selected TTS speed (if applicable).
     */
    static async playSound(soundName: string, voiceId?: string, playbackSpeed?: number) {
        // TODO
        console.log(soundName);
        console.log(voiceId);
        console.log(playbackSpeed);
    }
    /**
     * Play a random sound signifying that the query couldn't be answered.
     * @async
     * @param voiceId Selected TTS voice (if applicable).
     * @param playbackSpeed Selected TTS speed (if applicable).
     * @returns The text that was read (for displaying in UI).
     */
    static async playDunno(voiceId: string, playbackSpeed: number): Promise<string> {
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
        // TODO
        console.log(audioUrl);
    }
    /**
     * Stop playing sounds.
     */
    static stop() {
        // TODO
        console.log("stopping audio player");
    }
}
