import axios from "axios";

const configuredApiUrl = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

export const API_BASE_URL = configuredApiUrl.endsWith("/api")
    ? configuredApiUrl
    : `${configuredApiUrl}/api`;

const api = axios.create({
    baseURL: API_BASE_URL
});

export default api;