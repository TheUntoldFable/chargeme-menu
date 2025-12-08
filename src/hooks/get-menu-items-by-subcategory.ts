import { API_BASE_URL, headers } from "@/api/config"
import { MenuItem } from "@/models/categories"
import { getApiLanguage, useLanguageStore, type LanguageCode } from "@/store/language"
import { UseQueryResult, useQuery } from "@tanstack/react-query"

export const fetchMenuItemsBySubCategory = async (subCategoryId: string, language: LanguageCode): Promise<MenuItem[]> => {
    const apiLang = getApiLanguage(language)
    const res = await fetch(`${API_BASE_URL}/menu-items/subcategory/${subCategoryId}?lang=${apiLang}`)
    if (!res.ok) {
        throw new Error("Network response was not ok")
    }
    const data: MenuItem[] = await res.json()
    return data
}

export const useSubCategoryMenuItems = (subCategoryId: string): UseQueryResult<MenuItem[]> => {
    const language = useLanguageStore((state) => state.language)
    return useQuery({
        queryKey: ["sub-category-id", subCategoryId, language],
        queryFn: () => fetchMenuItemsBySubCategory(subCategoryId, language),
        meta: { headers },
    })
}
