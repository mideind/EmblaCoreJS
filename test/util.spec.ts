import { assert } from "chai";
import { asciify } from "../src/util.js";

describe("Util tests", function () {
    it("asciify should turn Guðrún into Gudrun", function () {
        const result = asciify("Guðrún");
        assert.equal(result, "Gudrun");
    });
});