

import { In, Like } from "typeorm";
import { dbConnection } from "../database";
import { Artworks } from "../entities/Artworks";
import { S3Service } from "./S3Service";

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

    async getAllByStorage (name: string, page: string, count: string, sortField?: string, sortOrder?: string) {
        try {
         const [arts, artsCount] = await artsRepository.findAndCount({
           order: {[sortField] : sortOrder.toUpperCase()},
           where:{storageLocation: name},
        take: parseInt(count),
        skip: (parseInt(count) * parseInt(page)) - parseInt(count)
         })
       
         return [arts, artsCount]
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

    // async searchAllByKeywords (params: string[]) {
    //     console.log('PARAMS', params)
    //   try {
    //     const queryBuilder = await dbConnection
    //     .createQueryBuilder().select("artworks")
    //     .from(Artworks, "artworks")

    //     // Loop through each keyword and add conditions for each column
    //     params.forEach(keyword => {
    //         queryBuilder.andWhere(
    //             `artist = :keyword OR technique = :keyword OR title = :keyword`,
    //             { keyword }
    //         );
    //     });

    //     // Group by the artwork ID to ensure uniqueness
    //     queryBuilder.groupBy("id");

    //     const results = await queryBuilder.orderBy("id", "DESC").getMany();
    //     return results;
    // } catch (error) {
    //     console.error("Fetch failed!", error);
    //     throw new Error("Fetch failed!");
    // }
    //   }

    async searchByKeywords(keywords: string[]): Promise<Artworks[]> {

        const whereConditions = keywords.map(keyword =>
            `(CONCAT(artworks.artist, ' ', artworks.title, ' ', artworks.technique, ' ', artworks.notes, ' ', artworks.storageLocation, ' ', artworks.cell) LIKE ?)`
          ).join(' AND ');
        
          const whereParams = keywords.map(keyword => `%${keyword}%`);
        
          const query = `
            SELECT *
            FROM artworks
            WHERE ${whereConditions}
          `;
        
          const results = await dbConnection.query(query, whereParams);
        const queryBuilder = dbConnection.createQueryBuilder().select("artworks")
        .from(Artworks, "artworks")
    
    
    //      // Create a WHERE clause with separate conditions for each keyword
    // const whereConditions = keywords.map(keyword =>
    //     `(CONCAT(artworks.artist, ' ', artworks.title, ' ', artworks.technique) LIKE :${keyword})`
    //   ).join(' AND ');
  
    //   // Construct the final WHERE clause
    //   const whereClause = `(${whereConditions})`;
      
  
    //   // Build and execute the query
    //   const results = await queryBuilder
    //     .where(whereClause, keywords.reduce((params, keyword) => {
    //       params[keyword] = `%${keyword}%`;
    //       return params;
    //     }, {}))
    //     .getMany();

  
      return results;
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