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

async function checkVisisted() {
  const result = await db.query("SELECT country_code FROM visited_countries"); //could do a select all from visited_countries.
  let countries = [];
  if (result.rows.length > 0) {
    //result.rows will always be an array and never null or undefine. so it will always exist. Btter to check with .length
    result.rows.forEach((item) => {
      countries.push(item.country_code);
    });
    return countries;
  }
}

app.get("/", async (req, res) => {
  const result = await checkVisisted();
  res.render("index.ejs", { countries: result, total: result.length });
});

//The post request:
app.post("/add", async (req, res) => {
  const inputValue = req.body.country;
  // console.log(inputValue);
  try {
    const fetchedRow = await db.query(
      "select country_code from countries where country_name = ($1)", //select never throws an exception if a data is not found. Only when the name of the table itself is wrong so ya aako error catch block le catch handaina.
      [inputValue]
    );
    try {
      const code = fetchedRow.rows[0].country_code;
      await db.query(
        "insert into visited_countries (country_code) values ($1)",
        [code]
      );
      res.redirect("/");
    } catch (error) {
      //catch for if we try to enter repeated data.
      console.log(error);
      const countries = await checkVisisted();
      res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        error: "Country already added. Error :" + error,
      });
    }
  } catch (error) {
    //catch for if the Cpuntry name doesnt exist.
    console.log(error);
    const countries = await checkVisisted();
    res.render("index.ejs", {
      countries: countries,
      total: countries.length,
      error: "Country name doesn't exist :" + error,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
