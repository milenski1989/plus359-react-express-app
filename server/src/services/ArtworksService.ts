

import { In, Like } from "typeorm";
import { dbConnection } from "../database";
import { Artworks } from "../entities/Artworks";
import { S3Service } from "./S3Service";
import ArtistsService from "./ArtistsService";

const s3Client = new S3Service()

const artsRepository = dbConnection.getRepository(Artworks);

export default class ArtworksService {

    private static authenticationService: ArtworksService

    private constructor() {}

    static getInstance() {
        if (!ArtworksService.authenticationService) {
            ArtworksService.authenticationService = new ArtworksService()
        }

        return ArtworksService.authenticationService
    }

    async getAll () {
      try {
          return await artsRepository.find()
      } catch {
       throw new Error("Fetch failed!");
      }
     };

     async getAllByArtist (artist: string) {
      try {
        return await artsRepository.find({
          where:{artist: artist}
        })
    } catch {
     throw new Error("Fetch failed!");
    }
     }

    async getAllByStorage (name: string, page: string, count: string, sortField?: string, sortOrder?: string) {
        try {

          if (name === 'All') {
            const [arts, artsCount] = await artsRepository.findAndCount({
              order: {[sortField] : sortOrder.toUpperCase()},
           take: parseInt(count),
           skip: (parseInt(count) * parseInt(page)) - parseInt(count)
            })

            return [arts, artsCount]

          } else {
            const [arts, artsCount] = await artsRepository.findAndCount({
              order: {[sortField] : sortOrder.toUpperCase()},
              where:{storageLocation: name},
           take: parseInt(count),
           skip: (parseInt(count) * parseInt(page)) - parseInt(count)
            })
   
            return [arts, artsCount]
            
          }
        
        } catch {
         throw new Error("Fetch failed!");
        }
       };

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
            throw new Error("Error saving artwork into the database");
        }
    }


    async searchByKeywords(keywords: string[],  page: string, count: string, sortField?: string, sortOrder?: string) {

        const whereConditions = keywords.map(keyword =>
            `(CONCAT(artworks.artist, ' ', artworks.title, ' ', artworks.technique, ' ', artworks.notes, ' ', artworks.storageLocation, ' ', artworks.cell) LIKE ?)`
          ).join(' AND ');
        
          const whereParams = keywords.map(keyword => `%${keyword}%`);
        
          const query = `
            SELECT *
            FROM artworks
            WHERE ${whereConditions}
            ORDER BY ${sortField} ${sortOrder.toUpperCase()}
            LIMIT ? OFFSET ?
          `;

          const countQuery = `
            SELECT COUNT(*) AS total
            FROM artworks
            WHERE ${whereConditions}
          `;

          const paginationParams = [parseInt(count), (parseInt(page) - 1) * parseInt(count)];
          const finalParams = [...whereParams, ...paginationParams];

          const countResult = await dbConnection.query(countQuery, whereParams);
          const total = countResult[0].total;

        
          const results = await dbConnection.query(query, finalParams);

      return [results, total];
      }
      

       async deleteFileFromS3AndDB (originalFilename, filename, id) {
        
        try {

             await s3Client.deleteFile(originalFilename, filename)

        } catch {
          throw new Error("Could not delete the entry!");
          
        }

        try {
            const results = await artsRepository.delete(id)
            return results;
        } catch (error) {
            throw new Error(error)
        }
      };

      async updateArtwork (
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
    ){
    
            const updatedEntry = { title,
              artist,
              technique,
              dimensions,
              price,
              notes,
              storageLocation,
              cell,
              position,
              by_user}
            try {
              const item = await artsRepository.findOneBy({
                id: id
            })
            await artsRepository.merge(item, updatedEntry)
            const results = await artsRepository.save(item)
            return results
            } catch {
            throw new Error("Could not update entry")
    
            }
    
    };

}