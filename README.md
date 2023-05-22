# EmblaCoreJS

EmblaCore is a TypeScript/JavaScipt library containing the core session functionality in Embla, a cross-platform mobile Icelandic-language voice assistant client.

## Installation

Use yarn to install dependencies.

```sh
yarn install
```

To build and bundle the project run:

```sh
npm run build
```

This compiles the TypeScript code into JavaScript libraries found in `lib/`, named `lib/emblacore.js` and `lib/emblacore.min.js`.

## Testing

Tests can be run with:

```sh
npm run test
```

## Documentation

Documentation can be generated with:

```sh
npm run doc
```

The HTML files can then be found in the `lib/doc/` directory.

## Example

Example usages can be found in the `examples/` directory (currently only contains an example of usage in a browser environment).

### Browser example

To test the library in a browser environment navigate to the `examples/browser/` directory and run the following command (requires Python 3):

```sh
python3 -m http.server --bind 127.0.0.1 8000
```

Open the following URL in the browser: `http://localhost:8000/client.html`.
Note that running the example requires an API key for the server EmblaCore is configured to communicate with (modify the `API_KEY` constant in `client.html`).
