import * as express from 'express'
import StorageService from '../services/StorageService'


export class StorageController{

    router: express.Router

    constructor() {
this.router = express.Router()
this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.get('/:cell', this.getFreeCells)
        this.router.put('/update-location', this.updateLocation)

    }

    getFreeCells = async (req, res) => {
        const {cell} = req.params
      
        try {
          
          const results = await StorageService.getInstance().getFreeCells(cell)
      
              res.status(200).json(results);
          
        } catch (error) {
          res.status(400).json(error)
        }
      
      }

      updateLocation = async(req, res) => {
        const {ids, formControlData}  = req.body
      
        try {
          const results = await StorageService.getInstance().updateLocation(ids, formControlData)
          res.status(200).send(results)
      
        } catch (error){
         throw new Error("Could not update locations!");
         
        }
        
      }

}