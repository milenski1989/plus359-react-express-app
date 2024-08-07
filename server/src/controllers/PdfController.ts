import * as express from 'express'
import PdfService from '../services/PdfService'


export class PdfController{

    router: express.Router

    constructor() {
this.router = express.Router()
this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.post('/create-certificate', this.createCertificate)
}

createCertificate = async (req, res) => {
    const {imageSrc, bio, artist, title, technique, dimensions} = req.body 
  
    try {
      PdfService.getInstance().createCertificate(
        imageSrc, bio, artist, title, technique, dimensions,
        (chunk) => stream.write(chunk),
        () => stream.end()
      )
  
      const stream = res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment;filename=certificate.pdf'
      })
  
    } catch (error) {
      res.status(400).json(error);
    }
  }
}