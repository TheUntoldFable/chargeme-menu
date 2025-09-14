import axios from "axios"

export const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL

export const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
}

export const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
    headers,
})
