const express = require("express")
const dotenv = require('dotenv').config()
const cookieParser = require('cookie-parser')
const cors = require("cors")
const bodyParser = require('body-parser')
const path = require("path")
const database = require('./database')
const functions = require('./functions')
const multer = require("multer")
const session = require('express-session');
const connection = require("./database")
//const { s3UploadV2 } = require('../s3Service');

const app = express()

app.use(express.static(path.join(__dirname + "/public")))

app.use(cors({origin: 'http://localhost:3000'}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

//const storage = multer.memoryStorage()
const upload = multer({
        dest: 'uploads/'
    })

    app.post("/upload", upload.single("file"), async (req, res) => {
        const {filename, path} = req.file
        const title = req.body.title
        const author = req.body.author
        const width = req.body.width
        const height = req.body.height
        const image_url = `/uploads/${filename}`
        functions.uploadArt(title, author, width, height, image_url, (error, insertId) => {
            if (error) {
                res.send({error: error.message})
                return
            } else {
                res.send({
                    id: insertId,
                    title,
                    author,
                    width,
                    height,
                    image_url
                })
            }
        })
    })
    
    app.post('/login', (req, res) => {
    
        let email = req.body.email;
        let password = req.body.password;
       
        if (email && password) {
            
            connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], function(error, result) {
             
                if (error) throw error;
                if (result.length > 0) {
                    req.session.loggedin = true;
                    req.session.username = result[0].userName;
                   res.status(200).send({username: result[0].userName})
                } else {
                    res.status(401).send({message: 'Incorrect Email and/or Password!'});
                }			
                res.end();
            });
        } else {
            res.status(401).send({message: 'Please enter Email and Password!'});
            res.end();
        }
    });

//const adminRoutes = require('./routes/adminRoutes')

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server is connected on ${PORT}`))