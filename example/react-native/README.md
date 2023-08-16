# React Native example

Create the file `.env` with the following variables set:
```
RATATOSKUR_API_KEY="<your-api-key-here>"
RATATOSKUR_SERVER_URL="<your-Ratatoskur-server-URL>"
```

Run the example with:

```sh
npx react-native start
```

and in another terminal (in the same directory):

```sh
npx react-native run-android
```

> Note: Some libraries used are Turbo Modules,
> so the new architecture must be enabled ([see steps to enable it here](https://reactnative.dev/blog/2022/03/15/an-update-on-the-new-architecture-rollout#the-new-architecture-template)).

See usage of library in [App.tsx](./src/App.tsx).
