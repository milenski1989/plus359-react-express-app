import { In, Like } from "typeorm";
import { dbConnection } from "../database";
import { Artworks } from "../entities/Artworks";
import { S3Service } from "./S3Service";
import ArtistsService from "./ArtistsService";

const s3Client = new S3Service();

const artsRepository = dbConnection.getRepository(Artworks);

export default class ArtworksService {
  private static authenticationService: ArtworksService;

  private constructor() {}

  static getInstance() {
    if (!ArtworksService.authenticationService) {
      ArtworksService.authenticationService = new ArtworksService();
    }

    return ArtworksService.authenticationService;
  }

  async getOneById(id) {
    try {
      return await artsRepository.findOne({
        where: {
          id: id,
        },
      });
    } catch {
      throw new Error("Fetch failed!");
    }
  }

  async getAll() {
    try {
      return await artsRepository.find();
    } catch {
      throw new Error("Fetch failed!");
    }
  }

  async getAllByCellFromCurrentStorage(currentStorage: string) {
    try {
      return await artsRepository.find({
        where: {
          storageLocation: currentStorage,
        },
      });
    } catch {
      throw new Error("Fetch failed!");
    }
  }

  async getAllByArtistAndStorage(artist: string, storage: string) {
    try {
      if (storage === "All") {
        return await artsRepository.find({
          where: { artist: artist },
        });
      } else {
        return await artsRepository.find({
          where: { artist: artist, storageLocation: storage },
        });
      }
    } catch {
      throw new Error("Fetch failed!");
    }
  }

  async getAllByCellInStorage(cell: string) {
    try {
      return await artsRepository.find({
        where: { cell: cell },
      });
    } catch {
      throw new Error("Fetch failed!");
    }
  }

  async getAllByStorage(
    name: string,
    page: string,
    count: string,
    sortField?: string,
    sortOrder?: string
  ) {
    try {
      if (name === "All") {
        const [arts, artsCount] = await artsRepository.findAndCount({
          order: { [sortField]: sortOrder.toUpperCase() },
          take: parseInt(count),
          skip: parseInt(count) * parseInt(page) - parseInt(count),
        });

        return [arts, artsCount];
      } else {
        const [arts, artsCount] = await artsRepository.findAndCount({
          order: { [sortField]: sortOrder.toUpperCase() },
          where: { storageLocation: name },
          take: parseInt(count),
          skip: parseInt(count) * parseInt(page) - parseInt(count),
        });

        return [arts, artsCount];
      }
    } catch {
      throw new Error("Fetch failed!");
    }
  }

  async saveFileIntoDatabase(
    title,
    artist,
    technique,
    dimensions,
    price,
    notes,
    storageLocation,
    cell,
    position,
    image_url,
    image_key,
    download_url,
    download_key,
    by_user
  ) {
    try {
      const newArtwork = artsRepository.create({
        title,
        artist,
        technique,
        dimensions,
        price,
        notes,
        storageLocation,
        cell,
        position,
        image_url,
        image_key,
        download_url,
        download_key,
        by_user,
      });

      const savedArtwork = await artsRepository.save(newArtwork);

      return savedArtwork;
    } catch (error) {
      throw new Error("Error saving artwork into the database!");
    }
  }

  async updateImageData(
    old_download_key,
    old_image_key,
    id,
    image_url,
    image_key,
    download_url,
    download_key
  ) {
    try {
      await s3Client.deleteFile(old_download_key, old_image_key);

      await dbConnection
        .createQueryBuilder()
        .update(Artworks)
        .set({ image_url, image_key, download_url, download_key })
        .where("id = :id", { id: id })
        .execute();
    } catch {
      throw new Error("Error updating image data in database!");
    }
  }

  async searchByKeywords(
    keywords: string[],
    page: string,
    count: string,
    sortField?: string,
    sortOrder?: string
  ) {
    const whereConditions = keywords
      .map(
        (keyword) =>
          `(CONCAT(artworks.artist, ' ', artworks.title, ' ', artworks.technique, ' ', artworks.notes, ' ', artworks.storageLocation, ' ', artworks.cell) LIKE ?)`
      )
      .join(" AND ");

    const whereParams = keywords.map((keyword) => `%${keyword}%`);
    const additionalCondition = `AND artworks.storageLocation NOT IN ('Sold')`;

    const query = `
            SELECT *
            FROM artworks
            WHERE ${whereConditions} ${additionalCondition}
            ORDER BY ${sortField} ${sortOrder.toUpperCase()}
            LIMIT ? OFFSET ?
          `;

    const countQuery = `
            SELECT COUNT(*) AS total
            FROM artworks
            WHERE ${whereConditions}
          `;

    const paginationParams = [
      parseInt(count),
      (parseInt(page) - 1) * parseInt(count),
    ];
    const finalParams = [...whereParams, ...paginationParams];

    const countResult = await dbConnection.query(countQuery, whereParams);
    const total = countResult[0].total;

    const results = await dbConnection.query(query, finalParams);

    return [results, total];
  }

  async deleteOne(originalFilename, filename, id) {
    try {
      await s3Client.deleteFile(originalFilename, filename);
    } catch {
      throw new Error("Could not delete the entry!");
    }

    try {
      const results = await artsRepository.delete(id);
      return results;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateOne(
    title: string,
    artist: string,
    technique: string,
    dimensions: string,
    price: number,
    notes: string,
    storageLocation: string,
    cell: string,
    position: number,
    by_user: string,
    id: number
  ) {
    const updatedEntry = {
      title,
      artist,
      technique,
      dimensions,
      price,
      notes,
      storageLocation,
      cell,
      position,
      by_user,
    };
    try {
      const item = await artsRepository.findOneBy({
        id: id,
      });
      artsRepository.merge(item, updatedEntry);
      const results = await artsRepository.save(item);
      return results;
    } catch {
      throw new Error("Could not update entry");
    }
  }
}
