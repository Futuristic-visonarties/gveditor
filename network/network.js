import axios from "axios";
// const BASE = process.env.CONFIG_API;
const BASE = "https://5lvv484m2m.execute-api.us-east-1.amazonaws.com/dev/";

const axiosInstance = axios.create({
  baseURL: BASE,
  headers: {
    Authorization:
      "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxZDg0MjRkNzY3MDU0ODA0YjFhZjE4ZjlkY2FlMzMwMiIsInVzZXJJZCI6IjVhZmVhZWY3LTk5NDctNDNkMi05M2E4LTZhZmY5NTIyZWQzYSIsInVzZXJuYW1lIjoiYmliaGlzaGFuIiwiaWF0IjoxNjYwOTc1NTUwLCJleHAiOjE2NjEwNjE5NTAsInRva2VuX3R5cGUiOiJhY2Nlc3MifQ.vg7rZfjWFoX9mYgEJAIZumGKDka0Vb_N6LWNirP2f6g",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    console.log("requestion", config);
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
