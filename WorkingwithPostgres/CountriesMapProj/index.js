import express from "express";
import bodyParser from "body-parser";

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
  const result = await db.query("select * from visited_counties");
  let arr = [];
  if (result.rows) {
    result.rows.forEach((item) => {
      arr.push(item.country_code);
    });
    res.send("index.ejs", { countries: arr });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
