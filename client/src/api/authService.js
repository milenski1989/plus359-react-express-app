import axios from "axios"
import { API_URL } from "./constants"

export const getAllUsers = async () => {
    try {
        return await axios.get(`${API_URL}/auth/all`);
    } catch(error) {
        console.error("Error in getting users:", error);
    }
}

export const loginUser = async (email, password) => {
    try {
        return await axios.post(`${API_URL}/auth/login`, {
            email: email,
            password: password,
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });

    } catch(error) {
        console.error("Error in login:", error);
    }
}

export const signupUser = async (data) => {
    try {
        await axios.post(`${API_URL}/auth/signup`, data, {
            headers: {
                "Content-Type": "application/json",
            }
        })
    } catch(error) {
        console.error("Error in signup:", error);
    }
}

export const deleteUser = async (emails) => {
    try {
        await axios.delete(`${API_URL}/auth/deleteUsers`, {
            params: { emails },
        });
    } catch(error) {
        console.error("Error in delete user:", error);
    }
}
