import axios from 'axios';
import { API_URL } from "./config.js";
export const API_BASE = API_URL;

const axiosInstance = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const fetchJson = async (url, config = {}) => {
    try {
        const response = await axiosInstance.get(url, config);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error en la red');
    }
};
