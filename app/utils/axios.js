// app/utils/hrmsApi.js
import axios from "axios";
import { getSession } from "next-auth/react";

const hrmsApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// For client-side requests
if (typeof window !== 'undefined') {
    hrmsApi.interceptors.request.use(
        async (config) => {
            // Try to get token from localStorage first
            let token = localStorage.getItem('token') || sessionStorage.getItem('token');

            // If no token in storage, try to get from NextAuth session
            if (!token) {
                const session = await getSession();
                token = session?.accessToken || session?.user?.accessToken;
            }

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
}

export default hrmsApi;