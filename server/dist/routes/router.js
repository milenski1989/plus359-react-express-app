"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const router = express_1.default.Router();
// const upload = multer({
//   storage: multerS3({
//     s3: s3Client,
//     bucket: process.env.SPACES_BUCKET,
//     shouldTransform: function (req, file, cb) {
//       cb(null, /^image/i.test(file.mimetype))
//     },
//     transforms: [
//     {
//       id: 'original',
//       key: function (req, file, cb) {
//         const ext = path.extname(file.originalname);
//         const name = path.parse(file.originalname).name;
//       cb(null, `${name}_${Date.now()}original${ext}`);
//       },
//       metadata: (req, file, cb) => {
//         cb(null, { fieldName: file.fieldname });
//       },
//       transform: function (req, file, cb) {
//         cb(null, sharp().resize(null, null).jpeg({quality : 100}))
//       }
//     },
//       {id: 'thumbnail',
//       key: function (req, file, cb) {
//         const ext = path.extname(file.originalname);
//         const name = path.parse(file.originalname).name;
//         cb(null, `${name}_${Date.now()} thumbnail${ext}`);
//       },
//       metadata: (req, file, cb) => {
//         cb(null, { fieldName: file.fieldname });
//       },
//       transform: function (req, file, cb) {
//         cb(null, sharp().resize(300, 300, {
//           fit: 'inside',
//       }).jpeg())
//       }
//     }],
//   key: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const name = path.parse(file.originalname).name;
//     cb(null, `${name}${ext}`);
//   },
//   metadata: (req, file, cb) => {
//     cb(null, { fieldName: file.fieldname });
//   },
//     acl: "public-read-write",
//   }),
// });
//router.get('/artworks/:name', getArts)
//router.get('/bio/:name', getBio)
//router.put('/bio/:id', updateBio)
//router.get('/artworksByKeyword/:param', searchArts)
//router.get('/storage/:cell', getFreeCells)
//router.post('/login', login)
//router.post('/signup', signup)
//router.post('/upload', upload.single("file"), uploadEntry)
//router.delete('/artworks/:filename', deleteFromS3)
//router.put('/artworks/:id', updateEntry)
//router.put('/update-location', updateLocation)
//router.post('/create-certificate', createCertificate)
exports.default = router;
