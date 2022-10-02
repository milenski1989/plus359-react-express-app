const express = require("express")
const dotenv = require("dotenv").config()
const cookieParser = require("cookie-parser")
const cors = require("cors")
const bodyParser = require("body-parser")
const session = require("express-session")
const adminRoutes = require('./routes/adminRoutes')

const app = express()

app.use(express.static('build'))

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

app.use(adminRoutes)
const PORT = process.env.PORT

app.listen(PORT, () => console.log(`Server is connected on 5000`))
