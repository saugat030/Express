import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "12345678",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const result = await db.query("select * from visited_countries");
  let arr = [];
  if (result.rows.length > 0) {
    //result.rows will alaways be an array and never null or undefunes. so it will always exist. Btter to check with .length
    result.rows.forEach((item) => {
      arr.push(item.country_code);
    });
    res.render("index.ejs", { countries: arr, total: arr.length });
  } else {
    res.render("index.ejs", { error: "Not found." });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
