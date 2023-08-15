import { dbConnection } from "../database"
import { Artists } from "../entities/Artists"
import { ArtistsBios } from "../entities/ArtistsBios"

const artistsRepository = dbConnection.getRepository(Artists)
const biosRepository = dbConnection.getRepository(ArtistsBios)


export default class BiosService {

    private static biosService: BiosService

    private constructor() {}

    static getInstance() {
        if (!BiosService.biosService) {
            BiosService.biosService = new BiosService()
        }

        return BiosService.biosService
    }

    async getBio (name: string){

        try {
      
          let bio: ArtistsBios
      
          const artist = await artistsRepository.findOne({
            where: {
              artist: name
            }
          })
      
          if (!artist) {
            throw new Error('Artist not found!')
          } else {
            bio = await biosRepository.findOne({
              where: {
                id: artist.id,
            },
          })
          }
      
        return bio
      
        } catch {
          throw new Error('No bio for this artist found!')
        }
      
      }

      async updateBio(id: number, bio: string){

        try {
          const bioFound = await biosRepository.findOneBy({
            id: id
        })
      
        await biosRepository.merge(bioFound, {...bioFound, bio: bio})
      
        const results = await biosRepository.save(bioFound)
        return results
        } catch (error) {
          console.log({error})
        throw new Error("Could not update entry")
        }
      
      }
      
}