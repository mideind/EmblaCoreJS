import { author, license, name, version } from "../package.json";

// Software
export const SOFTWARE_NAME = name;
export const SOFTWARE_VERSION = version;
export const SOFTWARE_AUTHOR = author;
export const SOFTWARE_LICENSE = license;

// Speech recognition settings
export const speechToTextLanguage = "is-IS";

// Audio recording settings
export const audioSampleRate = 16000;
export const audioBitRate = 16;
export const audioNumChannels = 1;

// Server communication
export const defaultServer = "https://staging.api.greynir.is";
export const tokenEndpoint = "/rat/v1/token";
export const socketEndpoint = "/rat/v1/short_asr";
export const speechSynthesisEndpoint = "/rat/v1/tts";
export const clearHistoryEndpoint = "/rat/v1/clear_history";
export const defaultQueryServer = "https://greynir.is";

export const requestTimeout = 10e3; // 10 seconds in milliseconds

// Speech synthesis
export const defaultSpeechSynthesisSpeed = 1.0;
export const defaultSpeechSynthesisVoice = "Guðrún";
export const supportedSpeechSynthesisVoices = [
    "Guðrún",
    "Gunnar",
];
