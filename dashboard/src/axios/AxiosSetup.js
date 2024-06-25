import axios from "axios";

let custom_axios = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    Accept: "*/*",
  },
});

export default custom_axios;
