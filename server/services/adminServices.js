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

//upload to database
const uploadArt = (
  title,
  author,
  width,
  height,
  technique,
  storageLocation,
  image_url,
  image_key,
  callback
) => {
  const query = `
    INSERT INTO artworks (title, author, width, height, technique, storageLocation, image_url, image_key)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
  const params = [title, author, width, height,technique, storageLocation, image_url, image_key];

  connection.query(query, params, (error, result) => {
    if (error) {
      callback(error);
      return;
    }
    callback(null, result.insertId);
  });
};

//get all entries from database
const getArts = (callback) => {
  const query = `
        SELECT * FROM artworks
        `;
  connection.query(query, (error, results) => {
    if (error) {
      callback(error);
      return;
    }
    callback(null, results);
  });
};

//search for an entry by author name

const search = (param, callback) => {
  const query = `
  SELECT *
FROM artworks
WHERE author LIKE '%${param}%';
        `

  connection.query(query, (error, results) => {
    if (error) {
      callback(error)
      return
    }
    callback(null, results)
  });
};

//delete one from database
const deleteArt = (id, callback) => {
  const query = `DELETE FROM artworks WHERE id = ?;`

  connection.query(query, id, (error, result) => {
    if (error) {
     callback(error)
      return;
    }
 callback(null, result)
  });
};

//update in database
const updateArt = (author, title, technique, storageLocation, width, height, id) => {
  const query = `
      UPDATE artworks SET author = ?, title = ?, technique = ?, storageLocation = ?, width = ?, height = ? WHERE id = ?
      `;
  const params = [author, title, technique, storageLocation, width, height, id];
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
  search
};
