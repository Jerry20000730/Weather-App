# React Native-Only version

## To run the program
Go to `weather-app` and run
```shell
npm install
npm start
```

## Goal
1. Rebuild the favorites storage functionality using local storage
    1. Use `AsyncStorage` to store the favorites
    2. **You will no longer need your backend server code for favorites, as local storage will now be used**

2. Implement a global context to manage favorites state and updates across all screens

3. Add two new screens:
    1. Add a Manage Favorites screen
    2. Add an hourly forecast screen

4. Rebuild the weather app using expo navigation
    1. Use `Drawer` navigation for the main and "manage favorites" screens
    2. Use `Stack` navigation for the weather and hourly forecast screens
        1. Pressing on each day of the 3 day forecast will navigate to the hourly forecast screen
    3. Use modal navigation for the search screen rather than the `Modal` component from the prior homework

5. React to light and dark mode changes
    1. Use the figma for "light" mode
    2. Implement a color scheme for "dark" mode. No Figma, just make it look readable and show that it responds to the active system setting