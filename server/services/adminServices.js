const connection = require("../database");

//login
const login = (email, password, callback) => {
  const query = `
    SELECT * FROM users WHERE email = ? AND password = ?
    `;
  const params = [email, password];

  connection.query(query, params, (error, result) => {
    if (error) {
      callback(err);
      return;
    }
    callback(null, result);
  });
};

//upload to Artworks and Storage tables, after object is created in the S3 Bucket
const uploadArt = (
  title,
  artist,
  technique,
  dimensions,
  price,
  notes,
  storageLocation,
  cell,
  image_url,
  image_key,
  callback
) => {
  connection.beginTransaction((err) => {
    if (err) {
      throw err;
    }
    connection.query(
      "INSERT INTO artworks (title, artist, technique, dimensions, price, notes, storageLocation, image_url, image_key) VALUES (?,?,?,?,?,?,?,?,?)",
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
      ],
      (err) => {
        if (err) {
          connection.rollback(() => {
            callback(err);
            return;
          });
        }
        connection.query(
          "INSERT INTO storage (storageLocation, cell) VALUES (?, ?)",
          [storageLocation, cell],
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

//get all entries from database
const getArts = (callback) => {
  const query = `
  SELECT artworks.id, artworks.artist, artworks.title, artworks.technique, artworks.dimensions, artworks.price, artworks.notes, artworks.image_url, artworks.image_key, storage.storageLocation, storage.cell
  FROM artworks
  JOIN storage
  ON artworks.storageLocation = storage.storageLocation
        `;
  connection.query(query, (error, results) => {
    if (error) {
      callback(error);
      return;
    }
    callback(null, results);
  });
};

//search for an entry by artist name
const search = (key, callback) => {
  const query = `
  SELECT artworks.artist, artworks.title, artworks.technique, artworks.dimensions, artworks.price, artworks.notes, artworks.image_url, storage.storageLocation, storage.cell
  FROM artworks
  JOIN storage
  ON artworks.storageLocation = storage.storageLocation
  WHERE
  artworks.artist LIKE '%${key}%' 
  OR artworks.title LIKE '%${key}%'
  OR artworks.technique LIKE '%${key}%'
  OR artworks.dimensions LIKE '%${key}%'
  OR artworks.price LIKE '%${key}%'
  OR artworks.notes LIKE '%${key}%'
  OR storage.storageLocation LIKE '%${key}%'
  OR storage.cell LIKE '%${key}%';
        `;

  connection.query(query, (error, results) => {
    if (error) {
      callback(error);
      return;
    }
    callback(null, results);
  });
};

//delete one from database
const deleteArt = (id, callback) => {
  const query = `DELETE FROM artworks WHERE id = ?;`

  connection.query(query, id, (error, result) => {
    if (error) {
      callback(error);
      return;
    }
    callback(null, result);
  });
 
};

//update in database
const updateArt = (artist, title, technique, dimensions, price, notes, storageLocation, id) => {
  const query = `
      UPDATE artworks SET artist = ?, title = ?, technique = ?, dimensions = ?, price = ?, notes = ?, storageLocation = ? WHERE id = ?
      `;
  const params = [artist, title, technique, dimensions, price, notes, storageLocation, id];
  connection.query(query, params, (error, result) => {
    if (error) {
      console.log("ERR", error);
      return;
    }
    console.log("RES", result);
  });
};

module.exports = {
  login,
  uploadArt,
  getArts,
  deleteArt,
  updateArt,
  search,
};
