import * as express from 'express'
import StorageService from '../services/StorageService'
import ArtworksService from '../services/ArtworksService'


export class StorageController{

    router: express.Router

    constructor() {
this.router = express.Router()
this.initializeRoutes()
    }

    private initializeRoutes() {
        this.router.get('/:cell', this.getFreeCells)
        this.router.get('/all/allCellsFromCurrentStorage/:currentStorage', this.getAllCellsFromCurrentStorage)
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

      getAllCellsFromCurrentStorage = async (req, res) => {
        const {currentStorage} = req.params
        let cells;
        try {
          if (currentStorage !== 'All') {
            const arts = await ArtworksService.getInstance().getAllByCellFromCurrentStorage(currentStorage);
            cells = arts
            .map(art => art.cell)
            .filter(cell => cell !== "")
            .sort((a, b) => a.localeCompare(b));
          } else {
            const arts = await ArtworksService.getInstance().getAll();
            cells = arts
            .map(art => art.cell)
            .filter(cell => cell !== "")
            .sort((a, b) => a.localeCompare(b));
          }
      
            res.status(200).json(cells);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
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