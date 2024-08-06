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

import { asciify, capFirst } from "../util";

describe("Util tests", () => {
    it("asciify should turn Guðrún into Gudrun", () => {
        const result = asciify("Guðrún");
        expect(result).toEqual("Gudrun");
        expect(asciify("ð Ð á Á ú Ú í Í é É þ Þ ó Ó ý Ý ö Ö æ Æ")).toEqual(
            "d D a A u U i I e E th TH o O y Y o O ae AE"
        );
    });
    it("should capitalize first letter", () => {
        expect(capFirst("abcd")).toEqual("Abcd");
        expect(capFirst("")).toEqual("");
        expect(capFirst("g")).toEqual("G");
        expect(capFirst("12")).toEqual("12");
    });
});
