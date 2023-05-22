
/**
 * ASCII-fy a string, turning Icelandic characters into ASCII.
 * @param s String to ASCII-fy.
 * @returns ASCII-fied string with no characters
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
