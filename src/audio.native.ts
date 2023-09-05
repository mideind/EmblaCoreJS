import type {
    AudioPlayer,
    SpeechOptions,
    TranscriptionOptions,
} from "./common";
import { EmblaAPI } from "./api";
import { asciify } from "./util";
import SoundPlayer from "react-native-sound-player";

// TODO: Playback speed
// TODO: Load and bundle audio assets

// const AUDIO_FILES = [
//     // Voice-independent
//     "../../assets/audio/rec_begin.wav",
//     "../../assets/audio/rec_cancel.wav",
//     "../../assets/audio/rec_confirm.wav",
//     // Voice dependent
//     "../../assets/audio/conn-gudrun.wav",
//     "../../assets/audio/conn-gunnar.wav",
//     "../../assets/audio/err-gudrun.wav",
//     "../../assets/audio/err-gunnar.wav",
//     "../../assets/audio/mynameis-gudrun.wav",
//     "../../assets/audio/mynameis-gunnar.wav",
//     "../../assets/audio/voicespeed-gudrun.wav",
//     "../../assets/audio/voicespeed-gunnar.wav",
//     "../../assets/audio/nomic-gudrun.wav",
//     "../../assets/audio/nomic-gunnar.wav",
//     "../../assets/audio/dunno01-gudrun.wav",
//     "../../assets/audio/dunno02-gudrun.wav",
//     "../../assets/audio/dunno03-gudrun.wav",
//     "../../assets/audio/dunno04-gudrun.wav",
//     "../../assets/audio/dunno05-gudrun.wav",
//     "../../assets/audio/dunno06-gudrun.wav",
//     "../../assets/audio/dunno07-gudrun.wav",
//     "../../assets/audio/dunno01-gunnar.wav",
//     "../../assets/audio/dunno02-gunnar.wav",
//     "../../assets/audio/dunno03-gunnar.wav",
//     "../../assets/audio/dunno04-gunnar.wav",
//     "../../assets/audio/dunno05-gunnar.wav",
//     "../../assets/audio/dunno06-gunnar.wav",
//     "../../assets/audio/dunno07-gunnar.wav",
// ];
const DUNNO_STRINGS: { [key: string]: string } = {
    dunno01: "Ég get ekki svarað því.",
    dunno02: "Ég get því miður ekki svarað því.",
    dunno03: "Ég kann ekki svar við því.",
    dunno04: "Ég skil ekki þessa fyrirspurn.",
    dunno05: "Ég veit það ekki.",
    dunno06: "Því miður skildi ég þetta ekki.",
    dunno07: "Því miður veit ég það ekki.",
};

export class RNAudioPlayer implements AudioPlayer {
    private _fileExt = "mp3";
    private _audioURL = "https://embla.is/assets/audio";
    async init(): Promise<void> {
        // AUDIO_FILES.forEach((name) => {
        //     console.log(name);
        //     // SoundPlayer.loadSoundFile(name, AUDIO_EXTENSION);
        // });
    }

    playSessionStart(): void {
        this._playFile("rec_begin");
    }

    playSessionConfirm(): void {
        this._playFile("rec_confirm");
    }

    playSessionCancel(): void {
        this._playFile("rec_cancel");
    }

    playNoMic(
        voiceId?: string | undefined,
        _playbackSpeed?: number | undefined
    ): void {
        voiceId = voiceId ? asciify(voiceId).toLowerCase() : "gudrun";
        this._playFile(`nomic-${voiceId}`);
    }

    playDunno(voiceId: string, _playbackSpeed?: number | undefined): string {
        let i: string = (Math.floor(Math.random() * 7) + 1)
            .toString()
            .padStart(2, "0");
        let chosenDunno = `dunno${i}`;
        voiceId = voiceId ? asciify(voiceId).toLowerCase() : "gudrun";
        this._playFile(`${chosenDunno}-${voiceId}`);

        return DUNNO_STRINGS[chosenDunno] || DUNNO_STRINGS.dunno01!;
    }

    playSound(
        soundName: string,
        voiceId?: string | undefined,
        _playbackSpeed?: number | undefined
    ): void {
        let filename: string;
        if (voiceId !== undefined) {
            voiceId = voiceId ? asciify(voiceId).toLowerCase() : "gudrun";
            filename = `${soundName}-${voiceId}`;
        } else {
            filename = soundName;
        }

        this._playFile(filename);
    }

    playURL(audioURL: string, _playbackSpeed?: number | undefined): void {
        SoundPlayer.playUrl(audioURL);
    }

    stop(): void {
        SoundPlayer.stop();
    }

    async speak(
        text: string,
        apiKey?: string,
        ttsOptions?: SpeechOptions,
        transcriptionOptions?: TranscriptionOptions,
        transcribe?: boolean
    ) {
        const audioURL = await EmblaAPI.synthesize(
            text,
            apiKey,
            ttsOptions,
            transcriptionOptions,
            transcribe
        );
        if (audioURL === undefined) {
            throw new Error("Error during speech synthesis");
        }
        this.playURL(audioURL);
    }

    private _playFile(file: string) {
        SoundPlayer.playUrl(`${this._audioURL}/${file}.${this._fileExt}`);
    }
}
