import axios from "axios"
import { API_URL } from "./constants"


export const getAllArtistsRelatedToEntriesInSelectedStorage = async (name) => {
    try {
        return await axios.get(`${API_URL}/artists/relatedToEntriesInStorage/${name.split(':')[1]}`)
    } catch(error) {
        console.log(error)
        throw error
    }
}

export const getAllArtistsRelatedToAllEntries = async () => {
    try {
        return await axios.get(`${API_URL}/artists/relatedToEntries`)

    } catch(error) {
        console.log(error)
        throw error
    }
}