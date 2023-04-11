import { assert } from "chai";
import { AuthenticationToken } from "../src/token.js";

describe("AuthenticationToken tests", () => {
   it("should parse JSON correctly (expired timestamp)", () => {
      let expired = "2023-04-27T14:05:30.428692";
      const result = AuthenticationToken.fromJson(
         JSON.stringify({
            "token": "hello",
            "expires_at": expired
         })
      )
      const expected = new AuthenticationToken(
         "hello",
         new Date(expired)
      );
      assert.equal(result.tokenString, expected.tokenString);
      assert.equal(result.expiresAt.valueOf(), expected.expiresAt.valueOf());
      assert.equal(result.isExpired(), expected.isExpired());
      assert.equal(result.toString(), expected.toString());
   });
   it("should parse JSON correctly (non-expired timestamp)", () => {
      let nonexpired = "4050-04-27T14:05:30.428692";
      const result = AuthenticationToken.fromJson(
         JSON.stringify({
            "token": "hello",
            "expires_at": nonexpired
         })
      )
      const expected = new AuthenticationToken(
         "hello",
         new Date(nonexpired)
      );
      assert.equal(result.tokenString, expected.tokenString);
      assert.equal(result.expiresAt.valueOf(), expected.expiresAt.valueOf());
      assert.equal(result.isExpired(), expected.isExpired());
      assert.equal(result.toString(), expected.toString());
   });
   // TODO: Test isExpired w.r.t. expiration within thirty seconds
});