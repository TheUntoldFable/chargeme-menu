import axios from "axios"
import type { LanguageCode } from "@/store/language"
import { getApiLanguage } from "@/store/language"

export const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL

export const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
}

export const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
    headers,
})

// Helper to get language from localStorage
export const getLanguage = (): LanguageCode => {
    if (typeof window === "undefined") return "BG"
    try {
        const persist = localStorage.getItem("recoil-persist")
        if (!persist) return "BG"
        const data = JSON.parse(persist)
        return data.Language || "BG"
    } catch {
        return "BG"
    }
}

// Add language parameter to all requests
API.interceptors.request.use((config) => {
    const languageCode = getLanguage()
    const apiLanguage = getApiLanguage(languageCode)
    config.params = { ...config.params, lang: apiLanguage }
    return config
})
