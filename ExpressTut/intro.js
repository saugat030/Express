import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.send("<h1>I am crazy.</h1>"); //"/" is called a endpoint.
});

app.get("/contact", (req, res) => {
  //"/contact" is called a endpoint.
  res.send("<h1>9842504131</h1>");
});

app.get("/about", (req, res) => {
  res.send("<h1>YOLO</h1>"); //"/about" is called a endpoint.
});

app.listen(3000, () => {
  console.log("Server ran on port 3k.");
});
