import axios from "axios";
// const BASE = process.env.CONFIG_API;
const BASE = "https://5lvv484m2m.execute-api.us-east-1.amazonaws.com/dev/";

const axiosInstance = axios.create({
  baseURL: BASE,
  headers: {
    Authorization:
      "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJjYjY2OTk5YmZhMmM0MWFmYmVmNTQwNTYxNTRhMzk0ZCIsInVzZXJJZCI6IjU2NWJiZTg3LWZhZmItNDdlMi1iYTY0LTE2OGRmMzRjMDY0YSIsInVzZXJuYW1lIjoiYmliaGlzaGFuIiwiaWF0IjoxNjYzNzg4NDA5LCJleHAiOjE2NjM4NzQ4MDksInRva2VuX3R5cGUiOiJhY2Nlc3MifQ.fG0pFle5B-GAdgP83OoPv6IsY3C6_iaI838wWajkprk",
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
