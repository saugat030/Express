import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
let bandName = "";

app.use(express.urlencoded({ extended: true })); //bodyParser jastai

function bandNameGenerator(req, res, next) {
  //custom middleware.
  console.log(req.body);
  bandName = req.body["street"] + req.body["pet"];
  next();
}

app.use(bandNameGenerator); //Middleware gets executed first before the app.get request.

app.get("/", (req, res) => {
  console.log("check when this gets executed");
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/submit", (req, res) => {
  res.send(`<h1>Your band name is:</h1><h2>${bandName}</h2>`);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
