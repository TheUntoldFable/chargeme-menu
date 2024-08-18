import { API_BASE_URL, headers } from "@/api/config"
import { MenuItem } from "@/models/categories"
import { UseQueryResult, useQuery } from "@tanstack/react-query"

export const fetchMenuItems = async (id: string): Promise<MenuItem[]> => {
    const res = await fetch(`${API_BASE_URL}/menu-items/subcategory/${id}`)
    if (!res.ok) {
        throw new Error("Network response was not ok")
    }
    const data: MenuItem[] = await res.json()
    return data
}

export const useMenuItems = (id: string): UseQueryResult<MenuItem[]> => {
    return useQuery({
        queryKey: ["menu-items", id],
        queryFn: () => fetchMenuItems(id),
        meta: { headers },
    })
}
