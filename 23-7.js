import inquirer from "inquirer";
import qr from "qr-image";
import fs from "fs";
//var qr = require("qr-image");

console.log("Helpppppppppp");

inquirer
  .prompt([{ message: "Type the URL:", name: "URL" }])
  .then((answers) => {
    const url = answers.URL;

    var qr_svg = qr.image(url);
    qr_svg.pipe(fs.createWriteStream("./23-7static/qr_image.png"));

    fs.writeFile("./23-7static/URL.txt", url, (err) => {
      if (err) throw err;
      console.log("File has been saved.");
    });
  })
  .catch((error) => {
    if (error.isTtyError) {
      console.log("error happened");
    } else {
      console.log("some other error happened.");
    }
  });
