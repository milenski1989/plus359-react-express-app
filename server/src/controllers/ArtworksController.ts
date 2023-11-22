import * as express from 'express'
import ArtworksService from '../services/ArtworksService'


export class ArtworksController{

    router: express.Router

    constructor() {
this.router = express.Router()
this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.get('/:name', this.getAllByStorage)
        this.router.post('/artwork', this.searchAllByKeywords)
        this.router.delete('/artwork/:params', this.deleteFileFromS3andDB)
        this.router.put('/artwork/:id', this.updateArtwork)
    }

    getAllByStorage = async (req, res) => {
      const {page, count, sortField, sortOrder} = req.query
      const {name} = req.params
      try {
       const [arts, artsCount] = await ArtworksService.getInstance().getAllByStorage(name, page, count, sortField, sortOrder)
    
       res.status(200).json({arts, artsCount});
      } catch (error) {
        res.status(400).json(error);
      }
    }

    // searchAllByKeyword = async (req, res) => {

    //   const {param} = req.body
    //   const keywordsArray = param.split(" ");
    //   console.log(param)

    //   try {
    //     const results = await ArtworksService.getInstance().searchAllsByKeywords(keywordsArray);
    //     res.status(200).json(results);
    //   } catch (error) {
    //     console.error("Error searching by keywords:", error.message);
    //     res.status(500).json({ error: "Internal server error" });
    //   }
    // };

    async searchAllByKeywords(req, res) {
      const { keywords } = req.body;
  
      try {
        const results = await ArtworksService.getInstance().searchByKeywords(keywords);
        res.json({ results });
      } catch (error) {
        console.error('Error:', error);
        res.status(404).json({ error: 'No results from the search!' });
      }
    }
    

    deleteFileFromS3andDB = async (req, res) => {
      const {originalFilename, filename, id} = req.query
      console.log(req.query)
      try {
        const results = await ArtworksService.getInstance().deleteFileFromS3AndDB(originalFilename, filename, id)
        res.send(results)
      } catch (error) {
        res.send({ error: error.message });
      }
    }

    updateArtwork = async (req, res) => {
      const {title,
        artist,
        technique,
        dimensions,
        price,
        notes,
        storageLocation,
        cell,
        position,
        by_user} = req.body
      const {id} = req.params
          try {
            const results = await ArtworksService.getInstance().updateArtwork(title,
              artist,
              technique,
              dimensions,
              price,
              notes,
              storageLocation,
              cell,
              position,
              by_user,
              id)
            res.status(200).send(results)
    
          } catch (error){
           throw new Error("Could not update entry!");
           
          }
    }
}