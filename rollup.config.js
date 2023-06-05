import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import license from "rollup-plugin-license";
import commonjs from "@rollup/plugin-commonjs";

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
            plugins: [
                // Minify code
                terser({
                    ecma: "2016",
                    module: true,
                    format: { comments: false },
                }),
                // Prepend license banner
                license({
                    banner: {
                        commentStyle: "ignored",
                        content: { file: "BANNER.txt" },
                    },
                }),
            ],
        },
    ],
    plugins: [
        // Compile from typescript
        typescript(),
        // Allow importing constants from package.json
        json(),
        // Locate dependencies in node_modules
        nodeResolve(),
        // Convert CommonJS modules to ES modules, so they can be bundled
        commonjs(),
        // Prepend license banner to output file
        license({
            banner: {
                commentStyle: "ignored",
                content: { file: "BANNER.txt" },
            },
        }),
    ],
};
