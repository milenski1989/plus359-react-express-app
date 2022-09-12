const express = require("express")
const sequelize = require('sequelize')
const dotenv = require('dotenv').config()
const cookieParser = require('cookie-parser')
const cors = require("cors")
const bodyParser = require('body-parser')
const path = require("path")
const db = require('./models')
const userRoutes = require ('./routes/adminRoutes')



const adminRoutes = require('./routes/adminRoutes')

const PORT = process.env.PORT || 5000

const app = express()

app.use(express.static(path.join(__dirname + "/public")))
// app.use('/*', (req, res) => {
//     res.sendFile(path.join(__dirname + '/public', 'index.html'))
// })

app.use(cors({origin: 'http://localhost:3000'}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

//synchronizing the database and forcing it to false so we dont lose data
db.sequelize.sync({ force: false }).then(() => {
    console.log("db has been re sync")
})

app.use('/api', adminRoutes)



app.listen(PORT, () => console.log(`Server is connected on ${PORT}`))