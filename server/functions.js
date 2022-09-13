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