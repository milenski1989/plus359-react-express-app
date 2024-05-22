import axios from "axios";
import { API_URL } from "./constants";

export const getPaginatedArtworks = async (page, sortField, sortOrder, name) => {
    try {
        if (!page && !sortField && !sortOrder) {
            return await axios.get(
                `${API_URL}/artworks/filterByStorage/${name}`,
            );
        } else {
            return await axios.get(
                `${API_URL}/artworks/filterByStorage/${name.split(':')[1]}?count=25&page=${page}&sortField=${sortField}&sortOrder=${sortOrder}`,
            );
        }
    } catch(error) {
        console.log(error)
        throw error
    }
}

export const filterAllArtworks = async (keywords, selectedArtist, selectedCell, sortField, sortOrder) => {
    try {
        return await axios.get(`${API_URL}/artworks/filter?sortField=${sortField}&sortOrder=${sortOrder}`, {
            params: {
                keywords: keywords,
                selectedArtist: selectedArtist,
                selectedCell: selectedCell
            }
        })

    } catch(error) {
        console.log(error)
        throw error
    }
}

export const updateOneArtwork = async (updatedEntry, id) => {
    try {
        await axios.put(
            `${API_URL}/artworks/updateOne/${id}`,
            updatedEntry
        );
    } catch(error) {
        console.log(error)
        throw error
    }
}

export const deleteOneArtwork = async (params) => {
    try {
        await axios.delete(
            `${API_URL}/artworks/deleteOne/${params}`,
            { params }
        );
    } catch(error) {
        console.log(error)
        throw error
    }
}
