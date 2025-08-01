import axios from 'axios';

export const authEduRuralApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});
