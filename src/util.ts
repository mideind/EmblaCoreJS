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
 * ASCII-fy a string, turning Icelandic characters into ASCII.
 * @param {string} s String to ASCII-fy.
 * @returns ASCII-fied string with no special Icelandic characters
 * specific to Icelandic.
 */
export function asciify(s: string) {
    const icechar2ascii = {
        "ð": "d",
        "Ð": "D",
        "á": "a",
        "Á": "A",
        "ú": "u",
        "Ú": "U",
        "í": "i",
        "Í": "I",
        "é": "e",
        "É": "E",
        "þ": "th",
        "Þ": "TH",
        "ó": "o",
        "Ó": "O",
        "ý": "y",
        "Ý": "Y",
        "ö": "o",
        "Ö": "O",
        "æ": "ae",
        "Æ": "AE",
    };
    for (const [key, value] of Object.entries(icechar2ascii)) {
        s = s.replaceAll(key, value);
    }
    return s;
}

/**
 * Capitalize the first character of a string, leaving the rest unchanged.
 * @param {string} s String to capitalize first character of.
 * @returns String with first character capitalized.
 */
export function capFirst(s: string): string {
    return s[0].toUpperCase() + s.substring(1);
}