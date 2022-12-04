const express = require("express");
const router = express.Router();
const path = require("path");
const adminServices = require("../services/adminServices");
const dotenv = require("dotenv").config();
var aws = require('aws-sdk')
var multerS3 = require('multer-s3-transform');
const multer = require("multer");
const sharp = require('sharp');


const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    shouldTransform: function (req, file, cb) {
      cb(null, /^image/i.test(file.mimetype))
    },
    transforms: [

    {
      id: 'original',
      key: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const name = path.parse(file.originalname).name;
      cb(null, `${name}original${ext}`);
      },
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      transform: function (req, file, cb) {
        cb(null, sharp().resize(null, null).jpeg({quality : 100}))
      }
    },
      {id: 'thumbnail',
      key: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const name = path.parse(file.originalname).name;
        cb(null, `${name}thumbnail${ext}`);
      },
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      transform: function (req, file, cb) {
        cb(null, sharp().resize(500, 500, {
          fit: 'inside',
      }).jpeg())
      }
    }],
  key: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.parse(file.originalname).name;
    cb(null, `${name}${ext}`);
  },
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
    acl: "bucket-owner-full-control",
  }),
});

//signup
router.post("/signup", async (req, res) => {
  const {email, password, userName} = req.body

try {
  adminServices.signup(email, password, userName)
  res.status(200).send({message:"You've signed up successfully! Your account is active now!"});
} catch (error) {
  console.log(error)
  res.status(400).send({error: "User with this email is already registered!"})
}
});

//login
router.post("/login", async (req, res) => {
  const {email, password} = req.body

try {
  const result = await adminServices.login(email, password)
  req.session.loggedin = true;
  req.session.username = result[0].userName;
  res.status(200).send({ username: result[0].userName, email: result[0].email, isSuperUser: result[0].superUser });
} catch (error) {
  res.status(400).send({error: "Incorrect username and or/password!"})
}
});

//upload a photo with details to S3 Bucket and MySQL Database tables Artworks and Storage
router.post("/upload", upload.single("file"), async (req, res) => {

  const {title, artist, technique, dimensions, price, notes, storageLocation, cell, position} = req.body
  const image_url = req.file.transforms[0].location
  const image_key = req.file.transforms[0].key
  const download_url = req.file.transforms[1].location
  const download_key = req.file.transforms[1].key

  const query1 = adminServices.insertIntoArtworks (
    title,
    artist,
    technique,
    dimensions,
    price,
    notes,
    storageLocation,
    image_url,
    image_key,
    download_url,
    download_key
    )

  const query2 = adminServices.insertIntoStorage (storageLocation, cell, position)
  const promises = [query1, query2]

try {
  const result = await Promise.all(promises);
  res.status(200).json(`Inserted entry with id ${result[0].insertId} on location ${storageLocation}, cell ${cell}, position ${position} `)
} catch (error) {
  res.status(400).json(error)
}
})

//get all photos from S3 and details from database
router.get("/artworks", async (req, res) => {
  try {
    adminServices.getArts((error, results) => {
      res.status(200).json(results);
    });

  } catch (error) {
    res.status(400).json(error);
  }
});

router.get("/storage/:cell", async (req, res) => {
  const {cell} = req.params

  try {
    adminServices.getArtsNumbers(cell, (error, results) => {
        res.status(200).json(results);
    });
  } catch (error) {
    res.status(400).json(error)
  }

});

//delete single entry from s3, then from db
router.delete("/artworks/:filename", async (req, res) => {
  const filename = req.params.filename

  await s3.deleteObject({Bucket: process.env.AWS_BUCKET_NAME, Key: filename}).promise();
   
     adminServices.deleteArt(filename, async (error, result) => {
        if (error) {
          res.send({ error: error.message });
          return;
        }
        res.status(200).send("Entry deleted successfully!")
        });
})

//deleteOriginal
router.delete("/artworks/:originalFilename", async (req, res) => {
  const originalFilename = req.params.originalFilename
  await s3.deleteObject({Bucket: process.env.AWS_BUCKET_NAME, Key: originalFilename}).promise();
})

//update single entry in database
router.put("/artworks/:id", async (req, res) => {
  const {artist, title, technique, dimensions, price, notes, storageLocation,cell, position, id} = req.body
  adminServices.updateArt(artist, title, technique, dimensions, price, notes, storageLocation, cell, position, id, async (error, result) => {
    if (error) {
      res.send({ error: error.message });
      return;
    } else {
      res.status(200).send({ "updated entry": result });

    }
    });
});

module.exports = router;  