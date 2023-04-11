

/** Authentication token object required to start a session. */
export class AuthenticationToken {

    constructor(
        public tokenString: string,
        public expiresAt: Date
    ) { }

    static fromJson(data: string): AuthenticationToken {
        let tokenString: string;
        let expiresAt: Date;
        try {
            let parsed = JSON.parse(data);
            tokenString = parsed["token"];
            expiresAt = new Date(parsed["expires_at"]);
        } catch (e) {
            console.debug(`Failed to parse token JSON: ${e}`);
            tokenString = "";
            expiresAt = new Date(Date.now());
        }
        return new AuthenticationToken(tokenString, expiresAt);
    }

    isExpired(): boolean {
        // If token expires in less than 30 seconds, consider it expired.
        let thirtySeconds = 30e3; // 30e3 is 30 seconds in milliseconds
        return this.expiresAt.getTime() < Date.now() - thirtySeconds;
    }

    toString(): string {
        return `AuthToken: ${this.tokenString} (expires at ${this.expiresAt})`;
    }
}