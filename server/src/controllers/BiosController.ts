import * as express from 'express'
import BiosService from '../services/BiosService'


export class BiosController{

    router: express.Router

    constructor() {
this.router = express.Router()
this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.get('/bio/:name', this.getBio)
        this.router.put('/bio/:id', this.updateBio)

    }


   getBio = async (req, res) => {
  const {name} = req.params
  try {
   const bio = await BiosService.getInstance().getBio(name)

   res.status(200).json(bio);
  } catch (error) {
    res.status(400).json(error);
  }
}

    updateBio = async (req, res) => {
    const {bio} = req.body
    const {id} = req.params
  
    try {
     const result = await BiosService.getInstance().updateBio(id, bio)
  
     res.status(200).json(result);
    } catch (error) {
      res.status(400).json(error);
    }
  }
   
}