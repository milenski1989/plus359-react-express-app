import s3Client from "../s3Client/s3Client";
import { deleteArtService, getArtsService, getBioService, getCellsService, loginService, searchService, signupService, updateArtService, updateBioService, uploadService } from "../services/AdminServices";
import 'dotenv/config';

export const login = async (req, res) => {
  const {email, password} = req.body

try {
  const userFound = await loginService(email, password)
  req.session.loggedin = true;

  if (!userFound) res.status(400).send({error: "Invalid Username or Password"})
 
  else res.status(200).send(userFound);
} catch  {
throw new Error("Error");
}
};

export const signup =  async (req, res) => {
  const {email, password, userName} = req.body

try {
 await signupService(email, password, userName)

  res.status(200).send({message: 'You\'ve signed up successfuly!'});
} catch {
  throw new Error("User with this email already exists");
  
}
}

export const uploadEntry = async (req, res) => {

  const {title, artist, technique, dimensions, price, notes, storageLocation, cell, position, by_user} = req.body

  const image_url = req.file.transforms[0].location
  const image_key = req.file.transforms[0].key
  const download_url = req.file.transforms[1].location
  const download_key = req.file.transforms[1].key

try {
 
  const results = await uploadService (
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
    )
  res.status(200).json({results: results})
} catch (error) {
  res.status(400).json(error)
}

}

  export const getArts = async (req, res) => {
  const {page, count} = req.query
  const {name} = req.params
  try {
   const [arts, artsCount] = await getArtsService(name, page, count)

   res.status(200).json({arts, artsCount});
  } catch (error) {
    res.status(400).json(error);
  }
}

export const getBio = async (req, res) => {
  const {name} = req.params
  try {
   const bio = await getBioService(name)

   res.status(200).json(bio);
  } catch (error) {
    res.status(400).json(error);
  }
}

export const updateBio = async (req, res) => {
  const {bio} = req.body
  const {id} = req.params

  try {
   const result = await updateBioService(id, bio)

   res.status(200).json(result);
  } catch (error) {
    res.status(400).json(error);
  }
}

export const searchArts = async (req, res) => {
  const {param} = req.params
  try {
    const results = await searchService(param)
    res.status(200).json(results);

  } catch {
    throw new Error("No entries found");
    
  }
}

export const getFreeCells = async (req, res) => {
  const {cell} = req.params

  try {
    
    const results = await getCellsService(cell)

        res.status(200).json(results);
    
  } catch (error) {
    res.status(400).json(error)
  }

}

export const deleteFromS3 = async (req, res) => {
  const filename = req.params.filename
  try {
    await s3Client.deleteObject({Bucket: process.env.AWS_BUCKET_NAME, Key: filename}).promise();
    const results = await deleteArtService(filename)
    res.send(results)
  } catch (error) {
    res.send({ error: error.message });
  }
}

export const deleteOriginalFromS3 =  async (req, res) => {
  const originalFilename = req.params.originalFilename
  await s3Client.deleteObject({Bucket: process.env.AWS_BUCKET_NAME, Key: originalFilename}).promise();
}

export const updateEntry = async (req, res) => {
  const {title,
    artist,
    technique,
    dimensions,
    price,
    notes,
    storageLocation,
    cell,
    position,
    by_user} = req.body
  const {id} = req.params
      try {
        const results = await updateArtService(title,
          artist,
          technique,
          dimensions,
          price,
          notes,
          storageLocation,
          cell,
          position,
          by_user,
          id)
        res.status(200).send(results)

      } catch (error){
       throw new Error("Could not update entry!");
       
      }
}