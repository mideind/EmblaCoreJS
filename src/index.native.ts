// Classes
export { EmblaSessionConfig } from "./config";
export { EmblaAPI } from "./api";
export { AuthenticationToken } from "./token";

// React Native specific classes
import { RNAudioPlayer } from "./audio.native";
import { RNAudioRecorder } from "./recorder.native";
import { EmblaSession, EmblaSessionState } from "./session";

// Attach audio classes for React Native
EmblaSession._attachAudioClasses(RNAudioRecorder, RNAudioPlayer);
export { EmblaSessionState, EmblaSession, RNAudioRecorder, RNAudioPlayer };

// Interfaces
export type { QueryOptions, GreetingsOutputMessage } from "./messages";
export type {
    AudioRecorder,
    AudioPlayer,
    ASROptions,
    TTSOptions,
    GreetingsResponseMessage,
    ASRResponseMessage,
    QueryResponseMessage,
    QueryResponseData,
} from "./common";
// Constants
export { SOFTWARE_VERSION as EmblaCoreVersion } from "./common";
