import axios from "axios"
import { API_URL } from "./constants"


export const getAllStorages = async () => {
    try {
        return await axios.get(`${API_URL}/storage/allStorages`)
    } catch(error) {
        console.log(error)
        throw error
    }
}

export const getStoragesWithNoEntries = async () => {
    try {
        return await axios.get(`${API_URL}/storage/storagesWithNoEntries`)
    } catch(error) {
        console.log(error)
        throw error
    }
}

export const getAllCellsFromSelectedStorage = async (name) => {
    try {
        return await axios.get(`${API_URL}/storage/all/allCellsFromCurrentStorage/${name.split(':')[1]}`)
    } catch(error) {
        console.log(error)
        throw error
    }
}

export const saveOneStorage = async (name) => {
    try {
        await axios.post(`${API_URL}/storage/saveOne`, {name}, {
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const deleteOneStorage = async (name) => {
    try {
        await axios.delete(`${API_URL}/storage/deleteOne`, {params: {name}});
    } catch(error) {
        console.log(error)
        throw error
    }
}

export const updateLocations = async (ids, formControlData) => {
    try {
        await axios.put(
            `${API_URL}/storage/update-location`,
            {ids, formControlData}
        );
    } catch(error) {
        console.log(error)
        throw error
    }
}

export const getAvailablePositions = async (selectedCell, location) => {
    try {
        return await axios(`${API_URL}/storage/${selectedCell}/${location}`)
    } catch(error) {
        console.log(error)
        throw error
    }
}