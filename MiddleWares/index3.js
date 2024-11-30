import express from "express";

const app = express();
const port = 3000;

function logger(req, res, next) {
  console.log(req.method);
  console.log(req.url);
  next(); //next halena vane resonse kei aaudaina and it will get stuck since we havent passed the next to our get function
}

app.use(logger);

app.get("/", (req, res) => {
  console.log("Logging after the middleware");
  res.send("Goodbye World");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
