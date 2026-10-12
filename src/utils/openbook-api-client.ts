import axios, { type AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
    baseURL: 'https://openlibrary.org',
});

export default api;
