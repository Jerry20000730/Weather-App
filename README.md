# Weather App - Cross Platform Framework Learning Path

## Functionalities of the weather app
The function includes:
1. find the weather according to user-input zip code (US targeted)
2. display weather in two mode (fahrenheit and celcius)
3. display favorite list (a mechanism that lets you add a city as favorite)
4. add, remove favorite from favorite list

## Goal of this practice project
To understand how one code can be run on different platform (web, mobile, etc.,)

## Path

### Path 1: HTML version - README link [here](HTML-version/README.md)
HTML version focus on basic functionalities, the aim of the project is to let us get familiarize with the javascript, which will be an essential component afterwards.

### Path 2: TypeScript version - README link [here][TS-version/README.md]
TypeScript is a superset of JavaScript, by using pure TypeScript, we can build the website just like using the pure HTML, but focus on type declaring. TypeScript version require to use `npm` to download additional packages.

### Path 3: React (client) and Express (server) version - README link [here](React-client-Express-server-version/README.md)
This get us familiarize the framework react and its basic functionalities that makes the development easier than pure html. We also use Express as the backend framework for incoporating "favorite list" functionalities

### Path 4: React Native (mobile) and Express (server) version - README link [here](ReactNative-client-Express-server-version/README.md)
Now the weather app has been moved to mobile using react native - a cross platform development framework using react syntaxs and thinking mode while using it own components to build the mobile application (compared with native development, this is more convenient, require one code to run on every platform, but cannot be used for compute-intensive tasks). We still use Express as the backend server to store the favorite list.

### Path 5: React Native Only version - README link [here](ReactNative-only-version/README.md)
Now what we do is to use two special functionalities in expo ([https://expo.dev/](https://expo.dev/)) to rebuild the mobile platform app, one is navigation system, the other is storage system (so we do not need to build backend server while directly saving the data on local storage system). This app also starts to build support for night mode that change the color under different color schemes.