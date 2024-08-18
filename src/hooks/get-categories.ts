import { API_BASE_URL, headers } from "@/api/config"
import { MenuCategory } from "@/models/categories"
import { UseQueryResult, useQuery } from "@tanstack/react-query"
import { fetchMenuItemsByCategory } from "./get-menu-items-by-category"

export const fetchCategories = async (): Promise<MenuCategory[]> => {
    const res = await fetch(`${API_BASE_URL}/menu-items/categories`)
    if (!res.ok) {
        throw new Error("Network response was not ok")
    }
    const data: MenuCategory[] = await res.json()

    // Fetch menu items for categories without subcategories
    const updatedCategories = await Promise.all(
        data.map(async (item) => {
            if (item.subcategories.length === 0) {
                try {
                    const subcategories = await fetchMenuItemsByCategory(item.id)
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
}

export const useCategories = (): UseQueryResult<MenuCategory[]> => {
    return useQuery({ queryKey: ["categories"], queryFn: fetchCategories, meta: { headers } })
}
