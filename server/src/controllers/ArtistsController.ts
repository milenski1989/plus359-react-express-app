import * as express from 'express'
import ArtistsService from '../services/ArtistsService'
import ArtworksService from '../services/ArtworksService'


export class ArtistsController{

    router: express.Router

    constructor() {
this.router = express.Router()
this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.post('/save', this.saveArtist)
        this.router.get('/artists', this.getAllArtists)
        this.router.get('/allFromArtworks', this.getAllArtistsFromArtworks)
    }

    saveArtist = async (req, res) => {
      const artist = req.body
      try {
        const result = await ArtistsService.getInstance().saveArtist(artist)

       res.status(200).json(result);
      } catch (error) {
        res.status(400).json(error);
      }
    }

    getAllArtists = async (req, res) => {
  try {
   const artists = await ArtistsService.getInstance().getAllArtists()
   res.status(200).json(artists);
  } catch (error) {
    res.status(400).json(error);
  }
}

getAllArtistsFromArtworks = async (req, res) => {
  try {
    const arts = await ArtworksService.getInstance().getAll()
    const artists = Array.from(new Set(arts.map(art => art.artist))).sort((a,b) => a.localeCompare(b))
   res.status(200).json(artists);
  } catch (error) {
    res.status(400).json(error);
  }
}
   
}