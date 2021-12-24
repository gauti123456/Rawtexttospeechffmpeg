const express = require("express");

const bodyParser = require("body-parser");

const fs = require("fs");

const app = express();

// running commands in node.js app

const { exec } = require("child_process");

const path = require("path");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/texttospeech", (req, res) => {
  output = Date.now() + "output." + req.body.format;

  console.log(req.body.text);
  console.log(req.body.format);

  var command = `ffmpeg -f lavfi -i "flite=text='${req.body.text}'" ${output}`;

  console.log(command);

  exec(
    command,

    (err, stdout, stderr) => {
      if (err) {
        console.log(err);
      }
      console.log(stdout);
      res.json({
        path: output,
      });
    }
  );
});

// download the file as attachment

app.get("/download", (req, res) => {
  var pathoutput = req.query.path;
  console.log(pathoutput);
  var fullpath = path.join(__dirname, pathoutput);
  res.download(fullpath, (err) => {
    if (err) {
      fs.unlinkSync(fullpath);
      res.send(err);
    }
    fs.unlinkSync(fullpath);
  });
});

app.listen(5000, () => {
  console.log("App is litening on port 5000");
});
