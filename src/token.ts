/*
 * This file is part of the EmblaCoreJS package
 *
 * Copyright (c) 2023 Miðeind ehf. <mideind@mideind.is>
 * Original author: Logi Eyjolfsson
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Authentication token object required to start a WebSocket session.
 * @internal
 */
export class AuthenticationToken {

    /**
     * Constructor used internally. Use {@link AuthenticationToken.fromJson} instead.
     * @internal
     * @param tokenString Authentication token.
     * @param expiresAt Expiration timestamp.
     */
    constructor(
        public tokenString: string,
        public expiresAt: Date
    ) { }

    /**
     * Create an AuthenticationToken from JSON string data.
     * @param {string} data JSON string to parse.
     * @returns AuthenticationToken instance.
     */
    public static fromJson(data: string): AuthenticationToken {
        let tokenString: string;
        let expiresAt: Date;
        try {
            const parsed = JSON.parse(data);
            tokenString = parsed.token;
            expiresAt = new Date(parsed.expires_at);
        } catch (e) {
            console.debug(`Failed to parse token JSON: ${e}`);
            tokenString = "";
            expiresAt = new Date(Date.now());
        }
        return new AuthenticationToken(tokenString, expiresAt);
    }

    /**
     * Check whether token is safe to use for a new WebSocket session.
     * @returns `true` if token is expired (or almost expired), `false` otherwise
     */
    isExpired(): boolean {
        // If token expires in less than 30 seconds, consider it expired.
        const thirtySeconds = 30e3; // 30e3 is 30 seconds in milliseconds
        return this.expiresAt.getTime() < Date.now() - thirtySeconds;
    }

    toString(): string {
        return `AuthToken: ${this.tokenString} (expires at ${this.expiresAt})`;
    }
}