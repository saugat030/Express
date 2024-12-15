import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "todo",
  password: "12345678",
  port: 5432,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items");
    if (result.rows.length > 0) {
      items = result.rows;
      res.render("index.ejs", {
        listTitle: "Today",
        listItems: items,
      });
    } else {
      console.log("No data found.");
    }
  } catch (error) {
    console.log(error.message);
    res.redirect("/");
  }
});

app.post("/add", (req, res) => {
  const item = req.body.newItem;
  items.push({ title: item });
  res.redirect("/");
});

app.post("/edit", (req, res) => {});

app.post("/delete", (req, res) => {});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
