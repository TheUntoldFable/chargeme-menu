import { API_BASE_URL, headers } from "@/api/config"
import { MenuItem } from "@/models/categories"
import { UseQueryResult, useQuery } from "@tanstack/react-query"

export const fetchMenuItemsBySubCategory = async (subCategoryId: string): Promise<MenuItem[]> => {
    const res = await fetch(`${API_BASE_URL}/menu-items/subcategory/${subCategoryId}`)
    if (!res.ok) {
        throw new Error("Network response was not ok")
    }
    const data: MenuItem[] = await res.json()
    return data
}

export const useSubCategoryMenuItems = (subCategoryId: string): UseQueryResult<MenuItem[]> => {
    return useQuery({
        queryKey: ["sub-category-id", subCategoryId],
        queryFn: () => fetchMenuItemsBySubCategory(subCategoryId),
        meta: { headers },
    })
}
