// @ts-ignore // Ignore missing spec file for RecordRTC
import RecordRTC = require("recordrtc"); // This is a CommonJS library, not an ES6 module
import { audioBitRate, audioNumChannels, audioSampleRate } from "./common.js";

const audioConstraints: MediaTrackConstraints = {
    sampleRate: audioSampleRate,
    sampleSize: audioBitRate,
    channelCount: audioNumChannels,
    echoCancellation: true,
    autoGainControl: true, // not supported on Safari, desktop and mobile
    noiseSuppression: true, // not supported on Safari, desktop and mobile
    // TODO: does the following change anything?
    // latency: 0
}
const mediaConstraints: MediaStreamConstraints = { audio: audioConstraints };
// RecorderRTC configuration
const mediaRecorderConfig = {
    type: "audio",
    recorderType: RecordRTC.StereoAudioRecorder,
    mimeType: "audio/pcm",
    desiredSampRate: audioConstraints.sampleRate ? Number(audioConstraints.sampleRate) : undefined,
    disableLogs: true,
    timeSlice: 100, /* ms */
    numberOfAudioChannels: 1,
    ondataavailable: undefined as any, /* Hack so tsc doesn't complain */
};

/**
 * Class for handling microphone recording & streaming.
 */
export class AudioRecorder {
    private static _micRecorder?: RecordRTC.RecordRTCPromisesHandler = undefined;
    private static _stream?: MediaStream = undefined;
    private constructor() { }

    /**
     * Returns true if microphone input is currently being recorded.
     * @async
     * @returns true if currently recording microphone input.
     */
    static async isRecording(): Promise<boolean> {
        if (this._micRecorder) {
            return (await this._micRecorder.getState()) === "recording";
        }
        return false;
    }

    /**
     * Start recording microphone input.
     * @async
     * @param dataHandler Callback handler for handling audio input chunks.
     * @param errHandler Callback handler for handling errors during recording.
     */
    static async start(dataHandler: (data: Blob) => void, errHandler: (error: string) => void): Promise<void> {
        if (await this.isRecording()) {
            errHandler("Already recording.");
            return;
        }
        try {
            this._stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
            // Copy media recorder config
            const options = { ...mediaRecorderConfig };
            // Connect dataHandler function
            options.ondataavailable = dataHandler;
            this._micRecorder = new RecordRTC.RecordRTCPromisesHandler(this._stream, options);
            // Start recording
            this._micRecorder.startRecording();
        } catch (e: any) {
            console.error(e);
            errHandler(e.toString());
        }
    }

    /**
     * Stop recording microphone audio.
     * @async
     */
    static async stop(): Promise<void> {
        if (this._stream) {
            this._stream.getTracks().forEach((track) => track.stop());
            this._stream = undefined;
        }
        if (this._micRecorder) {
            await this._micRecorder.stopRecording();
            await this._micRecorder.reset();
            await this._micRecorder.destroy();
            this._micRecorder = undefined;
        }
    }
}