import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";

//Password of haseduser@mail.com is 12345678. (For testing purposes).

const app = express();
const port = 3000;
const saltRounds = 10;
//Password + salt ----hashfunction----> hash value -> hash value + salt ----hashfunction----> new hash value -> new hash value + salt ----hashfunction----> new hash value .....estai 10 ota rounds hunxa aba bcrypt function ma chai.

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

//register Post route:
app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  try {
    //check if the user is already registered.
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in.");
    } else {
      //hash the password before sending it to the db.

      bcrypt.hash(password, saltRounds, async (err, hashValue) => {
        if (err) {
          console.log(err);
        } else {
          const result = await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2)", //This time we send the hashValue instead of the actual password.
            [email, hashValue]
          );
          // console.log(result);
          res.render("secrets.ejs");
        }
      });
      //if user not registered then enter the values in the db.
    }
  } catch (err) {
    console.log(err);
  }
});

//Login Post route:
app.post("/login", async (req, res) => {
  const email = req.body.username;
  const loginpassword = req.body.password;

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedPassword = user.password;

      bcrypt.compare(loginpassword, storedPassword, (err, result) => {
        //the order of the .compare() matters so the loginpassword must be in the beginning.
        if (err) {
          console.log(err);
        } else {
          if (result) {
            res.render("secrets.ejs");
          } else {
            res.send("Incorrect Password.");
          }
        }
      });
    } else {
      res.send("User not found");
    }
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
