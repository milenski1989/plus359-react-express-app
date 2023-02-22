import express from "express";
import bcrypt from "bcrypt"
import { User } from "../entities/User";
import { dbConnection } from "../database";
import { Artworks } from "../entities/Artworks";
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


  //login
export const loginService = async (email: string, password: string) => {
  let authenticated: boolean

  try {
    let userFound = await userRepository.findOneBy({
      email: email
    })

    if (userFound) {
     authenticated = await bcrypt.compare(password, userFound.password)
    }

    if (authenticated) return userFound
    else throw new Error("Invalid credentials");

  } catch {
   throw new Error("Invalid credentials");
  }
  
};

//signup
 export const signupService = async (email: string, password: string, userName: string) => {
  let user: object
  let userFound = await userRepository.findOneBy({
    email: email
  })

  console.log(userFound)

  try {
     if (!userFound) {
    
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) throw new Error("Signup failed!");
        
        user = await userRepository.create({
          email: email,
          password: hash,
          userName: userName,
          superUser: 1
        })
        console.log('user',user)
        await dbConnection.getRepository(User).save(user)
      
        return user
      })
     } else {
      throw new Error("exists");
      
     }

    
  } catch {
    throw new Error("Error occured while register");
  }

};

//upload to Artworks after object is created in the S3 Bucket

export const uploadService = async (
    title: string,
    artist: string,
    technique: string,
    dimensions: string,
    price: number,
    notes: string,
    onWall: number,
    inExhibition: number,
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
          onWall,
          inExhibition,
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

//get all entries from database
export const getArtsService = async () => {
 try {
  console.log('invoked 1')
  const results = await artsRepository.find({
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
    console.log('invoked 2')

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

//delete one from database
export const deleteArtService = async (id) => {
  try {
    const results = await artsRepository.delete(id)
    return results;
  } catch {
    throw new Error("Could not delete the entry!");
    
  }
};

//update in database
export const updateArtService = async (
    title: string,
    artist: string,
    technique: string,
    dimensions: string,
    price: number,
    notes: string,
    onWall: number,
    inExhibition: number,
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
          onWall,
          inExhibition,
          storageLocation,
          cell,
          position,
          by_user}
        try {
          const item = await artsRepository.findOneBy({
            id: id
        })

        console.log('item:', item)
        await artsRepository.merge(item, updatedEntry)
        const results = await artsRepository.save(item)
        return results
        } catch {
        throw new Error("Could not update entry")

        }

};




