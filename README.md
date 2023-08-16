[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Language](https://img.shields.io/badge/language-javascript-yellow)]()
[![Release](https://shields.io/github/v/release/mideind/EmblaCoreJS?display_name=tag)]()
[![Build](https://github.com/mideind/EmblaCoreJS/actions/workflows/main.yml/badge.svg)]()

<img src="./img/emblacore_icon.png" align="right" width="200" height="200" style="margin-left:20px;">

# EmblaCoreJS

EmblaCoreJS is a TypeScript/JavaScript library containing the core session functionality in [Embla](https://github.com/mideind/EmblaFlutterApp), a cross-platform mobile Icelandic-language voice assistant client. EmblaCoreJS is packaged both for modern browser and React Native environments.

For the Dart/Flutter library see [EmblaCoreFlutter](https://github.com/mideind/EmblaCoreFlutter).

## Browser usage

The bundled web version of EmblaCoreJS, along with a minified version, can be found in the releases.
See the [browser example](./example/web/README.md) for example usage.

> **Important note:**
>
> Using the library requires an API key for the Ratatoskur server instance you wish to communicate with.
> To prevent the Ratatoskur API key from being sent to clients, it is recommended you set up an API endpoint which
> proxies the Ratatoskur authentication token endpoint. See endpoint documentation [here](https://api.greynir.is/docs).

### Installation

Use npm or yarn to install dependencies:

```sh
npm install
# Needed for web version
npm install recordrtc
# Needed for React Native version
npm install react-native-sound-player @dr.pogodin/react-native-audio
```

To build the project run:

```sh
npm run build
```

This compiles the code into JavaScript libraries found in `lib/web/` and `lib/react-native`.

## Documentation

Documentation can be generated by running:

```sh
npm run docs
```

Documentation is then found in `docs/` (open `docs/index.html` in a browser).

## Testing

Tests can be run with:

```bash
npm run test
```

## Example usage

Examples can be found in the directories `example/web` and `example/react-native`.

Information on running them is found in the corresponding `README.md` files.

## License

EmblaCoreJS is Copyright &copy; 2023 [Miðeind ehf.](https://mideind.is)

<a href="https://mideind.is"><img src="./img/mideind_logo.png" alt="Miðeind ehf."
width="214" height="66" align="right" style="margin-left:20px; margin-bottom: 20px;"></a>

This set of programs is free software: you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the Free
Software Foundation, either version 3 of the License, or (at your option) any later
version.

This set of programs is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
A PARTICULAR PURPOSE. See the GNU General Public License for more details.

<a href="https://www.gnu.org/licenses/gpl-3.0.html"><img src="./img/GPLv3.png"
align="right" style="margin-left:15px;" width="180" height="60"></a>

The full text of the GNU General Public License v3 is
[included here](./LICENSE)
and also available here:
[https://www.gnu.org/licenses/gpl-3.0.html](https://www.gnu.org/licenses/gpl-3.0.html).

If you wish to use this set of programs in ways that are not covered under the
GNU GPLv3 license, please contact us at [mideind@mideind.is](mailto:mideind@mideind.is)
to negotiate a custom license. This applies for instance if you want to include or use
this software, in part or in full, in other software that is not licensed under
GNU GPLv3 or other compatible licenses.

## Attributions

EmblaCoreJS bundles the following libraries:

-   [RecordRTC](http://recordrtc.org/), Copyright &copy; [Muaz Khan](https://github.com/muaz-khan).

The following libraries are peer dependencies (not included when bundled):

-   [react-native-sound-player](https://github.com/johnsonsu/react-native-sound-player), Copyright &copy; [Johnson Su](https://github.com/johnsonsu).
-   [@dr.pogodin/react-native-audio](https://github.com/birdofpreyru/react-native-audio), Copyright &copy; [Dr. Sergey Pogodin](https://dr.pogodin.studio)
