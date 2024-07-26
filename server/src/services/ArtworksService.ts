import { dbConnection } from "../database";
import { Artworks } from "../entities/Artworks";
import { Cells } from "../entities/Cells";
import { Positions } from "../entities/Positions";
import { Storages } from "../entities/Storages";
import { S3Service } from "./S3Service";
import StorageService from "./StorageService";

const s3Client = new S3Service();

const artsRepository = dbConnection.getRepository(Artworks);
const cellsRepository = dbConnection.getRepository(Cells);
const positionsRepository = dbConnection.getRepository(Positions);
const storagesRepository = dbConnection.getRepository(Storages)


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
    page?: string,
    count?: string,
    sortField?: string,
    sortOrder?: string
) {
    try {
        if (!page && !count) {
            const whereCondition = { storage: { name: name } };

            const artsCount = await artsRepository.count({
                where: whereCondition
            });

            return [artsCount];
        }

        const take = parseInt(count);
        const skip = take * (parseInt(page) - 1);
        const order = sortField ? { [sortField]: sortOrder.toUpperCase() } : {};

        if (name === "All") {
            const [arts, artsCount] = await artsRepository.findAndCount({
                relations: ["storage", "cell_t", "position_t"],
                order,
                take,
                skip
            });

            return [arts, artsCount];
        } else {
            const whereCondition = { storage: { name: name } };

            const [arts, artsCount] = await artsRepository.findAndCount({
                where: whereCondition,
                relations: ["storage", "cell_t", "position_t"],
                order,
                take,
                skip
            });

            return [arts, artsCount];
        }
    } catch {
        throw new Error("Fetch failed!");
    }
}


  async saveEntryInDb(
    title,
    artist,
    technique,
    dimensions,
    price,
    notes,
    storageLocation,
    cellParam,
    positionParam,
    image_url,
    image_key,
    download_url,
    download_key,
    by_user
) {
    try {
        let foundCellId;
        let foundPositionId;

        const foundStorage = await storagesRepository.findOne({
            where: { name: storageLocation }
        });

        if (cellParam) {
            const foundCell = await cellsRepository.findOne({
                where: { name: cellParam }
            });
            foundCellId = foundCell ? foundCell.id : null;
        }

        if (positionParam) {
            const foundCell = await cellsRepository.findOne({
                where: { name: cellParam }
            });
            const foundPosition = await positionsRepository.findOne({
                where: { cell_id: foundCell.id, cell: { storage_id: foundStorage.id } }
            });
            foundPositionId = foundPosition ? foundPosition.id : null;
        }

        const newArtwork = artsRepository.create({
            title,
            artist,
            technique,
            dimensions,
            price,
            notes,
            storageLocation,
            cell: cellParam || null,
            position: positionParam || null,
            image_url,
            image_key,
            download_url,
            download_key,
            by_user,
            storage_id: foundStorage.id,
            cell_id: foundCellId,
            position_id: foundPositionId
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

  async filterAllEntries(
    keywords: string[] = [],
    sortField?: string,
    sortOrder?: string,
    selectedArtist?: string, 
    selectedCell?: string
  ) {
    let query;
    let results;
    let whereConditions;
    let additionalCondition;
    let whereParams;

    if (selectedArtist && !selectedCell && !keywords.length) {
      additionalCondition = `artworks.artist = '${selectedArtist}' AND artworks.storageLocation NOT IN ('Sold')`
    
    } else if (selectedArtist && selectedCell && !keywords.length) {
      additionalCondition = `artworks.artist = '${selectedArtist}' AND artworks.cell = '${selectedCell}' AND artworks.storageLocation NOT IN ('Sold')`
    
    } else if (!selectedArtist && !selectedCell && keywords.length) {
      whereConditions = keywords
      .map(
        (keyword) =>
          `(CONCAT(artworks.artist, ' ', artworks.title, ' ', artworks.technique, ' ', artworks.notes, ' ', artworks.storageLocation, ' ', artworks.cell) LIKE ?)`
      )
      .join(" AND ");

     whereParams = keywords.map((keyword) => `%${keyword}%`);
     additionalCondition = `AND artworks.storageLocation NOT IN ('Sold')`;

    } else if (!selectedArtist && selectedCell && keywords.length) {
      whereConditions = keywords
      .map(
        (keyword) =>
          `(CONCAT(artworks.artist, ' ', artworks.title, ' ', artworks.technique, ' ', artworks.notes, ' ', artworks.storageLocation) LIKE ?)`
      )
      .join(" AND ");

    whereParams = keywords.map((keyword) => `%${keyword}%`);
    additionalCondition = `AND artworks.cell = '${selectedCell}' AND artworks.storageLocation NOT IN ('Sold')`

    } else if (!selectedArtist && selectedCell && !keywords.length) {
      additionalCondition = `artworks.cell = '${selectedCell}' AND artworks.storageLocation NOT IN ('Sold')`

    } else if (selectedArtist && !selectedCell && keywords.length) {
      whereConditions = keywords
      .map(
        (keyword) =>
          `(CONCAT(artworks.title, ' ', artworks.technique, ' ', artworks.notes, ' ', artworks.storageLocation, ' ', artworks.cell) LIKE ?)`
      )
      .join(" AND ");

    whereParams = keywords.map((keyword) => `%${keyword}%`);
    additionalCondition = `AND artworks.artist = '${selectedArtist}' AND artworks.storageLocation NOT IN ('Sold')`
    } else {
      whereConditions = keywords
      .map(
        (keyword) =>
          `(CONCAT(artworks.title, ' ', artworks.technique, ' ', artworks.notes, ' ', artworks.storageLocation) LIKE ?)`
      )
      .join(" AND ");

    whereParams = keywords.map((keyword) => `%${keyword}%`);
    additionalCondition = `AND artworks.artist = '${selectedArtist}' AND artworks.cell = '${selectedCell}' AND artworks.storageLocation NOT IN ('Sold')`

    }
   
    if (whereConditions) {
      query = `
      SELECT artworks.*, storages.name AS storage_name, cells.name AS cell_name, positions.name AS position_name
      FROM artworks
      LEFT JOIN storages ON artworks.storage_id = storages.id
      LEFT JOIN cells ON artworks.cell_id = cells.id
      LEFT JOIN positions ON artworks.position_id = positions.id
      WHERE ${whereConditions} ${additionalCondition}
      ORDER BY ${sortField} ${sortOrder.toUpperCase()}
    `;

    } else {
      query = `
      SELECT artworks.*, storages.name AS storage_name, cells.name AS cell_name, positions.name AS position_name
      FROM artworks
      LEFT JOIN storages ON artworks.storage_id = storages.id
      LEFT JOIN cells ON artworks.cell_id = cells.id
      LEFT JOIN positions ON artworks.position_id = positions.id
      WHERE ${additionalCondition}
      ORDER BY ${sortField} ${sortOrder.toUpperCase()}
    `;
    }

    if (whereParams) {
      const finalParams = [...whereParams];
      results = await dbConnection.query(query, finalParams);
    } else {
      results = await dbConnection.query(query);
    }
    return results ;
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
