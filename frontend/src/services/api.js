import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost/backend/api/"
});

export default api;