const express = require('express') //1
const multer = require("multer")
const { s3UploadV2 } = require('../s3Service');
const router = express.Router() //2
const pool = require('../database')
const userController = require('../controllers/userController')
const { signup, login } = userController
const userAuth = require('../middleware/userAuth');

router.post('/signup', userAuth.saveUser, signup)

//login route
router.post('/login', login )

const storage = multer.memoryStorage()
const upload = multer({
        storage
    })
//3
router.post("/upload", upload.single("file"), async (req, res) => {
   const result = await s3UploadV2(req.file)
    res.json({status: "success", result})
    console.log('REEEEEES',result)
})


  

module.exports = router //last