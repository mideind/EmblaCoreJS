/**
 * Class containing static methods for playing audio.
 */
export class AudioPlayer {
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
     * Play sound signifying that the query couldn't be answered.
     * @async
     */
    static async playDunno() {
        // TODO
    }
    /**
     * Play sound fetched from a URL.
     * @async
     */
    static async playURL() {
        // TODO
    }
    /**
     * Stop playing sounds.
     */
    static stop() {
        // TODO
    }
}
