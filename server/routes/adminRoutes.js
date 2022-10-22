const express = require("express");

const router = express.Router();
const path = require("path");
const adminServices = require("../services/adminServices");
const dotenv = require("dotenv").config();


const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

const multerS3 = require("multer-s3");
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
  const {title, author, width, height, technique, storageLocation} = req.body
  const {location, originalname} = req.file
  const image_url = location;
  const image_key = originalname

  adminServices.uploadArt(
    title, author, width, height, technique, storageLocation, image_url, image_key,
    (error, result) => {
      if (error) {
        res.send({ error: error.message });
        return;
      } else {
        res.send({title, author, width, height, technique, storageLocation, image_url, image_key});
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

//delete single entry from s3, then from db
router.delete("/artworks/:filename", async (req, res) => {
  const filename = req.params.filename

  await s3.send(new DeleteObjectCommand({Bucket: process.env.AWS_BUCKET_NAME, Key: filename}));
   
      adminServices.deleteArt(filename, async (error, result) => {
        if (error) {
          res.send({ error: error.message });
          return;
        }
        res.status(200).send({"deletedEntry": result.affectedRows})
        });
})

//update single entry in database
router.put("/artworks/:id", async (req, res) => {
  const { author, title, technique, storageLocation, width, height, id } = req.body;
  adminServices.updateArt(author, title, technique, storageLocation, width, height, id);
  res.status(200).send({ "updated entry": title, "by author": author });
});

//search
router.get("/search", async (req, res) => {
  const {author} = req.query
  console.log(req.query)
  adminServices.search(author, (error, results) => {
    if (error) {
      res.send({error: error.message})
      return
    } else  res.status(200).send({'results': results}) 
  })
 
})

module.exports = router;
