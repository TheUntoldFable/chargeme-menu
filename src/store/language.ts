import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export type LanguageCode = "BG" | "EN"

export const LANGUAGE_MAP: Record<LanguageCode, string> = {
    BG: "bulgarian",
    EN: "english",
}

export const getApiLanguage = (code: LanguageCode): string => LANGUAGE_MAP[code]

interface LanguageState {
    language: LanguageCode
}

interface LanguageActions {
    setLanguage: (language: LanguageCode) => void
}

export const useLanguageStore = create<LanguageState & LanguageActions>()(
    persist(
        (set) => ({
            language: "BG",

            setLanguage: (language) => set({ language }),
        }),
        {
            name: "language-storage",
            storage: createJSONStorage(() => localStorage),
            skipHydration: true,
        }
    )
)
