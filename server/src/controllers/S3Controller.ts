
import * as express from 'express'
import { S3Service } from '../services/S3Service'
import ArtworksService from '../services/ArtworksService'

const s3Service = new S3Service()

export class S3Controller{

    router: express.Router

    constructor() {
this.router = express.Router()
this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.post('/upload', this.upload)
        this.router.get('/:name', this.getArts)
    }

    getArts = async (req, res) => {
      const {page, count, sortField, sortOrder} = req.query
      const {name} = req.params
      try {
       const [arts, artsCount] = await ArtworksService.getInstance().getAllByStorage(name, page, count, sortField, sortOrder)
    
       res.status(200).json({arts, artsCount});
      } catch (error) {
        res.status(400).json(error);
      }
    }

    upload = async (req, res) => {
        // Define a callback function to process the request body after file upload
        const processRequestBody = async () => {
            const { title, artist, technique, dimensions, price, notes, storageLocation, cell, position, by_user } = req.body;
            let image_url;
            let image_key;
            let download_url;
            let download_key;
    
            // Extract information from the transformed file
            image_url = req.file.transforms[0].location;
            image_key = req.file.transforms[0].key;
            download_url = req.file.transforms[1].location;
            download_key = req.file.transforms[1].key;
    
            // Save the file info into the database
            await ArtworksService.getInstance().saveFileIntoDatabase(
                title,
                artist,
                technique,
                dimensions,
                price,
                notes,
                storageLocation,
                cell,
                position,
                image_url,
                image_key,
                download_url,
                download_key,
                by_user
            );
    
            res.status(200).json({
                results: {
                    image_url,
                    image_key,
                    download_url,
                    download_key,
                },
            });
        };
    
        try {
            // Use the processRequestBody callback in the upload middleware
            s3Service.uploadSingleFile('file')(req, res, async (uploadErr) => {
                if (uploadErr) {
                    return res.status(400).json({ error: 'File upload failed' });
                }
    
                // Call the processRequestBody callback
                await processRequestBody();
            });
        } catch (error) {
            res.status(400).json(error);
        }
    };
    
    
}