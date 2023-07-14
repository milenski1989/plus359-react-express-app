import bcrypt from "bcrypt"
import { User } from "../entities/User";
import { dbConnection } from "../database";
import { Artworks } from "../entities/Artworks";
import { In, Like } from "typeorm"
import { Artists } from "../entities/Artists";
import { ArtistsBios } from "../entities/ArtistsBios";

const saltRounds = 10

dbConnection
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })

    const userRepository = dbConnection.getRepository(User);
    const artsRepository = dbConnection.getRepository(Artworks);
    const artistsRepository = dbConnection.getRepository(Artists)
    const biosRepository = dbConnection.getRepository(ArtistsBios)

export const loginService = async (email: string, password: string) => {
  let authenticated: boolean

  try {
    let userFound = await userRepository.findOne({
      where: [{email: email}, {userName: email}]
    })

    if (userFound) {
     authenticated = await bcrypt.compare(password, userFound.password)
     if (authenticated) return userFound
    } else return userFound

   
    
  } catch(error) {
   throw new Error("Invalid credentials");
  }
  
};

 export const signupService = async (email: string, password: string, userName: string) => {
  let user: object
  let userFound = await userRepository.findOneBy({
    email: email
  })

  try {
     if (!userFound) {
    
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) throw new Error("Signup failed!");
        
        user = userRepository.create({
          email: email,
          password: hash,
          userName: userName,
          superUser: 1
        })
        await dbConnection.getRepository(User).save(user)
       
      })
     } else {
      throw new Error("exists");
      
     }

  } catch {
    throw new Error("Error occured while registering!");
  }

};

export const uploadService = async (
    title: string,
    artist: string,
    technique: string,
    dimensions: string,
    price: number,
    notes: string,
    storageLocation: string,
    cell: string,
    position: number,
    image_url: string,
    image_key: string,
    download_url: string,
    download_key: string,
    by_user: string) => {

      let newEntry: object

      try {

        newEntry = await artsRepository.create({
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
        })

        const results = await artsRepository.save(newEntry)
        return results;

      } catch {
        throw new Error("Upload failed");
        
      }

    }

export const getArtsService = async (name: string, page: string, count: string, sortField?: string, sortOrder?: string) => {
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

export const getBioService = async(name: string) => {

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

export const updateBioService = async(id: number, bio: string) => {

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

export const searchService = async (params: string) => {
  try {
   const results = await artsRepository.find(
   { where: [
    {artist:  Like(`%${params}%`)},
    {technique: Like(`%${params}%`)},
    {title: Like(`%${params}%`)},
    {storageLocation: Like(`%${params}%`)},
    {dimensions: Like(`%${params}%`)},
    {notes: Like(`%${params}%`)}
  ],
  order: {
    id: "DESC",
},
})
  
   return results
  } catch {
   throw new Error("Fetch failed!");
   
  }
 };

 export const getCellsService = async (cell: string) => {

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

export const deleteArtService = async (id) => {
  try {
    const results = await artsRepository.delete(id)
    return results;
  } catch {
    throw new Error("Could not delete the entry!");
    
  }
};

export const updateArtService = async (
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
) => {

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

export const updateLocationService = async(ids: number[], formControlData: {
  storageLocation: string,
  cell: string,
  position: number

}) => {
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




