import axios from "axios";

export const configureAxios = () => {
  axios.defaults.baseURL = "/api";
};
