const { response } = require('express')
const database = require('./database')

const uploadArt = (title, author, width, height, image_url, image_key, callback) => {
    const query = `
    INSERT INTO artworks (title, author, width, height, image_url, image_key)
    VALUES (?, ?, ?, ?, ?, ?)
    `
    const params = [title, author, width, height, image_url, image_key]
    
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

    const updateArt = (author, title, width, height, id) => {

      const query = `
      UPDATE artworks SET author = ?, title = ?, width = ?, height = ? WHERE id = ?
      `
      const params = [author, title, width, height, id]
      database.query(query, params, (error, result) => {
       
        if (error) {
          console.log('ERR',error)
          return
      }
      console.log('RES',result)
      })
    }

    exports.updateArt = updateArt