const {S3} = require("aws-sdk")

exports.s3UploadV2 = async (file) => {
    const s3 = new S3()

    const param = {
Bucket: process.env.AWS_BUCKET_NAME,
Key: `artworks/${file.originalname}`,
Body: file.buffer
    }

const result = await s3.upload(param).promise()
return result
}