import "reflect-metadata"
import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import bodyParser from "body-parser"
import session from "express-session"
import path from "path"
import { AuthenticationController } from "./controllers/AuthenticationController"
import { ArtworksController } from "./controllers/ArtworksController"
import { S3Controller } from "./controllers/S3Controller"
import { StorageController } from "./controllers/StorageController"
import { PdfController } from "./controllers/PdfController"
import { BiosController } from "./controllers/BiosController"
import { ArtistsController } from "./controllers/ArtistsController"
dotenv.config()

    const app = express()
    
    //app.use(express.static(path.join(__dirname, '/build')));
    
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

    const authController = new AuthenticationController();
    const artworksController = new ArtworksController()
    const s3Controller = new S3Controller()
    const storageController = new StorageController()
    const pdfController = new PdfController()
    const biosController = new BiosController()
    const artistsController = new ArtistsController()

    app.use('/auth', authController.router);
    app.use('/artworks', artworksController.router)
    app.use('/s3', s3Controller.router)
    app.use('/storage', storageController.router)
    app.use('/pdf', pdfController.router)
    app.use('/bios', biosController.router)
    app.use('/artists', artistsController.router)
    
    // app.get('*', (req,res) =>{
    //   res.sendFile(path.join(__dirname+'/build/index.html'));
    //   });
    
    const PORT = process.env.PORT
    
    app.listen(PORT, () => console.log(`Server is connected on ${PORT}`))



