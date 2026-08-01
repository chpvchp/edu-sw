import axios from "axios";

// Use vite server proxy
export const BASE_URL = ""

export const api = axios.create({
  baseURL: BASE_URL,
})