import { API_BASE_URL, headers } from "@/api/config"
import { MenuItem } from "@/types/categories"
import { UseQueryResult, useQuery } from "@tanstack/react-query"

export const fetchMenuItemsByCategory = async (id: string): Promise<MenuItem[]> => {
    const res = await fetch(`${API_BASE_URL}/menu-items/category/${id}`)
    if (!res.ok) {
        throw new Error("Network response was not ok")
    }
    const data: MenuItem[] = await res.json()
    return data
}

export const useCategoryMenuItems = (id: string): UseQueryResult<MenuItem[]> => {
    return useQuery({
        queryKey: ["category-id", id],
        queryFn: () => fetchMenuItemsByCategory(id),
        meta: { headers },
    })
}
