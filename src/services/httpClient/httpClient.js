import Axios from "axios";

export const BASE_URL = "https://api.openweathermap.org/data/2.5/";
const appId = "131434944b83c08daa033300ffb2fde7";

const config = {
  baseURL: BASE_URL,
};

export const axios = Axios.create(config);

axios.interceptors.request.use(
  (config) => {
    config.params = {
      ...config.params,
      appid: appId,
    };
    return config;
  },
  (error) => {
    console.log(error);
  }
);

export const httpClient = {
  get(url, params) {
    return axios.get(url, {
      params,
    });
  },
  post(url, data, headers) {
    return axios.post(url, data, headers);
  },
  put(url, data) {
    return axios.put(url, data);
  },
  patch(url, data) {
    return axios.patch(url, data);
  },
  delete(url, data) {
    return axios.delete(url, data);
  },
};
