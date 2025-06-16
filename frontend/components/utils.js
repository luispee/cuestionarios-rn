import axios from 'axios';

const API_BASE = 'http://10.13.22.3:3001/';

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
