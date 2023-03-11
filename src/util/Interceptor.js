import axios from "axios";
import { errorHandler } from "./Api";
import { REST_API } from "./EndPoints";

const axiosInstance = axios.create({
    baseURL: REST_API,
})

axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        if(config.headers['Content-Type'] !== 'multipart/form-data')
            config.headers['Content-Type'] = 'application/json';
        return config;
    },
    error => {
        console.log(error)
        return Promise.reject(error);
    });

axiosInstance.interceptors.response.use((response) => response.data, (error) => {
    console.log(error)
    errorHandler(error)
    return Promise.reject(error)
})

export default axiosInstance;