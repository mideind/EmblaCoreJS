import type { AudioRecorder } from "./common";
import {
    AUDIO_FORMATS,
    AUDIO_SOURCES,
    CHANNEL_CONFIGS,
    InputAudioStream,
} from "@dr.pogodin/react-native-audio";

const SAMPLE_RATE = 16000;
const CHUNK_SIZE = 4096;

export class RNAudioRecorder implements AudioRecorder {
    private stream?: InputAudioStream = undefined;

    async isRecording(): Promise<boolean> {
        return this.stream !== undefined && this.stream.active;
    }

    async start(
        dataHandler: (
            data: Blob | ArrayBuffer | Uint16Array | DataView
        ) => void,
        errHandler: (error: string) => void
    ): Promise<void> {
        if (this.stream !== undefined) {
            return;
        }
        this.stream = new InputAudioStream(
            AUDIO_SOURCES.MIC,
            SAMPLE_RATE,
            CHANNEL_CONFIGS.MONO,
            AUDIO_FORMATS.PCM_16BIT,
            CHUNK_SIZE
        );
        this.stream.addErrorListener((error: Error) => {
            errHandler(error.message);
        });
        this.stream.addChunkListener((chunk: Buffer, _chunkId: number) => {
            dataHandler(chunk);
        });

        this.stream.start();
    }

    async stop(): Promise<void> {
        await this.stream?.destroy();
        this.stream = undefined;
    }
}
