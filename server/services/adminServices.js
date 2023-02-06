const connection = require("../database");
const bcrypt = require('bcrypt')
const saltRounds = 10

//signup
const signup = (email, password, userName) => {
  
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) console.log(err)
    const query = `
    INSERT INTO users (email, password, userName) VALUES(?,?,?)
    `;
  const params = [email, hash, userName];

    return new Promise ((resolve, reject) => {
      connection.query(query, params, (error, result) => {
          if(error){
              return reject(error);
          }
          return resolve(result);
      });
  });
  })
};

//login
const login = (email, password) => {
 
  return new Promise ((resolve, reject) => {
    const query = `
    SELECT * FROM users WHERE email = ?
    `;
    connection.query(query, email, (error, result) => {

        if (result.length > 0) {
           bcrypt.compare(password, result[0].password, (err, response) => {
            if (response) {
              return resolve(result);
            } else {
              return reject(error);
            }
          })
        } else {
          return reject(error)
        }
    })
});
};

//upload to Artworks after object is created in the S3 Bucket

  const insertIntoArtworks = (
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
    by_user) => {

    return new Promise((resolve, reject)=> {
        connection.query("INSERT INTO artworks (title, artist, technique, dimensions, price, notes, onWall, inExhibition, storageLocation, cell, position, image_url, image_key, download_url, download_key, by_user) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, ?)",
        [
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
        ],  (error, results)=>{
            if(error){
                return reject(error);
            }
            return resolve(results);
        });
    });
};

//get all entries from database
const getArts = (callback) => {
  const query = `SELECT * FROM artworks
  ORDER BY id DESC`;
  connection.query(query, (error, results) => {
    if (error) {
      callback(error);
      return;
    }

    callback(null, results);
  });
};

const getArtsNumbers = (cell, callback) => {
  const query = `
  SELECT * FROM artworks WHERE cell = ?
        `;
        const params = [cell];

  connection.query(query, params, (error, results) => {
    if (error) {
      callback(error);
      return;
    }
    callback(null, results);
  });
};

//delete one from database
const deleteArt = (id, callback) => {
  const query = `
  DELETE FROM artworks WHERE id = ?;
        `;
        const params = [id];

  connection.query(query, params, (error, result) => {
    if (error) {
      callback(error);
      return;
    }
    callback(null, result);
  });
};

//update in database
const updateArt = (artist, title, technique, dimensions, price, notes, storageLocation, cell, position, id, callback) => {
  const query = `
  UPDATE artworks SET artist = ?, title = ?, technique = ?, dimensions = ?, price = ?, notes = ?, storageLocation = ?, cell = ?, position = ? WHERE id = ?;
        `;
        const params = [artist, title, technique, dimensions, price, notes, storageLocation, cell, position, id]

        connection.query(query, params, (error, result) => {
          if (error) {
            callback(error);
            return;
          }
          callback(null, result);
        });

};

module.exports = {
  signup,
  login,
  insertIntoArtworks,
  getArts,
  getArtsNumbers,
  deleteArt,
  updateArt
};

