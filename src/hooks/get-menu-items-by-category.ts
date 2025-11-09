import { API_BASE_URL, headers } from "@/api/config"
import { MenuItem } from "@/models/categories"
import { languageState, getApiLanguage, type LanguageCode } from "@/store/language"
import { UseQueryResult, useQuery } from "@tanstack/react-query"
import { useRecoilValue } from "recoil"

export const fetchMenuItemsByCategory = async (id: string, language: LanguageCode): Promise<MenuItem[]> => {
    const apiLang = getApiLanguage(language)
    const res = await fetch(`${API_BASE_URL}/menu-items/category/${id}?lang=${apiLang}`)
    if (!res.ok) {
        throw new Error("Network response was not ok")
    }
    const data: MenuItem[] = await res.json()
    return data
}

export const useCategoryMenuItems = (id: string): UseQueryResult<MenuItem[]> => {
    const language = useRecoilValue(languageState)
    return useQuery({
        queryKey: ["category-id", id, language],
        queryFn: () => fetchMenuItemsByCategory(id, language),
        meta: { headers },
    })
}
