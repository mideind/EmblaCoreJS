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

import * as dotenv from "dotenv";
dotenv.config();
import { EmblaAPI } from "../api";

let it_net = (function () {
    const nt = process.env.NETWORK_TESTS;
    if (nt === "1" || nt?.toLowerCase() === "true") {
        return it;
    } else {
        return it.skip;
    }
})();

describe("EmblaAPI tests", function () {
    it("should have the correct interface", function () {
        // Static methods
        expect(EmblaAPI).toHaveProperty("synthesize");
        expect(typeof EmblaAPI.synthesize).toBe("function");
        expect(EmblaAPI).toHaveProperty("performQuery");
        expect(typeof EmblaAPI.performQuery).toBe("function");
        expect(EmblaAPI).toHaveProperty("clearUserData");
        expect(typeof EmblaAPI.performQuery).toBe("function");
    });
    //
    // If the NETWORK_TESTS env variable is set, run the following tests
    //
    it_net(
        "should not speech synthesize text (incorrect api key)",
        async function () {
            const audio_url = await EmblaAPI.synthesize(
                "Þetta er prufutexti.",
                "an incorrect API key"
            );
            expect(audio_url).toBe(undefined);
        }
    );
    it_net("should speech synthesize text", async function () {
        const audio_url = await EmblaAPI.synthesize(
            "Þetta er prufutexti.",
            process.env.X_API_KEY ?? ""
        );
        expect(typeof audio_url).toBe("string");
        expect(audio_url!.startsWith("http")).toBeTruthy();
    });
});
