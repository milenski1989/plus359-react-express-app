import express from "express"
import { deleteFromS3, deleteOriginalFromS3, getArts, getBio, getFreeCells, login, searchArts, signup, updateBio, updateEntry, uploadEntry } from "../controllers/AdminController"
import AWS from 'aws-sdk';
import multerS3 from 'multer-s3-transform';
import multer from 'multer';
import sharp from 'sharp';
import path from "path";
import 'dotenv/config';

const router = express.Router()

//resize
const s3 = new AWS.S3({
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
        cb(null, `${name}_${Date.now()}original${ext}`);
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
          cb(null, `${name}_${Date.now()} thumbnail${ext}`);
        },
        metadata: (req, file, cb) => {
          cb(null, { fieldName: file.fieldname });
        },
        transform: function (req, file, cb) {
          cb(null, sharp().resize(300, 300, {
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


router.get('/artworks', getArts)
router.get('/bio/:name', getBio)
router.put('/bio/:id', updateBio)
router.get('/artworks/:param', searchArts)
router.get('/storage/:cell', getFreeCells)
router.post('/login', login)
router.post('/signup', signup)
router.post('/upload', upload.single("file"), uploadEntry)
router.delete('/artworks/:filename', deleteFromS3)
router.delete('/artworks/:originalFilename', deleteOriginalFromS3)
router.put('/artworks/:id', updateEntry)

export default router
