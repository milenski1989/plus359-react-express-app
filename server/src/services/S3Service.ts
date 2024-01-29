import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3-transform';
import sharp from 'sharp';
import path from 'path';
import 'dotenv/config';
import s3Client from '../s3Client/s3Client';

export class S3Service {
  private s3: AWS.S3;
  private upload: multer.Multer;

  constructor() {
    this.s3 = new AWS.S3({
      endpoint: 'nyc3.digitaloceanspaces.com',
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.SPACES_KEY,
        secretAccessKey: process.env.SPACES_SECRET,
      },
    });

    this.upload = multer({
      storage: multerS3({
        s3: s3Client,
        bucket: process.env.SPACES_BUCKET,
        shouldTransform: function (req, file, cb) {
          cb(null, /^image/i.test(file.mimetype));
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
              cb(null, sharp().resize(null, null).jpeg({ quality: 100 }));
            },
          },
          {
            id: 'thumbnail',
            key: function (req, file, cb) {
              const ext = path.extname(file.originalname);
              const name = path.parse(file.originalname).name;
              cb(null, `${name}_${Date.now()} thumbnail${ext}`);
            },
            metadata: (req, file, cb) => {
              cb(null, { fieldName: file.fieldname });
            },
            transform: function (req, file, cb) {
              cb(null, sharp().resize(500, 500, { fit: 'inside' }).jpeg());
            },
          },
        ],
        key: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          const name = path.parse(file.originalname).name;
          cb(null, `${name}${ext}`);
        },
        metadata: (req, file, cb) => {
          cb(null, { fieldName: file.fieldname });
        },
        acl: 'public-read-write',
      }),
    });
  }

  uploadSingleFile(fieldName: string) {
    return this.upload.single(fieldName);

  }

  async deleteFile (originalFilename, filename) {

    try {
      const paramsForThumbnail = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filename,
      };
  
      this.s3.deleteObject(paramsForThumbnail, (err, data) => {
        if (err) {
          console.error('Error deleting object:', err);
        } else {
          console.log('Object deleted!');
        }
      });
    } catch (error) {
      throw new Error(error)
    }

    try {
      const paramsForOriginalFile = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: originalFilename
      }
  
      return this.s3.deleteObject(paramsForOriginalFile, (err, data) => {
        if (err) {
          console.error('Error deleting object:', err);
        } else {
          console.log('Object deleted:', data);
        }
      });
    } catch (error) {
      throw new Error(error)
    }

  }

}
