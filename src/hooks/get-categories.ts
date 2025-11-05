import { API_BASE_URL, headers } from "@/api/config"
import { MenuCategory } from "@/models/categories"
import { languageState, getApiLanguage, type LanguageCode } from "@/store/language"
import { UseQueryResult, useQuery } from "@tanstack/react-query"
import { useRecoilValue } from "recoil"
import { fetchMenuItemsByCategory } from "./get-menu-items-by-category"

export const fetchCategories = async (restaurantId: string, language: LanguageCode): Promise<MenuCategory[]> => {
    try {
        if (!restaurantId) throw new Error("Missing restaurantId")
        const apiLang = getApiLanguage(language)
        const res = await fetch(`${API_BASE_URL}/menu-items/categories/restaurant/${restaurantId}?lang=${apiLang}`)

        const data: MenuCategory[] = await res.json()

        // Fetch menu items for categories without subcategories
        const updatedCategories = await Promise.all(
            data.map(async (item) => {
                if (item.subcategories.length === 0) {
                    try {
                        const subcategories = await fetchMenuItemsByCategory(item.id, language)
                        return { ...item, subcategories }
                    } catch (error) {
                        console.error(`Failed to fetch menu items for category ${item.id}:`, error)
                        return item
                    }
                }
                return item
            })
        )

        return updatedCategories
    } catch (e) {
        throw new Error(`An error occurred when fetching categories - ${e}`)
    }
}

export const useCategories = (restaurantId: string): UseQueryResult<MenuCategory[]> => {
    const language = useRecoilValue(languageState)
    return useQuery({
        queryKey: ["categories", restaurantId, language],
        queryFn: () => fetchCategories(restaurantId, language),
        meta: { headers },
        enabled: !!restaurantId,
    })
}
