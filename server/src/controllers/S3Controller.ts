
import * as express from 'express'
import { S3Service } from '../services/S3Service'
import ArtworksService from '../services/ArtworksService'
import { Artworks } from '../entities/Artworks';

const s3Service = new S3Service()

export class S3Controller{

    router: express.Router

    constructor() {
this.router = express.Router()
this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.post('/upload', this.upload)
        this.router.post('/replace', this.replace)
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

    replace = async (req, res) => {
          
          const processRequestBody = async () => {
            const {id, old_image_key, old_download_key} = req.body

            let image_url;
            let image_key;
            let download_url;
            let download_key;
    
            image_url = req.file.transforms[0].location;
            image_key = req.file.transforms[0].key;
            download_url = req.file.transforms[1].location;
            download_key = req.file.transforms[1].key;
    
            const entryFound = await ArtworksService.getInstance().getOneById(id)
            

            if (entryFound) await ArtworksService.getInstance().updateImageData(old_image_key, old_download_key, entryFound.id, image_url, image_key, download_url, download_key)
    
            res.status(200).json({result: "Photo replaced successfuly"});
        };
    
        try {
            s3Service.uploadSingleFile('file')(req, res, async (uploadErr) => {
                if (uploadErr) {
                    return res.status(400).json({ error: 'File upload failed' });
                }
    
                await processRequestBody();
            });
        } catch (error) {
            res.status(400).json(error);
        }
    }

    upload = async (req, res) => {
        const processRequestBody = async () => {
            const { title, artist, technique, dimensions, price, notes, storageLocation, cell, position, by_user } = req.body;
            let image_url;
            let image_key;
            let download_url;
            let download_key;
    
            image_url = req.file.transforms[0].location;
            image_key = req.file.transforms[0].key;

            // let originalString = req.file.transforms[1].location;
            // let removedString = originalString.replace(/plus359gallery\//, "");
            // download_url = "https://plus359gallery." + removedString;
            download_url = req.file.transforms[1].location;
            download_key = req.file.transforms[1].key;

            const cellParam = cell ? cell : null;
            const positionParam = position ? position : null;
        
            await ArtworksService.getInstance().saveEntryInDb(
                title,
                artist,
                technique,
                dimensions,
                price,
                notes,
                storageLocation,
                cellParam,
                positionParam,
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
            s3Service.uploadSingleFile('file')(req, res, async (uploadErr) => {
                if (uploadErr) {
                    return res.status(400).json({ error: 'File upload failed!' });
                }
    
                await processRequestBody();
            });
        } catch (error) {
            res.status(400).json(error);
        }
    };
    
    
}