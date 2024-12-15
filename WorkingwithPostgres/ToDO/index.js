import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "todo",
  password: "12345678",
  port: 5432,
});

db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    console.log("GET: Fetching items from database...");
    const result = await db.query("SELECT * FROM items");
    console.log(`Query executed, rows returned: ${result.rows.length}`);
    if (result.rows.length > 0) {
      let items = result.rows;
      res.render("index.ejs", {
        listTitle: "Today",
        listItems: items,
      });
    } else {
      console.log("No data found.");
      let items = [];
      res.render("index.ejs", {
        listTitle: "Today",
        listItems: items,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.send("Error has happened brthr");
  }
});

app.post("/add", async (req, res) => {
  const inputValue = req.body.newItem;
  try {
    await db.query("insert into items (title) values ($1)", [inputValue]);
    console.log("inserted successfully");
  } catch (error) {
    console.log("Error has occured : " + error.message);
  }
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const inputId = req.body.updatedItemId;
  const inputValue = req.body.updatedItemTitle;
  console.log(inputId, inputValue);
  try {
    await db.query("update items set title = $1 where id = ($2)", [
      inputValue.trim(),
      inputId,
    ]);
    res.redirect("/");
  } catch (error) {
    console.log("Error in updating databse: " + error.message);
    res.send("Error updating the database.....");
  }
});

app.post("/delete", async (req, res) => {
  const inputId = parseInt(req.body.deleteItemId);
  try {
    await db.query("delete from items where id=($1)", [inputId]);
    res.redirect("/");
  } catch (error) {
    console.log("Error in deleting : " + error.message);
    res.send("Something happened while deleting :" + error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
