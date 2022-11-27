const express = require("express")
const dotenv = require("dotenv").config()
const cookieParser = require("cookie-parser")
const cors = require("cors")
const bodyParser = require("body-parser")
const session = require("express-session")
const adminRoutes = require('./routes/adminRoutes')
const path = require('path')

const app = express()

app.use(express.static(path.join(__dirname, '/build')));

app.use(cors({ origin: "http://localhost:3000" }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
)

app.use('/api',adminRoutes)

app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/build/index.html'));
    });

   


const PORT = process.env.PORT

app.listen(PORT, () => console.log(`Server is connected on 5000`))