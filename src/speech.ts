
import * as common from './common.js';
import { TTSOptions } from 'messages.js';

interface TTSInput extends TTSOptions {
    apiURL: string | undefined
}

/** Speech synthesizer static class. */
export class EmblaSpeechSynthesizer {
    private constructor() { }

    /** Send request to speech synthesis API (static method). */
    static async synthesize(text: string, apiKey: string, handler: ((response: { [k: string]: any } | null) => void) | undefined, tts_options: TTSInput): Promise<void> {
        let qargs = {
            'text': text,
            'api_key': apiKey,
            'voice_id': tts_options.voice_id ?? common.defaultSpeechSynthesisVoice,
            'voice_speed': tts_options.voice_speed?.toString() ?? common.defaultSpeechSynthesisSpeed.toString(),
        };
        tts_options.apiURL = (tts_options.apiURL) ? tts_options.apiURL : `${common.defaultServer}${common.speechSynthesisEndpoint}`;
        await EmblaSpeechSynthesizer._makeRequest(tts_options.apiURL, qargs, handler);
    }

    protected static async _makeRequest(apiURL: string, qargs: { [k: string]: any }, handler: ((response: { [k: string]: any } | null) => void) | undefined): Promise<Response | null> {
        console.debug(`Sending POST request to ${apiURL}: ${qargs.toString()}`);
        let response: Response | null;
        try {
            response = await fetch(
                new URL(apiURL),
                {
                    method: "POST",
                    body: JSON.stringify(qargs),
                    signal: AbortSignal.timeout(common.requestTimeout)
                }
            );
        } catch (e) {
            // NOTE: the following cast is unsafe,
            // JS can raise other things than Errors
            let err = e as Error;
            if (err.name === "TimeoutError") {
                console.debug("Timed out while requesting speech synthesis");
            } else {
                console.debug(`Error while making POST request: ${err.name}, ${err.message}`);
            }
            response = null;
        }

        // Handle null response
        if (response === null) {
            handler!(null);
            return null;
        }

        // We have a valid response object
        console.debug(`Response status: ${response.status}`);
        console.debug(`Response body: ${response.body}`);
        if (handler != null) {
            // Parse JSON body and feed ensuing data structure to handler function
            let arg = (response.status == 200) ? await response.json() : null;
            // JSON response should be a dict, otherwise something's gone horribly wrong
            arg = typeof arg !== "object" ? null : arg;
            handler(arg);
        }

        return response;
    }
}
