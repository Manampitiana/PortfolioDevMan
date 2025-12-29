import axios from "axios";

const axiosClient = axios.create({
    baseURL: "https://portfolio-backend-58gy.onrender.com/api",
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear token and redirect to login
            localStorage.removeItem("ACCESS_TOKEN");
            window.location.href = "/admin/login";
        }
        throw error;
    }
);

export default axiosClient;