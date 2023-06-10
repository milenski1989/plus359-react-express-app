import express from "express"
import { deleteFromS3, deleteOriginalFromS3, getArts, getBio, getFreeCells, login, searchArts, signup, updateBio, updateEntry, uploadEntry } from "../controllers/AdminController"
import multerS3 from 'multer-s3-transform';
import multer from 'multer';
import sharp from 'sharp';
import path from "path";
import 'dotenv/config';
import s3Client from "../s3Client/s3Client";

const router = express.Router()

  
  const upload = multer({
    storage: multerS3({
      s3: s3Client,
      bucket: process.env.SPACES_BUCKET,
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
      acl: "public-read-write",
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
