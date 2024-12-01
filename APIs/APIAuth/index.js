import express, { response } from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com";

//TODO 1: Fill in your values for the 3 types of auth.
//re-register the values since it might be expired. refer notes for the links.

const yourUsername = "zulu";
const yourPassword = "mumu";
const yourAPIKey = "35523474-7090-45ce-9c5f-efd61483d011";
const yourBearerToken = "cd25b454-01f0-464f-a9fd-466fbda5c7b9";

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "API Response." });
});

//No auth:

app.get("/noAuth", async (req, res) => {
  try {
    const response = await axios.get(
      "https://secrets-api.appbrewery.com/random"
    );
    const data = JSON.stringify(response.data);
    // console.log(data);
    res.status(200).render("index.ejs", { content: data });
  } catch (error) {
    console.log(error.message);
    res.status(404).render("index.ejs", { content: error.message });
  }
});

//basic Auth:

app.get("/basicAuth", async (req, res) => {
  try {
    const response = await axios.get(
      "https://secrets-api.appbrewery.com/all?page=1",
      {
        auth: {
          username: yourUsername,
          password: yourPassword,
        },
      }
    );
    const data = JSON.stringify(response.data);
    console.log(data);
    res.status(200).render("index.ejs", { content: data });
  } catch (error) {
    //console.log(error.message);
    res.status(404).render("index.ejs", { content: error.message });
  }
});

//API key :

app.get("/apiKey", async (req, res) => {
  try {
    let sc = 5;
    const response = await axios.get(
      `https://secrets-api.appbrewery.com/filter?score=${sc}&apiKey=${yourAPIKey}`
    );

    //can also do :
    // const response = await axios.get(
    //   "https://secrets-api.appbrewery.com/filter",
    //   {
    //     params: {
    //       score: sc,
    //       apiKey: yourAPIKey,
    //     },
    //   }
    // );

    const data = JSON.stringify(response.data);
    console.log(data);
    res.status(200).render("index.ejs", { content: data });
  } catch (error) {
    //console.log(error.message);
    res.status(404).render("index.ejs", { content: error.message });
  }
});

//Bearer Token:

app.get("/bearerToken", async (req, res) => {
  try {
    const result = await axios.get(API_URL + "/secrets/4", {
      headers: {
        Authorization: `Bearer ${yourBearerToken}`,
      },
    });
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    console.log(error.message);
    res.status(404).render("index.ejs", { content: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
