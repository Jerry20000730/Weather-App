# ece5904hw3

## Usage
I have seperated the client and the server. To run the server, go to server folder and do

```shell
cd server
npm install
npm run dev
```

Then go to the client folder and run similar command:

```shell
cd client
npm install
npm run dev
```

## Goal

### Server Side
- Copy your `favorites` backend API server from the last class. You will use it as the backend for this homework.

Note the client and server will now be running on different ports on your local machine. You will need to enable CORS in your backend so that it will allow connnections from other hosts/ports.
Client Side

### Client Side
- Create a new React app using `vite`
- Use the supplied Figma file as a style guide
    - link: [https://gitlab.oit.duke.edu/kits/ECE-590-04-F24/figma/-/blob/main/Homework%203/Weather.fig?ref_type=heads](https://gitlab.oit.duke.edu/kits/ECE-590-04-F24/figma/-/blob/main/Homework%203/Weather.fig?ref_type=heads)
    - Overall layout and styles (color, font size, etc) of your React app should match the Figma file
    - Re-build the weather page as a series of React components
    - __NOTE__ there are some additional elements in the Figma file that were not in the original weather page
    - You will still use `fetch()` API to retrieve current conditions
        - Your `vite` app and your API will now be running on different ports.
        - You will need to provide the url for your API to fetch. It will be accessed from the port it was started on. So if you started it on port 4000, it would be http://localhost:4000

- Use `useState` and `useEffect` to manage the application state


