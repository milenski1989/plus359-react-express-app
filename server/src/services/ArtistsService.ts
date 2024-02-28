import { dbConnection } from "../database"
import { Artists } from "../entities/Artists"

const artistsRepository = dbConnection.getRepository(Artists)

export default class ArtistsService {

    private static artistsService: ArtistsService

    private constructor() {}

    static getInstance() {
        if (!ArtistsService.artistsService) {
            ArtistsService.artistsService = new ArtistsService()
        }

        return ArtistsService.artistsService
    }

    async getAllArtists () {
        try {
          return await artistsRepository
          .createQueryBuilder('artist')
          .select('artist.artist', 'artist')
          .orderBy('artist', 'ASC')
          .getRawMany();

        } catch {
         throw new Error("Fetch failed!");
        }
       };

       async getArtistByName (name: string){
        try {
      
        const artistFound = await artistsRepository.findOne({
            where: {
              artist: name
            }
          })

          return artistFound
      
        } catch {
          throw new Error('No bio for this artist found!')
        }
      }

      async saveArtist (artist) {
        await artistsRepository.save(artist);
      }
      
}