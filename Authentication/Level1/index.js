import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "secrets",
  password: "12345678",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

//function to handle register:
app.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const result = await db.query("select * from users where email = ($1)", [
      username,
    ]);
    if (result.rows.length == 0) {
      const insertedData = await db.query(
        "insert into users (email , password) values ($1,$2)",
        [username, password]
      );
      res.render("secrets.ejs");
      console.log(insertedData);
    } else {
      res.send("Email already exists try Logging in....");
    }
  } catch (err) {
    console.log("Error" + err.message);
    res.send("Error in the database: " + err.message);
  }
});

//function to handle login:
app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
