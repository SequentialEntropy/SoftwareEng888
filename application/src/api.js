/**
 * api.js - Configures Axios for API requests 
 * 
 * @file Sets ups and Axios instance with a base URL and request intercepter for authentication 
 * @author Carina Jose 
 * @author Amreet Dhillon
 * @author Dany Kelzi  
 * @version 1.0.0 
 * @since 15-02-2025
 */

import axios from "axios"
import { ACCESS_TOKEN } from "./constants"

/**
 * Creates an Axios instance with a predefined base URL 
 */
const api = axios.create({
    // baseURL: import.meta.env.VITE_API_URL
    // base URL for API requests 
    baseURL: "http://127.0.0.1:8000"
})

/**
 * Axios request intercepter to add authentication token to headers
 */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default api