const express = require("express");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const database = require("./database");
const functions = require("./functions");
const session = require("express-session");
const connection = require("./database");

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const uuid = require("uuid").v4;
const multerS3 = require("multer-S3");
const multer = require("multer");

const app = express();

app.use(express.static(path.join(__dirname + "/public")));
//app.use(express.static('build'))

app.use(cors({ origin: "http://localhost:3000" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

const s3 = new S3Client({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${uuid()}${ext}`);
    },
  }),
});

const s3UploadV2 = async (file) => {

  const param = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `artworks/${file.originalname}`
  };
  console.log(param);

  const result = await s3.send(new PutObjectCommand(param));
  return result;
};

app.post("/upload", upload.single("file"), async (req, res) => {
  const title = req.body.title;
  const author = req.body.author;
  const width = req.body.width;
  const height = req.body.height;
  const uploaded = req.file.location;

  const result = await s3UploadV2(req.file);
  const image_url = uploaded;

  functions.uploadArt(
    title,
    author,
    width,
    height,
    image_url,
    (error, insertId) => {
      if (error) {
        res.send({ error: error.message });
        return;
      } else {
        res.send({
          result,
          title,
          author,
          width,
          height,
          image_url,
        });
      }
    }
  );
});

app.get("/artworks", async (req, res) => {
  functions.getArts((error, artworks) => {
    if (error) {
      res.send({ error: error.message });
      return;
    }
    res.status(200).send({ artworks });
  });
});

app.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (email && password) {
    connection.query(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email, password],
      function (error, result) {
        if (error) throw error;
        if (result.length > 0) {
          req.session.loggedin = true;
          req.session.username = result[0].userName;
          res.status(200).send({ username: result[0].userName });
        } else {
          res.status(401).send({ message: "Incorrect Email and/or Password!" });
        }
        res.end();
      }
    );
  } else {
    res.status(401).send({ message: "Please enter Email and Password!" });
    res.end();
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is connected on ${PORT}`));
