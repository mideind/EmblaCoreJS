import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

export default {
    input: "src/index.ts",
    output: [
        {
            file: "lib/emblacore.js",
            name: "EmblaCore",
            format: "es",
        },
        {
            file: "lib/emblacore.min.js",
            name: "EmblaCore",
            format: "es",
            plugins: [terser()],
        },
    ],
    plugins: [
        json(),
        nodeResolve({
            browser: true,
            include: "node_modules/recordrtc/RecordRTC.min.js",
        }),
        typescript(),
    ],
};
