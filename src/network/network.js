import axios from "axios";
// const BASE = process.env.CONFIG_API;
const BASE = "https://api-py.glocalvoice.in/";

const { hideUpload, type, token } = Object.fromEntries(
  new URLSearchParams(window.location.search)
);

const axiosInstance = axios.create({
  baseURL: BASE,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    console.log("requestion", config);
    console.log(localStorage.getItem("Token"));
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("error  from the api", JSON.stringify(error));
    return Promise.reject(error.response.data);
  }
);

export default axiosInstance;
