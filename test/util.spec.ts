import { assert } from "chai";
import { asciify } from "../src/util.js";

describe("Util tests", () => {
   it("asciify should turn Guðrún into Gudrun", () => {
      const result = asciify("Guðrún");
      assert.equal(result, "Gudrun");
   });
});