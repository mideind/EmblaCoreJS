import * as dotenv from "dotenv";
dotenv.config();
import { assert, expect } from "chai";
import { EmblaSpeechSynthesizer } from "../src/speech.js";

let _run_network_tests: boolean = function () {
    const nt = process.env["NETWORK_TESTS"];
    return nt ? nt == "1" || nt.toLowerCase() == "true" : false;
}();

describe("EmblaSpeechSynthesizer tests", function () {
    it("should have the correct interface", function () {
        // Static methods
        expect(EmblaSpeechSynthesizer).to.have.property("synthesize");
        expect(EmblaSpeechSynthesizer.synthesize).to.be.a("function");
    })
    it("should not speech synthesize text (incorrect api key)", async function () {
        if (_run_network_tests) {
            // If the NETWORK_TESTS env variable is set, run this test
            const audio_url = await EmblaSpeechSynthesizer.synthesize("Þetta er prufutexti.", "an incorrect API key");
            assert.equal(audio_url, null);
        } else {
            this.skip();
        }
    })
    it("should speech synthesize text", async function () {
        if (_run_network_tests) {
            // If the NETWORK_TESTS env variable is set, run this test
            const audio_url = await EmblaSpeechSynthesizer.synthesize("Þetta er prufutexti.", process.env["X_API_KEY"] ?? "");
            assert.isString(audio_url);
            assert.isTrue(audio_url!.startsWith("http"));
        } else {
            this.skip();
        }
    })
});