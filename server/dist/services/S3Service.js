"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const multer_1 = __importDefault(require("multer"));
const multer_s3_transform_1 = __importDefault(require("multer-s3-transform"));
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
require("dotenv/config");
const s3Client_1 = __importDefault(require("../s3Client/s3Client"));
class S3Service {
    constructor() {
        this.s3 = new aws_sdk_1.default.S3({
            endpoint: 'nyc3.digitaloceanspaces.com',
            region: 'us-east-1',
            credentials: {
                accessKeyId: process.env.SPACES_KEY,
                secretAccessKey: process.env.SPACES_SECRET,
            },
        });
        this.upload = (0, multer_1.default)({
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
                        },
                    },
                    {
                        id: 'thumbnail',
                        key: function (req, file, cb) {
                            const ext = path_1.default.extname(file.originalname);
                            const name = path_1.default.parse(file.originalname).name;
                            cb(null, `${name}_${Date.now()} thumbnail${ext}`);
                        },
                        metadata: (req, file, cb) => {
                            cb(null, { fieldName: file.fieldname });
                        },
                        transform: function (req, file, cb) {
                            cb(null, (0, sharp_1.default)().resize(500, 500, { fit: 'inside' }).jpeg());
                        },
                    },
                ],
                key: (req, file, cb) => {
                    const ext = path_1.default.extname(file.originalname);
                    const name = path_1.default.parse(file.originalname).name;
                    cb(null, `${name}${ext}`);
                },
                metadata: (req, file, cb) => {
                    cb(null, { fieldName: file.fieldname });
                },
                acl: 'public-read-write',
            }),
        });
    }
    uploadSingleFile(fieldName) {
        return this.upload.single(fieldName);
    }
    deleteFile(originalFilename, filename) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const paramsForThumbnail = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: filename,
                };
                this.s3.deleteObject(paramsForThumbnail, (err, data) => {
                    if (err) {
                        console.error('Error deleting object:', err);
                    }
                    else {
                        console.log('Object deleted!');
                    }
                });
            }
            catch (error) {
                throw new Error(error);
            }
            try {
                const paramsForOriginalFile = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: originalFilename
                };
                return this.s3.deleteObject(paramsForOriginalFile, (err, data) => {
                    if (err) {
                        console.error('Error deleting object:', err);
                    }
                    else {
                        console.log('Object deleted:', data);
                    }
                });
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
}
exports.S3Service = S3Service;
