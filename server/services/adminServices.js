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

//upload to Artworks and Storage tables, after object is created in the S3 Bucket

  const insertIntoArtworks = (title,
    artist,
    technique,
    dimensions,
    price,
    notes,
    storageLocation,
    image_url,
    image_key,
    download_url,
    download_key) => {

    return new Promise((resolve, reject)=> {
        connection.query("INSERT INTO artworks (title, artist, technique, dimensions, price, notes, storageLocation, image_url, image_key, download_url, download_key) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
        [
          title,
          artist,
          technique,
          dimensions,
          price,
          notes,
          storageLocation,
          image_url,
          image_key,
          download_url,
          download_key,
        ],  (error, results)=>{
            if(error){
                return reject(error);
            }
            return resolve(results);
        });
    });
};

const insertIntoStorage = (storageLocation, cell, position) => {
  return new Promise((resolve, reject)=>{
      connection.query( "INSERT INTO storage (storageLocation, cell, position) VALUES (?, ?, ?)",
      [storageLocation, cell, position], (error, results) =>{
          if(error){
              return reject(error);
          }
          return resolve(results);
      });
  });
};


//get all entries from database
const getArts = (callback) => {
  const query = `
  SELECT a.id, a.artist, a.title, a.technique, a.dimensions, a.price, a.notes, a.image_url, a.image_key, a.download_url, a.download_key, s.storageLocation, s.cell, s.position
  FROM artworks a
  JOIN storage s
  ON a.storageLocation = s.storageLocation AND a.id = s.id
  ORDER BY a.id DESC
        `;
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
  SELECT * FROM storage WHERE cell = ?
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

  connection.beginTransaction((err) => {
    if (err) {
      throw err;
    }
    connection.query(
     "DELETE FROM storage WHERE id = ?;", id,
      (err) => {
        if (err) {
          connection.rollback(() => {
            callback(err);
            return;
          });
        }
        connection.query(
          "DELETE FROM artworks WHERE id = ?;", id,
          (err, result) => {
            if (err) {
              connection.rollback(() => {
                callback(err);
                return;
              });
            }
            connection.commit((err) => {
              if (err) {
                connection.rollback(() => {
                  callback(err);
                  return;
                });
              }
              callback(null, result);    
            });
          }
        );
      }
    );
  });
};

//update in database
const updateArt = (artist, title, technique, dimensions, price, notes, storageLocation,cell, position, id, callback) => {

  connection.beginTransaction((err) => {
    if (err) {
      throw err;
    }
    connection.query(
      "UPDATE storage SET storageLocation = ?, cell = ?, position = ? WHERE id = ?", [storageLocation, cell, position, id],
      (err) => {
        if (err) {
          connection.rollback(() => {
            callback(err);
            return;
          });
        }
        connection.query(
          "UPDATE artworks SET artist = ?, title = ?, technique = ?, dimensions = ?, price = ?, notes = ?, storageLocation = ? WHERE id = ?",
          [artist, title, technique, dimensions, price, notes, storageLocation, id],
          (err, result, fields) => {
            if (err) {
              connection.rollback(() => {
                callback(err);
                return;
              });
            }
            connection.commit((err) => {
              if (err) {
                connection.rollback(() => {
                  callback(err);
                  return;
                });
              }
              callback(null, result);
            });
          }
        );
      }
    );
  });
};

module.exports = {
  signup,
  login,
  insertIntoArtworks,
  insertIntoStorage,
  getArts,
  getArtsNumbers,
  deleteArt,
  updateArt
};

