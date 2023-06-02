import { asciify } from "../src/util";

describe("Util tests", () => {
    test("asciify should turn Guðrún into Gudrun", () => {
        const result = asciify("Guðrún");
        expect(result).toEqual("Gudrun");
    });
});