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
const icechar2ascii: { [key: string]: string } = {
    ð: "d",
    Ð: "D",
    á: "a",
    Á: "A",
    ú: "u",
    Ú: "U",
    í: "i",
    Í: "I",
    é: "e",
    É: "E",
    þ: "th",
    Þ: "TH",
    ó: "o",
    Ó: "O",
    ý: "y",
    Ý: "Y",
    ö: "o",
    Ö: "O",
    æ: "ae",
    Æ: "AE",
};
/**
 * ASCII-fy a string, turning Icelandic characters into ASCII.
 * @internal
 * @param {string} s String to ASCII-fy.
 * @returns ASCII-fied string with no special Icelandic characters.
 */
export function asciify(s: string) {
    let out = "";
    for (const letter of s) {
        if (letter.charCodeAt(0) < 128) {
            out += letter;
        } else if (letter in icechar2ascii) {
            out += icechar2ascii[letter]!;
        }
        // Ignore non-ascii and non-Icelandic letters
    }
    return out;
}

/**
 * Capitalize the first character of a string, leaving the rest unchanged.
 * @internal
 * @param {string} s String to capitalize first character of.
 * @returns String with first character capitalized.
 */
export function capFirst(s: string): string {
    return s.substring(0, 1).toUpperCase() + s.substring(1);
}

/**
 * Call fetch() with timeout.
 * @param url JSON endpoint URL.
 * @param options Options passed to fetch.
 * @param timeout How many milliseconds to wait before cancelling the request.
 * @returns JSON body of response or undefined if an error occurs.
 */
export async function fetchWithTimeout(
    url: string,
    options?: RequestInit,
    timeout?: number
) {
    let controller = new AbortController();
    setTimeout(() => controller.abort(), timeout);

    let headers = {
        ...options?.headers,
        "Content-Type": "application/json",
        "Accept": "application/json",
    };
    let realOptions = {
        ...options,
        headers: headers,
        signal: controller.signal,
    };

    try {
        const response = await fetch(url, realOptions);
        if (response.status < 200 || response.status >= 300) {
            return undefined;
        }
        // Parse JSON body and return
        return await response.json();
    } catch (e) {
        // NOTE: the following cast is unsafe,
        // JS can raise other things than Errors
        const err = e as Error;
        if (err.name === "AbortError") {
            console.debug("Timed out while making POST request");
        } else {
            console.debug(
                `Error during POST request: ${err.name}, ${err.message}`
            );
        }
        return undefined;
    }
}
