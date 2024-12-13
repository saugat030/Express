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
  const result = await db.query("select * from visited_countries"); //could do a select country_code from visited_countries.
  let arr = [];
  if (result.rows.length > 0) {
    //result.rows will always be an array and never null or undefine. so it will always exist. Btter to check with .length
    result.rows.forEach((item) => {
      arr.push(item.country_code);
    });
    res.render("index.ejs", { countries: arr, total: arr.length });
  } else {
    res.render("index.ejs", { error: "No data in the array" });
    db.end();
  }
});

//The post request:
app.post("/add", async (req, res) => {
  const inputValue = req.body.country;
  const fetchedRow = await db.query(
    "select country_code from countries where country_name = ($1)",
    [inputValue]
  );

  if (fetchedRow.rows.length !== 0) {
    const code = fetchedRow.rows[0].country_code;
    await db.query("insert into visited_countries (country_code) values ($1)", [
      code,
    ]);
    res.redirect("/");
  }
});
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
