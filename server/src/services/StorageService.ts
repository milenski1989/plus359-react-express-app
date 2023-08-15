
import { In } from "typeorm";
import { dbConnection } from "../database";
import { Artworks } from "../entities/Artworks";

const artsRepository = dbConnection.getRepository(Artworks);


export default class StorageService {

    private static storageService: StorageService

    private constructor() {}

    static getInstance() {
        if (!StorageService.storageService) {
            StorageService.storageService = new StorageService()
        }

        return StorageService.storageService
    }

    async getFreeCells (cell: string) {

        try {
      
          const results = await artsRepository.find({
            where: {
              cell: cell
            }
          })
      
          return results
        } catch {
          throw new Error("Error getting free positions in the selected cell");
          
        }
      };

     async updateLocation (ids: number[], formControlData: {
        storageLocation: string,
        cell: string,
        position: number}){
        const {storageLocation, cell, position} = formControlData
        const promises = []
        try {
          const images = await artsRepository.findBy({
            id: In([ids])
        })
      
        for (let image of images) {
          promises.push(await artsRepository.save({
            id: image.id,
            storageLocation: storageLocation,
            cell: cell || '',
            position: position || 0
          }))
        }
      
        const result = await Promise.all(promises)
        return result
      
        } catch {
        throw new Error("Could not update locations!")
      
        }
      }

}