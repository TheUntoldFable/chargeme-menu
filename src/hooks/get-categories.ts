import { API_BASE_URL, headers } from "@/api/config"
import { MenuCategory } from "@/models/categories"
import { UseQueryResult, useQuery } from "@tanstack/react-query"
import { fetchMenuItemsByCategory } from "./get-menu-items-by-category"

export const fetchCategories = async (): Promise<MenuCategory[]> => {
    try {
        const res = await fetch(`${API_BASE_URL}/menu-items/categories/restaurant/b7718a77-2edb-42c7-be54-a078b99d1b01`)

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
    } catch (e) {
        throw new Error(`An error occurred when fetching categories - ${e}`)
    }
}

export const useCategories = (): UseQueryResult<MenuCategory[]> => {
    return useQuery({ queryKey: ["categories"], queryFn: fetchCategories, meta: { headers } })
}
