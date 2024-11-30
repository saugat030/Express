import express from "express";
import path from "path"; //path is a default export.
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.urlencoded({ extended: true }));

function checker(req, res, next) {
  console.log(req.body);
  if (req.body.password == "ILoveProgramming") {
    return res.sendFile(path.join(__dirname, "public", "secret.html"));
  }
  next();
}

app.use("/check", checker); //This will make it so the check is inly applied to the post route. Alternatively we can do the same thing in the Post method but this is a good practice.

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/check", (req, res) => {
  res.status(401).send("Password is incorrect.");
  //can also do a res.redirect("/") to send it back to the homepage.
});

app.listen(3000, () => {
  console.log(`Listening on port 3000`);
});
