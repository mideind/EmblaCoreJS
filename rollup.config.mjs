import json from "@rollup/plugin-json";
import typescript from "rollup-plugin-typescript2";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import license from "rollup-plugin-license";
import { dts } from "rollup-plugin-dts";
import commonjs from "@rollup/plugin-commonjs";

const NAME = "EmblaCore";

const WEB_ENTRY = "src/index.web.ts";
const RN_ENTRY = "src/index.native.ts";

const WEB_OUT_DIR = "lib/web";
const RN_OUT_DIR = "lib/react-native";

export default [
    {
        // Web version
        input: WEB_ENTRY,
        output: [
            {
                file: `${WEB_OUT_DIR}/embla-core.js`,
                name: NAME,
                format: "es",
            },
            {
                file: `${WEB_OUT_DIR}/embla-core.min.js`,
                name: NAME,
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
            // Compile from TypeScript
            typescript({ tsconfig: "tsconfig.web.json" }),
            // Allow importing constants from package.json
            json(),
            // Include dependencies in output
            nodeResolve(),
            // Convert CommonJS dependency code to ES modules, so they can be bundled as ES module
            commonjs(),
            // Prepend license banner to output file
            license({
                banner: {
                    commentStyle: "ignored",
                    content: { file: "BANNER.txt" },
                },
            }),
        ],
    },
    {
        // React Native version
        input: RN_ENTRY,
        external: [
            "react",
            "react-native",
            "react-native-sound-player",
            "@dr.pogodin/react-native-audio",
        ],
        output: [
            {
                file: `${RN_OUT_DIR}/embla-core.js`,
                name: NAME,
                format: "es",
            },
            {
                file: `${RN_OUT_DIR}/embla-core.min.js`,
                name: NAME,
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
            typescript({ tsconfig: "tsconfig.react-native.json" }),
            // Allow importing constants from package.json
            json(),
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
    },
    {
        // Declaration files
        input: `${RN_OUT_DIR}/src/index.native.d.ts`,
        output: [{ file: "lib/types/embla-core.d.ts", format: "es" }],
        plugins: [dts()],
    },
];
