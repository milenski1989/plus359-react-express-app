import axios from "axios";
import { API_URL } from "./constants";

export const uploadImageWithData = async (data, onUploadProgress) => {
    try {
        await axios.post(`${API_URL}/s3/upload`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress
        });
    } catch(error) {
        console.log(error)
        throw error;
    }
}
export const replaceImage = async (data) => {
    try {
        await axios.post(`${API_URL}/s3/replace`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    } catch(error) {
        console.log(error)
        throw error;
    }
}
