import { deleteArtService, getArtsService, getCellsService, loginService, searchService, signupService, updateArtService, uploadService } from "../services/AdminServices";
import 'dotenv/config';
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});



//login
export const login = async (req, res) => {
  const {email, password} = req.body

try {
  const userFound = await loginService(email, password)
  req.session.loggedin = true;
  //req.session.username = userName;
 
  res.status(200).send(userFound);
} catch  {
throw new Error("Error");
}
};

//signup
export const signup =  async (req, res) => {
  const {email, password, userName} = req.body

try {
 let results = await signupService(email, password, userName)
  res.status(200).json(results);
} catch {
  throw new Error("User with this email already exists");
  
}
}



//upload a photo with details to S3 Bucket and MySQL Database tables Artworks and Storage
export const uploadEntry = async (req, res) => {

  const {title, artist, technique, dimensions, price, notes, onWall,
    inExhibition, storageLocation, cell, position, by_user} = req.body

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
    )
  res.status(200).json({results: results})
} catch (error) {
  res.status(400).json(error)
}

}

  


//get all photos from S3 and details from database
export const getArts = async (req, res) => {
  const {page, count} = req.query
  try {
   const [arts, artsCount] = await getArtsService(page, count)

   res.status(200).json({arts, artsCount});
  } catch (error) {
    res.status(400).json(error);
  }
}

//search 
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

//delete single entry from s3, then from db
export const deleteFromS3 = async (req, res) => {
  const filename = req.params.filename
  try {
    await s3.deleteObject({Bucket: process.env.AWS_BUCKET_NAME, Key: filename}).promise();
    const results = await deleteArtService(filename)
    res.send(results)
  } catch (error) {
    res.send({ error: error.message });
  }
}

//deleteOriginal
export const deleteOriginalFromS3 =  async (req, res) => {
  const originalFilename = req.params.originalFilename
  await s3.deleteObject({Bucket: process.env.AWS_BUCKET_NAME, Key: originalFilename}).promise();
}

//update single entry in database
export const updateEntry = async (req, res) => {
  const {title,
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
    by_user} = req.body
  const {id} = req.params
      try {
        const results = await updateArtService(title,
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
          by_user,
          id)
        res.status(200).send(results)

      } catch (error){
       console.log(error)        
      }
}