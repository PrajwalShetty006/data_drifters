import axios from 'axios';

const axios = axios.create({
    baseURL: process.env.FASTAPI_URL,
    withCredentials: true
    });
export default axios;