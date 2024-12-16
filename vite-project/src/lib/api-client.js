import { HOST } from "@/utils/constants.js";
import axios from "axios";


export const apiClient = axios.create({
    baseURL: HOST,
    withCredentials: true,
})

// apiClient.interceptors.request.use((config) => {
//     const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   });