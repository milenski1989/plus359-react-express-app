const express = require("express");

const router = express.Router();
const path = require("path");
const connection = require("../database");
const adminServices = require("../services/adminServices");
const dotenv = require("dotenv").config();
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const multerS3 = require("multer-S3");
const multer = require("multer");

const s3 = new S3Client({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: "bucket-owner-full-control",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = path.parse(file.originalname).name;
      cb(null, `${name}${ext}`);
    },
  }),
});

//login
router.post("/login", async (req, res) => {
  const {email, password} = req.body

  adminServices.login(email, password, (error, result) => {
    if (email && password) {
      if (error) {
        res.send({ error: error.message });
        return;
      } else {
        if (result.length > 0) {
          req.session.loggedin = true;
          req.session.username = result[0].userName;
          res.status(200).send({ username: result[0].userName });
        } else {
          res.status(401).send({ message: "Incorrect Email and/or Password!" });
        }
      }
    } else {
      res.status(401).send({ message: "Please enter Email and Password!" });
    }
  });
});

//upload a photo with details to S3 Bucket and MySQL Database
router.post("/upload", upload.single("file"), async (req, res) => {
  const {title, author, width, height} = req.body
  const {location, originalname} = req.file
  const image_url = location;
  const image_key = originalname

  adminServices.uploadArt(
    title, author, width, height, image_url, image_key,
    (error, insertId) => {
      if (error) {
        res.send({ error: error.message });
        return;
      } else {
        res.send({title, author, width, height, image_url, image_key});
      }
    }
  );
});

//get all photos from S3 and details from database
router.get("/artworks", async (req, res) => {
  adminServices.getArts((error, artworks) => {
    if (error) {
      res.send({ error: error.message });
      return;
    }
    res.status(200).send({ artworks });
  });
});

//delete single entry from database
//TO DO: delete the object from S3 Bucket too
// app.delete("/artworks/:filename", async (req, res) => {

//   s3.DeleteObjectCommand({Bucket: process.env.AWS_BUCKET_NAME, Key: req.body.filename})
//   console.log('REQUEST', request)
//   console.log('RESPONSE', response)
// })

router.delete("/artworks/:id", async (req, res) => {
  const { id } = req.params;
adminServices.deleteArt(id, (error, result) => {
    if (error) {
        res.send({ error: error.message });
        return;
      }
      res.status(200).send({ "deleted entry": result.affectedRows })
    });
})

//update single entry in database
//TO DO: update photo in S3 Bucket too
router.put("/artworks/:id", async (req, res) => {
  const { author, title, width, height, id } = req.body;
  adminServices.updateArt(author, title, width, height, id);
  res.status(200).send({ "updated entry": title, "by author": author });
});

module.exports = router;
