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

// @ts-ignore // Ignore missing spec file for RecordRTC
import RecordRTC from "recordrtc";
import {
    type AudioRecorder,
    WAVHeaderLength,
    audioBitRate,
    audioNumChannels,
    audioSampleRate,
} from "./common";

const audioConstraints: MediaTrackConstraints = {
    sampleRate: audioSampleRate,
    sampleSize: audioBitRate,
    channelCount: audioNumChannels,
    echoCancellation: true,
    autoGainControl: true, // not supported on Safari, desktop and mobile
    noiseSuppression: true, // not supported on Safari, desktop and mobile
    // TODO: does the following change anything?
    // latency: 0
};
const mediaConstraints: MediaStreamConstraints = { audio: audioConstraints };
// RecorderRTC configuration
const mediaRecorderConfig = {
    type: "audio",
    recorderType: RecordRTC.StereoAudioRecorder,
    mimeType: "audio/wav",
    desiredSampRate: audioConstraints.sampleRate
        ? Number(audioConstraints.sampleRate)
        : undefined,
    disableLogs: true,
    timeSlice: 100 /* ms */,
    numberOfAudioChannels: 1,
    ondataavailable: undefined as any /* Hack so tsc doesn't complain */,
};

/**
 * @summary Class for handling microphone recording & streaming.
 */
export class WebAudioRecorder implements AudioRecorder {
    private _micRecorder?: RecordRTC.RecordRTCPromisesHandler = undefined;
    private _stream?: MediaStream = undefined;

    /**
     * Returns true if microphone input is currently being recorded.
     * @async
     * @returns true if currently recording microphone input.
     */
    async isRecording(): Promise<boolean> {
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
    async start(
        dataHandler: (data: Blob) => void,
        errHandler: (error: string) => void
    ): Promise<void> {
        if (await this.isRecording()) {
            errHandler("Already recording.");
            return;
        }
        try {
            this._stream = await navigator.mediaDevices.getUserMedia(
                mediaConstraints
            );
            // Copy media recorder config
            const options = { ...mediaRecorderConfig };
            // Connect dataHandler function
            options.ondataavailable = (data: Blob) => {
                // Skip WAV header (RecordRTC prepends a WAV header to each blob)
                dataHandler(data.slice(WAVHeaderLength));
            };
            this._micRecorder = new RecordRTC.RecordRTCPromisesHandler(
                this._stream,
                options
            );
            // Start recording
            this._micRecorder.startRecording();
        } catch (e: any) {
            errHandler(e.toString());
        }
    }

    /**
     * Stop recording microphone audio.
     * @async
     */
    async stop(): Promise<void> {
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
