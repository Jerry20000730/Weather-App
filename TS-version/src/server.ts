import express from "express";
import path from "path";
import favoritesRouter from "./routes/favorites";
const app = express();
const port = 3000;

app.use(express.json());

// this will serve all files in the static directory as static
// files, such as HTML, CSS, images, etc.
app.use(express.static("static"));

app.use(favoritesRouter);

// this starts the server listening on the specified port
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});