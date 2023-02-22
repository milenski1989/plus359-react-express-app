import "reflect-metadata"
import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import bodyParser from "body-parser"
import session from "express-session"
import path from "path"
import router from "./routes/router"
dotenv.config()

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
    
    app.use('/api', router)
    
    app.get('*', (req,res) =>{
      res.sendFile(path.join(__dirname+'/build/index.html'));
      });
    
    const PORT = process.env.PORT
    
    app.listen(PORT, () => console.log(`Server is connected on ${PORT}`))



