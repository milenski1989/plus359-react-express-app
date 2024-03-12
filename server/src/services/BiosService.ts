import { dbConnection } from "../database";
import { Artists } from "../entities/Artists";
import { ArtistsBios } from "../entities/ArtistsBios";
import ArtistsService from "./ArtistsService";

const biosRepository = dbConnection.getRepository(ArtistsBios);

export default class BiosService {
  private static biosService: BiosService;

  private constructor() {}

  static getInstance() {
    if (!BiosService.biosService) {
      BiosService.biosService = new BiosService();
    }

    return BiosService.biosService;
  }

  async getOne(name: string) {
    try {
      let bio: ArtistsBios;

      const artist: Artists = await ArtistsService.getInstance().getOneByName(
        name
      );

      if (!artist) {
        throw new Error("Artist not found!");
      } else {
        bio = await biosRepository.findOne({
          where: {
            artistId: artist.id,
          },
        });
      }

      return bio;
    } catch {
      throw new Error("No bio for this artist found!");
    }
  }

  async updateOne(id: number, bio: string) {
    try {
      const bioFound: ArtistsBios = await biosRepository.findOneBy({
        artistId: id,
      });

      biosRepository.merge(bioFound, { ...bioFound, bio: bio });

      const results = await biosRepository.save(bioFound);
      return results;
    } catch (error) {
      console.log({ error });
      throw new Error("Could not update bio!");
    }
  }
}
