import axios from "axios";

const axiosClient = axios.create({
    baseURL: "https://portfolio-backend-58gy.onrender.com/api",
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("ACCESS_TOKEN");
            window.location.href = "/admin/login";
        }
        throw error;
    }
);

export default axiosClient;