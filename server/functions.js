const database = require('./database')

const uploadArt = (title, author, width, height, image_url, callback) => {
    const query = `
    INSERT INTO artworks (title, author, width, height, image_url)
    VALUES (?, ?, ?, ?, ?)
    `
    const params = [title, author, width, height, image_url]
    
    database.query(query, params, (error, result) => {
        if (error) {
            callback(err)
            return
        }
        callback(null, result.insertId)
    })
    }

    exports.uploadArt = uploadArt

    const getArts = (callback) => {
        const query = `
        SELECT * FROM artworks
        `
      database.query(query, (error, results) => {
        if (error) {
            callback(error)
            return
        }
        callback(null, results)
      })
    }

    exports.getArts = getArts