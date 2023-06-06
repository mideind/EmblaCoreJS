/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    transform: { "^.+\\.(t|j)sx?$": "@swc/jest" },
    testEnvironment: "node",
    verbose: true,
    // This is needed to find relative imports in src/
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },
};
