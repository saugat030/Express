import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com";

// HINTs: Use the axios documentation as well as the video lesson to help you.
// https://axios-http.com/docs/post_example
// Use the Secrets API documentation to figure out what each route expects and how to work with it.
// https://secrets-api.appbrewery.com/

//TODO 1: Add your own bearer token from the previous lesson.
const yourBearerToken = "cd25b454-01f0-464f-a9fd-466fbda5c7b9";
const config = {
  headers: { Authorization: `Bearer ${yourBearerToken}` },
};

app.use(bodyParser.urlencoded({ extended: true }));

//home route
app.get("/", (req, res) => {
  res.render("index.ejs", { content: "Waiting for data..." });
});

//Post with /get-secrect request:
app.post("/get-secret", async (req, res) => {
  const searchId = req.body.id;
  try {
    const result = await axios.get(API_URL + "/secrets/" + searchId, config);
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.render("index.ejs", { content: JSON.stringify(error.response.data) });
  }
});

//Posting the secret:
app.post("/post-secret", async (req, res) => {
  const formData = req.body;
  try {
    const result = await axios.post(API_URL + "/secrets", formData, config);
    res.render("index.ejs", { content: JSON.stringify(result.data) }); //printing the data you just inputted through the post request. Yo chai API banauda handle garne ho aba post req aauda k response pathaune vanra yo api ko case ma chai tyo data return vayera aauxa.
  } catch (error) {
    console.log(error.message);
  }
});

//Putting the secret.
app.post("/put-secret", async (req, res) => {
  const searchId = req.body.id;
  const formData = req.body;
  try {
    const result = await axios.put(
      API_URL + "/secrets/" + searchId,
      formData,
      config
    );
    res.render("index.ejs", { content: JSON.stringify(result.data) }); //printing the data you just inputted through the post request
  } catch (error) {
    console.log(error.message);
    res.render("index.ejs", { content: JSON.stringify(error.response.data) });
  }
});

app.post("/patch-secret", async (req, res) => {
  const searchId = req.body.id;
  try {
    const result = await axios.patch(
      API_URL + "/secrets/" + searchId,
      req.body,
      config
    );
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.render("index.ejs", { content: JSON.stringify(error.response.data) });
  }
});

app.post("/delete-secret", async (req, res) => {
  const searchId = req.body.id;
  try {
    const result = await axios.delete(API_URL + "/secrets/" + searchId, config); // You need to handle what comes in result.data after th delete request has been made. In this case a jsin fil with this type of message is sent -{"message":"Secret with ID 51 has been deleted successfully."}
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.render("index.ejs", { content: JSON.stringify(error.response.data) });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
