"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AdminController_1 = require("../controllers/AdminController");
const multer_s3_transform_1 = __importDefault(require("multer-s3-transform"));
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
require("dotenv/config");
const s3Client_1 = __importDefault(require("../s3Client/s3Client"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)({
    storage: (0, multer_s3_transform_1.default)({
        s3: s3Client_1.default,
        bucket: process.env.SPACES_BUCKET,
        shouldTransform: function (req, file, cb) {
            cb(null, /^image/i.test(file.mimetype));
        },
        transforms: [
            {
                id: 'original',
                key: function (req, file, cb) {
                    const ext = path_1.default.extname(file.originalname);
                    const name = path_1.default.parse(file.originalname).name;
                    cb(null, `${name}_${Date.now()}original${ext}`);
                },
                metadata: (req, file, cb) => {
                    cb(null, { fieldName: file.fieldname });
                },
                transform: function (req, file, cb) {
                    cb(null, (0, sharp_1.default)().resize(null, null).jpeg({ quality: 100 }));
                }
            },
            { id: 'thumbnail',
                key: function (req, file, cb) {
                    const ext = path_1.default.extname(file.originalname);
                    const name = path_1.default.parse(file.originalname).name;
                    cb(null, `${name}_${Date.now()} thumbnail${ext}`);
                },
                metadata: (req, file, cb) => {
                    cb(null, { fieldName: file.fieldname });
                },
                transform: function (req, file, cb) {
                    cb(null, (0, sharp_1.default)().resize(300, 300, {
                        fit: 'inside',
                    }).jpeg());
                }
            }
        ],
        key: (req, file, cb) => {
            const ext = path_1.default.extname(file.originalname);
            const name = path_1.default.parse(file.originalname).name;
            cb(null, `${name}${ext}`);
        },
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        acl: "public-read-write",
    }),
});
router.get('/artworks/:name', AdminController_1.getArts);
router.get('/bio/:name', AdminController_1.getBio);
router.put('/bio/:id', AdminController_1.updateBio);
router.get('/artworksByKeyword/:param', AdminController_1.searchArts);
router.get('/storage/:cell', AdminController_1.getFreeCells);
router.post('/login', AdminController_1.login);
router.post('/signup', AdminController_1.signup);
router.post('/upload', upload.single("file"), AdminController_1.uploadEntry);
router.delete('/artworks/:filename', AdminController_1.deleteFromS3);
router.delete('/artworks/:originalFilename', AdminController_1.deleteOriginalFromS3);
router.put('/artworks/:id', AdminController_1.updateEntry);
exports.default = router;
