import { AuthenticationToken } from "../src/token";

describe("AuthenticationToken tests", function () {
    it("should have the correct interface", function () {
        // Static methods
        expect(AuthenticationToken).toHaveProperty("fromJson");
        expect(typeof AuthenticationToken.fromJson).toBe("function");
        // Instance methods
        let instance = new AuthenticationToken("dummy", new Date());
        expect(instance).toHaveProperty("isExpired");
        expect(typeof instance.isExpired).toBe("function");
        expect(instance).toHaveProperty("toString");
        expect(typeof instance.toString).toBe("function");
    })
    it("should parse JSON correctly (expired timestamp)", function () {
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
        expect(result.tokenString).toEqual(expected.tokenString);
        expect(result.expiresAt.valueOf()).toEqual(expected.expiresAt.valueOf());
        expect(result.isExpired()).toEqual(expected.isExpired());
        expect(result.toString()).toEqual(expected.toString());
    });
    it("should parse JSON correctly (non-expired timestamp)", function () {
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
        expect(result.tokenString).toEqual(expected.tokenString);
        expect(result.expiresAt.valueOf()).toEqual(expected.expiresAt.valueOf());
        expect(result.isExpired()).toEqual(expected.isExpired());
        expect(result.toString()).toEqual(expected.toString());
    });
    // TODO: Test isExpired w.r.t. expiration within thirty seconds
});