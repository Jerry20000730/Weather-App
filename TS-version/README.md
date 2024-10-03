# TypeScript Version + Express server

## Part 1
Create an Express Server using TypeScript

- Set up environment to use `nodemon` and `ts-node`
- Create a static directory
- Copy your HTML file from Homework 1 to the static directory so that it serves up when you navgiate to the root of your server, e.g. `http://localhost:3000/`
- Create an API in your server at the path /favorites with the following routes:
    - GET /favorites - returns a list of favorite items
    - POST /favorites - adds a new favorite item
    - DELETE /favorites/:id - deletes a favorite item by id

## Part 2
Modify the HTML page in your static directory to implement storing of favorite zip codes
- Add a button to add the current zip code to the favorites list

- Go to a favorite zip code that was previously stored

- Delete a favorite zip code from the list of saved favorites

- Call your backend API to perform these actions

    - use the `fetch()` API to make the calls to your server with the appropriate method and data