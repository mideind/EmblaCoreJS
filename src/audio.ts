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
