import axios from "axios";

export const authEduRuralApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL ?? "https://localhost:7005/api",
  headers: { "Content-Type": "application/json" },
  // withCredentials: false // mantén false si usas JWT en headers/body
});
