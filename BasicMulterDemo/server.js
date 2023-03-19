const express = require("express");
const app = express();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderName = file.originalname.replace(
      path.extname(file.originalname),
      ""
    );
    const dir = `./Images/${folderName}`;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true,
      });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/upload", (req, res) => {
  res.render("upload");
});

app.post("/upload", upload.single("image"), (req, res) => {
  res.send("Image Uploaded successfully");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`listening on ${port}...`);
});
