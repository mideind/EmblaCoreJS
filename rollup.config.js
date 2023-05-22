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
            format: "umd",
        },
        {
            file: "lib/emblacore.min.js",
            name: "EmblaCore",
            format: "umd",
            plugins: [terser()],
        },
    ],
    plugins: [json(), nodeResolve({ browser: true }), typescript()],
};
