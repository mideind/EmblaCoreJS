import * as dotenv from "dotenv";
dotenv.config();
import { EmblaSpeechSynthesizer } from "../src/speech";

let it_net = function () {
    const nt = process.env["NETWORK_TESTS"];
    if (nt === "1" || nt?.toLowerCase() == "true") {
        return it;
    }
    else {
        return it.skip
    }
}();

describe("EmblaSpeechSynthesizer tests", function () {
    it("should have the correct interface", function () {
        // Static methods
        expect(EmblaSpeechSynthesizer).toHaveProperty("synthesize");
        expect(typeof EmblaSpeechSynthesizer.synthesize).toBe("function");
    })
    it_net("should not speech synthesize text (incorrect api key)", async function () {
        // If the NETWORK_TESTS env variable is set, run this test
        const audio_url = await EmblaSpeechSynthesizer.synthesize("Þetta er prufutexti.", "an incorrect API key");
        expect(audio_url).toEqual(null);
    })
    it_net("should speech synthesize text", async function () {
        // If the NETWORK_TESTS env variable is set, run this test
        const audio_url = await EmblaSpeechSynthesizer.synthesize("Þetta er prufutexti.", process.env["X_API_KEY"] ?? "");
        expect(audio_url).toBeInstanceOf("string");
        expect(audio_url!.startsWith("http")).toBeTruthy();
    })
});