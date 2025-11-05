import { atom } from "recoil"
import { recoilPersist } from "recoil-persist"

const localStorage = typeof window !== `undefined` ? window.localStorage : undefined

const { persistAtom } = recoilPersist({
    key: "recoil-persist", // this key is using to store data in local storage
    storage: localStorage, // configure which storage will be used to store the data
})

export type LanguageCode = "BG" | "EN"

export const LANGUAGE_MAP: Record<LanguageCode, string> = {
    BG: "bulgarian",
    EN: "english",
}

export const languageState = atom<LanguageCode>({
    key: "Language",
    default: "BG",
    // eslint-disable-next-line camelcase
    effects_UNSTABLE: [persistAtom],
})

export const getApiLanguage = (code: LanguageCode): string => LANGUAGE_MAP[code]
